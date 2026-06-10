import assert from 'node:assert/strict'
import test from 'node:test'
import { archivedSeasonState } from '../lib/archive-rules'
import { validateImport } from '../lib/import-validation'
import { isOverdue, standingsForFlight } from '../lib/league'
import { hashPin, verifyPinHash } from '../lib/pin-validation'
import { validateServerScore } from '../lib/score-rules'
import { matches, teams } from '../lib/data'

test('score validation requires one team to reach 21 in each game', () => {
  assert.deepEqual(validateServerScore({ game1: { teamA: 20, teamB: 18 }, game2: { teamA: 21, teamB: 19 } }), [
    'Game 1: one team must score exactly 21.',
  ])
  assert.deepEqual(validateServerScore({ game1: { teamA: 21, teamB: 18 }, game2: { teamA: 14, teamB: 21 } }), [])
})

test('standings rank by total points first', () => {
  const rows = standingsForFlight('Green', matches, teams)
  assert.equal(rows[0].team.name, 'Glen Sharks')
  assert.ok(rows[0].totalPoints >= rows[1].totalPoints)
})

test('pin validation is case-insensitive', () => {
  const hash = hashPin('Glen')
  assert.equal(verifyPinHash('glen', hash), true)
  assert.equal(verifyPinHash('GLEN', hash), true)
  assert.equal(verifyPinHash('wrong', hash), false)
})

test('overdue scheduled matches are detected', () => {
  assert.equal(isOverdue({ ...matches[5], status: 'Scheduled', approvedScore: undefined }, new Date('2026-06-10T12:00:00')), true)
  assert.equal(isOverdue({ ...matches[0], status: 'Final' }, new Date('2026-06-10T12:00:00')), false)
})

test('import validation blocks missing teams and warns on missing phone', () => {
  const preview = validateImport(
    [
      {
        Season: 'Summer 2026',
        Flight: 'Green',
        'Team Number': '1',
        'Player 1 First Name': 'Jon',
        'Player 1 Last Name': 'Soll',
        'Player 1 Phone': '',
        'Player 1 Email': '',
        'Player 2 First Name': 'Pat',
        'Player 2 Last Name': 'Tronco',
        'Player 2 Phone': '856-555-0123',
        'Player 2 Email': '',
      },
    ],
    [{ Season: 'Summer 2026', Week: '1', Date: '2026-06-01', Time: '6:30 PM', Flight: 'Green', 'Team A Number': '1', 'Team B Number': '2', Notes: '' }],
  )
  assert.ok(preview.warnings.some((warning) => warning.includes('missing a phone')))
  assert.ok(preview.errors.some((error) => error.includes('Team B Number 2')))
})

test('archive behavior marks season inactive and preserves archive timestamp', () => {
  const archived = archivedSeasonState({ id: 'season-1', is_active: true, archived_at: null }, '2026-06-09T12:00:00Z')
  assert.equal(archived.is_active, false)
  assert.equal(archived.archived_at, '2026-06-09T12:00:00Z')
})
