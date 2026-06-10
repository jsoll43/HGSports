export type Flight = 'Green' | 'Red' | 'White'

export type FlightRecord = {
  id: string
  name: Flight
  sortOrder: number
  colorLabel: string
}

export type MatchStatus =
  | 'Scheduled'
  | 'Rescheduled / Makeup Needed'
  | 'Pending Commissioner Approval'
  | 'Final'

export type Player = {
  id: string
  firstName: string
  lastName: string
  phone: string
  teamId: string
  email?: string | null
}

export type Team = {
  id: string
  name: string
  flight: Flight
  flightId?: string
  teamNumber?: number
}

export type GameScore = {
  teamA: number
  teamB: number
}

export type Score = {
  game1: GameScore
  game2: GameScore
}

export type Match = {
  id: string
  seasonId?: string
  flightId?: string
  week: number
  date: string
  time: string
  flight: Flight
  teamAId: string
  teamBId: string
  status: MatchStatus
  approvedScore?: Score
  previousStatus?: MatchStatus
}

export type ScoreSubmission = {
  id: string
  matchId: string
  submittedByPlayerId: string
  submittedAt: string
  playedDate: string
  notes: string
  score: Score
  status: 'Pending' | 'Approved' | 'Rejected'
}

export type RescheduleLog = {
  id: string
  matchId: string
  submittedByPlayerId: string
  submittedAt: string
  proposedDateTime: string
  notes: string
}

export type Champion = {
  sport: string
  season: string
  flight: Flight
  teamName: string
  playerNames?: string
}

export type LeagueData = {
  source: 'supabase' | 'mock'
  seasonId: string
  leagueId: string
  activeSeason: string
  flights: FlightRecord[]
  teams: Team[]
  players: Player[]
  matches: Match[]
  champions: Champion[]
}

export type StandingRow = {
  team: Team
  rank: number
  totalPoints: number
  matchWins: number
  matchLosses: number
  gameWins: number
  gameLosses: number
  pointDifferential: number
  matchesPlayed: number
}
