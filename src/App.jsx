import { useEffect, useMemo, useState } from 'react'

const PIN = 'glen'
const ADMIN_PASSWORD = 'glenadmin'

const flights = ['Green', 'Red', 'White']

const teams = [
  { id: 'green-1', flight: 'Green', number: 1, name: 'Soll / Tronco' },
  { id: 'green-2', flight: 'Green', number: 2, name: 'Gatti / Hourani' },
  { id: 'red-1', flight: 'Red', number: 3, name: 'Kemner / Polizzi' },
  { id: 'red-2', flight: 'Red', number: 4, name: 'Mueller / Walter' },
  { id: 'white-1', flight: 'White', number: 5, name: 'Hourani / Hourani' },
  { id: 'white-2', flight: 'White', number: 6, name: 'Deck Duo' },
]

const players = [
  { id: 'jon-soll', first: 'Jonathan', last: 'Soll', phone: '856-555-0101', teamId: 'green-1' },
  { id: 'matt-tronco', first: 'Matt', last: 'Tronco', phone: '856-555-0102', teamId: 'green-1' },
  { id: 'mike-gatti', first: 'Mike', last: 'Gatti', phone: '856-555-0103', teamId: 'green-2' },
  { id: 'john-hourani-g', first: 'John', last: 'Hourani', phone: '856-555-0104', teamId: 'green-2' },
  { id: 'brian-kemner', first: 'Brian', last: 'Kemner', phone: '856-555-0105', teamId: 'red-1' },
  { id: 'tom-polizzi', first: 'Tom', last: 'Polizzi', phone: '856-555-0106', teamId: 'red-1' },
  { id: 'cory-mueller', first: 'Cory', last: 'Mueller', phone: '856-555-0107', teamId: 'red-2' },
  { id: 'chris-walter', first: 'Chris', last: 'Walter', phone: '856-555-0108', teamId: 'red-2' },
  { id: 'john-hourani-w', first: 'John', last: 'Hourani', phone: '856-555-0109', teamId: 'white-1' },
  { id: 'wendy-hourani', first: 'Wendy', last: 'Hourani', phone: '856-555-0110', teamId: 'white-1' },
  { id: 'casey-deck', first: 'Casey', last: 'Deck', phone: '856-555-0111', teamId: 'white-2' },
  { id: 'taylor-deck', first: 'Taylor', last: 'Deck', phone: '856-555-0112', teamId: 'white-2' },
]

const initialMatches = [
  { id: 'm1', week: 1, date: '2026-05-07', time: '6:30 PM', flight: 'Green', teamA: 'green-1', teamB: 'green-2', status: 'final', score: [[21, 18], [14, 21]], submittedBy: 'jon-soll', approvedAt: '2026-05-08T10:00:00' },
  { id: 'm2', week: 1, date: '2026-05-07', time: '7:15 PM', flight: 'Red', teamA: 'red-1', teamB: 'red-2', status: 'final', score: [[21, 12], [21, 19]], submittedBy: 'brian-kemner', approvedAt: '2026-05-08T10:00:00' },
  { id: 'm3', week: 1, date: '2026-05-07', time: '8:00 PM', flight: 'White', teamA: 'white-1', teamB: 'white-2', status: 'final', score: [[17, 21], [21, 14]], submittedBy: 'wendy-hourani', approvedAt: '2026-05-08T10:00:00' },
  { id: 'm4', week: 2, date: '2026-05-14', time: '6:30 PM', flight: 'Green', teamA: 'green-2', teamB: 'green-1', status: 'pending', score: [[21, 19], [18, 21]], submittedBy: 'mike-gatti' },
  { id: 'm5', week: 2, date: '2026-05-14', time: '7:15 PM', flight: 'Red', teamA: 'red-2', teamB: 'red-1', status: 'rescheduled', rescheduleNote: 'Makeup date needed' },
  { id: 'm6', week: 2, date: '2026-05-14', time: '8:00 PM', flight: 'White', teamA: 'white-2', teamB: 'white-1', status: 'scheduled' },
  { id: 'm7', week: 3, date: '2026-05-21', time: '6:30 PM', flight: 'Green', teamA: 'green-1', teamB: 'green-2', status: 'final', score: [[21, 10], [21, 20]], submittedBy: 'matt-tronco', approvedAt: '2026-05-22T09:30:00' },
  { id: 'm8', week: 3, date: '2026-05-21', time: '7:15 PM', flight: 'Red', teamA: 'red-1', teamB: 'red-2', status: 'scheduled' },
  { id: 'm9', week: 3, date: '2026-05-21', time: '8:00 PM', flight: 'White', teamA: 'white-1', teamB: 'white-2', status: 'pending', score: [[21, 18], [15, 21]], submittedBy: 'john-hourani-w' },
  { id: 'm10', week: 4, date: '2026-05-28', time: '6:30 PM', flight: 'Green', teamA: 'green-2', teamB: 'green-1', status: 'scheduled' },
  { id: 'm11', week: 4, date: '2026-05-28', time: '7:15 PM', flight: 'Red', teamA: 'red-2', teamB: 'red-1', status: 'final', score: [[21, 15], [12, 21]], submittedBy: 'cory-mueller', approvedAt: '2026-05-29T09:00:00' },
  { id: 'm12', week: 4, date: '2026-05-28', time: '8:00 PM', flight: 'White', teamA: 'white-2', teamB: 'white-1', status: 'scheduled' },
  { id: 'm13', week: 5, date: '2026-06-04', time: '6:30 PM', flight: 'Green', teamA: 'green-1', teamB: 'green-2', status: 'scheduled' },
  { id: 'm14', week: 5, date: '2026-06-04', time: '7:15 PM', flight: 'Red', teamA: 'red-1', teamB: 'red-2', status: 'scheduled' },
  { id: 'm15', week: 5, date: '2026-06-04', time: '8:00 PM', flight: 'White', teamA: 'white-1', teamB: 'white-2', status: 'rescheduled', rescheduleNote: 'Vacation conflict' },
  { id: 'm16', week: 6, date: '2026-06-11', time: '6:30 PM', flight: 'Green', teamA: 'green-2', teamB: 'green-1', status: 'scheduled' },
  { id: 'm17', week: 6, date: '2026-06-11', time: '7:15 PM', flight: 'Red', teamA: 'red-2', teamB: 'red-1', status: 'scheduled' },
  { id: 'm18', week: 6, date: '2026-06-11', time: '8:00 PM', flight: 'White', teamA: 'white-2', teamB: 'white-1', status: 'scheduled' },
  { id: 'm19', week: 7, date: '2026-06-18', time: '6:30 PM', flight: 'Green', teamA: 'green-1', teamB: 'green-2', status: 'scheduled' },
  { id: 'm20', week: 7, date: '2026-06-18', time: '7:15 PM', flight: 'Red', teamA: 'red-1', teamB: 'red-2', status: 'scheduled' },
  { id: 'm21', week: 7, date: '2026-06-18', time: '8:00 PM', flight: 'White', teamA: 'white-1', teamB: 'white-2', status: 'scheduled' },
]

