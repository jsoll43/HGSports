import MatchContactClient from './MatchContactClient'
import { matches } from '@/lib/league'

export function generateStaticParams() {
  return matches.map((match) => ({
    matchId: match.id,
  }))
}

export default function MatchContactPage({
  params,
}: {
  params: { matchId: string }
}) {
  return <MatchContactClient matchId={params.matchId} />
}