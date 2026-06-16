import { useEffect, useMemo, useState } from 'react'

const PIN = 'glen'
const ADMIN_PASSWORD = 'glenadmin'
const PAYMENT_LINK = 'https://square.link/u/6oHmgu9w'
const SPORTS_STORAGE_KEY = 'hg-sports-data'
const CORNHOLE_STORAGE_KEY = 'cornhole'
const LEGACY_STORAGE_KEYS = ['hg-cornhole-2026-data']
const LEGACY_STORAGE_PREFIXES = ['hg-2026-v4']

const flights = ['Green', 'Red', 'White']

const initialTeams = [
  { id: 'team-1', flight: 'Green', number: 1, name: 'Tronco / Soll', paid: false, paymentNote: '' },
  { id: 'team-2', flight: 'Green', number: 2, name: 'Gatti / Hourani', paid: false, paymentNote: '' },
  { id: 'team-3', flight: 'Green', number: 3, name: 'Brody / Van Leeuwen', paid: false, paymentNote: '' },
  { id: 'team-4', flight: 'Green', number: 4, name: 'Kemner / Polizzi', paid: false, paymentNote: '' },
  { id: 'team-5', flight: 'Green', number: 5, name: 'Schreiber / Schreiber', paid: false, paymentNote: '' },
  { id: 'team-6', flight: 'Green', number: 6, name: 'Merrill / Devino', paid: false, paymentNote: '' },
  { id: 'team-7', flight: 'Green', number: 7, name: 'Seaberger / Eckert', paid: false, paymentNote: '' },
  { id: 'team-8', flight: 'Green', number: 8, name: 'Sharkey / Wade', paid: false, paymentNote: '' },
  { id: 'team-9', flight: 'Red', number: 9, name: 'Walter / Mueller', paid: false, paymentNote: '' },
  { id: 'team-10', flight: 'Red', number: 10, name: 'Babcock / Babcock', paid: false, paymentNote: '' },
  { id: 'team-11', flight: 'Red', number: 11, name: 'Stola / Murray', paid: false, paymentNote: '' },
  { id: 'team-12', flight: 'Red', number: 12, name: 'Danenza / Jecmen', paid: false, paymentNote: '' },
  { id: 'team-13', flight: 'Red', number: 13, name: 'Angelone / McDonald', paid: false, paymentNote: '' },
  { id: 'team-14', flight: 'Red', number: 14, name: 'Franecki / Contino', paid: false, paymentNote: '' },
  { id: 'team-15', flight: 'Red', number: 15, name: 'Mills / Carlin', paid: false, paymentNote: '' },
  { id: 'team-16', flight: 'Red', number: 16, name: 'Gledhill / Lofink', paid: false, paymentNote: '' },
  { id: 'team-17', flight: 'White', number: 17, name: 'Anderson / Anderson', paid: false, paymentNote: '' },
  { id: 'team-18', flight: 'White', number: 18, name: 'Brumbach / Brumbach', paid: false, paymentNote: '' },
  { id: 'team-19', flight: 'White', number: 19, name: 'Frett / Massa', paid: false, paymentNote: '' },
  { id: 'team-20', flight: 'White', number: 20, name: 'Houck / McCarthy', paid: false, paymentNote: '' },
  { id: 'team-21', flight: 'White', number: 21, name: 'Stola / Monschein', paid: false, paymentNote: '' },
  { id: 'team-22', flight: 'White', number: 22, name: 'Moore / Moore', paid: false, paymentNote: '' },
  { id: 'team-23', flight: 'White', number: 23, name: 'Monrondo / Whittle', paid: false, paymentNote: '' },
  { id: 'team-24', flight: 'White', number: 24, name: 'Luciano / Luciano', paid: false, paymentNote: '' },
]