const trophyEntries = [
  { year: 2025, flight: 'Green', winners: 'Jonathan Soll and Matt Tronco' },
  { year: 2025, flight: 'Red', winners: 'Brian Kemner and Tom Polizzi' },
  { year: 2025, flight: 'White', winners: 'John Hourani and Wendy Hourani' },
  { year: 2024, flight: 'Green', winners: 'Mike Gatti and John Hourani' },
  { year: 2024, flight: 'Red', winners: 'Cory Mueller and Chris Walter' },
  { year: 2024, flight: 'White', winners: 'Jonathan Soll and Matt Tronco' },
]

function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [page, setPage] = useState('home')
  const [selectedPlayerId, setSelectedPlayerId] = useState(() => localStorage.getItem('hg-player') || '')
  const [matches, setMatches] = useState(() => readStored('hg-matches', initialMatches))
  const [audit, setAudit] = useState(() => readStored('hg-audit', []))
  const [snapshots, setSnapshots] = useState(() => readStored('hg-snapshots', []))
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [submissionConfirmation, setSubmissionConfirmation] = useState(null)

  useEffect(() => localStorage.setItem('hg-player', selectedPlayerId), [selectedPlayerId])
  useEffect(() => localStorage.setItem('hg-matches', JSON.stringify(matches)), [matches])
  useEffect(() => localStorage.setItem('hg-audit', JSON.stringify(audit)), [audit])
  useEffect(() => localStorage.setItem('hg-snapshots', JSON.stringify(snapshots)), [snapshots])

  const selectedPlayer = players.find((player) => player.id === selectedPlayerId)
  const selectedTeam = selectedPlayer ? getTeam(selectedPlayer.teamId) : null
  const standings = useMemo(() => buildStandings(matches), [matches])

  function log(action, details) {
    setAudit((items) => [{ id: crypto.randomUUID(), at: new Date().toISOString(), action, details }, ...items])
  }

  function submitScore(matchId, score, submittedBy) {
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? { ...match, status: 'pending', score, submittedBy, submittedAt: new Date().toISOString() }
          : match,
      ),
    )
    log('score_submitted', { matchId, submittedBy, score })
    setSubmissionConfirmation({ matchId, at: new Date().toISOString() })
    setPage('submitted')
  }

  function markRescheduled(matchId, note, submittedBy) {
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? { ...match, status: 'rescheduled', rescheduleNote: note || 'Makeup needed', rescheduledBy: submittedBy, rescheduledAt: new Date().toISOString() }
          : match,
      ),
    )
    log('match_rescheduled', { matchId, submittedBy, note })
  }

  function approveScore(matchId) {
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'final', approvedAt: new Date().toISOString() } : match,
      ),
    )
    log('score_approved', { matchId })
  }

  function rejectScore(matchId) {
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'scheduled', score: undefined, submittedBy: undefined } : match,
      ),
    )
    log('score_rejected', { matchId })
  }

  function createSnapshot() {
    const snapshot = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      matches,
      standings,
      auditCount: audit.length,
    }
    setSnapshots((items) => [snapshot, ...items])
    log('snapshot_created', { snapshotId: snapshot.id })
  }

  function importSchedule(rows) {
    const importedMatches = rows.map((row, index) => {
      const teamA = teamByNumber(row.teamANumber)
      const teamB = teamByNumber(row.teamBNumber)
      return {
        id: `import-${Date.now()}-${index}`,
        week: row.week,
        date: row.date,
        time: row.time,
        flight: row.flight,
        teamA: teamA.id,
        teamB: teamB.id,
        status: 'scheduled',
        notes: row.notes,
      }
    })
    setMatches(importedMatches)
    log('schedule_imported', { matches: importedMatches.length })
    setPage('schedule')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="club-bar">
          <span></span>
          <button className="admin-link" type="button" onClick={() => setPage('admin')}>Admin</button>
        </div>
        <button className="club-logo" type="button" onClick={() => setPage('home')}>
          <strong>HADDON GLEN</strong>
          <span>SWIM CLUB</span>
        </button>
      </header>

      <main className="content">
        {page === 'home' && <Home standings={standings} setPage={setPage} />}
        {page === 'my' && (
          <MyMatches
            matches={matches}
            selectedPlayer={selectedPlayer}
            selectedTeam={selectedTeam}
            selectedPlayerId={selectedPlayerId}
            setSelectedPlayerId={setSelectedPlayerId}
            standings={standings}
            submitScore={submitScore}
            markRescheduled={markRescheduled}
            setPage={setPage}
          />
        )}
        {page === 'standings' && <Standings standings={standings} />}
        {page === 'schedule' && <Schedule matches={matches} />}
        {page === 'trophy' && <TrophyRoom />}
        {page === 'submitted' && (
          <ScoreSubmitted
            confirmation={submissionConfirmation}
            setPage={setPage}
          />
        )}
        {page === 'admin' && (
          <Admin
            adminUnlocked={adminUnlocked}
            setAdminUnlocked={setAdminUnlocked}
            matches={matches}
            audit={audit}
            snapshots={snapshots}
            approveScore={approveScore}
            rejectScore={rejectScore}
            createSnapshot={createSnapshot}
            importSchedule={importSchedule}
          />
        )}
      </main>

      {page !== 'admin' && (
        <nav className="bottom-nav" aria-label="Main navigation">
          <button type="button" onClick={() => setPage('home')}>Home</button>
          <button type="button" onClick={() => setPage('my')}>My Matches</button>
          <button type="button" onClick={() => setPage('standings')}>Standings</button>
          <button type="button" onClick={() => setPage('schedule')}>Schedule</button>
          <button type="button" onClick={() => setPage('trophy')}>Trophy Room</button>
        </nav>
      )}
    </div>
  )
}

