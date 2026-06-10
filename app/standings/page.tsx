'use client'

import { useState } from 'react'
import { useLeague } from '@/components/LeagueProvider'
import { standingsForFlight } from '@/lib/league'
import type { Flight } from '@/lib/types'

export default function StandingsPage() {
  const { matches, teams, flights } = useLeague()
  const [flight, setFlight] = useState<Flight>('Green')
  const rows = standingsForFlight(flight, matches, teams)

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Public standings</p>
        <h1 className="text-3xl font-black text-navy">Standings</h1>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-white p-2 shadow-sm">
        {flights.map((band) => (
          <button
            key={band.id}
            className={`min-h-12 rounded-lg font-black ${flight === band.name ? 'bg-navy text-white' : 'bg-aqua text-navy'}`}
            onClick={() => setFlight(band.name)}
            type="button"
          >
            {band.name}
          </button>
        ))}
      </div>

      <section className="grid gap-3">
        {rows.map((row) => (
          <article key={row.team.id} className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-cyan-700">Rank {row.rank}</p>
                <h2 className="text-xl font-black text-navy">{row.team.name}</h2>
              </div>
              <div className="rounded-lg bg-navy px-4 py-2 text-center text-white">
                <span className="block text-2xl font-black">{row.totalPoints}</span>
                <span className="text-xs font-bold">points</span>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <Stat label="Match W-L" value={`${row.matchWins}-${row.matchLosses}`} />
              <Stat label="Game W-L" value={`${row.gameWins}-${row.gameLosses}`} />
              <Stat label="Diff" value={String(row.pointDifferential)} />
              <Stat label="Played" value={String(row.matchesPlayed)} />
            </dl>
          </article>
        ))}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-deck p-3">
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="text-lg font-black text-navy">{value}</dd>
    </div>
  )
}
