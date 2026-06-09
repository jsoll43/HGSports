import type { RescheduleLog, ScoreSubmission } from './types'

const selectedPlayerKey = 'hg-sports-selected-player'
const submissionsKey = 'hg-sports-score-submissions'
const reschedulesKey = 'hg-sports-reschedules'

export function readSelectedPlayerId() {
  return window.localStorage.getItem(selectedPlayerKey) ?? ''
}

export function saveSelectedPlayerId(playerId: string) {
  window.localStorage.setItem(selectedPlayerKey, playerId)
}

export function clearSelectedPlayerId() {
  window.localStorage.removeItem(selectedPlayerKey)
}

export function readSubmissions() {
  return readJson<ScoreSubmission[]>(submissionsKey, [])
}

export function saveSubmissions(submissions: ScoreSubmission[]) {
  window.localStorage.setItem(submissionsKey, JSON.stringify(submissions))
}

export function readReschedules() {
  return readJson<RescheduleLog[]>(reschedulesKey, [])
}

export function saveReschedules(reschedules: RescheduleLog[]) {
  window.localStorage.setItem(reschedulesKey, JSON.stringify(reschedules))
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