function Home({ standings, setPage }) {
  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Haddon Glen Cornhole League</p>
        <h1>Summer 2026</h1>
        <p>Schedules, standings, score submission, and quick match texting.</p>
      </div>
      <div className="quick-grid">
        <BigButton label="My Matches" onClick={() => setPage('my')} />
        <BigButton label="Standings" onClick={() => setPage('standings')} />
        <BigButton label="Full Schedule" onClick={() => setPage('schedule')} />
        <BigButton label="Trophy Room" onClick={() => setPage('trophy')} />
      </div>
      <Card title="Current Leaders">
        <div className="mini-list">
          {flights.map((flight) => {
            const leader = standings[flight][0]
            return <p key={flight}><strong>{flight} Band</strong><span>{leader?.team.name || 'No scores yet'} · {leader?.points || 0} pts</span></p>
          })}
        </div>
      </Card>
    </section>
  )
}

function MyMatches({ matches, selectedPlayer, selectedTeam, selectedPlayerId, setSelectedPlayerId, standings, submitScore, markRescheduled }) {
  if (!selectedPlayer || !selectedTeam) {
    return (
      <section className="stack">
        <PageTitle eyebrow="No login needed" title="My Matches" />
        <Card title="Select your name">
          <label className="field">
            Player
            <select value={selectedPlayerId} onChange={(event) => setSelectedPlayerId(event.target.value)}>
              <option value="">Choose player</option>
              {[...players].sort((a, b) => a.last.localeCompare(b.last)).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.last}, {player.first}
                </option>
              ))}
            </select>
          </label>
        </Card>
      </section>
    )
  }

  const row = standings[selectedTeam.flight].find((item) => item.team.id === selectedTeam.id)
  const allMyMatches = matches
    .filter((match) => match.teamA === selectedTeam.id || match.teamB === selectedTeam.id)
    .sort(bySchedule)
  const openMatches = allMyMatches
    .filter((match) => match.status !== 'final' || isOverdue(match))
  const playedMatches = allMyMatches
    .filter((match) => match.status === 'final' && !isOverdue(match))
    .reverse()
  const nextMatch = openMatches[0]
  const otherOpenMatches = openMatches.slice(1)

  return (
    <section className="stack">
      <div className="profile-card">
        <p>Continue as {selectedPlayer.first} {selectedPlayer.last}</p>
        <h1>{selectedTeam.name}</h1>
        <span>{selectedTeam.flight} Band</span>
        <button type="button" onClick={() => setSelectedPlayerId('')}>Change player</button>
      </div>
      <div className="stat-grid">
        <Stat label="Record" value={`${row?.matchWins || 0}-${row?.matchLosses || 0}`} />
        <Stat label="Points" value={row?.points || 0} />
        <Stat label="Rank" value={row ? `#${row.rank}` : '-'} />
      </div>
      {nextMatch ? (
        <section className="priority-match">
          <p className="eyebrow">Next match</p>
          <MatchCard
            match={nextMatch}
            viewerTeam={selectedTeam}
            selectedPlayer={selectedPlayer}
            submitScore={submitScore}
            markRescheduled={markRescheduled}
            showContacts
          />
        </section>
      ) : (
        <p className="empty">No upcoming matches need attention right now.</p>
      )}
      {otherOpenMatches.length > 0 && (
        <div className="card-list">
          {otherOpenMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              viewerTeam={selectedTeam}
              selectedPlayer={selectedPlayer}
              submitScore={submitScore}
              markRescheduled={markRescheduled}
              showContacts
            />
          ))}
        </div>
      )}
      <details className="history-panel">
        <summary>Played matches ({playedMatches.length})</summary>
        <div className="card-list">
          {playedMatches.map((match) => (
            <MatchCard key={match.id} match={match} viewerTeam={selectedTeam} />
          ))}
        </div>
      </details>
    </section>
  )
}

