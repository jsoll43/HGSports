import { NextRequest, NextResponse } from 'next/server'
import { calculatedScoreFields, validateServerScore } from '@/lib/score-rules'
import { getAdminName } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'
import type { Score } from '@/lib/types'

type ScoreSubmissionRow = Database['public']['Tables']['score_submissions']['Row']
type MatchRow = Database['public']['Tables']['matches']['Row']

export async function POST(request: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })

  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any

  const { submissionId } = await params
  const body = (await request.json()) as { score?: Score; adminNote?: string }
  if (!body.score) return NextResponse.json({ error: 'Score is required.' }, { status: 400 })

  const errors = validateServerScore(body.score)
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 })

  const { data: beforeData } = await db.from('score_submissions').select('*').eq('id', submissionId).single()
  const before = beforeData as ScoreSubmissionRow | null
  if (!before) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })

  const { data: matchData } = await db.from('matches').select('*').eq('id', before.match_id).single()
  const match = matchData as MatchRow | null
  if (!match) return NextResponse.json({ error: 'Match not found.' }, { status: 404 })

  const { data: updated, error } = await db
    .from('score_submissions')
    .update({
      ...calculatedScoreFields(body.score),
      admin_note: body.adminNote || 'Score corrected by admin before approval.',
      updated_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select('*')
    .single()

  if (error || !updated) return NextResponse.json({ error: error?.message ?? 'Could not update score.' }, { status: 500 })

  await db.from('audit_log').insert({
    season_id: match.season_id,
    actor_type: 'admin',
    actor_admin_name: adminName,
    action: 'score_submission_edited',
    entity_type: 'score_submissions',
    entity_id: submissionId,
    before_json: before,
    after_json: updated,
  })

  return NextResponse.json({ ok: true, submission: updated })
}
