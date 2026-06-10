import { activeSeason, champions, flights, matches, players, teams } from './data'
import type { LeagueData } from './types'

export function getMockLeagueData(): LeagueData {
  return {
    source: 'mock',
    seasonId: 'mock-season-summer-2026',
    leagueId: 'mock-haddon-glen-cornhole',
    activeSeason,
    flights: flights.map((flight, index) => ({
      id: `mock-flight-${flight.toLowerCase()}`,
      name: flight,
      sortOrder: index + 1,
      colorLabel: flight.toLowerCase(),
    })),
    teams,
    players,
    matches,
    champions,
  }
}
