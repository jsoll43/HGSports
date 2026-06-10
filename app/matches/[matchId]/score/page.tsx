import ScoreClient from './ScoreClient'
import { matches } from '@/lib/data'

export function generateStaticParams() {
  return matches.map((match) => ({
    matchId: match.id,
  }))
}

export default async function ScorePage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  return <ScoreClient matchId={matchId} />
}
