const RECORD_ID = 'haddon-glen-2026'
const LEAGUE_KEYS = ['cornhole', 'bocce']

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

function parseStoredData(raw) {
  try {
    const data = raw ? JSON.parse(raw) : {}
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

function mergeSportsData(existing, incoming) {
  const merged = { ...existing, ...incoming }

  LEAGUE_KEYS.forEach((key) => {
    const existingLeague = existing?.[key]
    const incomingLeague = incoming?.[key]
    if (!isPlainObject(existingLeague) && !isPlainObject(incomingLeague)) return
    merged[key] = mergeLeagueData(existingLeague || {}, incomingLeague || {})
  })

  return repairSportsData(merged)
}

function repairSportsData(data) {
  const repaired = { ...data }

  LEAGUE_KEYS.forEach((key) => {
    const league = repaired[key]
    if (!isPlainObject(league)) return
    repaired[key] = repairLeagueData(league)
  })

  return repaired
}

function mergeLeagueData(existing, incoming) {
  const audit = mergeAudit(existing.audit, incoming.audit)
  const matches = mergeMatches(existing.matches, incoming.matches)
  return repairLeagueData({ ...existing, ...incoming, audit, matches })
}

function repairLeagueData(league) {
  const audit = Array.isArray(league.audit) ? league.audit : []
  const matches = Array.isArray(league.matches)
    ? restoreScoredMatchesFromAudit(league.matches, audit)
    : league.matches
  return { ...league, audit, matches }
}

function mergeAudit(existingAudit, incomingAudit) {
  const itemsByKey = new Map()

  ;[...(Array.isArray(existingAudit) ? existingAudit : []), ...(Array.isArray(incomingAudit) ? incomingAudit : [])]
    .filter(Boolean)
    .forEach((item) => {
      itemsByKey.set(auditKey(item), item)
    })

  return [...itemsByKey.values()].sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')))
}

function auditKey(item) {
  if (item?.id) return `id:${item.id}`
  const details = item?.details || {}
  return [
    'event',
    item?.at || '',
    item?.action || '',
    details.matchId || '',
    details.savedBy || '',
    details.submittedBy || '',
    details.game || '',
  ].join(':')
}

function mergeMatches(existingMatches, incomingMatches) {
  if (!Array.isArray(incomingMatches)) return Array.isArray(existingMatches) ? existingMatches : []
  const existingById = new Map((Array.isArray(existingMatches) ? existingMatches : []).map((match) => [match.id, match]))

  return incomingMatches.map((match) => {
    const existing = existingById.get(match?.id)
    return existing ? { ...existing, ...match } : match
  })
}

function restoreScoredMatchesFromAudit(matches, audit) {
  const scoreEvents = buildScoreEventsByMatch(audit)
  if (scoreEvents.size === 0) return matches

  return matches.map((match) => {
    const event = scoreEvents.get(match.id)
    if (!event) return match

    if (event.status === 'rejected' || event.status === 'reset') {
      return clearDraftFields(clearScoreFields({ ...match, status: 'scheduled' }))
    }

    if (!event.score) return match

    if (event.status === 'final') {
      return clearDraftFields({
        ...match,
        status: 'final',
        score: event.score,
        submittedBy: match.submittedBy || event.submittedBy,
        submittedAt: match.submittedAt || event.submittedAt,
        approvedAt: match.approvedAt || event.approvedAt,
      })
    }

    if (event.status === 'pending' && match.status !== 'final') {
      return {
        ...match,
        status: 'pending',
        score: event.score,
        submittedBy: match.submittedBy || event.submittedBy,
        submittedAt: match.submittedAt || event.submittedAt,
      }
    }

    return match
  })
}

function buildScoreEventsByMatch(audit) {
  const events = new Map()
  const items = [...(Array.isArray(audit) ? audit : [])]
    .filter((item) => item?.details?.matchId)
    .sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')))

  items.forEach((item) => {
    const matchId = item.details.matchId
    const current = events.get(matchId) || {}

    if (item.action === 'score_submitted') {
      const score = normalizeAuditScore(item.details.score)
      if (score) {
        events.set(matchId, {
          status: 'final',
          score,
          submittedBy: item.details.submittedBy,
          submittedAt: item.at,
          approvedAt: item.details.approvedAt || item.at,
        })
      }
      return
    }

    if (item.action === 'score_approved') {
      const score = normalizeAuditScore(item.details.score) || current.score
      if (score) events.set(matchId, { ...current, status: 'final', score, approvedAt: item.at })
      return
    }

    if (item.action === 'score_corrected') {
      const score = normalizeAuditScore(item.details.score)
      if (score) events.set(matchId, {
        ...current,
        status: item.details.status === 'pending' ? 'final' : item.details.status || current.status || 'final',
        score,
      })
      return
    }

    if (item.action === 'score_rejected') {
      events.set(matchId, { status: 'rejected' })
      return
    }

    if (item.action === 'score_reset') {
      events.set(matchId, { status: 'reset' })
    }
  })

  return events
}

function normalizeAuditScore(score) {
  if (!Array.isArray(score)) return null
  const normalized = score.map((game) => {
    if (!Array.isArray(game) || game.length < 2) return null
    const a = Number(game[0])
    const b = Number(game[1])
    return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null
  })
  return normalized.length > 0 && normalized.every(Boolean) ? normalized : null
}

function clearScoreFields(match) {
  const next = { ...match }
  delete next.score
  delete next.submittedBy
  delete next.submittedAt
  delete next.approvedAt
  return next
}

function clearDraftFields(match) {
  const next = { ...match }
  delete next.draftScore
  delete next.draftGameSavedAt
  delete next.draftUpdatedAt
  delete next.draftSavedBy
  return next
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is missing.' }, { status: 500 })

  await ensureRecord(env.DB)
  const row = await env.DB
    .prepare('SELECT data, updated_at FROM league_state WHERE id = ?')
    .bind(RECORD_ID)
    .first()

  return json({
    data: repairSportsData(parseStoredData(row?.data)),
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

  await ensureRecord(env.DB)
  const row = await env.DB
    .prepare('SELECT data FROM league_state WHERE id = ?')
    .bind(RECORD_ID)
    .first()
  const data = mergeSportsData(parseStoredData(row?.data), body.data)
  const now = new Date().toISOString()
  await env.DB
    .prepare(`
      INSERT INTO league_state (id, data, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updated_at = excluded.updated_at
    `)
    .bind(RECORD_ID, JSON.stringify(data), now)
    .run()

  return json({ ok: true, updatedAt: now })
}
