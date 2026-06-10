'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { csvTemplate, scheduleTemplateColumns, teamTemplateColumns, validateImport, type ImportPreview, type ScheduleImportRow, type TeamImportRow } from '@/lib/import-validation'
import type { LeagueData } from '@/lib/types'

export function ImportPanel() {
  const [teams, setTeams] = useState<TeamImportRow[]>([])
  const [schedule, setSchedule] = useState<ScheduleImportRow[]>([])
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [message, setMessage] = useState('')

  async function readFile(file: File, kind: 'teams' | 'schedule') {
    const rows = file.name.endsWith('.xlsx') ? await readXlsx(file) : readCsv(await file.text())
    if (kind === 'teams') setTeams(rows as TeamImportRow[])
    else setSchedule(rows as ScheduleImportRow[])
    setMessage(`${file.name} loaded. Preview before saving.`)
  }

  function previewImport() {
    setPreview(validateImport(teams, schedule))
  }

  async function confirmImport() {
    if (!preview || preview.errors.length) return
    const response = await fetch('/api/admin/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teams, schedule }),
    })
    setMessage(response.ok ? 'Import saved. Refreshing league data on next load.' : await response.text())
  }

  return (
    <section className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">Import League Data</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <DownloadButton filename="hg-team-template.csv" content={csvTemplate(teamTemplateColumns)}>Download Team Template</DownloadButton>
        <DownloadButton filename="hg-schedule-template.csv" content={csvTemplate(scheduleTemplateColumns)}>Download Schedule Template</DownloadButton>
      </div>
      <label className="grid gap-2 font-bold text-navy">
        Upload Team CSV or XLSX
        <input accept=".csv,.xlsx" className="rounded-lg border border-cyan-200 p-3" type="file" onChange={(event) => event.target.files?.[0] && void readFile(event.target.files[0], 'teams')} />
      </label>
      <label className="grid gap-2 font-bold text-navy">
        Upload Schedule CSV or XLSX
        <input accept=".csv,.xlsx" className="rounded-lg border border-cyan-200 p-3" type="file" onChange={(event) => event.target.files?.[0] && void readFile(event.target.files[0], 'schedule')} />
      </label>
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="button" onClick={previewImport}>Preview Import</button>
      {preview ? <PreviewCard preview={preview} /> : null}
      <button className="min-h-12 rounded-lg bg-emerald-600 px-4 font-black text-white disabled:opacity-50" type="button" disabled={!preview || preview.errors.length > 0} onClick={() => void confirmImport()}>
        Confirm Import
      </button>
      {message ? <p className="font-bold text-cyan-700">{message}</p> : null}
    </section>
  )
}

export function AdvancedSettingsPanel({ seasonId }: { seasonId: string }) {
  const [adminPassword, setAdminPassword] = useState('')
  const [snapshotEnabled, setSnapshotEnabled] = useState(false)
  const [snapshotTime, setSnapshotTime] = useState('02:00')
  const [newSeasonName, setNewSeasonName] = useState('')
  const [newSeasonYear, setNewSeasonYear] = useState(String(new Date().getFullYear()))
  const [message, setMessage] = useState('')

  async function save() {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seasonId, adminPassword, snapshotEnabled, snapshotTime, newSeasonName, newSeasonYear }),
    })
    setMessage(response.ok ? 'Settings saved.' : await response.text())
    if (response.ok) setAdminPassword('')
  }

  return (
    <div className="grid gap-4 border-t border-cyan-100 pt-4">
      <label className="grid gap-2 text-sm font-bold text-navy">
        New Admin Password
        <input className="min-h-12 rounded-lg border border-cyan-200 px-3" type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} />
      </label>
      <label className="flex items-center gap-3 font-bold text-navy">
        <input checked={snapshotEnabled} onChange={(event) => setSnapshotEnabled(event.target.checked)} type="checkbox" />
        Enable daily snapshots
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Snapshot Time
        <input className="min-h-12 rounded-lg border border-cyan-200 px-3" type="time" value={snapshotTime} onChange={(event) => setSnapshotTime(event.target.value)} />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-navy">
          New Season Name
          <input className="min-h-12 rounded-lg border border-cyan-200 px-3" value={newSeasonName} onChange={(event) => setNewSeasonName(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          New Season Year
          <input className="min-h-12 rounded-lg border border-cyan-200 px-3" value={newSeasonYear} onChange={(event) => setNewSeasonYear(event.target.value)} />
        </label>
      </div>
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="button" onClick={() => void save()}>Save Advanced Settings</button>
      {message ? <p className="font-bold text-cyan-700">{message}</p> : null}
    </div>
  )
}