const initialPlayers = [
  { id: 'player-1a', first: 'Matthew', last: 'Tronco', phone: '6092029539', email: 'matthewtronco@yahoo.com', teamId: 'team-1' },
  { id: 'player-1b', first: 'Jon', last: 'Soll', phone: '6092302432', email: 'jsoll43@gmail.com', teamId: 'team-1' },
  { id: 'player-2a', first: 'Mike', last: 'Gatti', phone: '6096347552', email: 'm.gatti3@gmail.com', teamId: 'team-2' },
  { id: 'player-2b', first: 'John', last: 'Hourani', phone: '8562619462', email: 'jhourani@comcast.net', teamId: 'team-2' },
  { id: 'player-3a', first: 'Michael', last: 'Brody', phone: '609-556-9824', email: 'mbrody31@gmail.com', teamId: 'team-3' },
  { id: 'player-3b', first: 'Keith', last: 'Van Leeuwen', phone: '302-723-9449', email: 'Keith.vanleeuwen@gmail.com', teamId: 'team-3' },
  { id: 'player-4a', first: 'Brian', last: 'Kemner', phone: '856-261-3748', email: 'bkemner11@msn.com', teamId: 'team-4' },
  { id: 'player-4b', first: 'Tom', last: 'Polizzi', phone: '856- 981-6803', email: 'Tompolizzi78@gmail.com', teamId: 'team-4' },
  { id: 'player-5a', first: 'Scott', last: 'Schreiber', phone: '609-330-6880', email: 'schreibs13@gmail.com', teamId: 'team-5' },
  { id: 'player-5b', first: 'Travis', last: 'Schreiber', phone: '856-739-2632', email: 'schrei37@rowan.edu', teamId: 'team-5' },
  { id: 'player-6a', first: 'JJ', last: 'Merrill', phone: '215-260-2947', email: 'jmer125@gmail.com', teamId: 'team-6' },
  { id: 'player-6b', first: 'Chad', last: 'Devino', phone: '609-351-4301', email: 'chaddevino@gmail.com', teamId: 'team-6' },
  { id: 'player-7a', first: 'Jay', last: 'Seaberger', phone: '(215)776-0589', email: 'JasonSeeberger23@Live.com', teamId: 'team-7' },
  { id: 'player-7b', first: 'Edward', last: 'Eckert', phone: '(856) 261-0648', email: 'Eeckert.jr@gmail.com', teamId: 'team-7' },
  { id: 'player-8a', first: 'Jim', last: 'Sharkey', phone: '609-923-7030', email: 'jshark1987@gmail.com', teamId: 'team-8' },
  { id: 'player-8b', first: 'John', last: 'Wade', phone: '609-792-5052', email: 'Jmwade87@gmail.com', teamId: 'team-8' },
  { id: 'player-9a', first: 'Chris', last: 'Walter', phone: '856-304-8263', email: 'chrisw427@mac.com', teamId: 'team-9' },
  { id: 'player-9b', first: 'Cory', last: 'Mueller', phone: '973- 224-0276', email: 'coryrmueller@gmail.com', teamId: 'team-9' },
  { id: 'player-10a', first: 'Brian', last: 'Babcock', phone: '6095131312', email: 'Brianbabcock383@hotmail.com', teamId: 'team-10' },
  { id: 'player-10b', first: 'Sean', last: 'Babcock', phone: '609-417-1338', email: 'Seanbabcock5@hotmail.com', teamId: 'team-10' },
  { id: 'player-11a', first: 'Anthony', last: 'Stola', phone: '8598899218', email: 'anthony.stola@gmail.com', teamId: 'team-11' },
  { id: 'player-11b', first: 'Brenden', last: 'Murray', phone: '518 - 527-1901', email: 'Bmurray2@gmail.com', teamId: 'team-11' },
  { id: 'player-12a', first: 'Warren', last: 'Danenza', phone: '484-571-2035', email: 'wmdanenza@gmail.com', teamId: 'team-12' },
  { id: 'player-12b', first: 'Chris', last: 'Jecmen', phone: '856-562-1227', email: 'Cjecmen@gmail.com', teamId: 'team-12' },
  { id: 'player-13a', first: 'Jay', last: 'Angelone', phone: '8569965611', email: 'jasonangelone@comcast.net', teamId: 'team-13' },
  { id: 'player-13b', first: 'Kevin', last: 'McDonald', phone: '856-220-8335', email: 'kevmac2101@yahoo.com', teamId: 'team-13' },
  { id: 'player-14a', first: 'Gary', last: 'Franecki', phone: '856-761-6930', email: 'gfranecki@gmail.com', teamId: 'team-14' },
  { id: 'player-14b', first: 'Alex', last: 'Contino', phone: '609-760-9509', email: 'acontino@hotmail.com', teamId: 'team-14' },
  { id: 'player-15a', first: 'Jim', last: 'Mills', phone: '609-405-6258', email: 'jim.mills0205@gmail.com', teamId: 'team-15' },
  { id: 'player-15b', first: 'Mark', last: 'Carlin', phone: '(609) 513-8782', email: 'markc1487@gmail.com', teamId: 'team-15' },
  { id: 'player-16a', first: 'Steve', last: 'Gledhill', phone: '856-979-3692', email: 'steve.gledhill@hotmail.com', teamId: 'team-16' },
  { id: 'player-16b', first: 'Cole', last: 'Lofink', phone: '(609) 458-6242', email: 'Colelofink@gmail.com', teamId: 'team-16' },
  { id: 'player-17a', first: 'Mary Ann', last: 'Anderson', phone: '8569525951', email: 'manderson616@gmail.com', teamId: 'team-17' },
  { id: 'player-17b', first: 'Todd', last: 'Anderson', phone: '8562780891', email: 'manderson616@gmail.com', teamId: 'team-17' },
  { id: 'player-18a', first: 'Joe', last: 'Brumbach', phone: '6092045246', email: 'Joe.brumbach@gmail.com', teamId: 'team-18' },
  { id: 'player-18b', first: 'Andrea', last: 'Brumbach', phone: '6094325897', email: 'brumbachandrea@gmail.com', teamId: 'team-18' },
  { id: 'player-19a', first: 'Mike', last: 'Frett', phone: '8569045539', email: 'Michaelfrett@yahoo.com', teamId: 'team-19' },
  { id: 'player-19b', first: 'Alex', last: 'Massa', phone: '8566859758', email: 'alexandermassllc@gmail.com', teamId: 'team-19' },
  { id: 'player-20a', first: 'Brittany', last: 'Houck', phone: '856 304 0748', email: 'Brittanyhouck8@gmail.com', teamId: 'team-20' },
  { id: 'player-20b', first: 'Lisa', last: 'McCarthy', phone: '(856) 264-2488', email: 'Lisamariemc619@gmail.com', teamId: 'team-20' },
  { id: 'player-21a', first: 'Franseca', last: 'Stola', phone: '267-693-8338', email: 'francesca.m.stola@gmail.com', teamId: 'team-21' },
  { id: 'player-21b', first: 'Lauren', last: 'Monschein', phone: '856-816-4699', email: 'lalacull@icloud.com', teamId: 'team-21' },
  { id: 'player-22a', first: 'Korie', last: 'Moore', phone: '856-816-0195', email: 'Koriemaej@yahoo.com', teamId: 'team-22' },
  { id: 'player-22b', first: 'Justin', last: 'Moore', phone: '732-309-4178', email: 'Jnmcrew7@gmail.com', teamId: 'team-22' },
  { id: 'player-23a', first: 'Julia', last: 'Monrondo', phone: '302-381-1092', email: 'Jhmondoro@gmail.com', teamId: 'team-23' },
  { id: 'player-23b', first: 'Jackie', last: 'Whittle', phone: '201-486-8278', email: 'Lange.Jaclyn@gmail.com', teamId: 'team-23' },
  { id: 'player-24a', first: 'Alison', last: 'Luciano', phone: '8563131888', email: 'Tabytha25@yahoo.com', teamId: 'team-24' },
  { id: 'player-24b', first: 'Daniel', last: 'Luciano', phone: '856341187', email: 'Tabytha25@yahoo.com', teamId: 'team-24' },
]

