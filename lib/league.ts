import { matches as seedMatches, players, teams } from './data'
import type { Flight, GameScore, Match, Player, Score, ScoreSubmission, StandingRow, Team } from './types'

export function playerName(player: Player) {
  return `${player.firstName} ${player.lastName}`
}

export function teamById(teamId: string) {
  return teams.find((team) => team.id === teamId)
}

export function playerById(playerId: string) {
  return players.find((player) => player.id === playerId)
}

export function teamPlayers(teamId: string) {
  return players.filter((player) => player.teamId === teamId)
}

export function sortedPlayers() {
  return [...players].sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName))
}

export function isPlayerInMatch(player: Player, match: Match) {
  return player.teamId === match.teamAId || player.teamId === match.teamBId
}

export function opponentTeam(player: Player, match: Match) {
  return teamById(player.teamId === match.teamAId ? match.teamBId : match.teamAId)
}

export function matchTitle(match: Match) {
  return `${teamById(match.teamAId)?.name ?? 'Team A'} vs ${teamById(match.teamBId)?.name ?? 'Team B'}`
}

export function displayDate(match: Pick<Match, 'date' | 'time'>) {
  return `${new Date(`${match.date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} at ${match.time}`
}

export function isOverdue(match: Match, today = new Date()) {
  const scheduled = new Date(`${match.date}T23:59:59`)
  return scheduled < today && !match.approvedScore && match.status !== 'Pending Commissioner Approval'
}

export function publicStatus(match: Match) {
  if (isOverdue(match)) return 'Score Needed or Makeup Required'
  return match.status
}

export function gameWinner(game: GameScore) {
  return game.teamA > game.teamB ? 'A' : 'B'
}

export function scoreTotals(score: Score) {
  return {
    teamA: score.game1.teamA + score.game2.teamA,
    teamB: score.game1.teamB + score.game2.teamB,
  }
}

export function validateGameScore(game: GameScore) {
  if (game.teamA > 21 || game.teamB > 21) return 'No score can be over 21.'
  if (game.teamA === game.teamB) return 'Games cannot end in a tie.'
  if (game.teamA !== 21 && game.teamB !== 21) return 'One team must score exactly 21.'
  if (game.teamA === 21 && game.teamB === 21) return 'Only one team can score 21.'
  if (game.teamA < 0 || game.teamB < 0) return 'Scores cannot be negative.'
  return ''
}

export function validateScore(score: Score) {
  return [validateGameScore(score.game1), validateGameScore(score.game2)].filter(Boolean)
}

export function effectiveMatches(submissions: ScoreSubmission[] = []) {
  const approvedByMatch = new Map(
    submissions.filter((submission) => submission.status === 'Approved').map((submission) => [submission.matchId, submission]),
  )

  return seedMatches.map((match) => {
    const approved = approvedByMatch.get(match.id)
    if (!approved) return match
    return { ...match, status: 'Final' as const, approvedScore: approved.score }
  })
}

export function standingsForFlight(flight: Flight, matches: Match[]): StandingRow[] {
  const rows = teams
    .filter((team) => team.flight === flight)
    .map<StandingRow>((team) => ({
      team,
      rank: 0,
      totalPoints: 0,
      matchWins: 0,
      matchLosses: 0,
      gameWins: 0,
      gameLosses: 0,
      pointDifferential: 0,
      matchesPlayed: 0,
    }))

  const rowForTeam = (teamId: string) => rows.find((row) => row.team.id === teamId)

  matches
    .filter((match) => match.flight === flight && match.approvedScore)
    .forEach((match) => {
      const teamA = rowForTeam(match.teamAId)
      const teamB = rowForTeam(match.teamBId)
      if (!teamA || !teamB || !match.approvedScore) return

      const totals = scoreTotals(match.approvedScore)
      teamA.totalPoints += totals.teamA
      teamB.totalPoints += totals.teamB
      teamA.pointDifferential += totals.teamA - totals.teamB
      teamB.pointDifferential += totals.teamB - totals.teamA
      teamA.matchesPlayed += 1
      teamB.matchesPlayed += 1

      const teamAGames = [match.approvedScore.game1, match.approvedScore.game2].filter((game) => gameWinner(game) === 'A').length
      const teamBGames = 2 - teamAGames
      teamA.gameWins += teamAGames
      teamA.gameLosses += teamBGames
      teamB.gameWins += teamBGames
      teamB.gameLosses += teamAGames

      if (teamAGames > teamBGames) {
        teamA.matchWins += 1
        teamB.matchLosses += 1
      } else {
        teamB.matchWins += 1
        teamA.matchLosses += 1
      }
    })

  return rows
    .sort(
      (a, b) =>
        b.totalPoints - a.totalPoints ||
        b.matchWins - a.matchWins ||
        b.gameWins - a.gameWins ||
        b.pointDifferential - a.pointDifferential ||
        a.team.name.localeCompare(b.team.name),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }))
}

export function currentLeaders(matches: Match[]) {
  return (['Green', 'Red', 'White'] as Flight[]).map((flight) => standingsForFlight(flight, matches)[0])
}

export function recordForTeam(team: Team, matches: Match[]) {
  return (['Green', 'Red', 'White'] as Flight[])
    .flatMap((flight) => standingsForFlight(flight, matches))
    .find((row) => row.team.id === team.id)
}