export function SeasonsPanel() {
  const [message, setMessage] = useState('')
  async function archive() {
    if (!window.confirm('Archive the active season? This preserves its data and starts no replacement by itself.')) return
    const response = await fetch('/api/admin/archive-season', { method: 'POST' })
    setMessage(response.ok ? 'Season archived.' : await response.text())
  }
  return (
    <section className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">Seasons</h2>
      <p className="font-semibold text-slate-600">Archive the current season after final scores are approved. Create a new season from Settings or by importing league data.</p>
      <button className="min-h-12 rounded-lg bg-rose-600 px-4 font-black text-white" type="button" onClick={() => void archive()}>Archive Current Season</button>
      {message ? <p className="font-bold text-cyan-700">{message}</p> : null}
    </section>
  )
}

export function SnapshotsPanel() {
  const [snapshots, setSnapshots] = useState<Record<string, any>[]>([])
  const [message, setMessage] = useState('')
  async function load() {
    const response = await fetch('/api/admin/snapshots')
    setSnapshots(response.ok ? await response.json() : [])
  }
  async function create() {
    const response = await fetch('/api/admin/snapshots', { method: 'POST' })
    setMessage(response.ok ? 'Snapshot created.' : await response.text())
    await load()
  }
  return (
    <section className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">Snapshots</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" onClick={() => void create()} type="button">Create Snapshot Now</button>
        <button className="min-h-12 rounded-lg bg-aqua px-4 font-black text-navy" onClick={() => void load()} type="button">Load Snapshots</button>
      </div>
      {message ? <p className="font-bold text-cyan-700">{message}</p> : null}
      {snapshots.length === 0 ? <p className="rounded-lg bg-deck p-4 font-semibold text-slate-600">No snapshots loaded yet.</p> : null}
      {snapshots.map((snapshot) => {
        const json = snapshot.snapshot_json ?? {}
        const stats = json.stats ?? {}
        return (
          <article key={snapshot.id} className="grid gap-2 rounded-lg bg-deck p-4">
            <h3 className="font-black text-navy">{snapshot.snapshot_date}</h3>
            <p className="font-semibold text-slate-700">Teams {stats.teams ?? 0} · Matches {stats.matches ?? 0} · Approved {stats.approvedScores ?? 0} · Pending {stats.pendingScores ?? 0} · Rescheduled {stats.rescheduledMatches ?? 0} · Overdue {stats.overdueMatches ?? 0}</p>
            <DownloadButton filename={`snapshot-${snapshot.snapshot_date}.json`} content={JSON.stringify(json, null, 2)}>Download JSON</DownloadButton>
          </article>
        )
      })}
    </section>
  )
}

