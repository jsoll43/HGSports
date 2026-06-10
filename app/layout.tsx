import type { Metadata } from 'next'
import './globals.css'
import { LeagueProvider } from '@/components/LeagueProvider'
import { Shell } from '@/components/Shell'
import { getLeagueData, getPendingSubmissions } from '@/lib/supabase-data'

export const metadata: Metadata = {
  title: 'HG Sports',
  description: 'Haddon Glen Pool Club sports leagues',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const leagueData = await getLeagueData()
  const pendingSubmissions = await getPendingSubmissions()

  return (
    <html lang="en">
      <body>
        <LeagueProvider initialData={leagueData} initialSubmissions={pendingSubmissions}>
          <Shell activeSeason={leagueData.activeSeason}>{children}</Shell>
        </LeagueProvider>
      </body>
    </html>
  )
}
