'use client'

import Link from 'next/link'
import { useLeague } from '@/components/LeagueProvider'

export default function TrophyRoomPage() {
  const { champions } = useLeague()
  const groups = new Map<string, typeof champions>()

  champions.forEach((champion) => {
    const key = `${champion.sport} - ${champion.season}`
    groups.set(key, [...(groups.get(key) ?? []), champion])
  })

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Past seasons</p>
        <h1 className="text-3xl font-black text-navy">Trophy Room</h1>
      </div>

      {[...groups.entries()].map(([group, entries]) => (
        <section key={group} className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-black text-navy">{group}</h2>
          {entries.map((champion) => (
            <article key={`${champion.season}-${champion.flight}`} className="rounded-lg bg-deck p-3">
              <p className="text-sm font-black text-cyan-700">{champion.flight} Band</p>
              <h3 className="text-lg font-black text-navy">{champion.teamName}</h3>
              {champion.playerNames ? <p className="font-semibold text-slate-600">{champion.playerNames}</p> : null}
            </article>
          ))}
        </section>
      ))}

      {champions.length === 0 ? <p className="rounded-lg border border-cyan-100 bg-white p-5 font-semibold text-slate-600 shadow-sm">No trophy entries yet.</p> : null}

      <Link href="/trophy-room/archive" className="min-h-12 rounded-lg bg-navy px-4 py-3 text-center font-black text-white">
        Archived Seasons
      </Link>
    </main>
  )
}