function Standings({ standings }) {
  const [flight, setFlight] = useState('Green')
  return (
    <section className="stack">
      <PageTitle eyebrow="Public scoreboard" title="Standings" />
      <Segmented options={flights} value={flight} onChange={setFlight} />
      <section className="standings-grid" aria-label={`${flight} standings`}>
        <div className="standings-header">
          <span>Rank</span>
          <span>Team</span>
          <span>Pts</span>
          <span>Match</span>
          <span>Game</span>
          <span>Diff</span>
        </div>
        {standings[flight].map((row) => (
          <article className="standing-row" key={row.team.id}>
            <strong>{row.rank}</strong>
            <span className="team-name">{row.team.name}</span>
            <span className="points">{row.points}</span>
            <span>{row.matchWins}-{row.matchLosses}</span>
            <span>{row.gameWins}-{row.gameLosses}</span>
            <span>{row.diff}</span>
          </article>
        ))}
      </section>
    </section>
  )
}

function Schedule({ matches }) {
  const [flight, setFlight] = useState('All')
  const [week, setWeek] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))]
  const filtered = matches.filter((match) => (flight === 'All' || match.flight === flight) && (week === 'All' || match.week === Number(week)))

  return (
    <section className="stack">
      <PageTitle eyebrow="Public schedule" title="Full Schedule" />
      <div className="filters">
        <label className="field">Band<select value={flight} onChange={(event) => setFlight(event.target.value)}><option>All</option>{flights.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field">Week<select value={week} onChange={(event) => setWeek(event.target.value)}><option>All</option>{weeks.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="card-list">
        {filtered.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </section>
  )
}

function TrophyRoom() {
  return (
    <section className="stack">
      <PageTitle eyebrow="Past champions" title="Trophy Room" />
      <div className="card-list">
        {trophyEntries.map((entry) => (
          <article className="simple-card" key={`${entry.year}-${entry.flight}`}>
            <p>{entry.year} · {entry.flight} Band</p>
            <h2>{entry.winners}</h2>
          </article>
        ))}
      </div>
    </section>
  )
}

function ScoreSubmitted({ confirmation, setPage }) {
  return (
    <section className="submitted-screen">
      <div className="submitted-card">
        <p className="eyebrow">Pending commissioner approval</p>
        <h1>Score Submitted</h1>
        <p>Your score was saved and sent to the admin queue. Standings will update after approval.</p>
        {confirmation?.at && <span>Submitted {new Date(confirmation.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
        <div className="submitted-actions">
          <button type="button" onClick={() => setPage('my')}>Back to My Matches</button>
          <button type="button" className="secondary" onClick={() => setPage('home')}>Back to Home</button>
        </div>
      </div>
    </section>
  )
}

function Admin({ adminUnlocked, setAdminUnlocked, matches, audit, snapshots, approveScore, rejectScore, createSnapshot, importSchedule }) {
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('Scores')

  if (!adminUnlocked) {
    return (
      <section className="stack">
        <PageTitle eyebrow="Commissioner tools" title="Admin" />
        <Card title="Enter admin password">
          <form className="form" onSubmit={(event) => {
            event.preventDefault()
            if (password.trim().toLowerCase() === ADMIN_PASSWORD) setAdminUnlocked(true)
          }}>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Admin password" />
            <button type="submit">Unlock Admin</button>
          </form>
        </Card>
      </section>
    )
  }

  const pending = matches.filter((match) => match.status === 'pending')

  return (
    <section className="stack">
      <div className="admin-heading">
        <PageTitle eyebrow="Commissioner tools" title="Admin" />
        <button
          className="sign-out-button"
          type="button"
          onClick={() => {
            setAdminUnlocked(false)
            setPassword('')
          }}
        >
          Sign out
        </button>
      </div>
      <Segmented options={['Scores', 'Import', 'Schedule', 'Snapshots', 'Audit']} value={tab} onChange={setTab} />
      {tab === 'Scores' && (
        <Card title="Pending Scores">
          {pending.length === 0 && <p className="empty">No pending scores.</p>}
          <div className="card-list">
            {pending.map((match) => (
              <article className="simple-card" key={match.id}>
                <p>Week {match.week} · {matchTitle(match)}</p>
                <h2>{formatScore(match.score)}</h2>
                <p>Submitted by {playerName(match.submittedBy)}</p>
                <div className="button-row">
                  <button type="button" onClick={() => approveScore(match.id)}>Approve</button>
                  <button type="button" className="secondary" onClick={() => rejectScore(match.id)}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}
      {tab === 'Import' && <ScheduleImport importSchedule={importSchedule} />}
      {tab === 'Schedule' && (
        <Card title="Current Schedule">
          <div className="card-list">
            {matches.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
        </Card>
      )}
      {tab === 'Snapshots' && (
        <Card title="Daily Snapshots">
          <button type="button" onClick={createSnapshot}>Create Snapshot Now</button>
          <div className="card-list">
            {snapshots.map((snapshot) => <article className="simple-card" key={snapshot.id}><p>{new Date(snapshot.at).toLocaleString()}</p><h2>{snapshot.matches.length} matches saved</h2></article>)}
          </div>
        </Card>
      )}
      {tab === 'Audit' && (
        <Card title="Audit Log">
          <div className="card-list">
            {audit.length === 0 && <p className="empty">No audit entries yet.</p>}
            {audit.map((item) => <AuditEntry key={item.id} item={item} matches={matches} />)}
          </div>
        </Card>
      )}
    </section>
  )
}

function AuditEntry({ item, matches }) {
  const match = item.details?.matchId ? matches.find((candidate) => candidate.id === item.details.matchId) : null
  const actor = item.details?.submittedBy ? playerName(item.details.submittedBy) : 'Admin'

  if (item.action === 'score_submitted' && match) {
    const teamA = getTeam(match.teamA)
    const teamB = getTeam(match.teamB)
    const score = item.details.score
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} submitted a score</h2>
        <p>{matchTitle(match)}</p>
        <p>{teamA.name}: {score[0][0]} + {score[1][0]} = {score[0][0] + score[1][0]} points</p>
        <p>{teamB.name}: {score[0][1]} + {score[1][1]} = {score[0][1] + score[1][1]} points</p>
      </article>
    )
  }

  if (item.action === 'match_rescheduled' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} marked a match rescheduled</h2>
        <p>{matchTitle(match)}</p>
        <p>{item.details.note || 'No note provided.'}</p>
      </article>
    )
  }

  if (item.action === 'score_approved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin approved a score</h2>
        <p>{matchTitle(match)}</p>
      </article>
    )
  }

  if (item.action === 'score_rejected' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin rejected a score</h2>
        <p>{matchTitle(match)}</p>
      </article>
    )
  }

  return (
    <article className="simple-card audit-entry">
      <p>{new Date(item.at).toLocaleString()}</p>
      <h2>{item.action.replaceAll('_', ' ')}</h2>
      <p>{JSON.stringify(item.details)}</p>
    </article>
  )
}

function ScheduleImport({ importSchedule }) {
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState([])
  const [warnings, setWarnings] = useState([])
  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState('')

  async function handleFile(file) {
    setFileName(file.name)
    setMessage('')
    const text = await file.text()
    const parsed = parseScheduleCsv(text)
    const validation = validateScheduleRows(parsed)
    setRows(validation.rows)
    setWarnings(validation.warnings)
    setErrors(validation.errors)
  }

  function confirmImport() {
    if (errors.length) return
    importSchedule(rows)
    setMessage(`Imported ${rows.length} matches.`)
  }

  return (
    <Card title="Import League Schedule">
      <p className="empty">Upload a CSV schedule. Importing replaces the current schedule, so use this for a new season or a clean schedule reset.</p>
      <a className="download-link" href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleScheduleCsv())}`} download="hg-sports-schedule-template.csv">
        Download Sample Schedule CSV
      </a>
      <label className="field">
        Upload CSV
        <input accept=".csv,text/csv" type="file" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
      </label>
      {fileName && <p className="helper-text">Previewing {fileName}</p>}
      {rows.length > 0 && (
        <div className="import-summary">
          <Stat label="Matches" value={rows.length} />
          <Stat label="Weeks" value={new Set(rows.map((row) => row.week)).size} />
          <Stat label="Flights" value={new Set(rows.map((row) => row.flight)).size} />
        </div>
      )}
      {errors.length > 0 && <ValidationList title="Errors to fix" items={errors} tone="error" />}
      {warnings.length > 0 && <ValidationList title="Warnings" items={warnings} tone="warning-text" />}
      {rows.length > 0 && (
        <div className="preview-table">
          {rows.slice(0, 8).map((row, index) => (
            <p key={`${row.week}-${row.teamANumber}-${row.teamBNumber}-${index}`}>
              Week {row.week}: {teamByNumber(row.teamANumber)?.name || `Team ${row.teamANumber}`} vs {teamByNumber(row.teamBNumber)?.name || `Team ${row.teamBNumber}`} - {row.date} {row.time}
            </p>
          ))}
          {rows.length > 8 && <p>And {rows.length - 8} more matches...</p>}
        </div>
      )}
      <button type="button" disabled={!rows.length || errors.length > 0} onClick={confirmImport}>
        Confirm Import
      </button>
      {message && <p className="helper-text">{message}</p>}
    </Card>
  )
}

function ValidationList({ title, items, tone }) {
  return (
    <div className={`validation-list ${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

function MatchCard({ match, viewerTeam, selectedPlayer, showContacts = false, submitScore, markRescheduled }) {
  const teamA = getTeam(match.teamA)
  const teamB = getTeam(match.teamB)
  const opponent = viewerTeam ? getTeam(viewerTeam.id === match.teamA ? match.teamB : match.teamA) : null
  const status = publicStatus(match)

  return (
    <article className="match-card">
      <div className="match-head">
        <div>
          <p>Week {match.week} · {formatDate(match.date)} at {match.time}</p>
          <h2>{viewerTeam ? `vs ${opponent.name}` : `${teamA.name} vs ${teamB.name}`}</h2>
          <span>{match.flight} Band</span>
        </div>
        <StatusBadge status={status} />
      </div>
      {match.score && <p className="score-line">{formatScore(match.score)}</p>}
      {showContacts && selectedPlayer && (
        <ContactTools match={match} selectedPlayer={selectedPlayer} />
      )}
      {showContacts && match.status !== 'final' && (
        <MatchActions match={match} selectedPlayer={selectedPlayer} submitScore={submitScore} markRescheduled={markRescheduled} />
      )}
    </article>
  )
}

function ContactTools({ match, selectedPlayer }) {
  const [copied, setCopied] = useState('')
  const matchPlayers = [...teamPlayers(match.teamA), ...teamPlayers(match.teamB)]
  const selectedTeam = getTeam(selectedPlayer.teamId)
  const numbers = matchPlayers.map((player) => player.phone)
  const message = `Hey, this is ${selectedPlayer.first} from ${selectedTeam.name}. We're scheduled to play Week ${match.week} on ${formatDate(match.date)} at ${match.time}. Any chance you can reschedule?`

  async function copyText(text, label) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
  }

  return (
    <div className="contacts">
      <p className="helper-text">Tap any player below to launch a text message to that person.</p>
      {matchPlayers.map((player) => (
        <a key={player.id} href={`sms:${cleanPhone(player.phone)}`}>Text {player.first} {player.last} · {player.phone}</a>
      ))}
      <div className="button-row">
        <button type="button" onClick={() => copyText(numbers.join(', '), 'Copied all numbers.')}>Copy All Numbers</button>
        <button type="button" onClick={() => copyText(message, 'Copied message.')}>Copy Message</button>
      </div>
      {copied && <p className="helper-text">{copied}</p>}
    </div>
  )
}

function MatchActions({ match, selectedPlayer, submitScore, markRescheduled }) {
  const teamA = getTeam(match.teamA)
  const teamB = getTeam(match.teamB)
  const [open, setOpen] = useState('')
  const [pin, setPin] = useState('')
  const [game1A, setGame1A] = useState(21)
  const [game1B, setGame1B] = useState(0)
  const [game2A, setGame2A] = useState(0)
  const [game2B, setGame2B] = useState(21)
  const [note, setNote] = useState('')
  const score = [[Number(game1A), Number(game1B)], [Number(game2A), Number(game2B)]]
  const errors = validateScore(score)

  function pinIsValid() {
    return pin.trim().toLowerCase() === PIN
  }

  return (
    <div className="actions">
      <div className="button-row">
        <button type="button" onClick={() => setOpen(open === 'score' ? '' : 'score')}>Submit Score</button>
        <button type="button" className="secondary" onClick={() => setOpen(open === 'reschedule' ? '' : 'reschedule')}>Mark Rescheduled</button>
      </div>
      {open === 'score' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault()
          if (!pinIsValid() || errors.length) return
          submitScore(match.id, score, selectedPlayer.id)
        }}>
          <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" type="password" />
          <div className="score-grid">
            <label>Game 1 {teamA.name}<input type="number" min="0" max="21" value={game1A} onChange={(event) => setGame1A(event.target.value)} /></label>
            <label>Game 1 {teamB.name}<input type="number" min="0" max="21" value={game1B} onChange={(event) => setGame1B(event.target.value)} /></label>
            <label>Game 2 {teamA.name}<input type="number" min="0" max="21" value={game2A} onChange={(event) => setGame2A(event.target.value)} /></label>
            <label>Game 2 {teamB.name}<input type="number" min="0" max="21" value={game2B} onChange={(event) => setGame2B(event.target.value)} /></label>
          </div>
          {errors.map((error) => <p className="error" key={error}>{error}</p>)}
          {!pinIsValid() && pin && <p className="error">PIN should be Glen.</p>}
          <button type="submit">Submit for Approval</button>
        </form>
      )}
      {open === 'reschedule' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault()
          if (!pinIsValid()) return
          markRescheduled(match.id, note, selectedPlayer.id)
          setOpen('')
        }}>
          <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" type="password" />
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note or proposed makeup date" />
          {!pinIsValid() && pin && <p className="error">PIN should be Glen.</p>}
          <button type="submit">Save Reschedule</button>
        </form>
      )}
    </div>
  )
}

