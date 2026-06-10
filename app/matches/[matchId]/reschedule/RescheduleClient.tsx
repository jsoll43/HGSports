'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PinGate } from '@/components/PinGate'
import { useLeague } from '@/components/LeagueProvider'
import { displayDate, isPlayerInMatch, matchTitle, playerById } from '@/lib/league'

export default function RescheduleClient({ matchId }: { matchId: string }) {
  const { matches, selectedPlayerId, addReschedule } = useLeague()
  const router = useRouter()
  const match = matches.find((item) => item.id === matchId)
  const player = selectedPlayerId ? playerById(selectedPlayerId) : undefined
  const [proposedDateTime, setProposedDateTime] = useState('')
  const [notes, setNotes] = useState('')

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
        <p className="mt-2 font-semibold text-slate-600">You can only mark matches involving your team.</p>
      </main>
    )
  }

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Reschedule request</p>
        <h1 className="text-3xl font-black text-navy">{matchTitle(match)}</h1>
        <p className="font-semibold text-slate-600">Week {match.week} - {displayDate(match)}</p>
      </div>

      <PinGate label="Enter league PIN to mark rescheduled">
        <form
          className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            addReschedule({
              id: `res-${Date.now()}`,
              matchId: match.id,
              submittedByPlayerId: player.id,
              submittedAt: new Date().toISOString(),
              proposedDateTime,
              notes,
            })
            router.push('/my-matches')
          }}
        >
          <label className="grid gap-2 text-sm font-bold text-navy">
            Proposed makeup date/time
            <input className="min-h-12 rounded-lg border border-cyan-200 px-3" type="datetime-local" value={proposedDateTime} onChange={(event) => setProposedDateTime(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            Notes
            <textarea className="min-h-24 rounded-lg border border-cyan-200 px-3 py-2" value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>
          <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="submit">
            Save Reschedule
          </button>
        </form>
      </PinGate>
    </main>
  )
}
