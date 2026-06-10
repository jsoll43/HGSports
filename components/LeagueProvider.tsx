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
import { getMockLeagueData } from '@/lib/mock-data'
import type { FlightRecord, LeagueData, Match, RescheduleLog, ScoreSubmission } from '@/lib/types'

type LeagueContextValue = {
  source: LeagueData['source']
  seasonId: string
  leagueId: string
  activeSeason: string
  flights: FlightRecord[]
  teams: LeagueData['teams']
  players: LeagueData['players']
  champions: LeagueData['champions']
  selectedPlayerId: string
  setSelectedPlayerId: (playerId: string) => void
  changePlayer: () => void
  submissions: ScoreSubmission[]
  reschedules: RescheduleLog[]
  matches: Match[]
  addSubmission: (submission: ScoreSubmission) => Promise<void>
  approveSubmission: (submissionId: string) => Promise<void>
  rejectSubmission: (submissionId: string) => Promise<void>
  addReschedule: (log: RescheduleLog) => Promise<void>
}

const LeagueContext = createContext<LeagueContextValue | null>(null)

export function LeagueProvider({
  children,
  initialData = getMockLeagueData(),
  initialSubmissions = [],
}: {
  children: React.ReactNode
  initialData?: LeagueData
  initialSubmissions?: ScoreSubmission[]
}) {
  const [leagueData, setLeagueData] = useState(initialData)
  const [selectedPlayerId, setSelectedPlayerIdState] = useState('')
  const [submissions, setSubmissions] = useState<ScoreSubmission[]>(initialSubmissions)
  const [reschedules, setReschedules] = useState<RescheduleLog[]>([])

  useEffect(() => {
    setSelectedPlayerIdState(readSelectedPlayerId())
    if (initialData.source === 'mock') setSubmissions(readSubmissions())
    setReschedules(readReschedules())
  }, [initialData.source])

  const matches = useMemo(() => {
    const rescheduledMatchIds = new Set(reschedules.map((log) => log.matchId))
    const baseMatches = leagueData.source === 'mock' ? effectiveMatches(submissions) : leagueData.matches
    return baseMatches.map((match) =>
      rescheduledMatchIds.has(match.id) && match.status !== 'Final'
        ? { ...match, status: 'Rescheduled / Makeup Needed' as const }
        : match,
    )
  }, [leagueData, submissions, reschedules])

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

  async function refreshLeagueData() {
    const response = await fetch('/api/league-data')
    if (!response.ok) return
    setLeagueData((await response.json()) as LeagueData)
  }

  async function addSubmission(submission: ScoreSubmission) {
    if (leagueData.source === 'supabase') {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
      if (!response.ok) throw new Error(await response.text())
      setSubmissions([submission, ...submissions])
      await refreshLeagueData()
      return
    }
    updateSubmissions([submission, ...submissions])
  }

  async function approveSubmission(submissionId: string) {
    if (leagueData.source === 'supabase') {
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, { method: 'POST' })
      if (!response.ok) throw new Error(await response.text())
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId))
      await refreshLeagueData()
      return
    }
    updateSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId ? { ...submission, status: 'Approved' } : submission,
      ),
    )
  }

  async function rejectSubmission(submissionId: string) {
    if (leagueData.source === 'supabase') {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, { method: 'POST' })
      if (!response.ok) throw new Error(await response.text())
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId))
      await refreshLeagueData()
      return
    }
    updateSubmissions(
      submissions.map((submission) =>
        submission.id === submissionId ? { ...submission, status: 'Rejected' } : submission,
      ),
    )
  }

  async function addReschedule(log: RescheduleLog) {
    if (leagueData.source === 'supabase') {
      const response = await fetch('/api/reschedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      })
      if (!response.ok) throw new Error(await response.text())
      await refreshLeagueData()
      return
    }
    const next = [log, ...reschedules]
    setReschedules(next)
    saveReschedules(next)
  }

  return (
    <LeagueContext.Provider
      value={{
        source: leagueData.source,
        seasonId: leagueData.seasonId,
        leagueId: leagueData.leagueId,
        activeSeason: leagueData.activeSeason,
        flights: leagueData.flights,
        teams: leagueData.teams,
        players: leagueData.players,
        champions: leagueData.champions,
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