function buildStandings(matches) {
  const result = Object.fromEntries(flights.map((flight) => [flight, []]))
  teams.forEach((team) => {
    result[team.flight].push({ team, points: 0, matchWins: 0, matchLosses: 0, gameWins: 0, gameLosses: 0, diff: 0, played: 0 })
  })

  matches.filter((match) => match.status === 'final' && match.score).forEach((match) => {
    const a = result[match.flight].find((row) => row.team.id === match.teamA)
    const b = result[match.flight].find((row) => row.team.id === match.teamB)
    const aPoints = match.score[0][0] + match.score[1][0]
    const bPoints = match.score[0][1] + match.score[1][1]
    const aGames = match.score.filter((game) => game[0] > game[1]).length
    const bGames = 2 - aGames
    a.points += aPoints
    b.points += bPoints
    a.diff += aPoints - bPoints
    b.diff += bPoints - aPoints
    a.gameWins += aGames
    a.gameLosses += bGames
    b.gameWins += bGames
    b.gameLosses += aGames
    a.played += 1
    b.played += 1
    if (aGames > bGames) {
      a.matchWins += 1
      b.matchLosses += 1
    } else {
      b.matchWins += 1
      a.matchLosses += 1
    }
  })

  Object.keys(result).forEach((flight) => {
    result[flight] = result[flight]
      .sort((a, b) => b.points - a.points || b.matchWins - a.matchWins || b.gameWins - a.gameWins || b.diff - a.diff)
      .map((row, index) => ({ ...row, rank: index + 1 }))
  })
  return result
}