export function AuditLogPanel() {
  const [action, setAction] = useState('')
  const [rows, setRows] = useState<Record<string, any>[]>([])
  async function load(nextAction = action) {
    const response = await fetch(`/api/admin/audit-log${nextAction ? `?action=${nextAction}` : ''}`)
    setRows(response.ok ? await response.json() : [])
  }
  return (
    <section className="grid gap-4 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">Audit Log</h2>
      <select className="min-h-12 rounded-lg border border-cyan-200 px-3" value={action} onChange={(event) => { setAction(event.target.value); void load(event.target.value) }}>
        <option value="">All actions</option>
        {['score_submitted', 'score_approved', 'score_submission_edited', 'score_rejected', 'match_rescheduled', 'settings_change', 'import', 'archive_season'].map((item) => <option key={item}>{item}</option>)}
      </select>
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" onClick={() => void load()} type="button">Load Audit Log</button>
      {rows.length === 0 ? <p className="rounded-lg bg-deck p-4 font-semibold text-slate-600">No audit entries loaded yet.</p> : null}
      {rows.map((row) => (
        <details key={row.id} className="rounded-lg bg-deck p-4">
          <summary className="cursor-pointer font-black text-navy">{new Date(row.created_at).toLocaleString()} · {row.actor_admin_name || row.actor_type} · {row.action}</summary>
          <p className="mt-2 font-semibold text-slate-700">{row.entity_type} {row.entity_id}</p>
          <pre className="mt-2 overflow-auto rounded bg-white p-3 text-xs">{JSON.stringify({ before: row.before_json, after: row.after_json }, null, 2)}</pre>
        </details>
      ))}
    </section>
  )
}

export function TrophyAdminPanel({ leagueId }: { leagueId: string }) {
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ seasonName: '', year: '', flightName: '', championTeamName: '', championPlayerNames: '', notes: '' })
  async function save() {
    const response = await fetch('/api/admin/trophy-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId, ...form }),
    })
    setMessage(response.ok ? 'Trophy entry saved.' : await response.text())
  }
  return (
    <section className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">Trophy Room</h2>
      {Object.keys(form).map((key) => (
        <label key={key} className="grid gap-2 text-sm font-bold text-navy">
          {key.replace(/([A-Z])/g, ' $1')}
          <input className="min-h-12 rounded-lg border border-cyan-200 px-3" value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
        </label>
      ))}
      <button className="min-h-12 rounded-lg bg-navy px-4 font-black text-white" type="button" onClick={() => void save()}>Save Trophy Entry</button>
      {message ? <p className="font-bold text-cyan-700">{message}</p> : null}
    </section>
  )
}

export function BasicAdminList({ title, items }: { title: string; items: LeagueData['teams'] | LeagueData['matches'] }) {
  return (
    <section className="grid gap-3 rounded-lg border border-cyan-100 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      {items.length === 0 ? <p className="font-semibold text-slate-600">Nothing here yet.</p> : null}
      {items.slice(0, 30).map((item: any) => <div key={item.id} className="rounded-lg bg-deck p-3 font-bold text-navy">{item.name || `Week ${item.week}`}</div>)}
    </section>
  )
}

function PreviewCard({ preview }: { preview: ImportPreview }) {
  return (
    <div className="grid gap-3 rounded-lg bg-deck p-4">
      <p className="font-black text-navy">Preview: {preview.summary.teams} teams, {preview.summary.players} players, {preview.summary.flights} flights, {preview.summary.weeks} weeks, {preview.summary.matches} matches</p>
      {preview.errors.length ? <List title="Errors" items={preview.errors} tone="text-rose-700" /> : null}
      {preview.warnings.length ? <List title="Warnings" items={preview.warnings} tone="text-amber-700" /> : null}
      {!preview.errors.length && !preview.warnings.length ? <p className="font-bold text-emerald-700">Looks ready to import.</p> : null}
    </div>
  )
}

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return <div><h3 className={`font-black ${tone}`}>{title}</h3><ul className="mt-1 grid gap-1">{items.map((item) => <li key={item} className="text-sm font-semibold text-slate-700">{item}</li>)}</ul></div>
}

function DownloadButton({ filename, content, children }: { filename: string; content: string; children: React.ReactNode }) {
  return <a className="min-h-12 rounded-lg bg-aqua px-4 py-3 text-center font-black text-navy" download={filename} href={`data:text/plain;charset=utf-8,${encodeURIComponent(content)}`}>{children}</a>
}

function readCsv(text: string) {
  const [headerLine = '', ...lines] = text.trim().split(/\r?\n/)
  const headers = headerLine.split(',').map((item) => item.trim())
  return lines.filter(Boolean).map((line) => {
    const values = line.split(',').map((item) => item.trim())
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

async function readXlsx(file: File) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' })
}
