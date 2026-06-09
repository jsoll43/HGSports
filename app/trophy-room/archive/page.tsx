import Link from 'next/link'

export default function TrophyArchivePage() {
  return (
    <main className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h1 className="text-3xl font-black text-navy">Archived Seasons</h1>
      <p className="font-semibold text-slate-600">Season archives will live here once historical schedules and standings are imported.</p>
      <Link href="/trophy-room" className="min-h-12 rounded-lg bg-navy px-4 py-3 text-center font-black text-white">
        Back to Trophy Room
      </Link>
    </main>
  )
}