function validateScore(score) {
  return score.map((game, index) => {
    if (game[0] > 21 || game[1] > 21) return `Game ${index + 1}: no score over 21.`
    if (game[0] === game[1]) return `Game ${index + 1}: no ties.`
    if (game[0] !== 21 && game[1] !== 21) return `Game ${index + 1}: one team must have 21.`
    if (game[0] === 21 && game[1] === 21) return `Game ${index + 1}: only one team can have 21.`
    return ''
  }).filter(Boolean)
}

function isOverdue(match) {
  return new Date(`${match.date}T23:59:59`) < new Date('2026-06-10T12:00:00') && !['final', 'pending'].includes(match.status)
}

function bySchedule(a, b) {
  return scheduleTime(a) - scheduleTime(b)
}

function scheduleTime(match) {
  return new Date(`${match.date} ${match.time}`).getTime()
}

function publicStatus(match) {
  if (isOverdue(match)) return 'Score needed or makeup required'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'rescheduled') return 'Rescheduled / makeup needed'
  if (match.status === 'final') return 'Final'
  return 'Scheduled'
}

function getTeam(id) {
  return teams.find((team) => team.id === id)
}

function teamByNumber(number) {
  return teams.find((team) => team.number === Number(number))
}

function teamPlayers(teamId) {
  return players.filter((player) => player.teamId === teamId)
}

