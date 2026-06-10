'use client'

import Link from 'next/link'
import { useLeague } from '@/components/LeagueProvider'
import { currentLeaders } from '@/lib/league'

const navCards = [
  { href: '/my-matches', label: 'My Matches' },
  { href: '/standings', label: 'Standings' },
  { href: '/schedule', label: 'Full Schedule' },
  { href: '/trophy-room', label: 'Trophy Room' },
]

export default function HomePage() {
  const { activeSeason, matches, teams } = useLeague()
  const leaders = currentLeaders(matches, teams)

  return (
    <main className="grid gap-5">
      <section className="rounded-lg bg-navy p-5 text-white shadow-soft">
        <p className="text-sm font-bold text-cyan-100">{activeSeason}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight">Haddon Glen Cornhole League</h1>
        <p className="mt-3 max-w-xl text-base text-cyan-50">Fast schedules, standings, and match tools for Haddon Glen Pool Club players.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {navCards.map((card) => (
          <Link key={card.href} href={card.href} className="min-h-20 rounded-lg border border-cyan-100 bg-white p-4 text-xl font-black text-navy shadow-sm">
            {card.label}
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-black text-navy">Current Leaders</h2>
        <div className="mt-3 grid gap-3">
          {leaders.map((leader) => (
            <div key={leader.team.id} className="flex items-center justify-between gap-3 rounded-lg bg-deck p-3">
              <span className="font-black text-navy">{leader.team.flight} Band</span>
              <span className="text-right font-bold text-slate-700">
                {leader.team.name} · {leader.totalPoints} pts
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
