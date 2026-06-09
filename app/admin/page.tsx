'use client'

import { useState } from 'react'
import { PinGate } from '@/components/PinGate'
import { useLeague } from '@/components/LeagueProvider'
import { matchTitle, playerById, playerName, scoreTotals } from '@/lib/league'

const tabs = ['Pending Scores', 'Teams', 'Schedule', 'Import', 'Settings', 'Seasons', 'Audit Log', 'Snapshots']

export default function AdminPage() {
  const { submissions, matches, approveSubmission, rejectSubmission } = useLeague()
  const [activeTab, setActiveTab] = useState('Pending Scores')
  const pending = submissions.filter((submission) => submission.status === 'Pending')

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Prototype admin</p>
        <h1 className="text-3xl font-black text-navy">Admin</h1>
      </div>

      <PinGate label="Enter admin password" password="GlenAdmin">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-black ${activeTab === tab ? 'bg-navy text-white' : 'bg-white text-navy'}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Pending Scores' ? (
          <section className="grid gap-3">
            {pending.length === 0 ? (
              <div className="rounded-lg border border-cyan-100 bg-white p-5 text-center font-bold text-slate-600 shadow-sm">No pending scores.</div>
            ) : null}
            {pending.map((submission) => {
              const match = matches.find((item) => item.id === submission.matchId)
              const player = playerById(submission.submittedByPlayerId)
              const totals = scoreTotals(submission.score)
              return (
                <article key={submission.id} className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-black text-cyan-700">Week {match?.week}</p>
                    <h2 className="text-xl font-black text-navy">{match ? matchTitle(match) : 'Unknown match'}</h2>
                    <p className="font-semibold text-slate-600">
                      Submitted by {player ? playerName(player) : 'Unknown'} · {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="grid gap-2 rounded-lg bg-deck p-3 font-bold text-navy">
                    <p>Game 1: {submission.score.game1.teamA}-{submission.score.game1.teamB}</p>
                    <p>Game 2: {submission.score.game2.teamA}-{submission.score.game2.teamB}</p>
                    <p>Total: Team A {totals.teamA}, Team B {totals.teamB}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="min-h-12 rounded-lg bg-emerald-600 px-3 font-black text-white" type="button" onClick={() => approveSubmission(submission.id)}>
                      Approve
                    </button>
                    <button className="min-h-12 rounded-lg bg-aqua px-3 font-black text-navy" type="button">
                      Edit
                    </button>
                    <button className="min-h-12 rounded-lg bg-rose-600 px-3 font-black text-white" type="button" onClick={() => rejectSubmission(submission.id)}>
                      Reject
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        ) : (
          <section className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-navy">{activeTab}</h2>
            <p className="mt-2 font-semibold text-slate-600">Prototype placeholder for future admin tools.</p>
          </section>
        )}
      </PinGate>
    </main>
  )
}
