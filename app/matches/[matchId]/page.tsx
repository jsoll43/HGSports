import MatchContactClient from './MatchContactClient'
import { matches } from '@/lib/data'

export function generateStaticParams() {
  return matches.map((match) => ({
    matchId: match.id,
  }))
}

export default async function MatchContactPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  return <MatchContactClient matchId={matchId} />
}