const trophyEntries = [
  { year: 2025, flight: 'Green', winners: 'Jonathan Soll and Matt Tronco' },
  { year: 2025, flight: 'Red', winners: 'Brian Kemner and Tom Polizzi' },
  { year: 2025, flight: 'White', winners: 'John Hourani and Wendy Hourani' },
  { year: 2024, flight: 'Green', winners: 'Mike Gatti and John Hourani' },
  { year: 2024, flight: 'Red', winners: 'Cory Mueller and Chris Walter' },
  { year: 2024, flight: 'White', winners: 'Jonathan Soll and Matt Tronco' },
]

function readStored(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

function readAppData() {
  const sportsData = readStored(SPORTS_STORAGE_KEY)
  if (sportsData?.[CORNHOLE_STORAGE_KEY]) return normalizeAppData(sportsData[CORNHOLE_STORAGE_KEY])

  for (const key of LEGACY_STORAGE_KEYS) {
    const data = readStored(key)
    if (data) return normalizeAppData(data)
  }

  return normalizeAppData(readLegacyAppData())
}

function readLegacyAppData() {
  for (const prefix of LEGACY_STORAGE_PREFIXES) {
    const data = {
      selectedPlayerId: localStorage.getItem(`${prefix}-player`) || '',
      teams: readStored(`${prefix}-teams`),
      players: readStored(`${prefix}-players`),
      matches: readStored(`${prefix}-matches`),
      audit: readStored(`${prefix}-audit`),
      snapshots: readStored(`${prefix}-snapshots`),
    }

    if (data.selectedPlayerId || data.teams || data.players || data.matches || data.audit || data.snapshots) {
      return data
    }
  }

  return {}
}

function normalizeAppData(data = {}) {
  const teams = migrateRosterTeams(Array.isArray(data.teams) ? data.teams : initialTeams)
  const players = migrateRosterPlayers(Array.isArray(data.players) ? data.players : initialPlayers)

  return {
    selectedPlayerId: typeof data.selectedPlayerId === 'string' ? data.selectedPlayerId : '',
    teams,
    players,
    matches: Array.isArray(data.matches) ? data.matches : createSeasonSchedule(teams),
    audit: Array.isArray(data.audit) ? data.audit : [],
    snapshots: Array.isArray(data.snapshots) ? data.snapshots : [],
  }
}

function migrateRosterTeams(teams) {
  return teams.map((team) => {
    if (team.id !== 'team-19' || team.name !== 'Hourani / Hourani') return team
    return { ...team, flight: 'White', number: 19, name: 'Frett / Massa' }
  })
}

function migrateRosterPlayers(players) {
  return players.map((player) => {
    if (player.id === 'player-19a' && player.last === 'Hourani') {
      return { ...player, first: 'Mike', last: 'Frett', phone: '8569045539', email: 'Michaelfrett@yahoo.com', teamId: 'team-19' }
    }
    if (player.id === 'player-19b' && player.last === 'Hourani') {
      return { ...player, first: 'Alex', last: 'Massa', phone: '8566859758', email: 'alexandermassllc@gmail.com', teamId: 'team-19' }
    }
    return player
  })
}

function pageFromPath(pathname) {
  if (pathname === '/cornhole') return 'home'
  if (pathname === '/bocce') return 'bocce'
  return 'hub'
}

function pathForPage(page) {
  if (page === 'hub') return '/'
  if (page === 'bocce') return '/bocce'
  return '/cornhole'
}

function App() {
  const storedData = useMemo(readAppData, [])
  const [page, setCurrentPage] = useState(() => pageFromPath(window.location.pathname))
  const [selectedPlayerId, setSelectedPlayerId] = useState(storedData.selectedPlayerId)
  const [teams, setTeams] = useState(storedData.teams)
  const [players, setPlayers] = useState(storedData.players)
  const [matches, setMatches] = useState(storedData.matches)
  const [audit, setAudit] = useState(storedData.audit)
  const [snapshots, setSnapshots] = useState(storedData.snapshots)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [submissionConfirmation, setSubmissionConfirmation] = useState(null)
  const [headerHidden, setHeaderHidden] = useState(false)

  useEffect(() => {
    const appData = {
      selectedPlayerId,
      teams,
      players,
      matches,
      audit,
      snapshots,
    }
    const sportsData = readStored(SPORTS_STORAGE_KEY)
    const nextSportsData = {
      ...(sportsData && typeof sportsData === 'object' && !Array.isArray(sportsData) ? sportsData : {}),
      [CORNHOLE_STORAGE_KEY]: appData,
    }
    localStorage.setItem(SPORTS_STORAGE_KEY, JSON.stringify(nextSportsData))
  }, [selectedPlayerId, teams, players, matches, audit, snapshots])
  useEffect(() => {
    function handlePopState() {
      setCurrentPage(pageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  useEffect(() => {
    let lastScrollY = window.scrollY

    function handleScroll() {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY
      setHeaderHidden(scrollingDown && currentScrollY > 90)
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const selectedPlayer = players.find((player) => player.id === selectedPlayerId)
  const selectedTeam = selectedPlayer ? getTeam(teams, selectedPlayer.teamId) : null
  const standings = useMemo(() => buildStandings(matches, teams), [matches, teams])
  const showCornholeNav = ['home', 'my', 'standings', 'schedule', 'trophy', 'submitted'].includes(page)

  function setPage(nextPage) {
    const nextPath = pathForPage(nextPage)
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setCurrentPage(nextPage)
  }

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
      teams,
      players,
      standings,
      auditCount: audit.length,
    }
    setSnapshots((items) => [snapshot, ...items])
    log('snapshot_created', { snapshotId: snapshot.id })
  }

  function importSchedule(rows) {
    const importedMatches = rows.map((row, index) => {
      const teamA = teamByNumber(teams, row.teamANumber)
      const teamB = teamByNumber(teams, row.teamBNumber)
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

  function updateTeam(teamId, patch) {
    setTeams((items) => items.map((team) => (team.id === teamId ? { ...team, ...patch } : team)))
  }

  function updatePlayer(playerId, patch) {
    setPlayers((items) => items.map((player) => (player.id === playerId ? { ...player, ...patch } : player)))
  }

  function updateMatch(matchId, patch) {
    setMatches((items) => items.map((match) => (match.id === matchId ? { ...match, ...patch } : match)))
  }

  function regenerateSchedule() {
    const generated = createSeasonSchedule(teams)
    setMatches(generated)
    log('schedule_generated', { matches: generated.length, startDate: '2026-06-22' })
  }

  return (
    <div className="app-shell">
      <header className={`site-header ${headerHidden ? 'hidden' : ''}`}>
        <div className="club-bar">
          <span></span>
          {page !== 'hub' && page !== 'bocce' && <button className="admin-link" type="button" onClick={() => setPage('admin')}>Admin</button>}
        </div>
        <button className="club-logo" type="button" onClick={() => setPage('hub')}>
          <strong>HADDON GLEN</strong>
          <span>SWIM CLUB</span>
        </button>
      </header>

      <main className="content">
        {page === 'hub' && <LeagueHub setPage={setPage} />}
        {page === 'bocce' && <BoccePlaceholder setPage={setPage} />}
        {page === 'home' && <Home standings={standings} setPage={setPage} />}
        {page === 'my' && (
          <MyMatches
            matches={matches}
            teams={teams}
            players={players}
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
        {page === 'schedule' && <Schedule matches={matches} teams={teams} />}
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
            teams={teams}
            players={players}
            audit={audit}
            snapshots={snapshots}
            approveScore={approveScore}
            rejectScore={rejectScore}
            createSnapshot={createSnapshot}
            importSchedule={importSchedule}
            updateTeam={updateTeam}
            updatePlayer={updatePlayer}
            updateMatch={updateMatch}
            regenerateSchedule={regenerateSchedule}
          />
        )}
      </main>

      {showCornholeNav && (
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

function LeagueHub({ setPage }) {
  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Haddon Glen</p>
        <h1>Sports Leagues</h1>
        <p>Choose a league to view schedules, standings, and season tools.</p>
      </div>
      <div className="league-grid">
        <button className="league-button cornhole" type="button" onClick={() => setPage('home')}>
          <span>Cornhole</span>
          <strong>Summer 2026 League</strong>
        </button>
        <button className="league-button bocce" type="button" onClick={() => setPage('bocce')}>
          <span>Bocce</span>
          <strong>Coming soon</strong>
        </button>
      </div>
    </section>
  )
}

function BoccePlaceholder({ setPage }) {
  return (
    <section className="stack">
      <PageTitle eyebrow="Bocce" title="Under Construction" />
      <Card title="Bocce Site">
        <p className="empty">Bocce site is under construction while the league format is being finalized.</p>
        <button type="button" onClick={() => setPage('hub')}>Back to Sports Leagues</button>
      </Card>
    </section>
  )
}

function Home({ standings, setPage }) {
  return (
    <section className="stack">
      <div className="hero-card">
        <h1>Summer 2026 Cornhole League</h1>
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

function MyMatches({ matches, teams, players, selectedPlayer, selectedTeam, selectedPlayerId, setSelectedPlayerId, standings, submitScore, markRescheduled }) {
  if (!selectedPlayer || !selectedTeam) {
    return (
      <section className="stack">
        <PageTitle eyebrow="No login needed" title="My Matches" />
        <Card title="Select your name">
          <label className="field">
            Player
            <select value={selectedPlayerId} onChange={(event) => setSelectedPlayerId(event.target.value)}>
              <option value="">Choose player</option>
              {players.filter(hasPlayerName).sort((a, b) => a.last.localeCompare(b.last)).map((player) => (
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
    .filter((match) => !isPlayedForPlayer(match))
  const playedMatches = allMyMatches
    .filter(isPlayedForPlayer)
    .reverse()
  const nextMatch = openMatches[0]
  const otherOpenMatches = openMatches.slice(1)

  return (
    <section className="stack">
      <div className="profile-card">
        <div className="profile-top">
          <p>Continue as {selectedPlayer.first} {selectedPlayer.last}</p>
          <button type="button" onClick={() => setSelectedPlayerId('')}>Change player</button>
        </div>
        <div className="profile-team-name">
          <h1>Team: {selectedTeam.name}</h1>
          {!selectedTeam.paid && <PaymentWarning />}
        </div>
        <span>{selectedTeam.flight} Band</span>
      </div>
      {!selectedTeam.paid && <PaymentCallout />}
      <div className="stat-grid">
        <Stat label="Record" value={`${row?.matchWins || 0}-${row?.matchLosses || 0}`} />
        <Stat label="Points" value={row?.points || 0} />
        <Stat label="Rank" value={row ? row.rankLabel : '-'} />
      </div>
      {nextMatch && (
        <button
          className="jump-button"
          type="button"
          onClick={() => document.getElementById('next-match')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          Go to Next Match
        </button>
      )}
      {nextMatch ? (
        <section className="priority-match" id="next-match">
          <p className="eyebrow">Next match</p>
          <MatchCard
            match={nextMatch}
            teams={teams}
            players={players}
            viewerTeam={selectedTeam}
            selectedPlayer={selectedPlayer}
            submitScore={submitScore}
            markRescheduled={markRescheduled}
            showContacts
            showPaymentWarnings={false}
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
              teams={teams}
              players={players}
              viewerTeam={selectedTeam}
              selectedPlayer={selectedPlayer}
              submitScore={submitScore}
              markRescheduled={markRescheduled}
              showContacts
              showPaymentWarnings={false}
            />
          ))}
        </div>
      )}
      <details className="history-panel">
        <summary>Played matches ({playedMatches.length})</summary>
        <div className="card-list">
          {playedMatches.map((match) => (
            <MatchCard key={match.id} match={match} teams={teams} players={players} viewerTeam={selectedTeam} showPaymentWarnings={false} />
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
          <span>Game</span>
          <span>Diff</span>
        </div>
        {standings[flight].map((row) => (
          <article className="standing-row" key={row.team.id}>
            <strong>{row.rankLabel}</strong>
            <span className="team-name"><TeamName team={row.team} /></span>
            <span className="points">{row.points}</span>
            <span>{row.gameWins}-{row.gameLosses}</span>
            <span>{row.diff}</span>
          </article>
        ))}
      </section>
    </section>
  )
}

function Schedule({ matches, teams }) {
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
        {filtered.map((match) => <MatchCard key={match.id} match={match} teams={teams} />)}
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
          <article className={`simple-card ${entry.year === 2024 ? 'inaugural-trophy' : ''}`} key={`${entry.year}-${entry.flight}`}>
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

function Admin({
  adminUnlocked,
  setAdminUnlocked,
  matches,
  teams,
  players,
  audit,
  snapshots,
  approveScore,
  rejectScore,
  createSnapshot,
  importSchedule,
  updateTeam,
  updatePlayer,
  updateMatch,
  regenerateSchedule,
}) {
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
      <Segmented options={['Scores', 'Payments', 'Roster', 'Schedule', 'Import', 'Snapshots', 'Audit']} value={tab} onChange={setTab} />
      {tab === 'Scores' && (
        <Card title="Pending Scores">
          {pending.length === 0 && <p className="empty">No pending scores.</p>}
          <div className="card-list">
            {pending.map((match) => (
              <article className="simple-card" key={match.id}>
                <p>Week {match.week} · {matchTitle(match, teams)}</p>
                <h2>{formatScore(match.score)}</h2>
                <p>Submitted by {playerName(players, match.submittedBy)}</p>
                <div className="button-row">
                  <button type="button" onClick={() => approveScore(match.id)}>Approve</button>
                  <button type="button" className="secondary" onClick={() => rejectScore(match.id)}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        </Card>
      )}
      {tab === 'Roster' && (
        <RosterEditor teams={teams} players={players} updateTeam={updateTeam} updatePlayer={updatePlayer} />
      )}
      {tab === 'Payments' && (
        <PaymentTracker teams={teams} updateTeam={updateTeam} />
      )}
      {tab === 'Schedule' && (
        <ScheduleEditor matches={matches} teams={teams} updateMatch={updateMatch} regenerateSchedule={regenerateSchedule} />
      )}
      {tab === 'Import' && <ScheduleImport importSchedule={importSchedule} teams={teams} />}
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
            {audit.map((item) => <AuditEntry key={item.id} item={item} matches={matches} teams={teams} players={players} />)}
          </div>
        </Card>
      )}
    </section>
  )
}

function PaymentTracker({ teams, updateTeam }) {
  const sortedTeams = [...teams].sort((a, b) => a.number - b.number)
  const paidCount = sortedTeams.filter((team) => team.paid).length

  return (
    <Card title="Registration Payments">
      <p className="helper-text">Players use the Square payment link from My Matches. After the payment appears, mark the team as paid here.</p>
      <div className="payment-summary">
        <Stat label="Paid" value={paidCount} />
        <Stat label="Unpaid" value={sortedTeams.length - paidCount} />
        <Stat label="Teams" value={sortedTeams.length} />
      </div>
      <div className="card-list">
        {sortedTeams.map((team) => (
          <article className={`payment-row ${team.paid ? 'paid' : ''}`} key={team.id}>
            <div>
              <p>Team {team.number} · {team.flight} Band</p>
              <h2>{team.name}</h2>
            </div>
            <label className="payment-toggle">
              <input
                type="checkbox"
                checked={Boolean(team.paid)}
                onChange={(event) => updateTeam(team.id, { paid: event.target.checked })}
              />
              Paid
            </label>
            <label className="field payment-note">
              Note
              <input
                value={team.paymentNote || ''}
                placeholder="Check, Venmo, cash, etc."
                onChange={(event) => updateTeam(team.id, { paymentNote: event.target.value })}
              />
            </label>
          </article>
        ))}
      </div>
    </Card>
  )
}

function PaymentCallout() {
  return (
    <section className="payment-callout" aria-label="League payment">
      <div>
        <p className="eyebrow">Payment needed</p>
        <h2>Submit your league payment</h2>
        <p>The commissioner will mark your team paid after the Square payment comes through.</p>
      </div>
      <a href={PAYMENT_LINK} target="_blank" rel="noreferrer">Pay with Square</a>
    </section>
  )
}

function RosterEditor({ teams, players, updateTeam, updatePlayer }) {
  return (
    <Card title="Teams, Players, Phones, and Admin Emails">
      <p className="empty">Emails are stored here for admin use only. Player pages only use phone numbers for texting.</p>
      <div className="card-list">
        {[...teams].sort((a, b) => a.number - b.number).map((team) => {
          const teamPlayers = players.filter((player) => player.teamId === team.id)
          return (
            <article className="simple-card admin-team-card" key={team.id}>
              <div className="admin-team-head">
                <label className="field">
                  Team #
                  <input
                    type="number"
                    min="1"
                    value={team.number}
                    onChange={(event) => updateTeam(team.id, { number: Number(event.target.value) })}
                  />
                </label>
                <label className="field">
                  Band
                  <select value={team.flight} onChange={(event) => updateTeam(team.id, { flight: event.target.value })}>
                    {flights.map((flight) => <option key={flight}>{flight}</option>)}
                  </select>
                </label>
                <label className="field team-name-field">
                  Team Name
                  <input value={team.name} onChange={(event) => updateTeam(team.id, { name: event.target.value })} />
                </label>
              </div>
              <div className="admin-player-grid">
                {teamPlayers.map((player) => (
                  <div className="admin-player-card" key={player.id}>
                    <label className="field">First<input value={player.first} onChange={(event) => updatePlayer(player.id, { first: event.target.value })} /></label>
                    <label className="field">Last<input value={player.last} onChange={(event) => updatePlayer(player.id, { last: event.target.value })} /></label>
                    <label className="field">Phone<input value={player.phone} onChange={(event) => updatePlayer(player.id, { phone: event.target.value })} /></label>
                    <label className="field">Email<input value={player.email || ''} onChange={(event) => updatePlayer(player.id, { email: event.target.value })} /></label>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}

function ScheduleEditor({ matches, teams, updateMatch, regenerateSchedule }) {
  const [flight, setFlight] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  const filtered = matches
    .filter((match) => flight === 'All' || match.flight === flight)
    .sort(bySchedule)

  return (
    <Card title="Editable Schedule">
      <p className="empty">The generator starts Monday, June 22, 2026 and rotates band times each week: 6:00 PM, 6:45 PM, and 7:30 PM.</p>
      <button type="button" onClick={regenerateSchedule}>Generate June 22 Round Robin</button>
      <label className="field">
        Band
        <select value={flight} onChange={(event) => setFlight(event.target.value)}>
          <option>All</option>
          {flights.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <div className="card-list">
        {weeks.map((week) => {
          const weekMatches = filtered.filter((match) => match.week === week)
          if (!weekMatches.length) return null
          return (
            <section className="schedule-week" key={week}>
              <h3>Week {week}</h3>
              <div className="card-list">
                {weekMatches.map((match) => (
                  <article className="simple-card admin-match-card" key={match.id}>
                    <div className="admin-match-grid">
                      <label className="field">Date<input type="date" value={match.date} onChange={(event) => updateMatch(match.id, { date: event.target.value })} /></label>
                      <label className="field">Time<input value={match.time} onChange={(event) => updateMatch(match.id, { time: event.target.value })} /></label>
                      <label className="field">Band<select value={match.flight} onChange={(event) => updateMatch(match.id, { flight: event.target.value })}>{flights.map((item) => <option key={item}>{item}</option>)}</select></label>
                      <label className="field">Status<select value={match.status} onChange={(event) => updateMatch(match.id, { status: event.target.value })}>{['scheduled', 'rescheduled', 'pending', 'final'].map((item) => <option key={item}>{item}</option>)}</select></label>
                      <label className="field">Team A<select value={match.teamA} onChange={(event) => updateMatch(match.id, { teamA: event.target.value })}>{teams.map((team) => <option key={team.id} value={team.id}>{team.number}. {team.name}</option>)}</select></label>
                      <label className="field">Team B<select value={match.teamB} onChange={(event) => updateMatch(match.id, { teamB: event.target.value })}>{teams.map((team) => <option key={team.id} value={team.id}>{team.number}. {team.name}</option>)}</select></label>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </Card>
  )
}

function AuditEntry({ item, matches, teams, players }) {
  const match = item.details?.matchId ? matches.find((candidate) => candidate.id === item.details.matchId) : null
  const actor = item.details?.submittedBy ? playerName(players, item.details.submittedBy) : 'Admin'

  if (item.action === 'score_submitted' && match) {
    const teamA = getTeam(teams, match.teamA)
    const teamB = getTeam(teams, match.teamB)
    const score = item.details.score
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} submitted a score</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
        <p>{teamA?.name || 'Team A'}: {score[0][0]} + {score[1][0]} = {score[0][0] + score[1][0]} points</p>
        <p>{teamB?.name || 'Team B'}: {score[0][1]} + {score[1][1]} = {score[0][1] + score[1][1]} points</p>
      </article>
    )
  }

  if (item.action === 'match_rescheduled' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} marked a match rescheduled</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
        <p>{item.details.note || 'No note provided.'}</p>
      </article>
    )
  }

  if (item.action === 'score_approved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin approved a score</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
      </article>
    )
  }

  if (item.action === 'score_rejected' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin rejected a score</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
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

function ScheduleImport({ importSchedule, teams }) {
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
    const validation = validateScheduleRows(parsed, teams)
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
              Week {row.week}: {teamByNumber(teams, row.teamANumber)?.name || `Team ${row.teamANumber}`} vs {teamByNumber(teams, row.teamBNumber)?.name || `Team ${row.teamBNumber}`} - {row.date} {row.time}
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

function PaymentWarning() {
  return <span className="payment-warning">Unpaid</span>
}

function TeamName({ team, fallback = 'TBD', showPaymentWarning = true }) {
  if (!team) return <span>{fallback}</span>

  return (
    <span className="team-name-with-warning">
      <span className="team-name-text">{team.name}</span>
      {showPaymentWarning && !team.paid && <PaymentWarning />}
    </span>
  )
}

function MatchCard({ match, teams, players = [], viewerTeam, selectedPlayer, showContacts = false, showPaymentWarnings = true, submitScore, markRescheduled }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const opponent = viewerTeam ? getTeam(teams, viewerTeam.id === match.teamA ? match.teamB : match.teamA) : null
  const status = publicStatus(match)

  return (
    <article className="match-card">
      <div className="match-head">
        <div>
          <p>Week {match.week} · {formatDate(match.date)} at {match.time}</p>
          <h2 className="match-title">
            {viewerTeam ? (
              <>
                <span>vs</span>
                <TeamName team={opponent} showPaymentWarning={showPaymentWarnings} />
              </>
            ) : (
              <>
                <TeamName team={teamA} showPaymentWarning={showPaymentWarnings} />
                <span>vs</span>
                <TeamName team={teamB} showPaymentWarning={showPaymentWarnings} />
              </>
            )}
          </h2>
          <span>{match.flight} Band</span>
        </div>
        <StatusBadge status={status} />
      </div>
      {match.score && <p className="score-line">{formatScore(match.score)}</p>}
      {showContacts && match.status !== 'final' && (
        <MatchActions match={match} teams={teams} selectedPlayer={selectedPlayer} submitScore={submitScore} markRescheduled={markRescheduled} />
      )}
      {showContacts && selectedPlayer && (
        <ContactTools match={match} players={players} selectedPlayer={selectedPlayer} />
      )}
    </article>
  )
}

function ContactTools({ match, players, selectedPlayer }) {
  const [copied, setCopied] = useState('')
  const matchPlayers = [...teamPlayers(players, match.teamA), ...teamPlayers(players, match.teamB)].filter(hasPlayerName)
  const numbers = matchPlayers.map((player) => player.phone).filter(Boolean)

  async function copyText(text, label) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
  }

  return (
    <div className="contacts">
      <p className="helper-text">Tap any player to begin a text message</p>
      <div className="text-grid">
        {matchPlayers.map((player) => (
          cleanPhone(player.phone)
            ? <a key={player.id} href={`sms:${cleanPhone(player.phone)}`}>Text {player.first} {player.last}</a>
            : <span className="text-disabled" key={player.id}>Text {player.first} {player.last}</span>
        ))}
      </div>
      <div className="single-button-row">
        <button type="button" onClick={() => copyText(numbers.join(', '), 'Copied all numbers.')}>Copy All Numbers</button>
      </div>
      {copied && <p className="helper-text">{copied}</p>}
    </div>
  )
}

function MatchActions({ match, teams, selectedPlayer, submitScore, markRescheduled }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
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
      <div className="match-action-buttons">
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
            <label>Game 1 {teamA?.name || 'Team A'}<input type="number" min="0" max="21" value={game1A} onChange={(event) => setGame1A(event.target.value)} /></label>
            <label>Game 1 {teamB?.name || 'Team B'}<input type="number" min="0" max="21" value={game1B} onChange={(event) => setGame1B(event.target.value)} /></label>
            <label>Game 2 {teamA?.name || 'Team A'}<input type="number" min="0" max="21" value={game2A} onChange={(event) => setGame2A(event.target.value)} /></label>
            <label>Game 2 {teamB?.name || 'Team B'}<input type="number" min="0" max="21" value={game2B} onChange={(event) => setGame2B(event.target.value)} /></label>
          </div>
          {errors.map((error) => <p className="error" key={error}>{error}</p>)}
          {!pinIsValid() && pin && <p className="error">PIN should be glen.</p>}
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
          {!pinIsValid() && pin && <p className="error">PIN should be glen.</p>}
          <button type="submit">Save Reschedule</button>
        </form>
      )}
    </div>
  )
}

function createSeasonSchedule(teams) {
  const start = new Date('2026-06-22T12:00:00')
  const times = ['6:00 PM', '6:45 PM', '7:30 PM']
  const matches = []

  flights.forEach((flight, flightIndex) => {
    const flightTeams = teams
      .filter((team) => team.flight === flight)
      .sort((a, b) => a.number - b.number)
    const rounds = buildRoundRobinRounds(flightTeams)

    rounds.forEach((round, roundIndex) => {
      const date = addDays(start, roundIndex * 7)
      const time = times[(flightIndex + roundIndex) % times.length]

      round.forEach(([teamA, teamB], matchIndex) => {
        matches.push({
          id: `${flight.toLowerCase()}-${roundIndex + 1}-${matchIndex + 1}`,
          week: roundIndex + 1,
          date: ymd(date),
          time,
          flight,
          teamA: teamA.id,
          teamB: teamB.id,
          status: 'scheduled',
        })
      })
    })
  })

  return matches.sort(bySchedule)
}

function buildRoundRobinRounds(teams) {
  if (teams.length < 2) return []

  const pool = teams.length % 2 === 0 ? [...teams] : [...teams, { id: 'bye' }]
  const rounds = []

  for (let roundIndex = 0; roundIndex < pool.length - 1; roundIndex += 1) {
    const round = []
    for (let index = 0; index < pool.length / 2; index += 1) {
      const teamA = pool[index]
      const teamB = pool[pool.length - 1 - index]
      if (teamA.id !== 'bye' && teamB.id !== 'bye') round.push([teamA, teamB])
    }
    rounds.push(round)
    pool.splice(1, 0, pool.pop())
  }

  return rounds
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function ymd(date) {
  return date.toISOString().slice(0, 10)
}

function buildStandings(matches, teams) {
  const result = Object.fromEntries(flights.map((flight) => [flight, []]))
  teams.forEach((team) => {
    result[team.flight].push({ team, points: 0, matchWins: 0, matchLosses: 0, gameWins: 0, gameLosses: 0, diff: 0, played: 0 })
  })

  matches.filter((match) => match.status === 'final' && match.score).forEach((match) => {
    const a = result[match.flight].find((row) => row.team.id === match.teamA)
    const b = result[match.flight].find((row) => row.team.id === match.teamB)
    if (!a || !b) return
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
    const sortedRows = result[flight]
      .sort((a, b) => b.points - a.points || b.matchWins - a.matchWins || b.gameWins - a.gameWins || b.diff - a.diff)
    result[flight] = withRankLabels(sortedRows)
  })
  return result
}

function withRankLabels(rows) {
  return rows.map((row, index) => {
    const rank = rows.findIndex((item) => item.points === row.points) + 1
    const isTied = rows.filter((item) => item.points === row.points).length > 1
    return { ...row, rank, rankLabel: isTied ? `T-${rank}` : String(rank) }
  })
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

function isPlayedForPlayer(match) {
  return (match.status === 'final' || match.status === 'pending') && !isOverdue(match)
}

function bySchedule(a, b) {
  return scheduleTime(a) - scheduleTime(b)
}

function scheduleTime(match) {
  return new Date(`${match.date} ${match.time}`).getTime()
}

function publicStatus(match) {
  if (match.status === 'rescheduled') return 'Pending reschedule'
  if (isOverdue(match)) return 'Score needed or makeup required'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'final') return 'Final'
  return 'Scheduled'
}

function getTeam(teams, id) {
  return teams.find((team) => team.id === id)
}

function teamByNumber(teams, number) {
  return teams.find((team) => team.number === Number(number))
}

function teamPlayers(players, teamId) {
  return players.filter((player) => player.teamId === teamId)
}

function playerName(players, playerId) {
  const player = players.find((item) => item.id === playerId)
  return player ? `${player.first} ${player.last}` : 'Unknown'
}

function hasPlayerName(player) {
  return `${player.first || ''}${player.last || ''}`.trim()
}

function matchTitle(match, teams) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  return `${teamA?.name || 'TBD'} vs ${teamB?.name || 'TBD'}`
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function gameDateLabel(match) {
  return `Game date: ${formatDate(match.date)} at ${match.time}`
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

function validateScheduleRows(inputRows, teams) {
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
  const className = [
    'status',
    status.includes('needed') ? 'warning' : '',
    status.includes('Pending reschedule') ? 'reschedule' : '',
  ].filter(Boolean).join(' ')

  return <span className={className}>{status}</span>
}

export default App
