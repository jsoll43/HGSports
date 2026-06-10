export type TeamImportRow = {
  Season: string
  Flight: string
  'Team Number': string
  'Player 1 First Name': string
  'Player 1 Last Name': string
  'Player 1 Phone': string
  'Player 1 Email': string
  'Player 2 First Name': string
  'Player 2 Last Name': string
  'Player 2 Phone': string
  'Player 2 Email': string
}

export type ScheduleImportRow = {
  Season: string
  Week: string
  Date: string
  Time: string
  Flight: string
  'Team A Number': string
  'Team B Number': string
  Notes: string
}

export type ImportPreview = {
  teams: TeamImportRow[]
  schedule: ScheduleImportRow[]
  summary: {
    players: number
    teams: number
    flights: number
    weeks: number
    matches: number
  }
  warnings: string[]
  errors: string[]
}

export const teamTemplateColumns = [
  'Season',
  'Flight',
  'Team Number',
  'Player 1 First Name',
  'Player 1 Last Name',
  'Player 1 Phone',
  'Player 1 Email',
  'Player 2 First Name',
  'Player 2 Last Name',
  'Player 2 Phone',
  'Player 2 Email',
] as const

export const scheduleTemplateColumns = [
  'Season',
  'Week',
  'Date',
  'Time',
  'Flight',
  'Team A Number',
  'Team B Number',
  'Notes',
] as const

export function validateImport(teams: TeamImportRow[], schedule: ScheduleImportRow[]): ImportPreview {
  const warnings: string[] = []
  const errors: string[] = []
  const teamNumbers = new Set<string>()
  const flights = new Set<string>()
  const weeks = new Set<string>()
  const matchKeys = new Set<string>()
  const teamWeekKeys = new Set<string>()

  teams.forEach((row, index) => {
    const rowName = `Team row ${index + 1}`
    requireFields(row, teamTemplateColumns, rowName, errors)
    const teamNumber = String(row['Team Number'] ?? '').trim()
    if (!Number.isInteger(Number(teamNumber)) || Number(teamNumber) <= 0) errors.push(`${rowName}: Team Number must be a positive number.`)
    if (teamNumbers.has(teamNumber)) warnings.push(`${rowName}: duplicate team number ${teamNumber}.`)
    if (!row['Player 1 Phone']?.trim()) warnings.push(`${rowName}: Player 1 is missing a phone number.`)
    if (!row['Player 2 Phone']?.trim()) warnings.push(`${rowName}: Player 2 is missing a phone number.`)
    teamNumbers.add(teamNumber)
    if (row.Flight?.trim()) flights.add(row.Flight.trim())
  })

  schedule.forEach((row, index) => {
    const rowName = `Schedule row ${index + 1}`
    requireFields(row, scheduleTemplateColumns.filter((column) => column !== 'Notes'), rowName, errors)
    const week = String(row.Week ?? '').trim()
    const teamA = String(row['Team A Number'] ?? '').trim()
    const teamB = String(row['Team B Number'] ?? '').trim()
    const flight = row.Flight?.trim()
    weeks.add(week)
    if (flight) flights.add(flight)
    if (!teamNumbers.has(teamA)) errors.push(`${rowName}: Team A Number ${teamA} does not exist in the team import.`)
    if (!teamNumbers.has(teamB)) errors.push(`${rowName}: Team B Number ${teamB} does not exist in the team import.`)
    if (teamA === teamB) errors.push(`${rowName}: a team cannot play itself.`)
    if (Number.isNaN(Date.parse(row.Date))) warnings.push(`${rowName}: date looks invalid.`)
    if (!looksLikeTime(row.Time)) warnings.push(`${rowName}: time looks invalid.`)

    const orderedTeams = [teamA, teamB].sort().join('-')
    const matchKey = `${week}:${row.Date}:${flight}:${orderedTeams}`
    if (matchKeys.has(matchKey)) warnings.push(`${rowName}: duplicate match detected.`)
    matchKeys.add(matchKey)

    ;[teamA, teamB].forEach((teamNumber) => {
      const teamWeekKey = `${week}:${teamNumber}`
      if (teamWeekKeys.has(teamWeekKey)) warnings.push(`${rowName}: team ${teamNumber} is scheduled more than once in week ${week}.`)
      teamWeekKeys.add(teamWeekKey)
    })
  })

  return {
    teams,
    schedule,
    summary: {
      players: teams.length * 2,
      teams: teamNumbers.size,
      flights: flights.size,
      weeks: weeks.size,
      matches: schedule.length,
    },
    warnings,
    errors,
  }
}

export function csvTemplate(columns: readonly string[]) {
  return `${columns.join(',')}\n`
}

function requireFields(row: Record<string, unknown>, fields: readonly string[], rowName: string, errors: string[]) {
  fields.forEach((field) => {
    if (!String(row[field] ?? '').trim()) errors.push(`${rowName}: ${field} is required.`)
  })
}

function looksLikeTime(value: string) {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value) || /^\d{1,2}:[0-5]\d\s?(AM|PM)$/i.test(value)
}
