import RescheduleClient from './RescheduleClient'
import { matches } from '@/lib/data'

export function generateStaticParams() {
  return matches.map((match) => ({
    matchId: match.id,
  }))
}

export default async function ReschedulePage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  return <RescheduleClient matchId={matchId} />
}
