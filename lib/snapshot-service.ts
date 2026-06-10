import 'server-only'

import { getLeagueData } from './supabase-data'
import { createServiceSupabaseClient } from './supabase'
import { isOverdue, standingsForFlight } from './league'
import type { Database } from './supabase-types'

type AuditRow = Database['public']['Tables']['audit_log']['Row']
type SnapshotRow = Database['public']['Tables']['daily_snapshots']['Row']
type ArchiveRow = Database['public']['Tables']['season_archives']['Row']

export async function buildSeasonSnapshot() {
  const league = await getLeagueData()
  const standings = league.flights.map((flight) => ({
    flight: flight.name,
    rows: standingsForFlight(flight.name, league.matches, league.teams),
  }))

  const stats = {
    teams: league.teams.length,
    matches: league.matches.length,
    approvedScores: league.matches.filter((match) => match.approvedScore).length,
    pendingScores: league.matches.filter((match) => match.status === 'Pending Commissioner Approval').length,
    rescheduledMatches: league.matches.filter((match) => match.status === 'Rescheduled / Makeup Needed').length,
    overdueMatches: league.matches.filter((match) => isOverdue(match)).length,
  }

  return {
    createdAt: new Date().toISOString(),
    sports: [{ name: 'Cornhole', slug: 'cornhole' }],
    leagues: [{ id: league.leagueId, name: 'Haddon Glen Cornhole League', slug: 'haddon-glen-cornhole' }],
    activeSeason: { id: league.seasonId, name: league.activeSeason },
    flights: league.flights,
    teams: league.teams,
    players: league.players,
    matches: league.matches,
    standings,
    trophyRoomEntries: league.champions,
    rescheduledOrMakeup: league.matches.filter((match) => match.status === 'Rescheduled / Makeup Needed'),
    stats,
  }
}

export async function createDailySnapshot() {
  const supabase = createServiceSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const db = supabase as any
  const snapshot = await buildSeasonSnapshot()
  const snapshotDate = new Date().toISOString().slice(0, 10)

  const { data, error } = await db
    .from('daily_snapshots')
    .upsert(
      {
        season_id: snapshot.activeSeason.id,
        snapshot_date: snapshotDate,
        snapshot_json: snapshot,
      },
      { onConflict: 'season_id,snapshot_date' },
    )
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as SnapshotRow
}

export async function listSnapshots() {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return []
  const db = supabase as any
  const { data } = await db.from('daily_snapshots').select('*').order('snapshot_date', { ascending: false })
  return (data ?? []) as SnapshotRow[]
}

export async function listAuditLog(action?: string) {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return []
  const db = supabase as any
  let query = db.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
  if (action) query = query.eq('action', action)
  const { data } = await query
  return (data ?? []) as AuditRow[]
}

export async function archiveActiveSeason() {
  const supabase = createServiceSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const db = supabase as any
  const snapshot = await buildSeasonSnapshot()
  const archivedAt = new Date().toISOString()

  const { data: archive, error } = await db
    .from('season_archives')
    .insert({
      season_id: snapshot.activeSeason.id,
      archived_at: archivedAt,
      archive_summary_json: snapshot,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  await db.from('seasons').update({ is_active: false, archived_at: archivedAt }).eq('id', snapshot.activeSeason.id)
  await db.from('audit_log').insert({
    season_id: snapshot.activeSeason.id,
    actor_type: 'admin',
    actor_admin_name: 'Admin',
    action: 'archive_season',
    entity_type: 'seasons',
    entity_id: snapshot.activeSeason.id,
    after_json: archive,
  })
  return archive as ArchiveRow
}

export async function listArchives() {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return []
  const db = supabase as any
  const { data } = await db.from('season_archives').select('*').order('archived_at', { ascending: false })
  return (data ?? []) as ArchiveRow[]
}
