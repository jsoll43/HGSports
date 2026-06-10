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

  const nextStatus = match.proposed_makeup_at || match.reschedule_note ? 'rescheduled' : 'scheduled'
  await db.from('score_submissions').update({ status: 'rejected', rejected_by_admin_name: adminName, rejected_at: new Date().toISOString() }).eq('id', submission.id)
  const { data: updatedMatch } = await db.from('matches').update({ status: nextStatus }).eq('id', submission.match_id).select('*').single()

  await db.from('audit_log').insert({
    season_id: match.season_id,
    actor_type: 'admin',
    actor_admin_name: adminName,
    action: 'score_rejected',
    entity_type: 'score_submissions',
    entity_id: submission.id,
    before_json: { submission, match },
    after_json: { match: updatedMatch },
  })

  return NextResponse.json({ ok: true })
}
