import { NextResponse } from 'next/server'
import { listArchives } from '@/lib/snapshot-service'

export async function GET() {
  return NextResponse.json(await listArchives())
}
