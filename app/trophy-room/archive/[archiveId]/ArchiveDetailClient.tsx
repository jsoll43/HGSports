'use client'

import { useEffect, useState } from 'react'

export default function ArchiveDetailClient({ archiveId }: { archiveId: string }) {
  const [archive, setArchive] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    void fetch('/api/archives')
      .then((response) => response.json())
      .then((archives) => setArchive(archives.find((item: Record<string, any>) => item.id === archiveId) ?? null))
  }, [archiveId])

  const summary = archive?.archive_summary_json

  return (
    <main className="grid gap-4">
      <h1 className="text-3xl font-black text-navy">{summary?.activeSeason?.name ?? 'Archived Season'}</h1>
      {!summary ? <p className="rounded-lg bg-white p-5 font-semibold text-slate-600 shadow-sm">Loading archive...</p> : null}
      {summary?.standings?.map((flight: Record<string, any>) => (
        <section key={flight.flight} className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-black text-navy">{flight.flight} Standings</h2>
          <div className="mt-3 grid gap-2">
            {flight.rows.map((row: Record<string, any>) => (
              <div key={row.team.id} className="flex justify-between rounded-lg bg-deck p-3 font-bold text-navy">
                <span>#{row.rank} {row.team.name}</span>
                <span>{row.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </section>
      ))}
      {summary ? (
        <section className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-black text-navy">Schedule and Results</h2>
          <div className="mt-3 grid gap-2">
            {summary.matches?.map((match: Record<string, any>) => <div key={match.id} className="rounded-lg bg-deck p-3 font-bold text-slate-700">Week {match.week} - {match.date} - {match.status}</div>)}
          </div>
        </section>
      ) : null}
    </main>
  )
}
