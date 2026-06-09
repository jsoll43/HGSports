'use client'

import { useMemo, useState } from 'react'
import { MatchCard } from '@/components/MatchCard'
import { useLeague } from '@/components/LeagueProvider'
import { flights } from '@/lib/data'
import type { Flight } from '@/lib/types'

export default function SchedulePage() {
  const { matches } = useLeague()
  const [flight, setFlight] = useState<Flight | 'All'>('All')
  const [week, setWeek] = useState('All')
  const weeks = useMemo(() => [...new Set(matches.map((match) => match.week))], [matches])
  const filtered = matches.filter((match) => (flight === 'All' || match.flight === flight) && (week === 'All' || match.week === Number(week)))

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Public schedule</p>
        <h1 className="text-3xl font-black text-navy">Full Schedule</h1>
      </div>

      <section className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Band
          <select className="min-h-12 rounded-lg border border-cyan-200 px-3" value={flight} onChange={(event) => setFlight(event.target.value as Flight | 'All')}>
            <option>All</option>
            {flights.map((band) => (
              <option key={band}>{band}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Week
          <select className="min-h-12 rounded-lg border border-cyan-200 px-3" value={week} onChange={(event) => setWeek(event.target.value)}>
            <option>All</option>
            {weeks.map((matchWeek) => (
              <option key={matchWeek}>{matchWeek}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-3">
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>
    </main>
  )
}
