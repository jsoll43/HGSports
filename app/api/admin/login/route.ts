import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, verifyAdminPassword } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string; adminName?: string }
  if (!(await verifyAdminPassword(body.password ?? ''))) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 403 })
  }

  await createAdminSession(body.adminName || 'Admin')
  return NextResponse.json({ ok: true })
}
