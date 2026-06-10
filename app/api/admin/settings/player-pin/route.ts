import { NextRequest, NextResponse } from 'next/server'
import { getAdminName, hashSecret } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })

  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any

  const body = (await request.json()) as { seasonId?: string; enabled?: boolean; pin?: string }
  if (!body.seasonId) return NextResponse.json({ error: 'Season is required.' }, { status: 400 })

  await db.from('app_settings').upsert(
    {
      season_id: body.seasonId,
      key: 'player_pin_enabled',
      value: body.enabled !== false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'season_id,key' },
  )

  if (body.pin?.trim()) {
    await db.from('app_settings').upsert(
      {
        season_id: body.seasonId,
        key: 'player_pin_hash',
        value: hashSecret(body.pin.trim().toLowerCase()),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'season_id,key' },
    )
  }

  await db.from('audit_log').insert({
    season_id: body.seasonId,
    actor_type: 'admin',
    actor_admin_name: adminName,
    action: 'player_pin_settings_updated',
    entity_type: 'app_settings',
    entity_id: body.seasonId,
    after_json: { enabled: body.enabled !== false, pin_changed: Boolean(body.pin?.trim()) },
  })

  return NextResponse.json({ ok: true })
}
