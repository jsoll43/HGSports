import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyPlayerPin } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'
import type { RescheduleLog } from '@/lib/types'

type MatchRow = Database['public']['Tables']['matches']['Row']
type PlayerRow = Database['public']['Tables']['players']['Row']

export async function POST(request: NextRequest) {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any

  const body = (await request.json()) as RescheduleLog & { pin?: string }
  const { data: matchData } = await db.from('matches').select('*').eq('id', body.matchId).single()
  const { data: playerData } = await db.from('players').select('*').eq('id', body.submittedByPlayerId).single()
  const match = matchData as MatchRow | null
  const player = playerData as PlayerRow | null

  if (!match || !player) return NextResponse.json({ error: 'Match or player not found.' }, { status: 404 })
  if (player.team_id !== match.team_a_id && player.team_id !== match.team_b_id) {
    return NextResponse.json({ error: 'Player is not part of this match.' }, { status: 403 })
  }

  const cookieStore = await cookies()
  const hasVerifiedCookie = cookieStore.get(`hg_pin_${match.season_id}`)?.value === 'verified'
  if (!hasVerifiedCookie && !(await verifyPlayerPin(match.season_id, body.pin ?? ''))) {
    return NextResponse.json({ error: 'Invalid PIN.' }, { status: 403 })
  }

  const before = match
  const { data: updated, error } = await db
    .from('matches')
    .update({
      status: 'rescheduled',
      proposed_makeup_at: body.proposedDateTime || null,
      reschedule_note: body.notes || null,
      rescheduled_by_player_id: player.id,
      rescheduled_at: new Date().toISOString(),
    })
    .eq('id', match.id)
    .select('*')
    .single()

  if (error || !updated) return NextResponse.json({ error: error?.message ?? 'Could not reschedule match.' }, { status: 500 })

  await db.from('audit_log').insert({
    season_id: match.season_id,
    actor_type: 'player',
    actor_player_id: player.id,
    action: 'match_rescheduled',
    entity_type: 'matches',
    entity_id: match.id,
    before_json: before,
    after_json: updated,
  })

  return NextResponse.json({ ok: true, match: updated })
}
