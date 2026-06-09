import Link from 'next/link'
import { champions } from '@/lib/data'

export default function TrophyRoomPage() {
  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Past seasons</p>
        <h1 className="text-3xl font-black text-navy">Trophy Room</h1>
      </div>

      <section className="grid gap-3">
        {champions.map((champion) => (
          <article key={`${champion.season}-${champion.flight}`} className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-cyan-700">{champion.sport} · {champion.season}</p>
            <h2 className="mt-1 text-xl font-black text-navy">{champion.teamName}</h2>
            <p className="font-semibold text-slate-600">{champion.flight} Band Champions</p>
          </article>
        ))}
      </section>

      <Link href="/trophy-room/archive" className="min-h-12 rounded-lg bg-navy px-4 py-3 text-center font-black text-white">
        Archived Seasons
      </Link>
    </main>
  )
}
