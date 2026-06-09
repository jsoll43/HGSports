export function StatusBadge({ status }: { status: string }) {
  const urgent = status.includes('Score Needed') || status.includes('Makeup')
  const pending = status.includes('Pending')
  const final = status === 'Final'

  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1 text-xs font-black',
        final && 'bg-emerald-100 text-emerald-800',
        pending && 'bg-amber-100 text-amber-800',
        urgent && 'bg-rose-100 text-rose-800',
        !final && !pending && !urgent && 'bg-cyan-100 text-cyan-800',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {status}
    </span>
  )
}
