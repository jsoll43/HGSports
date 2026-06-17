const RECORD_ID = 'haddon-glen-2026'

function json(body, init = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init.headers || {}),
    },
  })
}

async function ensureRecord(db) {
  const now = new Date().toISOString()
  await db
    .prepare('INSERT OR IGNORE INTO league_state (id, data, updated_at) VALUES (?, ?, ?)')
    .bind(RECORD_ID, '{}', now)
    .run()
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is missing.' }, { status: 500 })

  await ensureRecord(env.DB)
  const row = await env.DB
    .prepare('SELECT data, updated_at FROM league_state WHERE id = ?')
    .bind(RECORD_ID)
    .first()

  return json({
    data: row?.data ? JSON.parse(row.data) : {},
    updatedAt: row?.updated_at || '',
  })
}

export async function onRequestPut({ env, request }) {
  if (!env.DB) return json({ error: 'D1 binding DB is missing.' }, { status: 500 })

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!body || typeof body.data !== 'object' || Array.isArray(body.data)) {
    return json({ error: 'Expected a data object.' }, { status: 400 })
  }

  const now = new Date().toISOString()
  await env.DB
    .prepare(`
      INSERT INTO league_state (id, data, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updated_at = excluded.updated_at
    `)
    .bind(RECORD_ID, JSON.stringify(body.data), now)
    .run()

  return json({ ok: true, updatedAt: now })
}