function playerName(playerId) {
  const player = players.find((item) => item.id === playerId)
  return player ? `${player.first} ${player.last}` : 'Unknown'
}

function matchTitle(match) {
  return `${getTeam(match.teamA).name} vs ${getTeam(match.teamB).name}`
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatScore(score) {
  return score ? `${score[0][0]}-${score[0][1]}, ${score[1][0]}-${score[1][1]}` : ''
}

function sampleScheduleCsv() {
  return [
    ['Week', 'Date', 'Time', 'Flight', 'Team A Number', 'Team B Number', 'Notes'],
    ['1', '2026-05-07', '6:30 PM', 'Green', '1', '2', 'Opening night'],
    ['1', '2026-05-07', '7:15 PM', 'Red', '3', '4', ''],
    ['1', '2026-05-07', '8:00 PM', 'White', '5', '6', ''],
  ].map((row) => row.map(csvEscape).join(',')).join('\n')
}

function parseScheduleCsv(text) {
  const rows = parseCsv(text)
  return rows.map((row) => ({
    week: Number(row.Week || row.week),
    date: String(row.Date || row.date || '').trim(),
    time: String(row.Time || row.time || '').trim(),
    flight: String(row.Flight || row.flight || '').trim(),
    teamANumber: Number(row['Team A Number'] || row.teamANumber || row.team_a_number),
    teamBNumber: Number(row['Team B Number'] || row.teamBNumber || row.team_b_number),
    notes: String(row.Notes || row.notes || '').trim(),
  }))
}

function validateScheduleRows(inputRows) {
  const warnings = []
  const errors = []
  const matchKeys = new Set()
  const teamWeekKeys = new Set()
  const validFlights = new Set(flights)
  const validTeamNumbers = new Set(teams.map((team) => team.number))
  const rows = inputRows.filter((row) => Object.values(row).some((value) => String(value || '').trim()))

  rows.forEach((row, index) => {
    const label = `Row ${index + 2}`
    if (!row.week) errors.push(`${label}: Week is required.`)
    if (!row.date) errors.push(`${label}: Date is required.`)
    if (!row.time) errors.push(`${label}: Time is required.`)
    if (!row.flight) errors.push(`${label}: Flight is required.`)
    if (!row.teamANumber) errors.push(`${label}: Team A Number is required.`)
    if (!row.teamBNumber) errors.push(`${label}: Team B Number is required.`)
    if (row.flight && !validFlights.has(row.flight)) errors.push(`${label}: Flight "${row.flight}" does not exist.`)
    if (row.teamANumber && !validTeamNumbers.has(row.teamANumber)) errors.push(`${label}: Team A Number ${row.teamANumber} does not exist.`)
    if (row.teamBNumber && !validTeamNumbers.has(row.teamBNumber)) errors.push(`${label}: Team B Number ${row.teamBNumber} does not exist.`)
    if (row.teamANumber === row.teamBNumber) errors.push(`${label}: A team cannot play itself.`)
    if (row.date && Number.isNaN(Date.parse(row.date))) warnings.push(`${label}: Date looks unusual. Use YYYY-MM-DD if possible.`)
    if (row.time && !looksLikeTime(row.time)) warnings.push(`${label}: Time looks unusual. Example: 6:30 PM.`)

    const sortedTeams = [row.teamANumber, row.teamBNumber].sort().join('-')
    const matchKey = `${row.week}:${row.date}:${row.flight}:${sortedTeams}`
    if (matchKeys.has(matchKey)) warnings.push(`${label}: This looks like a duplicate match.`)
    matchKeys.add(matchKey)

    ;[row.teamANumber, row.teamBNumber].forEach((teamNumber) => {
      if (!teamNumber) return
      const key = `${row.week}:${teamNumber}`
      if (teamWeekKeys.has(key)) warnings.push(`${label}: Team ${teamNumber} is scheduled more than once in week ${row.week}.`)
      teamWeekKeys.add(key)
    })
  })

  if (!rows.length) errors.push('No schedule rows found in the CSV.')
  return { rows, warnings, errors }
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = splitCsvLine(lines.shift() || '').map((header) => header.trim())
  return lines.map((line) => {
    const values = splitCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || '']))
  })
}

function splitCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]
    if (char === '"' && next === '"') {
      current += '"'
      index += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

function csvEscape(value) {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function looksLikeTime(value) {
  return /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(value) || /^([01]?\d|2[0-3]):[0-5]\d$/.test(value)
}

function cleanPhone(phone) {
  return phone.replace(/\D/g, '')
}

function BigButton({ label, onClick }) {
  return <button className="big-button" type="button" onClick={onClick}>{label}</button>
}

function Card({ title, children }) {
  return <section className="card"><h2>{title}</h2>{children}</section>
}

function PageTitle({ eyebrow, title }) {
  return <div><p className="eyebrow">{eyebrow}</p><h1 className="page-title">{title}</h1></div>
}

function Segmented({ options, value, onChange }) {
  return <div className="segmented">{options.map((option) => <button key={option} className={value === option ? 'active' : ''} type="button" onClick={() => onChange(option)}>{option}</button>)}</div>
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>
}

function StatusBadge({ status }) {
  return <span className={`status ${status.includes('needed') ? 'warning' : ''}`}>{status}</span>
}

export default App
