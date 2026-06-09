'use client'

import { useMemo, useState } from 'react'
import { useLeague } from '@/components/LeagueProvider'
import { displayDate, isPlayerInMatch, matchTitle, playerById, playerName, teamById, teamPlayers } from '@/lib/league'

export default function MatchContactClient({ matchId }: { matchId: string }) {
  const { matches, selectedPlayerId } = useLeague()
  const [copied, setCopied] = useState('')
const match = matches.find((item) => item.id === matchId)
  const selectedPlayer = selectedPlayerId ? playerById(selectedPlayerId) : undefined

  if (!match) {
    return (
      <main className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-navy">Match not found</h1>
      </main>
    )
  }

  const canView = selectedPlayer && isPlayerInMatch(selectedPlayer, match)
  const allPlayers = useMemo(() => [...teamPlayers(match.teamAId), ...teamPlayers(match.teamBId)], [match.teamAId, match.teamBId])

  if (!canView) {
    return (
      <main className="rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-black text-navy">Select your player first</h1>
        <p className="mt-2 font-semibold text-slate-600">Contact details are only shown for matches involving your selected player.</p>
      </main>
    )
  }

  const selectedTeam = teamById(selectedPlayer.teamId)
  const message = `Hey, this is ${playerName(selectedPlayer)} from ${selectedTeam?.name}. We're scheduled to play Week ${match.week} on ${displayDate(match)}. Any chance you can reschedule?`
  const numbers = allPlayers.map((player) => player.phone).join(',')

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
  }

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Match group</p>
        <h1 className="text-3xl font-black text-navy">{matchTitle(match)}</h1>
        <p className="font-semibold text-slate-600">Week {match.week} · {displayDate(match)}</p>
      </div>

      <a className="min-h-12 rounded-lg bg-navy px-4 py-3 text-center font-black text-white" href={`sms:${numbers}?&body=${encodeURIComponent(message)}`}>
        Text Match Group
      </a>

      <section className="grid gap-3">
        {[match.teamAId, match.teamBId].map((teamId) => (
          <div key={teamId} className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-black text-navy">{teamById(teamId)?.name}</h2>
            <div className="mt-3 grid gap-2">
              {teamPlayers(teamId).map((player) => (
                <a key={player.id} className="rounded-lg bg-aqua px-4 py-3 font-black text-navy" href={`sms:${player.phone}`}>
                  Text {playerName(player)} · {player.phone}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <button className="min-h-12 rounded-lg border border-cyan-200 bg-white px-4 font-black text-navy" type="button" onClick={() => copyText(numbers, 'numbers')}>
          Copy All Numbers
        </button>
        <button className="min-h-12 rounded-lg border border-cyan-200 bg-white px-4 font-black text-navy" type="button" onClick={() => copyText(message, 'message')}>
          Copy Reschedule Message
        </button>
      </div>
      {copied ? <p className="text-center text-sm font-black text-cyan-700">Copied {copied}.</p> : null}
    </main>
  )
}
