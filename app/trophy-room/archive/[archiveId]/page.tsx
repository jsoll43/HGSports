import ArchiveDetailClient from './ArchiveDetailClient'

export default async function ArchiveDetailPage({ params }: { params: Promise<{ archiveId: string }> }) {
  const { archiveId } = await params
  return <ArchiveDetailClient archiveId={archiveId} />
}
