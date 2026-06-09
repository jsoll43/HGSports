'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearSelectedPlayerId,
  readReschedules,
  readSelectedPlayerId,
  readSubmissions,
  saveReschedules,
  saveSelectedPlayerId,
  saveSubmissions,
} from '@/lib/storage'
import { effectiveMatches } from '@/lib/league'
import type { Match, RescheduleLog, ScoreSubmission } from '@/lib/types'

type LeagueContextValue = {
  selectedPlayerId: string
  setSelectedPlayerId: (playerId: string) => void
  changePlayer: () => void
  submissions: ScoreSubmission[]
  reschedules: RescheduleLog[]
  matches: Match[]
  addSubmission: (submission: ScoreSubmission) => void
  approveSubmission: (submissionId: string) => void
  rejectSubmission: (submissionId: string) => void
  addReschedule: (log: RescheduleLog) => void
}

const LeagueContext = createContext<LeagueContextValue | null>(null)

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [selectedPlayerId, setSelectedPlayerIdState] = useState('')
  const [submissions, setSubmissions] = useState<ScoreSubmission[]>([])
  const [reschedules, setReschedules] = useState<RescheduleLog[]>([])

  useEffect(() => {
    setSelectedPlayerIdState(readSelectedPlayerId())
    setSubmissions(readSubmissions())
    setReschedules(readReschedules())
  }, [])

  const matches = useMemo(() => {
    const rescheduledMatchIds = new Set(reschedules.map((log) => log.matchId))
    return effectiveMatches(submissions).map((match) =>
      rescheduledMatchIds.has(match.id) && match.status !== 'Final'
        ? { ...match, status: 'Rescheduled / Makeup Needed' as const }
        : match,
    )
  }, [submissions, reschedules])

  function setSelectedPlayerId(playerId: string) {
    setSelectedPlayerIdState(playerId)
    saveSelectedPlayerId(playerId)
  }

  function changePlayer() {
    setSelectedPlayerIdState('')
    clearSelectedPlayerId()
  }

  function updateSubmissions(next: ScoreSubmission[]) {
    setSubmissions(next)
    saveSubmissions(next)
  }

  function addSubmission(submission: ScoreSubmission) {
    updateSubmissions([submission, ...submissions])
  }

  function approveSubmission(submissionId: string) {
    updateSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId ? { ...submission, status: 'Approved' } : submission,
      ),
    )
  }

  function rejectSubmission(submissionId: string) {
    updateSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId ? { ...submission, status: 'Rejected' } : submission,
      ),
    )
  }

  function addReschedule(log: RescheduleLog) {
    const next = [log, ...reschedules]
    setReschedules(next)
    saveReschedules(next)
  }

  return (
    <LeagueContext.Provider
      value={{
        selectedPlayerId,
        setSelectedPlayerId,
        changePlayer,
        submissions,
        reschedules,
        matches,
        addSubmission,
        approveSubmission,
        rejectSubmission,
        addReschedule,
      }}
    >
      {children}
    </LeagueContext.Provider>
  )
}

export function useLeague() {
  const context = useContext(LeagueContext)
  if (!context) throw new Error('useLeague must be used inside LeagueProvider')
  return context
}
