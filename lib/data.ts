import type { Champion, Flight, Match, Player, Team } from './types'

export const activeSeason = 'Summer 2026'
export const flights: Flight[] = ['Green', 'Red', 'White']

export const teams: Team[] = [
  { id: 'g-sharks', name: 'Glen Sharks', flight: 'Green' },
  { id: 'g-dolphins', name: 'Deck Dolphins', flight: 'Green' },
  { id: 'r-rays', name: 'Ripple Rays', flight: 'Red' },
  { id: 'r-tides', name: 'Toss Tides', flight: 'Red' },
  { id: 'w-caps', name: 'Corner Caps', flight: 'White' },
  { id: 'w-waves', name: 'White Waves', flight: 'White' },
]

export const players: Player[] = [
  { id: 'p-avery', firstName: 'Jordan', lastName: 'Avery', phone: '856-555-0101', teamId: 'g-sharks' },
  { id: 'p-baker', firstName: 'Morgan', lastName: 'Baker', phone: '856-555-0102', teamId: 'g-sharks' },
  { id: 'p-carter', firstName: 'Casey', lastName: 'Carter', phone: '856-555-0103', teamId: 'g-dolphins' },
  { id: 'p-dawson', firstName: 'Taylor', lastName: 'Dawson', phone: '856-555-0104', teamId: 'g-dolphins' },
  { id: 'p-ellis', firstName: 'Jamie', lastName: 'Ellis', phone: '856-555-0105', teamId: 'r-rays' },
  { id: 'p-foster', firstName: 'Riley', lastName: 'Foster', phone: '856-555-0106', teamId: 'r-rays' },
  { id: 'p-garcia', firstName: 'Alex', lastName: 'Garcia', phone: '856-555-0107', teamId: 'r-tides' },
  { id: 'p-hughes', firstName: 'Sam', lastName: 'Hughes', phone: '856-555-0108', teamId: 'r-tides' },
  { id: 'p-irwin', firstName: 'Robin', lastName: 'Irwin', phone: '856-555-0109', teamId: 'w-caps' },
  { id: 'p-jones', firstName: 'Drew', lastName: 'Jones', phone: '856-555-0110', teamId: 'w-caps' },
  { id: 'p-kelly', firstName: 'Cameron', lastName: 'Kelly', phone: '856-555-0111', teamId: 'w-waves' },
  { id: 'p-lee', firstName: 'Quinn', lastName: 'Lee', phone: '856-555-0112', teamId: 'w-waves' },
]

