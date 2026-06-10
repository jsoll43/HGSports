'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PinGate } from '@/components/PinGate'
import { useLeague } from '@/components/LeagueProvider'
import { displayDate, isPlayerInMatch, matchTitle, playerById, scoreTotals, validateScore } from '@/lib/league'
import type { Score } from '@/lib/types'

export default function ScoreClient({ matchId }: { matchId: string }) {
  const { matches, selectedPlayerId, addSubmission, players, teams } = useLeague()
  const router = useRouter()
  const match = matches.find((item) => item.id === matchId)
  const player = selectedPlayerId ? playerById(selectedPlayerId, players) : undefined
  const [score, setScore] = useState<Score>({ game1: { teamA: 21, teamB: 0 }, game2: { teamA: 0, teamB: 21 } })
  const [playedDate, setPlayedDate] = useState(match?.date ?? '')
  const [notes, setNotes] = useState('')
  const errors = validateScore(score)
  const totals = scoreTotals(score)

  if (!match) {
    return (
      <main className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-navy">Match not found</h1>
      </main>
    )
  }

  if (!player || !isPlayerInMatch(player, match)) {
    return (
      <main className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-navy">Select your player first</h1>
        <p className="mt-2 font-semibold text-slate-600">You can only submit scores for matches involving your team.</p>
      </main>
    )
  }

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Score submission</p>
        <h1 className="text-3xl font-black text-navy">{matchTitle(match, teams)}</h1>
        <p className="font-semibold text-slate-600">Week {match.week} - {displayDate(match)}</p>
      </div>

      <PinGate label="Enter league PIN to submit a score">
        <form
          className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm"
          onSubmit={async (event) => {
            event.preventDefault()
            if (errors.length) return
            await addSubmission({
              id: `sub-${Date.now()}`,
              matchId: match.id,
              submittedByPlayerId: player.id,
              submittedAt: new Date().toISOString(),
              playedDate,
              notes,
              score,
              status: 'Pending',
            })
            router.push('/admin')
          }}
        >
          <ScoreRow label="Game 1" teamA={score.game1.teamA} teamB={score.game1.teamB} onChange={(game1) => setScore({ ...score, game1 })} />
          <ScoreRow label="Game 2" teamA={score.game2.teamA} teamB={score.game2.teamB} onChange={(game2) => setScore({ ...score, game2 })} />

          <label className="grid gap-2 text-sm font-bold text-navy">
            Played Date
            <input className="min-h-12 rounded-lg border border-cyan-200 px-3" type="date" value={playedDate} onChange={(event) => setPlayedDate(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            Notes
            <textarea className="min-h-24 rounded-lg border border-cyan-200 px-3 py-2" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>

          <div className="rounded-lg bg-deck p-3 font-black text-navy">
            Total points preview: Team A {totals.teamA}, Team B {totals.teamB}
          </div>
          {errors.map((error) => (
            <p key={error} className="font-bold text-rose-700">{error}</p>
          ))}
          <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white disabled:opacity-50" type="submit" disabled={errors.length > 0}>
            Submit for Commissioner Approval
          </button>
        </form>
      </PinGate>
    </main>
  )
}

function ScoreRow({ label, teamA, teamB, onChange }: { label: string; teamA: number; teamB: number; onChange: (score: { teamA: number; teamB: number }) => void }) {
  return (
    <div className="grid gap-2">
      <p className="font-black text-navy">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-sm font-bold text-navy">
          Team A
          <input className="min-h-12 rounded-lg border border-cyan-200 px-3 text-lg" min={0} max={21} type="number" value={teamA} onChange={(event) => onChange({ teamA: Number(event.target.value), teamB })} />
        </label>
        <label className="grid gap-1 text-sm font-bold text-navy">
          Team B
          <input className="min-h-12 rounded-lg border border-cyan-200 px-3 text-lg" min={0} max={21} type="number" value={teamB} onChange={(event) => onChange({ teamA, teamB: Number(event.target.value) })} />
        </label>
      </div>
    </div>
  )
}
