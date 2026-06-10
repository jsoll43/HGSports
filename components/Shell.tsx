import Link from 'next/link'

const bottomLinks = [
  { href: '/', label: 'Home' },
  { href: '/my-matches', label: 'My Matches' },
  { href: '/standings', label: 'Standings' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/trophy-room', label: 'Trophy' },
]

export function Shell({ children, activeSeason }: { children: React.ReactNode; activeSeason: string }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-cyan-100 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-lg font-black text-white">HG</span>
            <span>
              <span className="block text-lg font-black leading-tight text-navy">HG Sports</span>
              <span className="block text-xs font-semibold text-cyan-700">{activeSeason}</span>
            </span>
          </Link>
          <Link href="/admin" className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-bold text-navy shadow-sm">
            Admin
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:py-8">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-cyan-100 bg-white/95 shadow-soft backdrop-blur sm:hidden" aria-label="Primary">
        <div className="grid grid-cols-5">
          {bottomLinks.map((link) => (
            <Link key={link.href} href={link.href} className="min-h-16 px-1 py-3 text-center text-[11px] font-black text-navy">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