export const matches: Match[] = [
  { id: 'm-1', week: 1, date: '2026-05-07', time: '6:30 PM', flight: 'Green', teamAId: 'g-sharks', teamBId: 'g-dolphins', status: 'Final', approvedScore: { game1: { teamA: 21, teamB: 18 }, game2: { teamA: 16, teamB: 21 } } },
  { id: 'm-2', week: 1, date: '2026-05-07', time: '7:15 PM', flight: 'Red', teamAId: 'r-rays', teamBId: 'r-tides', status: 'Final', approvedScore: { game1: { teamA: 21, teamB: 12 }, game2: { teamA: 21, teamB: 19 } } },
  { id: 'm-3', week: 1, date: '2026-05-07', time: '8:00 PM', flight: 'White', teamAId: 'w-caps', teamBId: 'w-waves', status: 'Final', approvedScore: { game1: { teamA: 17, teamB: 21 }, game2: { teamA: 21, teamB: 14 } } },
  { id: 'm-4', week: 2, date: '2026-05-14', time: '6:30 PM', flight: 'Green', teamAId: 'g-dolphins', teamBId: 'g-sharks', status: 'Pending Commissioner Approval' },
  { id: 'm-5', week: 2, date: '2026-05-14', time: '7:15 PM', flight: 'Red', teamAId: 'r-tides', teamBId: 'r-rays', status: 'Rescheduled / Makeup Needed' },
  { id: 'm-6', week: 2, date: '2026-05-14', time: '8:00 PM', flight: 'White', teamAId: 'w-waves', teamBId: 'w-caps', status: 'Scheduled' },
  { id: 'm-7', week: 3, date: '2026-05-21', time: '6:30 PM', flight: 'Green', teamAId: 'g-sharks', teamBId: 'g-dolphins', status: 'Final', approvedScore: { game1: { teamA: 21, teamB: 10 }, game2: { teamA: 21, teamB: 20 } } },
  { id: 'm-8', week: 3, date: '2026-05-21', time: '7:15 PM', flight: 'Red', teamAId: 'r-rays', teamBId: 'r-tides', status: 'Scheduled' },
  { id: 'm-9', week: 3, date: '2026-05-21', time: '8:00 PM', flight: 'White', teamAId: 'w-caps', teamBId: 'w-waves', status: 'Pending Commissioner Approval' },
  { id: 'm-10', week: 4, date: '2026-05-28', time: '6:30 PM', flight: 'Green', teamAId: 'g-dolphins', teamBId: 'g-sharks', status: 'Scheduled' },
  { id: 'm-11', week: 4, date: '2026-05-28', time: '7:15 PM', flight: 'Red', teamAId: 'r-tides', teamBId: 'r-rays', status: 'Final', approvedScore: { game1: { teamA: 21, teamB: 15 }, game2: { teamA: 12, teamB: 21 } } },
  { id: 'm-12', week: 4, date: '2026-05-28', time: '8:00 PM', flight: 'White', teamAId: 'w-waves', teamBId: 'w-caps', status: 'Scheduled' },
  { id: 'm-13', week: 5, date: '2026-06-04', time: '6:30 PM', flight: 'Green', teamAId: 'g-sharks', teamBId: 'g-dolphins', status: 'Scheduled' },
  { id: 'm-14', week: 5, date: '2026-06-04', time: '7:15 PM', flight: 'Red', teamAId: 'r-rays', teamBId: 'r-tides', status: 'Scheduled' },
  { id: 'm-15', week: 5, date: '2026-06-04', time: '8:00 PM', flight: 'White', teamAId: 'w-caps', teamBId: 'w-waves', status: 'Rescheduled / Makeup Needed' },
  { id: 'm-16', week: 6, date: '2026-06-11', time: '6:30 PM', flight: 'Green', teamAId: 'g-dolphins', teamBId: 'g-sharks', status: 'Scheduled' },
  { id: 'm-17', week: 6, date: '2026-06-11', time: '7:15 PM', flight: 'Red', teamAId: 'r-tides', teamBId: 'r-rays', status: 'Scheduled' },
  { id: 'm-18', week: 6, date: '2026-06-11', time: '8:00 PM', flight: 'White', teamAId: 'w-waves', teamBId: 'w-caps', status: 'Scheduled' },
  { id: 'm-19', week: 7, date: '2026-06-18', time: '6:30 PM', flight: 'Green', teamAId: 'g-sharks', teamBId: 'g-dolphins', status: 'Scheduled' },
  { id: 'm-20', week: 7, date: '2026-06-18', time: '7:15 PM', flight: 'Red', teamAId: 'r-rays', teamBId: 'r-tides', status: 'Scheduled' },
  { id: 'm-21', week: 7, date: '2026-06-18', time: '8:00 PM', flight: 'White', teamAId: 'w-caps', teamBId: 'w-waves', status: 'Scheduled' },
]

export const champions: Champion[] = [
  { sport: 'Cornhole', season: 'Summer 2025', flight: 'Green', teamName: 'Glen Sharks' },
  { sport: 'Cornhole', season: 'Summer 2025', flight: 'Red', teamName: 'Ripple Rays' },
  { sport: 'Cornhole', season: 'Summer 2025', flight: 'White', teamName: 'White Waves' },
  { sport: 'Cornhole', season: 'Summer 2024', flight: 'Green', teamName: 'Deck Dolphins' },
  { sport: 'Cornhole', season: 'Summer 2024', flight: 'Red', teamName: 'Toss Tides' },
  { sport: 'Cornhole', season: 'Summer 2024', flight: 'White', teamName: 'Corner Caps' },
]
