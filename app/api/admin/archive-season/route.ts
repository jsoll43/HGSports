import { NextResponse } from 'next/server'
import { getAdminName } from '@/lib/server-auth'
import { archiveActiveSeason } from '@/lib/snapshot-service'

export async function POST() {
  if (!(await getAdminName())) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })
  return NextResponse.json(await archiveActiveSeason())
}
