import type { Score } from './types'

export function validateServerScore(score: Score) {
  const games = [score.game1, score.game2]
  const errors: string[] = []

  if (games.length !== 2) errors.push('Exactly two games are required.')

  games.forEach((game, index) => {
    const label = `Game ${index + 1}`
    if (game.teamA < 0 || game.teamB < 0) errors.push(`${label}: scores cannot be negative.`)
    if (game.teamA > 21 || game.teamB > 21) errors.push(`${label}: scores cannot exceed 21.`)
    if (game.teamA === game.teamB) errors.push(`${label}: ties are not allowed.`)
    if (game.teamA !== 21 && game.teamB !== 21) errors.push(`${label}: one team must score exactly 21.`)
    if (game.teamA === 21 && game.teamB === 21) errors.push(`${label}: only one team can score 21.`)
  })

  return errors
}

export function calculatedScoreFields(score: Score) {
  const game1TeamAWins = score.game1.teamA > score.game1.teamB ? 1 : 0
  const game2TeamAWins = score.game2.teamA > score.game2.teamB ? 1 : 0
  const teamAGameWins = game1TeamAWins + game2TeamAWins
  const teamBGameWins = 2 - teamAGameWins

  return {
    game1_team_a_score: score.game1.teamA,
    game1_team_b_score: score.game1.teamB,
    game2_team_a_score: score.game2.teamA,
    game2_team_b_score: score.game2.teamB,
    team_a_total_points: score.game1.teamA + score.game2.teamA,
    team_b_total_points: score.game1.teamB + score.game2.teamB,
    team_a_game_wins: teamAGameWins,
    team_b_game_wins: teamBGameWins,
    team_a_match_win: teamAGameWins > teamBGameWins,
    team_b_match_win: teamBGameWins > teamAGameWins,
  }
}
