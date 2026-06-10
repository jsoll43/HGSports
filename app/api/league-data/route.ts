import { NextResponse } from 'next/server'
import { getLeagueData } from '@/lib/supabase-data'

export async function GET() {
  return NextResponse.json(await getLeagueData())
}
