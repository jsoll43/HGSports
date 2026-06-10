'use client'

import { useState } from 'react'
import { PinGate } from '@/components/PinGate'
import { useLeague } from '@/components/LeagueProvider'
import { matchTitle, playerById, playerName, scoreTotals } from '@/lib/league'
import { AdvancedSettingsPanel, AuditLogPanel, BasicAdminList, ImportPanel, SeasonsPanel, SnapshotsPanel, TrophyAdminPanel } from './AdminPanels'

const tabs = ['Scores', 'Teams', 'Schedule', 'Import', 'Settings', 'Seasons', 'Audit Log', 'Snapshots', 'Trophy']

export default function AdminPage() {
  const { submissions, matches, teams, players, leagueId, seasonId, source, approveSubmission, rejectSubmission } = useLeague()
  const [activeTab, setActiveTab] = useState('Scores')
  const [pinEnabled, setPinEnabled] = useState(true)
  const [newPin, setNewPin] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const pending = submissions.filter((submission) => submission.status === 'Pending')

  async function editSubmission(submissionId: string) {
    if (source !== 'supabase') {
      window.alert('Score editing is available when Supabase is configured.')
      return
    }
    const raw = window.prompt('Enter scores as Game 1, Game 2. Example: 21-18,14-21')
    if (!raw) return
    const [game1Raw, game2Raw] = raw.split(',')
    const [g1a, g1b] = (game1Raw ?? '').split('-').map(Number)
    const [g2a, g2b] = (game2Raw ?? '').split('-').map(Number)
    const response = await fetch(`/api/admin/submissions/${submissionId}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: { game1: { teamA: g1a, teamB: g1b }, game2: { teamA: g2a, teamB: g2b } } }),
    })
    if (!response.ok) window.alert(await response.text())
    window.location.reload()
  }

  return (
    <main className="grid gap-4">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-cyan-700">League admin</p>
        <h1 className="text-3xl font-black text-navy">Admin</h1>
      </div>

      <PinGate label="Enter admin password" password="GlenAdmin">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-black ${activeTab === tab ? 'bg-navy text-white' : 'bg-white text-navy'}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
          {source === 'supabase' ? (
            <button
              className="min-h-11 shrink-0 rounded-full bg-white px-4 text-sm font-black text-rose-700"
              onClick={() => void fetch('/api/admin/logout', { method: 'POST' }).then(() => window.location.reload())}
              type="button"
            >
              Log Out
            </button>
          ) : null}
        </div>

        {activeTab === 'Scores' ? (
          <section className="grid gap-3">
            {pending.length === 0 ? (
              <div className="rounded-lg border border-cyan-100 bg-white p-5 text-center font-bold text-slate-600 shadow-sm">No pending scores. Nice and quiet.</div>
            ) : null}
            {pending.map((submission) => {
              const match = matches.find((item) => item.id === submission.matchId)
              const player = playerById(submission.submittedByPlayerId, players)
              const totals = scoreTotals(submission.score)
              return (
                <article key={submission.id} className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-black text-cyan-700">Week {match?.week}</p>
                    <h2 className="text-xl font-black text-navy">{match ? matchTitle(match, teams) : 'Unknown match'}</h2>
                    <p className="font-semibold text-slate-600">Submitted by {player ? playerName(player) : 'Unknown'} - {new Date(submission.submittedAt).toLocaleString()}</p>
                  </div>
                  <div className="grid gap-2 rounded-lg bg-deck p-3 font-bold text-navy">
                    <p>Game 1: {submission.score.game1.teamA}-{submission.score.game1.teamB}</p>
                    <p>Game 2: {submission.score.game2.teamA}-{submission.score.game2.teamB}</p>
                    <p>Total: Team A {totals.teamA}, Team B {totals.teamB}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="min-h-12 rounded-lg bg-emerald-600 px-3 font-black text-white" type="button" onClick={() => void approveSubmission(submission.id)}>Approve</button>
                    <button className="min-h-12 rounded-lg bg-aqua px-3 font-black text-navy" type="button" onClick={() => void editSubmission(submission.id)}>Edit</button>
                    <button className="min-h-12 rounded-lg bg-rose-600 px-3 font-black text-white" type="button" onClick={() => void rejectSubmission(submission.id)}>Reject</button>
                  </div>
                </article>
              )
            })}
          </section>
        ) : activeTab === 'Settings' ? (
          <section className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Settings</h2>
            <label className="flex items-center gap-3 font-bold text-navy">
              <input checked={pinEnabled} onChange={(event) => setPinEnabled(event.target.checked)} type="checkbox" />
              Require league PIN for score and reschedule actions
            </label>
            <label className="grid gap-2 text-sm font-bold text-navy">
              New Player PIN
              <input className="min-h-12 rounded-lg border border-cyan-200 px-3" placeholder="Leave blank to keep current PIN" type="password" value={newPin} onChange={(event) => setNewPin(event.target.value)} />
            </label>
            <button
              className="min-h-12 rounded-lg bg-navy px-4 font-black text-white"
              onClick={async () => {
                const response = await fetch('/api/admin/settings/player-pin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ seasonId, enabled: pinEnabled, pin: newPin }),
                })
                setSettingsMessage(response.ok ? 'Settings saved.' : await response.text())
                if (response.ok) setNewPin('')
              }}
              type="button"
            >
              Save PIN Settings
            </button>
            <AdvancedSettingsPanel seasonId={seasonId} />
            {settingsMessage ? <p className="font-bold text-cyan-700">{settingsMessage}</p> : null}
          </section>
        ) : activeTab === 'Import' ? (
          <ImportPanel />
        ) : activeTab === 'Seasons' ? (
          <SeasonsPanel />
        ) : activeTab === 'Snapshots' ? (
          <SnapshotsPanel />
        ) : activeTab === 'Audit Log' ? (
          <AuditLogPanel />
        ) : activeTab === 'Trophy' ? (
          <TrophyAdminPanel leagueId={leagueId} />
        ) : activeTab === 'Teams' ? (
          <BasicAdminList title="Teams" items={teams} />
        ) : activeTab === 'Schedule' ? (
          <BasicAdminList title="Schedule" items={matches} />
        ) : null}
      </PinGate>
    </main>
  )
}
