import { NextRequest, NextResponse } from 'next/server'
import { getAdminName } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })
  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any
  const body = (await request.json()) as {
    leagueId?: string
    id?: string
    seasonName?: string
    year?: string
    flightName?: string
    championTeamName?: string
    championPlayerNames?: string
    notes?: string
  }
  if (!body.leagueId || !body.seasonName || !body.year || !body.flightName || !body.championTeamName) {
    return NextResponse.json({ error: 'Season, year, flight, and champion team are required.' }, { status: 400 })
  }

  const payload = {
    league_id: body.leagueId,
    season_name: body.seasonName,
    year: Number(body.year),
    flight_name: body.flightName,
    champion_team_name: body.championTeamName,
    champion_player_names: body.championPlayerNames || '',
    notes: body.notes || null,
  }

  const { data, error } = body.id
    ? await db.from('trophy_room_entries').update(payload).eq('id', body.id).select('*').single()
    : await db.from('trophy_room_entries').insert(payload).select('*').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
