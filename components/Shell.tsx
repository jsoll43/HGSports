import Link from 'next/link'
import { activeSeason } from '@/lib/data'

export function Shell({ children }: { children: React.ReactNode }) {
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
      <div className="mx-auto max-w-5xl px-4 py-5 sm:py-8">{children}</div>
    </div>
  )
}
