import { NextRequest, NextResponse } from 'next/server'
import { getAdminName } from '@/lib/server-auth'
import { listAuditLog } from '@/lib/snapshot-service'

export async function GET(request: NextRequest) {
  if (!(await getAdminName())) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })
  return NextResponse.json(await listAuditLog(request.nextUrl.searchParams.get('action') ?? undefined))
}
