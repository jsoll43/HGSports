import 'server-only'

import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { createServiceSupabaseClient } from './supabase'

const adminCookieName = 'hg_admin_session'

export function hashSecret(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function safeCompare(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function verifyPlayerPin(seasonId: string, pin: string) {
  const supabase = createServiceSupabaseClient()
  if (!supabase) return pin.trim().toLowerCase() === 'glen'
  const db = supabase as any

  const { data } = await db
    .from('app_settings')
    .select('key,value')
    .eq('season_id', seasonId)
    .in('key', ['player_pin_enabled', 'player_pin_hash'])

  const settings = new Map((data ?? []).map((setting: { key: string; value: unknown }) => [setting.key, setting.value]))
  if (settings.get('player_pin_enabled') === false) return true

  const stored = String(settings.get('player_pin_hash') ?? hashSecret('glen'))
  return safeCompare(hashSecret(pin.trim().toLowerCase()), stored)
}

export async function verifyAdminPassword(password: string) {
  const envPassword = process.env.ADMIN_PASSWORD
  if (envPassword) return safeCompare(hashSecret(password), hashSecret(envPassword))

  const supabase = createServiceSupabaseClient()
  if (!supabase) return password === 'GlenAdmin'
  const db = supabase as any

  const { data } = await db.from('app_settings').select('value').is('season_id', null).eq('key', 'admin_password_hash').single()
  const stored = String(data?.value ?? hashSecret('GlenAdmin'))
  return safeCompare(hashSecret(password), stored)
}

export async function createAdminSession(adminName = 'Admin') {
  const cookieStore = await cookies()
  cookieStore.set(adminCookieName, adminName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(adminCookieName)
}

export async function getAdminName() {
  const cookieStore = await cookies()
  return cookieStore.get(adminCookieName)?.value ?? ''
}
