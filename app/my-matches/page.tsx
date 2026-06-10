'use client'

import Link from 'next/link'
import { MatchCard } from '@/components/MatchCard'
import { useLeague } from '@/components/LeagueProvider'
import { isOverdue, playerById, playerName, recordForTeam, sortedPlayers, teamById } from '@/lib/league'

export default function MyMatchesPage() {
  const { selectedPlayerId, setSelectedPlayerId, changePlayer, matches, players, teams } = useLeague()
  const selectedPlayer = selectedPlayerId ? playerById(selectedPlayerId, players) : undefined
  const team = selectedPlayer ? teamById(selectedPlayer.teamId, teams) : undefined

  if (!selectedPlayer || !team) {
    return (
      <main className="grid gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-cyan-700">No login needed</p>
          <h1 className="text-3xl font-black text-navy">My Matches</h1>
        </div>
        <section className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
          <label className="grid gap-2 text-sm font-bold text-navy">
            Select your name
            <select className="min-h-12 rounded-lg border border-cyan-200 px-3 text-base" defaultValue="" onChange={(event) => setSelectedPlayerId(event.target.value)}>
              <option value="" disabled>
                Choose player
              </option>
              {sortedPlayers(players).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.lastName}, {player.firstName} - {teamById(player.teamId, teams)?.name ?? 'Team'}
                </option>
              ))}
            </select>
          </label>
        </section>
      </main>
    )
  }

  const row = recordForTeam(team, matches, teams)
  const teamMatches = matches
    .filter((match) => match.teamAId === team.id || match.teamBId === team.id)
    .filter((match) => match.status !== 'Final' || isOverdue(match))

  return (
    <main className="grid gap-4">
      <section className="rounded-lg bg-navy p-5 text-white shadow-soft">
        <p className="font-bold text-cyan-100">Continue as {playerName(selectedPlayer)}</p>
        <h1 className="mt-1 text-3xl font-black">{team.name}</h1>
        <p className="mt-1 font-semibold text-cyan-50">{team.flight} Band</p>
        <button className="mt-4 rounded-lg bg-white px-4 py-2 font-black text-navy" type="button" onClick={changePlayer}>
          Change player
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Record" value={`${row?.matchWins ?? 0}-${row?.matchLosses ?? 0}`} />
        <Stat label="Total Points" value={String(row?.totalPoints ?? 0)} />
        <Stat label="Rank" value={row ? `#${row.rank}` : '#-'} />
        <Stat label="Players" value={String(players.filter((player) => player.teamId === team.id).length)} />
      </section>

      <Link href="/schedule" className="min-h-12 rounded-lg border border-cyan-200 bg-aqua px-4 py-3 text-center font-black text-navy">
        View Full Season Schedule
      </Link>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-navy">Upcoming and Needs Attention</h2>
        {teamMatches.map((match) => (
          <MatchCard key={match.id} match={match} player={selectedPlayer} teams={teams} />
        ))}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase text-cyan-700">{label}</p>
      <p className="text-2xl font-black text-navy">{value}</p>
    </div>
  )
}
