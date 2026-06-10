import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { calculatedScoreFields, validateServerScore } from '@/lib/score-rules'
import { verifyPlayerPin } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'
import type { ScoreSubmission } from '@/lib/types'

type MatchRow = Database['public']['Tables']['matches']['Row']
type PlayerRow = Database['public']['Tables']['players']['Row']

export async function POST(request: NextRequest) {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any

  const body = (await request.json()) as ScoreSubmission & { pin?: string }
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

  const errors = validateServerScore(body.score)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const calculated = calculatedScoreFields(body.score)
  const { data: submission, error } = await db
    .from('score_submissions')
    .insert({
      match_id: match.id,
      submitted_by_player_id: player.id,
      submitted_by_team_id: player.team_id,
      played_date: body.playedDate || match.scheduled_date,
      ...calculated,
      status: 'pending',
      notes: body.notes || null,
      user_agent: request.headers.get('user-agent'),
    })
    .select('*')
    .single()

  if (error || !submission) return NextResponse.json({ error: error?.message ?? 'Could not save score.' }, { status: 500 })

  await db.from('matches').update({ status: 'pending_approval', actual_played_date: body.playedDate || match.scheduled_date }).eq('id', match.id)
  await db.from('audit_log').insert({
    season_id: match.season_id,
    actor_type: 'player',
    actor_player_id: player.id,
    action: 'score_submitted',
    entity_type: 'score_submissions',
    entity_id: submission.id,
    after_json: submission,
  })

  return NextResponse.json({ ok: true, submission })
}
