import type { Metadata } from 'next'
import './globals.css'
import { LeagueProvider } from '@/components/LeagueProvider'
import { Shell } from '@/components/Shell'

export const metadata: Metadata = {
  title: 'HG Sports',
  description: 'Haddon Glen Pool Club sports leagues',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LeagueProvider>
          <Shell>{children}</Shell>
        </LeagueProvider>
      </body>
    </html>
  )
}
