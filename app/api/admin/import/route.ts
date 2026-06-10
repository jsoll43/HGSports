import { NextRequest, NextResponse } from 'next/server'
import { getAdminName } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'
import { validateImport, type ScheduleImportRow, type TeamImportRow } from '@/lib/import-validation'

export async function POST(request: NextRequest) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })
  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any
  const body = (await request.json()) as { teams: TeamImportRow[]; schedule: ScheduleImportRow[] }
  const preview = validateImport(body.teams ?? [], body.schedule ?? [])
  if (preview.errors.length) return NextResponse.json(preview, { status: 400 })

  const seasonName = body.teams[0]?.Season || body.schedule[0]?.Season || 'Imported Season'
  const { data: league } = await db.from('leagues').select('*').eq('slug', 'haddon-glen-cornhole').single()
  if (!league) return NextResponse.json({ error: 'League not found. Seed Supabase first.' }, { status: 404 })

  await db.from('seasons').update({ is_active: false }).eq('league_id', league.id)
  const { data: season, error: seasonError } = await db
    .from('seasons')
    .insert({ league_id: league.id, name: seasonName, year: Number(seasonName.match(/\d{4}/)?.[0] ?? new Date().getFullYear()), is_active: true })
    .select('*')
    .single()
  if (seasonError) return NextResponse.json({ error: seasonError.message }, { status: 500 })

  const flightByName = new Map<string, string>()
  for (const flightName of [...new Set(body.teams.map((row) => row.Flight.trim()).filter(Boolean))]) {
    const { data: flight } = await db
      .from('flights')
      .insert({ season_id: season.id, name: flightName, sort_order: flightByName.size + 1, color_label: flightName.toLowerCase() })
      .select('*')
      .single()
    flightByName.set(flightName, flight.id)
  }

  const teamByNumber = new Map<string, string>()
  for (const row of body.teams) {
    const { data: team } = await db
      .from('teams')
      .insert({ season_id: season.id, flight_id: flightByName.get(row.Flight.trim()), team_number: Number(row['Team Number']), team_name: `${row['Player 1 Last Name']}/${row['Player 2 Last Name']}` })
      .select('*')
      .single()
    teamByNumber.set(String(row['Team Number']).trim(), team.id)

    for (const playerIndex of [1, 2]) {
      const firstName = row[`Player ${playerIndex} First Name` as keyof TeamImportRow]
      const lastName = row[`Player ${playerIndex} Last Name` as keyof TeamImportRow]
      await db.from('players').insert({
        season_id: season.id,
        team_id: team.id,
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
        phone: row[`Player ${playerIndex} Phone` as keyof TeamImportRow] || '',
        email: row[`Player ${playerIndex} Email` as keyof TeamImportRow] || null,
      })
    }
  }

  for (const row of body.schedule) {
    const flightId = flightByName.get(row.Flight.trim())
    const teamAId = teamByNumber.get(String(row['Team A Number']).trim())
    const teamBId = teamByNumber.get(String(row['Team B Number']).trim())
    if (!flightId || !teamAId || !teamBId) continue
    await db.from('matches').insert({
      season_id: season.id,
      flight_id: flightId,
      week_number: Number(row.Week),
      scheduled_date: new Date(row.Date).toISOString().slice(0, 10),
      scheduled_time: normalizeTime(row.Time),
      team_a_id: teamAId,
      team_b_id: teamBId,
      notes: row.Notes || null,
    })
  }

  await db.from('audit_log').insert({
    season_id: season.id,
    actor_type: 'admin',
    actor_admin_name: adminName,
    action: 'import',
    entity_type: 'seasons',
    entity_id: season.id,
    after_json: preview,
  })

  return NextResponse.json({ ok: true, preview })
}

function normalizeTime(value: string) {
  const date = new Date(`2000-01-01 ${value}`)
  if (Number.isNaN(date.getTime())) return value
  return date.toTimeString().slice(0, 8)
}
