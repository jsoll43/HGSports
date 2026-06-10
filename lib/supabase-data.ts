import { getMockLeagueData } from './mock-data'
import { createPublicSupabaseClient, createServiceSupabaseClient } from './supabase'
import type { Database, MatchStatus as DbMatchStatus } from './supabase-types'
import type { Champion, Flight, LeagueData, Match, MatchStatus, Player, ScoreSubmission, Team } from './types'

type Tables = Database['public']['Tables']
type SeasonRow = Tables['seasons']['Row']
type LeagueRow = Tables['leagues']['Row']
type FlightRow = Tables['flights']['Row']
type TeamRow = Tables['teams']['Row']
type PlayerRow = Tables['players']['Row']
type MatchRow = Tables['matches']['Row']
type ApprovedScoreRow = Tables['approved_scores']['Row']
type ScoreSubmissionRow = Tables['score_submissions']['Row']
type TrophyRow = Tables['trophy_room_entries']['Row']

export async function getLeagueData(): Promise<LeagueData> {
  const supabase = createPublicSupabaseClient()
  if (!supabase) return getMockLeagueData()

  const { data: season, error: seasonError } = await supabase
    .from('seasons')
    .select('*, leagues(*)')
    .eq('is_active', true)
    .single()

  if (seasonError || !season) return getMockLeagueData()

  const activeSeason = season as SeasonRow & { leagues: LeagueRow }
  const seasonId = activeSeason.id
  const leagueId = activeSeason.league_id

  const [flightsResult, teamsResult, playersResult, matchesResult, scoresResult, trophyResult] = await Promise.all([
    supabase.from('flights').select('*').eq('season_id', seasonId).order('sort_order'),
    supabase.from('teams').select('*').eq('season_id', seasonId).order('team_number'),
    supabase.from('players').select('*').eq('season_id', seasonId).order('last_name'),
    supabase.from('matches').select('*').eq('season_id', seasonId).order('week_number').order('scheduled_time'),
    supabase.from('approved_scores').select('*'),
    supabase.from('trophy_room_entries').select('*').eq('league_id', leagueId).order('year', { ascending: false }),
  ])

  if (flightsResult.error || teamsResult.error || playersResult.error || matchesResult.error || scoresResult.error || trophyResult.error) {
    return getMockLeagueData()
  }

  return mapLeagueData({
    season: activeSeason,
    flights: flightsResult.data ?? [],
    teams: teamsResult.data ?? [],
    players: playersResult.data ?? [],
    matches: matchesResult.data ?? [],
    approvedScores: scoresResult.data ?? [],
    trophies: trophyResult.data ?? [],
  })
}

export async function getPendingSubmissions() {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('score_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false })

  if (error) return []
  return data.map(mapScoreSubmission)
}

function mapLeagueData({
  season,
  flights,
  teams,
  players,
  matches,
  approvedScores,
  trophies,
}: {
  season: SeasonRow & { leagues: LeagueRow }
  flights: FlightRow[]
  teams: TeamRow[]
  players: PlayerRow[]
  matches: MatchRow[]
  approvedScores: ApprovedScoreRow[]
  trophies: TrophyRow[]
}): LeagueData {
  const flightById = new Map(flights.map((flight) => [flight.id, flight]))
  const approvedByMatch = new Map(approvedScores.map((score) => [score.match_id, score]))

  return {
    source: 'supabase',
    seasonId: season.id,
    leagueId: season.league_id,
    activeSeason: season.name,
    flights: flights.map((flight) => ({
      id: flight.id,
      name: flight.name as Flight,
      sortOrder: flight.sort_order,
      colorLabel: flight.color_label,
    })),
    teams: teams.map((team) => mapTeam(team, flightById.get(team.flight_id)?.name as Flight)),
    players: players.map(mapPlayer),
    matches: matches.map((match) => mapMatch(match, flightById.get(match.flight_id)?.name as Flight, approvedByMatch.get(match.id))),
    champions: trophies.map(mapTrophy),
  }
}

function mapTeam(team: TeamRow, flight: Flight): Team {
  return {
    id: team.id,
    name: team.team_name,
    flight,
    flightId: team.flight_id,
    teamNumber: team.team_number,
  }
}

function mapPlayer(player: PlayerRow): Player {
  return {
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    phone: player.phone,
    teamId: player.team_id,
    email: player.email,
  }
}

function mapMatch(match: MatchRow, flight: Flight, approvedScore?: ApprovedScoreRow): Match {
  return {
    id: match.id,
    seasonId: match.season_id,
    flightId: match.flight_id,
    week: match.week_number,
    date: match.scheduled_date,
    time: formatTime(match.scheduled_time),
    flight,
    teamAId: match.team_a_id,
    teamBId: match.team_b_id,
    status: mapMatchStatus(match.status),
    previousStatus: match.status === 'rejected' ? 'Scheduled' : undefined,
    approvedScore: approvedScore
      ? {
          game1: { teamA: approvedScore.game1_team_a_score, teamB: approvedScore.game1_team_b_score },
          game2: { teamA: approvedScore.game2_team_a_score, teamB: approvedScore.game2_team_b_score },
        }
      : undefined,
  }
}

function mapTrophy(trophy: TrophyRow): Champion {
  return {
    sport: 'Cornhole',
    season: trophy.season_name,
    flight: trophy.flight_name as Flight,
    teamName: trophy.champion_team_name,
    playerNames: trophy.champion_player_names,
  }
}

export function mapScoreSubmission(submission: ScoreSubmissionRow): ScoreSubmission {
  return {
    id: submission.id,
    matchId: submission.match_id,
    submittedByPlayerId: submission.submitted_by_player_id,
    submittedAt: submission.submitted_at,
    playedDate: submission.played_date,
    notes: submission.notes ?? '',
    score: {
      game1: { teamA: submission.game1_team_a_score, teamB: submission.game1_team_b_score },
      game2: { teamA: submission.game2_team_a_score, teamB: submission.game2_team_b_score },
    },
    status: submission.status === 'approved' ? 'Approved' : submission.status === 'rejected' ? 'Rejected' : 'Pending',
  }
}

function mapMatchStatus(status: DbMatchStatus): MatchStatus {
  if (status === 'rescheduled') return 'Rescheduled / Makeup Needed'
  if (status === 'pending_approval') return 'Pending Commissioner Approval'
  if (status === 'final') return 'Final'
  return 'Scheduled'
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
