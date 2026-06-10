import { NextResponse } from 'next/server'
import { getAdminName } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'

type ScoreSubmissionRow = Database['public']['Tables']['score_submissions']['Row']
type MatchRow = Database['public']['Tables']['matches']['Row']

export async function POST(_: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })

  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any

  const { submissionId } = await params
  const { data: submissionData } = await db.from('score_submissions').select('*').eq('id', submissionId).single()
  const submission = submissionData as ScoreSubmissionRow | null
  if (!submission) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })

  const { data: matchData } = await db.from('matches').select('*').eq('id', submission.match_id).single()
  const match = matchData as MatchRow | null
  if (!match) return NextResponse.json({ error: 'Match not found.' }, { status: 404 })

  const approvedPayload = {
    match_id: submission.match_id,
    score_submission_id: submission.id,
    approved_at: new Date().toISOString(),
    approved_by_admin_name: adminName,
    game1_team_a_score: submission.game1_team_a_score,
    game1_team_b_score: submission.game1_team_b_score,
    game2_team_a_score: submission.game2_team_a_score,
    game2_team_b_score: submission.game2_team_b_score,
    team_a_total_points: submission.team_a_total_points,
    team_b_total_points: submission.team_b_total_points,
    team_a_game_wins: submission.team_a_game_wins,
    team_b_game_wins: submission.team_b_game_wins,
    team_a_match_win: submission.team_a_match_win,
    team_b_match_win: submission.team_b_match_win,
  }

  const { error: scoreError } = await db.from('approved_scores').upsert(approvedPayload, { onConflict: 'match_id' })
  if (scoreError) return NextResponse.json({ error: scoreError.message }, { status: 500 })

  await db.from('score_submissions').update({ status: 'approved', approved_by_admin_name: adminName, approved_at: approvedPayload.approved_at }).eq('id', submission.id)
  const { data: updatedMatch } = await db.from('matches').update({ status: 'final' }).eq('id', submission.match_id).select('*').single()

  await db.from('audit_log').insert({
    season_id: match.season_id,
    actor_type: 'admin',
    actor_admin_name: adminName,
    action: 'score_approved',
    entity_type: 'score_submissions',
    entity_id: submission.id,
    before_json: { submission, match },
    after_json: { approved_score: approvedPayload, match: updatedMatch },
  })

  return NextResponse.json({ ok: true })
}
