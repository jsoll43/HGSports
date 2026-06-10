'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TrophyArchivePage() {
  const [archives, setArchives] = useState<Record<string, any>[]>([])

  async function load() {
    const response = await fetch('/api/archives')
    setArchives(response.ok ? await response.json() : [])
  }

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Past seasons</p>
        <h1 className="text-3xl font-black text-navy">Archived Seasons</h1>
      </div>
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="button" onClick={() => void load()}>Load Archived Seasons</button>
      {archives.length === 0 ? <p className="rounded-lg border border-cyan-100 bg-white p-5 font-semibold text-slate-600 shadow-sm">No archived seasons loaded yet.</p> : null}
      {archives.map((archive) => {
        const summary = archive.archive_summary_json ?? {}
        return (
          <Link key={archive.id} href={`/trophy-room/archive/${archive.id}`} className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-cyan-700">{new Date(archive.archived_at).toLocaleDateString()}</p>
            <h2 className="text-xl font-black text-navy">{summary.activeSeason?.name ?? 'Archived Season'}</h2>
            <p className="font-semibold text-slate-600">{summary.stats?.teams ?? 0} teams · {summary.stats?.matches ?? 0} matches</p>
          </Link>
        )
      })}
    </main>
  )
}
