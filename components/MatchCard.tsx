import Link from 'next/link'
import { displayDate, isPlayerInMatch, matchTitle, opponentTeam, publicStatus } from '@/lib/league'
import type { Match, Player, Team } from '@/lib/types'
import { StatusBadge } from './StatusBadge'

export function MatchCard({ match, player, teams }: { match: Match; player?: Player; teams?: Team[] }) {
  const opponent = player ? opponentTeam(player, match, teams) : null
  const canUsePlayerActions = player && isPlayerInMatch(player, match)

  return (
    <article className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Week {match.week}</p>
          <h3 className="mt-1 text-lg font-black text-navy">{player ? `vs ${opponent?.name}` : matchTitle(match, teams)}</h3>
          <p className="text-sm font-semibold text-slate-600">
            {displayDate(match)} · {match.flight} Band
          </p>
        </div>
        <StatusBadge status={publicStatus(match)} />
      </div>

      {canUsePlayerActions ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Link className="min-h-12 rounded-lg bg-cyan-600 px-4 py-3 text-center font-black text-white" href={`/matches/${match.id}`}>
            Text Match Group
          </Link>
          <Link className="min-h-12 rounded-lg bg-navy px-4 py-3 text-center font-black text-white" href={`/matches/${match.id}/score`}>
            Lock Submit Score
          </Link>
          <Link className="min-h-12 rounded-lg border border-cyan-200 bg-aqua px-4 py-3 text-center font-black text-navy" href={`/matches/${match.id}/reschedule`}>
            Lock Mark Rescheduled
          </Link>
        </div>
      ) : null}
    </article>
  )
}
