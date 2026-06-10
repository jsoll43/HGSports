import { NextRequest, NextResponse } from 'next/server'
import { getAdminName, hashSecret } from '@/lib/server-auth'
import { createServiceSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const adminName = await getAdminName()
  if (!adminName) return NextResponse.json({ error: 'Admin session required.' }, { status: 401 })
  const supabase = createServiceSupabaseClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  const db = supabase as any
  const body = (await request.json()) as {
    seasonId?: string
    adminPassword?: string
    snapshotEnabled?: boolean
    snapshotTime?: string
    newSeasonName?: string
    newSeasonYear?: string
  }

  if (body.adminPassword?.trim()) {
    await db.from('app_settings').upsert({ season_id: null, key: 'admin_password_hash', value: hashSecret(body.adminPassword), updated_at: new Date().toISOString() }, { onConflict: 'season_id,key' })
  }
  if (body.seasonId) {
    await db.from('app_settings').upsert({ season_id: body.seasonId, key: 'snapshot_enabled', value: Boolean(body.snapshotEnabled), updated_at: new Date().toISOString() }, { onConflict: 'season_id,key' })
    await db.from('app_settings').upsert({ season_id: body.seasonId, key: 'snapshot_time', value: body.snapshotTime || '02:00', updated_at: new Date().toISOString() }, { onConflict: 'season_id,key' })
  }
  if (body.newSeasonName?.trim()) {
    const { data: activeSeason } = await db.from('seasons').select('*').eq('is_active', true).single()
    if (activeSeason) {
      await db.from('seasons').update({ is_active: false }).eq('id', activeSeason.id)
      await db.from('seasons').insert({
        league_id: activeSeason.league_id,
        name: body.newSeasonName,
        year: Number(body.newSeasonYear || new Date().getFullYear()),
        is_active: true,
      })
    }
  }

  if (body.seasonId) {
    await db.from('audit_log').insert({
      season_id: body.seasonId,
      actor_type: 'admin',
      actor_admin_name: adminName,
      action: 'settings_change',
      entity_type: 'app_settings',
      entity_id: body.seasonId,
      after_json: { snapshotEnabled: body.snapshotEnabled, snapshotTime: body.snapshotTime, adminPasswordChanged: Boolean(body.adminPassword), newSeasonName: body.newSeasonName },
    })
  }

  return NextResponse.json({ ok: true })
}
