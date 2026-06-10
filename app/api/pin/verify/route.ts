import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyPlayerPin } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { seasonId?: string; pin?: string }
  if (!body.seasonId || !(await verifyPlayerPin(body.seasonId, body.pin ?? ''))) {
    return NextResponse.json({ error: 'Invalid PIN.' }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.set(`hg_pin_${body.seasonId}`, 'verified', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 30,
  })

  return NextResponse.json({ ok: true })
}
