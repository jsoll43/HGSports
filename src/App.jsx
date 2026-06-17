import { useEffect, useMemo, useRef, useState } from 'react'

const PIN = 'glen'
const ADMIN_PASSWORD = 'glenadmin'
const PAYMENT_LINK = 'https://square.link/u/6oHmgu9w'
const SPORTS_STORAGE_KEY = 'hg-sports-data'
const CORNHOLE_STORAGE_KEY = 'cornhole'
const BOCCE_STORAGE_KEY = 'bocce'
const CORNHOLE_SCHEDULE_VERSION = '2026-27-team-v1'
const CLOUD_POLL_MS = 8000
const LEGACY_STORAGE_KEYS = ['hg-cornhole-2026-data']
const LEGACY_STORAGE_PREFIXES = ['hg-2026-v4']

const flights = ['Green', 'Red', 'White']
const bocceTimes = ['6:00 PM', '7:00 PM', '8:00 PM']

const initialTeams = [
  { id: 'team-1', flight: 'Green', number: 1, name: 'Tronco / Soll', paid: false, paymentNote: '' },
  { id: 'team-2', flight: 'Green', number: 2, name: 'Gatti / Hourani', paid: false, paymentNote: '' },
  { id: 'team-3', flight: 'Green', number: 3, name: 'Brody / Van Leeuwen', paid: false, paymentNote: '' },
  { id: 'team-4', flight: 'Green', number: 4, name: 'Kemner / Polizzi', paid: false, paymentNote: '' },
  { id: 'team-5', flight: 'Green', number: 5, name: 'Schreiber / Schreiber', paid: false, paymentNote: '' },
  { id: 'team-6', flight: 'Green', number: 6, name: 'Merrill / Devino', paid: false, paymentNote: '' },
  { id: 'team-7', flight: 'Green', number: 7, name: 'Seaberger / Eckert', paid: false, paymentNote: '' },
  { id: 'team-8', flight: 'Green', number: 8, name: 'Sharkey / Wade', paid: false, paymentNote: '' },
  { id: 'team-25', flight: 'Green', number: 9, name: 'Shields / Dougherty', paid: false, paymentNote: '' },
  { id: 'team-9', flight: 'Red', number: 10, name: 'Walter / Mueller', paid: false, paymentNote: '' },
  { id: 'team-10', flight: 'Red', number: 11, name: 'Babcock / Babcock', paid: false, paymentNote: '' },
  { id: 'team-11', flight: 'Red', number: 12, name: 'Stola / Murray', paid: false, paymentNote: '' },
  { id: 'team-12', flight: 'Red', number: 13, name: 'Danenza / Jecmen', paid: false, paymentNote: '' },
  { id: 'team-13', flight: 'Red', number: 14, name: 'Angelone / McDonald', paid: false, paymentNote: '' },
  { id: 'team-14', flight: 'Red', number: 15, name: 'Franecki / Contino', paid: false, paymentNote: '' },
  { id: 'team-15', flight: 'Red', number: 16, name: 'Mills / Carlin', paid: false, paymentNote: '' },
  { id: 'team-16', flight: 'Red', number: 17, name: 'Gledhill / Lofink', paid: false, paymentNote: '' },
  { id: 'team-26', flight: 'Red', number: 18, name: 'Schrank / Palmer', paid: false, paymentNote: '' },
  { id: 'team-17', flight: 'White', number: 19, name: 'Anderson / Anderson', paid: false, paymentNote: '' },
  { id: 'team-18', flight: 'White', number: 20, name: 'Brumbach / Brumbach', paid: false, paymentNote: '' },
  { id: 'team-19', flight: 'White', number: 21, name: 'Frett / Massa', paid: false, paymentNote: '' },
  { id: 'team-20', flight: 'White', number: 22, name: 'Houck / McCarthy', paid: false, paymentNote: '' },
  { id: 'team-21', flight: 'White', number: 23, name: 'Stola / Monschein', paid: false, paymentNote: '' },
  { id: 'team-22', flight: 'White', number: 24, name: 'Moore / Moore', paid: false, paymentNote: '' },
  { id: 'team-23', flight: 'White', number: 25, name: 'Monrondo / Whittle', paid: false, paymentNote: '' },
  { id: 'team-24', flight: 'White', number: 26, name: 'Luciano / Luciano', paid: false, paymentNote: '' },
  { id: 'team-27', flight: 'White', number: 27, name: 'Mertz / Capperella', paid: false, paymentNote: '' },
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
  { id: 'player-25a', first: 'Jim', last: 'Shields', phone: '856-889-9057', email: 'jshields1012@gmail.com', teamId: 'team-25' },
  { id: 'player-25b', first: 'Sean', last: 'Dougherty', phone: '856-889-6979', email: 'SDoc135@gmail.com', teamId: 'team-25' },
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
  { id: 'player-26a', first: 'Tom', last: 'Schrank', phone: '215-206-6730', email: 'tomschrank@gmail.com', teamId: 'team-26' },
  { id: 'player-26b', first: 'Evan', last: 'Palmer', phone: '856-425-1071', email: 'palmer.evanj@gmail.com', teamId: 'team-26' },
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
  { id: 'player-27a', first: 'Shane', last: 'Mertz', phone: '609-868-1756', email: 'Shanem75@aol.com', teamId: 'team-27' },
  { id: 'player-27b', first: 'Jay', last: 'Capperella', phone: '856-912-2804', email: 'Jay.Capperella@gmail.com', teamId: 'team-27' },
]

const initialBocceTeams = [
  { id: 'bocce-team-1', number: 1, name: 'God Fa Bid' },
  { id: 'bocce-team-2', number: 2, name: 'Bocce Balboa' },
  { id: 'bocce-team-3', number: 3, name: 'Holy Rollers' },
  { id: 'bocce-team-4', number: 4, name: 'We Thought You Meant Basketball' },
  { id: 'bocce-team-5', number: 5, name: 'Ball Busters' },
  { id: 'bocce-team-6', number: 6, name: 'Bocce takes Balls' },
]

const initialBoccePlayers = [
  { id: 'bocce-player-1a', first: 'Brian', last: 'Babcock', phone: '609-513-1312', email: 'brianbabcock383@hotmail.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-1b', first: 'Mary', last: 'Babcock', phone: '215-817-3666', email: 'maryalice911@gmail.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-1c', first: 'Cory', last: 'Mueller', phone: '973-224-0276', email: 'coryrmueller@gmail.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-1d', first: 'Janelle', last: 'Mueller', phone: '201-723-1615', email: 'janellesavin@yahoo.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-1e', first: 'Kevin', last: 'Gleason', phone: '718-986-4964', email: 'kgleason122@gmail.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-1f', first: 'Teresa', last: 'Gleason', phone: '856-693-0680', email: 'teresagleason555@gmail.com', teamId: 'bocce-team-1' },
  { id: 'bocce-player-2a', first: 'Stacey', last: 'Augustine', phone: '609-405-0164', email: 'stacey12682@gmail.com', teamId: 'bocce-team-2' },
  { id: 'bocce-player-2b', first: 'Chris', last: 'Augustine', phone: '609-707-0953', email: 'augie615@gmail.com', teamId: 'bocce-team-2' },
  { id: 'bocce-player-2c', first: 'Mary Stewart', last: 'Vena', phone: '215-684-9303', email: 'mstewartvena@gmail.com', teamId: 'bocce-team-2' },
  { id: 'bocce-player-2d', first: 'Dan', last: 'Vena', phone: '856-465-6218', email: 'dvena@johnvenaproduce.com', teamId: 'bocce-team-2' },
  { id: 'bocce-player-2e', first: 'Chris', last: 'DiPiazza', phone: '', email: '', teamId: 'bocce-team-2' },
  { id: 'bocce-player-2f', first: 'Heather', last: 'DiPiazza', phone: '', email: '', teamId: 'bocce-team-2' },
  { id: 'bocce-player-3a', first: 'Stefanie', last: 'Maro', phone: '856-287-2408', email: 'stefanie.maro@gmail.com', teamId: 'bocce-team-3' },
  { id: 'bocce-player-3b', first: 'Alex', last: 'Maro', phone: '856-524-5335', email: 'alexander.maro@gmail.com', teamId: 'bocce-team-3' },
  { id: 'bocce-player-3c', first: 'Eric', last: 'Cangalosi', phone: '856-655-8901', email: 'eric.cangelosi2@gmail.com', teamId: 'bocce-team-3' },
  { id: 'bocce-player-3d', first: 'Frank', last: 'Coppola', phone: '215-990-5858', email: 'Fracoppola@msn.com', teamId: 'bocce-team-3' },
  { id: 'bocce-player-3e', first: 'Chris', last: 'Angalone', phone: '856-266-2803', email: 'chrisang26@comcast.net', teamId: 'bocce-team-3' },
  { id: 'bocce-player-3f', first: 'Pete', last: 'Pryzbylkowski', phone: '856-979-6049', email: 'petepryz@gmail.com', teamId: 'bocce-team-3' },
  { id: 'bocce-player-4a', first: 'Tom', last: 'Schrank', phone: '215-206-6730', email: 'tomschrank@gmail.com', teamId: 'bocce-team-4' },
  { id: 'bocce-player-4b', first: 'Dan', last: 'Luciano', phone: '856-341-0187', email: 'Daniel.Luciano@blackrock.com', teamId: 'bocce-team-4' },
  { id: 'bocce-player-4c', first: 'Eric', last: 'Dougherty', phone: '856-676-2141', email: 'emdoc84@yahoo.com', teamId: 'bocce-team-4' },
  { id: 'bocce-player-4d', first: 'Maria', last: 'Dougherty', phone: '', email: '', teamId: 'bocce-team-4' },
  { id: 'bocce-player-4e', first: 'Additional', last: 'Contact 1', phone: '856-831-5557', email: '', teamId: 'bocce-team-4' },
  { id: 'bocce-player-4f', first: 'Additional', last: 'Contact 2', phone: '267-971-1270', email: '', teamId: 'bocce-team-4' },
  { id: 'bocce-player-5a', first: 'Matt', last: 'McCall', phone: '609-440-8585', email: '', teamId: 'bocce-team-5' },
  { id: 'bocce-player-5b', first: 'Lauren', last: 'McCall', phone: '856-669-7084', email: 'lmccall819@gmail.com', teamId: 'bocce-team-5' },
  { id: 'bocce-player-5c', first: 'Kevin', last: 'Hein', phone: '973-945-4480', email: 'hein.kev@icloud.com', teamId: 'bocce-team-5' },
  { id: 'bocce-player-5d', first: 'Rikki', last: 'Hein', phone: '', email: 'rikki.hein@gmail.com', teamId: 'bocce-team-5' },
  { id: 'bocce-player-5e', first: 'Dave', last: 'Perrin', phone: '', email: 'Davidcperrin@gmail.com', teamId: 'bocce-team-5' },
  { id: 'bocce-player-5f', first: 'Michele', last: 'Perrin', phone: '', email: 'Michelebperrin@gmail.com', teamId: 'bocce-team-5' },
  { id: 'bocce-player-6a', first: 'Chris', last: 'Pfieffer', phone: '856-448-3529', email: 'pfeiffer_chris@yahoo.com', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6b', first: 'Lauren', last: 'Pfeiffer', phone: '301-758-8879', email: 'laurenmpfeiffer@gmail.com', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6c', first: 'Robin', last: 'Baker', phone: '856-308-6796', email: 'robinlbaker@gmail.com', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6d', first: 'Chris', last: 'Baker', phone: '856-534-0931', email: 'Cltbaker@gmail.com', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6e', first: 'Danielle', last: 'Danenza', phone: '609-410-5067', email: 'Danielledanenza@gmail.com', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6f', first: 'Warren', last: 'Danenza', phone: '484-571-2035', email: '', teamId: 'bocce-team-6' },
  { id: 'bocce-player-6g', first: 'Marlies', last: 'Jecman', phone: '856-304-3735', email: '', teamId: 'bocce-team-6' },
]

const bocceRuleCards = [
  { title: 'Reschedules', text: 'Rescheduled matches must be played at Haddon Glen and recorded before the committee deadline.' },
  { title: 'Valid Rolls', text: 'Feet stay behind the fault line, throws are underhand, balls cross half court, and balls cannot hit the back wall first.' },
  { title: 'Gameplay', text: 'The team that is out throws until it is in or out of balls. All bocce balls are thrown to complete each frame.' },
  { title: 'Scoring', text: 'Only the closest team scores in a frame. Kisses count as two points. Games go to 11 and must be won by 2; a match is 3 games.' },
  { title: 'Throwing Rotation', text: 'Each team needs at least 2 players for a match. Four-player teams throw one ball per player; two-player teams throw two balls per player.' },
  { title: 'Pallino Toss', text: 'The pallino must cross half court and stay off the side and back walls. An invalid toss turns the start of the frame over to the other team.' },
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

function readSportsData() {
  const sportsData = readStored(SPORTS_STORAGE_KEY)
  return sportsData && typeof sportsData === 'object' && !Array.isArray(sportsData) ? sportsData : {}
}

function normalizeSportsData(data = {}) {
  return {
    [CORNHOLE_STORAGE_KEY]: normalizeAppData(data?.[CORNHOLE_STORAGE_KEY]),
    [BOCCE_STORAGE_KEY]: normalizeBocceData(data?.[BOCCE_STORAGE_KEY]),
  }
}

async function readCloudSportsData() {
  const response = await fetch('/api/state', {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) throw new Error(`Cloud read failed: ${response.status}`)
  return response.json()
}

async function saveCloudSportsData(data) {
  const response = await fetch('/api/state', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })

  if (!response.ok) throw new Error(`Cloud save failed: ${response.status}`)
  const result = await response.json()
  return result.updatedAt || ''
}

function readAppData() {
  const sportsData = readSportsData()
  if (sportsData?.[CORNHOLE_STORAGE_KEY]) return normalizeAppData(sportsData[CORNHOLE_STORAGE_KEY])

  for (const key of LEGACY_STORAGE_KEYS) {
    const data = readStored(key)
    if (data) return normalizeAppData(data)
  }

  return normalizeAppData(readLegacyAppData())
}

function readBocceData() {
  const sportsData = readSportsData()
  return normalizeBocceData(sportsData?.[BOCCE_STORAGE_KEY])
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
  const shouldRegenerateSchedule = data.scheduleVersion !== CORNHOLE_SCHEDULE_VERSION

  return {
    selectedPlayerId: typeof data.selectedPlayerId === 'string' ? data.selectedPlayerId : '',
    teams,
    players,
    matches: !shouldRegenerateSchedule && Array.isArray(data.matches) ? data.matches : createSeasonSchedule(teams),
    audit: Array.isArray(data.audit) ? data.audit : [],
    snapshots: Array.isArray(data.snapshots) ? data.snapshots : [],
    scheduleVersion: CORNHOLE_SCHEDULE_VERSION,
  }
}

function normalizeBocceData(data = {}) {
  const teams = migrateBocceTeams(Array.isArray(data?.teams) ? data.teams : initialBocceTeams)
  const players = Array.isArray(data?.players) ? data.players : initialBoccePlayers

  return {
    selectedPlayerId: typeof data?.selectedPlayerId === 'string' ? data.selectedPlayerId : '',
    teams,
    players,
    matches: Array.isArray(data?.matches) ? data.matches : createBocceSchedule(teams),
    audit: Array.isArray(data?.audit) ? data.audit : [],
    snapshots: Array.isArray(data?.snapshots) ? data.snapshots : [],
  }
}

function migrateBocceTeams(teams) {
  return teams.map((team) => {
    if (team.id !== 'bocce-team-1') return team
    return { ...team, name: 'God Fa Bid' }
  })
}

function migrateRosterTeams(teams) {
  const existingById = new Map(teams.map((team) => [team.id, team]))

  return initialTeams.map((team) => {
    const existing = existingById.get(team.id)
    return {
      ...team,
      paid: Boolean(existing?.paid ?? team.paid),
      paymentNote: existing?.paymentNote || team.paymentNote,
    }
  })
}

function migrateRosterPlayers(players) {
  return initialPlayers
}

function pageFromPath(pathname) {
  if (pathname === '/cornhole') return 'home'
  if (pathname === '/bocce') return 'bocce-home'
  return 'hub'
}

function pathForPage(page) {
  if (page === 'hub') return '/'
  if (page.startsWith('bocce')) return '/bocce'
  return '/cornhole'
}

function App() {
  const storedData = useMemo(readAppData, [])
  const storedBocceData = useMemo(readBocceData, [])
  const [page, setCurrentPage] = useState(() => pageFromPath(window.location.pathname))
  const [selectedPlayerId, setSelectedPlayerId] = useState(storedData.selectedPlayerId)
  const [teams, setTeams] = useState(storedData.teams)
  const [players, setPlayers] = useState(storedData.players)
  const [matches, setMatches] = useState(storedData.matches)
  const [audit, setAudit] = useState(storedData.audit)
  const [snapshots, setSnapshots] = useState(storedData.snapshots)
  const [selectedBoccePlayerId, setSelectedBoccePlayerId] = useState(storedBocceData.selectedPlayerId)
  const [bocceTeams, setBocceTeams] = useState(storedBocceData.teams)
  const [boccePlayers, setBoccePlayers] = useState(storedBocceData.players)
  const [bocceMatches, setBocceMatches] = useState(storedBocceData.matches)
  const [bocceAudit, setBocceAudit] = useState(storedBocceData.audit)
  const [bocceSnapshots, setBocceSnapshots] = useState(storedBocceData.snapshots)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [submissionConfirmation, setSubmissionConfirmation] = useState(null)
  const [bocceSubmissionConfirmation, setBocceSubmissionConfirmation] = useState(null)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [cloudReady, setCloudReady] = useState(false)
  const [cloudError, setCloudError] = useState('')
  const latestSportsDataRef = useRef(null)
  const cloudUpdatedAtRef = useRef('')
  const cloudSavingRef = useRef(false)
  const skipNextCloudSaveRef = useRef(false)
  const saveTimerRef = useRef(null)

  const currentSportsData = useMemo(() => ({
    [CORNHOLE_STORAGE_KEY]: {
      selectedPlayerId,
      teams,
      players,
      matches,
      audit,
      snapshots,
      scheduleVersion: CORNHOLE_SCHEDULE_VERSION,
    },
    [BOCCE_STORAGE_KEY]: {
      selectedPlayerId: selectedBoccePlayerId,
      teams: bocceTeams,
      players: boccePlayers,
      matches: bocceMatches,
      audit: bocceAudit,
      snapshots: bocceSnapshots,
    },
  }), [selectedPlayerId, teams, players, matches, audit, snapshots, selectedBoccePlayerId, bocceTeams, boccePlayers, bocceMatches, bocceAudit, bocceSnapshots])

  function applySportsData(sportsData) {
    const normalized = normalizeSportsData(sportsData)
    const cornhole = normalized[CORNHOLE_STORAGE_KEY]
    const bocce = normalized[BOCCE_STORAGE_KEY]

    setSelectedPlayerId(cornhole.selectedPlayerId)
    setTeams(cornhole.teams)
    setPlayers(cornhole.players)
    setMatches(cornhole.matches)
    setAudit(cornhole.audit)
    setSnapshots(cornhole.snapshots)
    setSelectedBoccePlayerId(bocce.selectedPlayerId)
    setBocceTeams(bocce.teams)
    setBoccePlayers(bocce.players)
    setBocceMatches(bocce.matches)
    setBocceAudit(bocce.audit)
    setBocceSnapshots(bocce.snapshots)
  }

  useEffect(() => {
    let cancelled = false

    async function loadCloudData() {
      let loaded = false
      try {
        const remote = await readCloudSportsData()
        if (cancelled) return

        const hasRemoteData = remote?.data && Object.keys(remote.data).length > 0
        if (hasRemoteData) {
          cloudUpdatedAtRef.current = remote.updatedAt || ''
          skipNextCloudSaveRef.current = true
          applySportsData(remote.data)
        } else {
          cloudUpdatedAtRef.current = await saveCloudSportsData(latestSportsDataRef.current || currentSportsData)
          skipNextCloudSaveRef.current = true
        }
        loaded = true
      } catch (error) {
        console.warn(error)
        if (!cancelled) setCloudError('Could not connect to the league database. Check the Cloudflare D1 binding named DB and redeploy.')
      } finally {
        if (!cancelled && loaded) setCloudReady(true)
      }
    }

    loadCloudData()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    latestSportsDataRef.current = currentSportsData

    if (!cloudReady) return undefined
    if (skipNextCloudSaveRef.current) {
      skipNextCloudSaveRef.current = false
      return undefined
    }

    window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(async () => {
      cloudSavingRef.current = true
      try {
        cloudUpdatedAtRef.current = await saveCloudSportsData(currentSportsData)
        setCloudError('')
      } catch (error) {
        console.warn(error)
        setCloudError('Could not save to the league database. Refresh before making more edits.')
      } finally {
        cloudSavingRef.current = false
      }
    }, 600)

    return () => window.clearTimeout(saveTimerRef.current)
  }, [currentSportsData, cloudReady])

  useEffect(() => {
    if (!cloudReady) return undefined

    let cancelled = false

    async function pollCloudData() {
      if (cloudSavingRef.current) return

      try {
        const remote = await readCloudSportsData()
        if (cancelled || !remote?.data || !remote.updatedAt || remote.updatedAt === cloudUpdatedAtRef.current) return

        cloudUpdatedAtRef.current = remote.updatedAt
        skipNextCloudSaveRef.current = true
        applySportsData(remote.data)
      } catch (error) {
        console.warn(error)
      }
    }

    const intervalId = window.setInterval(pollCloudData, CLOUD_POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [cloudReady])
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
  const selectedBoccePlayer = boccePlayers.find((player) => player.id === selectedBoccePlayerId)
  const selectedBocceTeam = selectedBoccePlayer ? getTeam(bocceTeams, selectedBoccePlayer.teamId) : null
  const standings = useMemo(() => buildStandings(matches, teams), [matches, teams])
  const bocceStandings = useMemo(() => buildBocceStandings(bocceMatches, bocceTeams), [bocceMatches, bocceTeams])
  const showCornholeNav = ['home', 'my', 'standings', 'schedule', 'trophy', 'submitted'].includes(page)
  const showBocceNav = ['bocce-home', 'bocce-my', 'bocce-standings', 'bocce-schedule', 'bocce-rules', 'bocce-submitted'].includes(page)

  if (!cloudReady) {
    return (
      <div className="app-shell">
        <main className="content">
          <section className="card sync-state">
            <h2>{cloudError ? 'Database unavailable' : 'Loading league data'}</h2>
            <p>{cloudError || 'Connecting to Cloudflare D1.'}</p>
          </section>
        </main>
      </div>
    )
  }

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

  function logBocce(action, details) {
    setBocceAudit((items) => [{ id: crypto.randomUUID(), at: new Date().toISOString(), action, details }, ...items])
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

  function updateTeamPaymentStatus(teamId, paid) {
    const team = teams.find((item) => item.id === teamId)
    if (!team || Boolean(team.paid) === paid) return

    setTeams((items) => items.map((item) => (item.id === teamId ? { ...item, paid } : item)))
    log(paid ? 'payment_marked_paid' : 'payment_unmarked_paid', {
      teamId,
      teamName: team.name,
      teamNumber: team.number,
      flight: team.flight,
      paid,
    })
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

  function submitBocceScore(matchId, score, submittedBy) {
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? { ...match, status: 'pending', score, submittedBy, submittedAt: new Date().toISOString() }
          : match,
      ),
    )
    logBocce('score_submitted', { matchId, submittedBy, score })
    setBocceSubmissionConfirmation({ matchId, at: new Date().toISOString() })
    setPage('bocce-submitted')
  }

  function markBocceRescheduled(matchId, note, submittedBy) {
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? { ...match, status: 'rescheduled', rescheduleNote: note || 'Makeup needed', rescheduledBy: submittedBy, rescheduledAt: new Date().toISOString() }
          : match,
      ),
    )
    logBocce('match_rescheduled', { matchId, submittedBy, note })
  }

  function approveBocceScore(matchId) {
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'final', approvedAt: new Date().toISOString() } : match,
      ),
    )
    logBocce('score_approved', { matchId })
  }

  function rejectBocceScore(matchId) {
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'scheduled', score: undefined, submittedBy: undefined, submittedAt: undefined } : match,
      ),
    )
    logBocce('score_rejected', { matchId })
  }

  function createBocceSnapshot() {
    const snapshot = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      matches: bocceMatches,
      teams: bocceTeams,
      players: boccePlayers,
      standings: bocceStandings,
      auditCount: bocceAudit.length,
    }
    setBocceSnapshots((items) => [snapshot, ...items])
    logBocce('snapshot_created', { snapshotId: snapshot.id })
  }

  function updateBocceTeam(teamId, patch) {
    setBocceTeams((items) => items.map((team) => (team.id === teamId ? { ...team, ...patch } : team)))
  }

  function updateBoccePlayer(playerId, patch) {
    setBoccePlayers((items) => items.map((player) => (player.id === playerId ? { ...player, ...patch } : player)))
  }

  function updateBocceMatch(matchId, patch) {
    setBocceMatches((items) => items.map((match) => (match.id === matchId ? { ...match, ...patch } : match)))
  }

  function regenerateBocceSchedule() {
    const generated = createBocceSchedule(bocceTeams)
    setBocceMatches(generated)
    logBocce('schedule_generated', { matches: generated.length, startDate: '2026-06-24' })
  }

  return (
    <div className="app-shell">
      <header className={`site-header ${headerHidden ? 'hidden' : ''}`}>
        <div className="club-bar">
          <span></span>
          {page !== 'hub' && (
            <button className="admin-link" type="button" onClick={() => setPage(page.startsWith('bocce') ? 'bocce-admin' : 'admin')}>Admin</button>
          )}
        </div>
        <button className="club-logo" type="button" onClick={() => setPage('hub')}>
          <strong>HADDON GLEN</strong>
          <span>SWIM CLUB</span>
        </button>
      </header>

      <main className="content">
        {cloudError && <p className="sync-warning">{cloudError}</p>}
        {page === 'hub' && <LeagueHub setPage={setPage} />}
        {page === 'bocce-home' && <BocceHome matches={bocceMatches} teams={bocceTeams} standings={bocceStandings} setPage={setPage} />}
        {page === 'bocce-my' && (
          <BocceMyMatches
            matches={bocceMatches}
            teams={bocceTeams}
            players={boccePlayers}
            selectedPlayer={selectedBoccePlayer}
            selectedTeam={selectedBocceTeam}
            selectedPlayerId={selectedBoccePlayerId}
            setSelectedPlayerId={setSelectedBoccePlayerId}
            standings={bocceStandings}
            submitScore={submitBocceScore}
            markRescheduled={markBocceRescheduled}
          />
        )}
        {page === 'bocce-standings' && <BocceStandings standings={bocceStandings} />}
        {page === 'bocce-schedule' && <BocceSchedule matches={bocceMatches} teams={bocceTeams} players={boccePlayers} />}
        {page === 'bocce-rules' && <BocceRules />}
        {page === 'bocce-submitted' && <ScoreSubmitted confirmation={bocceSubmissionConfirmation} setPage={setPage} homePage="bocce-home" myPage="bocce-my" />}
        {page === 'bocce-admin' && (
          <BocceAdmin
            adminUnlocked={adminUnlocked}
            setAdminUnlocked={setAdminUnlocked}
            matches={bocceMatches}
            teams={bocceTeams}
            players={boccePlayers}
            audit={bocceAudit}
            snapshots={bocceSnapshots}
            approveScore={approveBocceScore}
            rejectScore={rejectBocceScore}
            createSnapshot={createBocceSnapshot}
            updateTeam={updateBocceTeam}
            updatePlayer={updateBoccePlayer}
            updateMatch={updateBocceMatch}
            regenerateSchedule={regenerateBocceSchedule}
          />
        )}
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
      {showBocceNav && (
        <nav className="bottom-nav" aria-label="Bocce navigation">
          <button type="button" onClick={() => setPage('bocce-home')}>Home</button>
          <button type="button" onClick={() => setPage('bocce-my')}>My Matches</button>
          <button type="button" onClick={() => setPage('bocce-standings')}>Standings</button>
          <button type="button" onClick={() => setPage('bocce-schedule')}>Schedule</button>
          <button type="button" onClick={() => setPage('bocce-rules')}>Rules</button>
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
          <span className="league-copy">
            <span>Cornhole</span>
            <strong>Summer 2026 League</strong>
          </span>
          <span className="league-art cornhole-art" aria-hidden="true">
            <CornholeLeagueGraphic />
          </span>
        </button>
        <button className="league-button bocce" type="button" onClick={() => setPage('bocce-home')}>
          <span className="league-copy">
            <span>Bocce</span>
            <strong>Summer 2026 League</strong>
          </span>
          <span className="league-art bocce-art" aria-hidden="true">
            <BocceLeagueGraphic />
          </span>
        </button>
      </div>
    </section>
  )
}

function CornholeLeagueGraphic() {
  return (
    <svg viewBox="0 0 320 210" role="img">
      <g transform="translate(32 44)">
        <polygon points="38,92 220,4 294,55 103,166" fill="#e8b675" />
        <polygon points="38,92 103,166 103,187 38,112" fill="#d09450" />
        <polygon points="103,166 294,55 294,76 103,187" fill="#b87938" />
        <polygon points="77,91 216,26 266,59 116,144" fill="#ff7f38" />
        <path d="M76 91 L209 30" stroke="#f8cf4b" strokeWidth="8" />
        <path d="M116 144 L256 63" stroke="#f8cf4b" strokeWidth="8" />
        <path d="M85 95 L120 151" stroke="#17384c" strokeWidth="3" opacity="0.75" />
        <path d="M246 81 L286 62" stroke="#17384c" strokeWidth="3" opacity="0.75" />
        <circle cx="224" cy="43" r="29" fill="#f8cf4b" />
        <circle cx="224" cy="43" r="21" fill="#fff" />
        <rect x="262" y="82" width="18" height="63" fill="#c98b45" />
      </g>
      <g transform="translate(82 56) rotate(11)">
        <rect x="0" y="0" width="70" height="48" rx="12" fill="#f02b5e" />
      </g>
      <g transform="translate(170 112) rotate(10)">
        <rect x="0" y="0" width="66" height="54" rx="13" fill="#3f82a8" />
      </g>
      <path d="M32 65 C54 66 74 72 94 83" fill="none" stroke="#243037" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d="M24 85 C48 84 76 91 102 105" fill="none" stroke="#243037" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

function BocceLeagueGraphic() {
  return (
    <svg viewBox="0 0 900 360" role="img">
      <rect width="900" height="360" fill="#579143" />
      <polygon points="0,118 576,0 900,0 900,276 0,276" fill="#e7b86f" />
      <polygon points="80,110 592,18 900,46 900,195 32,205" fill="#f6eec8" />
      <polygon points="80,110 592,18 900,46 888,66 118,152" fill="#6b4821" />
      <polygon points="32,205 900,195 900,276 0,276 0,118" fill="#cda66c" />
      <path d="M104 150 L594 45 L900 68" fill="none" stroke="#fff" strokeWidth="5" opacity="0.95" />
      <g fill="#ded5a6" opacity="0.55">
        <ellipse cx="678" cy="42" rx="45" ry="8" />
        <ellipse cx="802" cy="72" rx="34" ry="7" />
        <ellipse cx="731" cy="118" rx="52" ry="8" />
        <ellipse cx="864" cy="121" rx="43" ry="8" />
      </g>
      <g>
        <circle cx="500" cy="101" r="27" fill="#f4f5f4" />
        <path d="M475 94 C493 111 512 113 527 96" fill="none" stroke="#d4d8d6" strokeWidth="6" />
        <ellipse cx="500" cy="129" rx="30" ry="8" fill="#c8b987" opacity="0.36" />
      </g>
      <g transform="translate(650 58)">
        <circle cx="0" cy="0" r="52" fill="#7775bd" />
        <path d="M-43 -16 C-20 -5 17 3 44 4" fill="none" stroke="#f5e18b" strokeWidth="7" />
        <path d="M-46 12 C-17 21 17 25 45 20" fill="none" stroke="#f5e18b" strokeWidth="7" />
        <path d="M-10 -49 C9 -21 18 10 11 50" fill="none" stroke="#f5e18b" strokeWidth="7" />
        <path d="M24 -45 C39 -18 43 10 30 42" fill="none" stroke="#f5e18b" strokeWidth="7" />
        <path d="M-33 -36 C-5 -14 19 -3 48 -5" fill="none" stroke="#fff" strokeWidth="5" opacity="0.85" />
      </g>
      <g transform="translate(704 183)">
        <circle cx="0" cy="0" r="80" fill="#d91b2b" />
        <path d="M-69 -20 C-31 7 19 20 74 17" fill="none" stroke="#f4e48b" strokeWidth="9" />
        <path d="M-53 -55 C-15 -18 22 15 54 53" fill="none" stroke="#f4e48b" strokeWidth="9" />
        <path d="M-7 -78 C12 -34 15 14 1 78" fill="none" stroke="#f4e48b" strokeWidth="9" />
        <path d="M-47 22 C-18 35 22 43 61 37" fill="none" stroke="#fff" strokeWidth="7" opacity="0.92" />
      </g>
      <g transform="translate(880 12)">
        <circle cx="0" cy="0" r="55" fill="#d91b2b" />
        <path d="M-48 -14 C-18 -4 17 3 49 0" fill="none" stroke="#f4e48b" strokeWidth="7" />
        <path d="M-48 15 C-16 25 17 30 48 25" fill="none" stroke="#f4e48b" strokeWidth="7" />
        <path d="M-17 -52 C-5 -19 -3 15 -15 51" fill="none" stroke="#f4e48b" strokeWidth="7" />
        <path d="M18 -52 C29 -18 30 14 19 48" fill="none" stroke="#f4e48b" strokeWidth="7" />
      </g>
      <g fill="#6f9b35">
        {Array.from({ length: 42 }, (_, index) => (
          <path
            d={`M${index * 22 - 8} 276 L${index * 22 - 2} ${245 + (index % 5) * 5} L${index * 22 + 4} 276 Z`}
            key={index}
          />
        ))}
      </g>
      <g transform="translate(295 292)">
        <circle cx="0" cy="0" r="103" fill="#d91b2b" />
        <path d="M-86 -35 C-37 10 26 29 92 23" fill="none" stroke="#f4e48b" strokeWidth="12" />
        <path d="M-68 -83 C-21 -32 28 22 62 87" fill="none" stroke="#f4e48b" strokeWidth="12" />
        <path d="M-11 -101 C19 -43 26 22 8 103" fill="none" stroke="#f4e48b" strokeWidth="12" />
        <path d="M-90 5 C-50 34 13 49 76 45" fill="none" stroke="#fff" strokeWidth="10" opacity="0.94" />
        <path d="M-52 -91 C-6 -68 42 -56 88 -58" fill="none" stroke="#fff" strokeWidth="10" opacity="0.94" />
        <ellipse cx="-31" cy="92" rx="82" ry="19" fill="#9f1220" opacity="0.4" />
      </g>
    </svg>
  )
}

function BocceHome({ matches, teams, standings, setPage }) {
  const nextMatches = matches.filter((match) => match.status !== 'final').sort(bySchedule).slice(0, 3)
  const completedMatches = matches.filter((match) => match.status === 'final').length
  const leader = standings[0]

  return (
    <section className="stack bocce-page">
      <div className="bocce-hero">
        <div>
          <p className="eyebrow">HGBBL</p>
          <h1>2026 Bocce Ball League</h1>
          <p>Wednesday night matchups, team contacts, standings, and score approval.</p>
        </div>
      </div>
      <div className="quick-grid">
        <BigButton label="My Matches" onClick={() => setPage('bocce-my')} />
        <BigButton label="Standings" onClick={() => setPage('bocce-standings')} />
        <BigButton label="Schedule" onClick={() => setPage('bocce-schedule')} />
        <BigButton label="Rules" onClick={() => setPage('bocce-rules')} />
      </div>
      <div className="stat-grid">
        <Stat label="Teams" value={teams.length} />
        <Stat label="Matches" value={matches.length} />
        <Stat label="Final" value={completedMatches} />
      </div>
      <Card title="League Leader">
        <div className="mini-list">
          <p><strong>{leader?.team.name || 'No scores yet'}</strong><span>{leader?.gameWins || 0} game wins</span></p>
        </div>
      </Card>
      <Card title="Next Matches">
        <div className="card-list">
          {nextMatches.map((match) => <BocceMatchCard key={match.id} match={match} teams={teams} compact />)}
          {!nextMatches.length && <p className="empty">No upcoming bocce matches right now.</p>}
        </div>
      </Card>
    </section>
  )
}

function BocceMyMatches({ matches, teams, players, selectedPlayer, selectedTeam, selectedPlayerId, setSelectedPlayerId, standings, submitScore, markRescheduled }) {
  if (!selectedPlayer || !selectedTeam) {
    return (
      <section className="stack">
        <PageTitle eyebrow="No login needed" title="My Bocce Matches" />
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

  const row = standings.find((item) => item.team.id === selectedTeam.id)
  const allMyMatches = matches
    .filter((match) => match.teamA === selectedTeam.id || match.teamB === selectedTeam.id)
    .sort(bySchedule)
  const openMatches = allMyMatches.filter((match) => !isPlayedForPlayer(match))
  const playedMatches = allMyMatches.filter(isPlayedForPlayer).reverse()
  const nextMatch = openMatches[0]
  const otherOpenMatches = openMatches.slice(1)

  return (
    <section className="stack">
      <div className="profile-card bocce-profile-card">
        <div className="profile-top">
          <p>Continue as {selectedPlayer.first} {selectedPlayer.last}</p>
          <button type="button" onClick={() => setSelectedPlayerId('')}>Change player</button>
        </div>
        <h1>Team: {selectedTeam.name}</h1>
        <span>Wednesday Bocce League</span>
      </div>
      <div className="stat-grid">
        <Stat label="Record" value={`${row?.matchWins || 0}-${row?.matchLosses || 0}`} />
        <Stat label="Game Wins" value={row?.gameWins || 0} />
        <Stat label="Rank" value={row ? row.rankLabel : '-'} />
      </div>
      {nextMatch && (
        <button
          className="jump-button"
          type="button"
          onClick={() => document.getElementById('next-bocce-match')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          Go to Next Match
        </button>
      )}
      {nextMatch ? (
        <section className="priority-match" id="next-bocce-match">
          <p className="eyebrow">Next match</p>
          <BocceMatchCard
            match={nextMatch}
            teams={teams}
            players={players}
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
            <BocceMatchCard
              key={match.id}
              match={match}
              teams={teams}
              players={players}
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
            <BocceMatchCard key={match.id} match={match} teams={teams} players={players} viewerTeam={selectedTeam} />
          ))}
        </div>
      </details>
    </section>
  )
}

function BocceStandings({ standings }) {
  return (
    <section className="stack">
      <PageTitle title="Bocce Standings" />
      <section className="standings-grid bocce-standings-grid" aria-label="Bocce standings">
        <div className="standings-header">
          <span>Rank</span>
          <span>Team</span>
          <span>GW</span>
          <span>Match</span>
          <span>Pts</span>
        </div>
        {standings.map((row) => (
          <article className="standing-row" key={row.team.id}>
            <strong>{row.rankLabel}</strong>
            <span className="team-name">{row.team.name}</span>
            <span className="points">{row.gameWins}</span>
            <span>{row.matchWins}-{row.matchLosses}</span>
            <span>{row.points}</span>
          </article>
        ))}
      </section>
    </section>
  )
}

function BocceSchedule({ matches, teams, players }) {
  const [week, setWeek] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  const filtered = matches.filter((match) => week === 'All' || match.week === Number(week))

  return (
    <section className="stack">
      <PageTitle eyebrow="Wednesday nights" title="Bocce Schedule" />
      <div className="filters one-filter">
        <label className="field">Week<select value={week} onChange={(event) => setWeek(event.target.value)}><option>All</option>{weeks.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="card-list">
        {filtered.map((match) => <BocceMatchCard key={match.id} match={match} teams={teams} players={players} />)}
      </div>
    </section>
  )
}

function BocceRules() {
  return (
    <section className="stack">
      <PageTitle eyebrow="HGBBL" title="Bocce Rules" />
      <div className="rules-grid">
        {bocceRuleCards.map((rule) => (
          <article className="simple-card rule-card" key={rule.title}>
            <h2>{rule.title}</h2>
            <p>{rule.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function BocceMatchCard({ match, teams, players = [], viewerTeam, selectedPlayer, showContacts = false, submitScore, markRescheduled, compact = false }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const opponent = viewerTeam ? getTeam(teams, viewerTeam.id === match.teamA ? match.teamB : match.teamA) : null
  const status = boccePublicStatus(match)

  return (
    <article className="match-card bocce-match-card">
      <div className="match-head">
        <div>
          <p>Week {match.week} - {formatDate(match.date)} at {match.time}</p>
          <h2 className="match-title">
            {viewerTeam ? (
              <>
                <span>vs</span>
                <span>{opponent?.name || 'TBD'}</span>
              </>
            ) : (
              <>
                <span>{teamA?.name || 'TBD'}</span>
                <span>vs</span>
                <span>{teamB?.name || 'TBD'}</span>
              </>
            )}
          </h2>
          <span>Bocce court</span>
        </div>
        <StatusBadge status={status} />
      </div>
      {match.score && <p className="score-line">{formatBocceScore(match.score)}</p>}
      {!compact && showContacts && match.status !== 'final' && selectedPlayer && submitScore && markRescheduled && (
        <BocceMatchActions match={match} teams={teams} selectedPlayer={selectedPlayer} submitScore={submitScore} markRescheduled={markRescheduled} />
      )}
      {!compact && showContacts && (
        <BocceContactTools match={match} teams={teams} players={players} textOnly={Boolean(selectedPlayer)} />
      )}
    </article>
  )
}

function BocceContactTools({ match, teams = [], players, textOnly = false }) {
  const [copied, setCopied] = useState('')
  const matchPlayers = [...teamPlayers(players, match.teamA), ...teamPlayers(players, match.teamB)].filter(hasPlayerName)
  const contacts = matchPlayers.filter((player) => player.phone || player.email)

  async function copyText(text, label) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
  }

  if (textOnly) {
    const teamA = getTeam(teams, match.teamA) || { name: 'Team A' }
    const teamB = getTeam(teams, match.teamB) || { name: 'Team B' }
    const teamAPlayers = teamPlayers(players, match.teamA).filter(hasPlayerName)
    const teamBPlayers = teamPlayers(players, match.teamB).filter(hasPlayerName)

    return (
      <div className="contacts">
        <p className="helper-text">Tap any player to begin a text message</p>
        <div className="bocce-text-team-grid">
          {[{ team: teamA, players: teamAPlayers }, { team: teamB, players: teamBPlayers }].map((group) => (
            <div className="bocce-text-team" key={group.team.id || group.team.name}>
              <h3>{group.team.name}</h3>
              <div className="text-grid single-column">
                {group.players.map((player) => (
                  cleanPhone(player.phone)
                    ? <a key={player.id} href={`sms:${cleanPhone(player.phone)}`}>Text {player.first} {player.last}</a>
                    : <span className="text-disabled" key={player.id}>Text {player.first} {player.last}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="contacts bocce-contacts">
      <p className="helper-text">Public team contacts</p>
      <div className="bocce-contact-grid">
        {matchPlayers.map((player) => (
          <div className="bocce-contact-card" key={player.id}>
            <strong>{player.first} {player.last}</strong>
            {cleanPhone(player.phone)
              ? <a href={`sms:${cleanPhone(player.phone)}`}>{player.phone}</a>
              : <span className="text-disabled">No phone listed</span>}
            {player.email
              ? <a href={`mailto:${player.email}`}>{player.email}</a>
              : <span className="text-disabled">No email listed</span>}
          </div>
        ))}
      </div>
      <div className="single-button-row">
        <button type="button" onClick={() => copyText(contacts.map((player) => `${player.first} ${player.last}: ${player.phone || 'No phone'} ${player.email || 'No email'}`).join('\n'), 'Copied contacts.')}>Copy All Contacts</button>
      </div>
      {copied && <p className="helper-text">{copied}</p>}
    </div>
  )
}

function BocceMatchActions({ match, teams, selectedPlayer, submitScore, markRescheduled }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const [open, setOpen] = useState('')
  const [pin, setPin] = useState('')
  const [game1A, setGame1A] = useState(11)
  const [game1B, setGame1B] = useState(8)
  const [game2A, setGame2A] = useState(8)
  const [game2B, setGame2B] = useState(11)
  const [game3A, setGame3A] = useState(11)
  const [game3B, setGame3B] = useState(9)
  const [note, setNote] = useState('')
  const score = [[Number(game1A), Number(game1B)], [Number(game2A), Number(game2B)], [Number(game3A), Number(game3B)]]
  const errors = validateBocceScore(score)

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
          <div className="score-grid bocce-score-grid">
            <label>Game 1 {teamA?.name || 'Team A'}<input type="number" min="0" value={game1A} onChange={(event) => setGame1A(event.target.value)} /></label>
            <label>Game 1 {teamB?.name || 'Team B'}<input type="number" min="0" value={game1B} onChange={(event) => setGame1B(event.target.value)} /></label>
            <label>Game 2 {teamA?.name || 'Team A'}<input type="number" min="0" value={game2A} onChange={(event) => setGame2A(event.target.value)} /></label>
            <label>Game 2 {teamB?.name || 'Team B'}<input type="number" min="0" value={game2B} onChange={(event) => setGame2B(event.target.value)} /></label>
            <label>Game 3 {teamA?.name || 'Team A'}<input type="number" min="0" value={game3A} onChange={(event) => setGame3A(event.target.value)} /></label>
            <label>Game 3 {teamB?.name || 'Team B'}<input type="number" min="0" value={game3B} onChange={(event) => setGame3B(event.target.value)} /></label>
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
  const allMyItems = buildTeamScheduleItems(matches, selectedTeam)
  const openItems = allMyItems
    .filter((item) => !isPlayedScheduleItem(item))
  const playedMatches = allMyMatches
    .filter(isPlayedForPlayer)
    .reverse()
  const nextItem = openItems[0]
  const otherOpenItems = openItems.slice(1)

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
      {nextItem && (
        <button
          className="jump-button"
          type="button"
          onClick={() => document.getElementById('next-match')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          Go to Next Week
        </button>
      )}
      {nextItem ? (
        <section className="priority-match" id="next-match">
          <p className="eyebrow">{nextItem.type === 'bye' ? 'Bye week' : 'Next match'}</p>
          <MyScheduleItemCard
            item={nextItem}
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
      {otherOpenItems.length > 0 && (
        <div className="card-list">
          {otherOpenItems.map((item) => (
            <MyScheduleItemCard
              key={item.id}
              item={item}
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
      <PageTitle title="Standings" />
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

function ScoreSubmitted({ confirmation, setPage, homePage = 'home', myPage = 'my' }) {
  return (
    <section className="submitted-screen">
      <div className="submitted-card">
        <p className="eyebrow">Pending commissioner approval</p>
        <h1>Score Submitted</h1>
        <p>Your score was saved and sent to the admin queue. Standings will update after approval.</p>
        {confirmation?.at && <span>Submitted {new Date(confirmation.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
        <div className="submitted-actions">
          <button type="button" onClick={() => setPage(myPage)}>Back to My Matches</button>
          <button type="button" className="secondary" onClick={() => setPage(homePage)}>Back to Home</button>
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
        <PaymentTracker
          teams={teams}
          updateTeam={updateTeam}
          updatePaymentStatus={updateTeamPaymentStatus}
        />
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

function BocceAdmin({
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
        <PageTitle eyebrow="Bocce commissioner tools" title="Admin" />
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
        <PageTitle eyebrow="Bocce commissioner tools" title="Admin" />
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
      <Segmented options={['Scores', 'Roster', 'Schedule', 'Snapshots', 'Audit']} value={tab} onChange={setTab} />
      {tab === 'Scores' && (
        <Card title="Pending Bocce Scores">
          {pending.length === 0 && <p className="empty">No pending bocce scores.</p>}
          <div className="card-list">
            {pending.map((match) => (
              <article className="simple-card" key={match.id}>
                <p>Week {match.week} - {matchTitle(match, teams)}</p>
                <h2>{formatBocceScore(match.score)}</h2>
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
        <BocceRosterEditor teams={teams} players={players} updateTeam={updateTeam} updatePlayer={updatePlayer} />
      )}
      {tab === 'Schedule' && (
        <BocceScheduleEditor matches={matches} teams={teams} updateMatch={updateMatch} regenerateSchedule={regenerateSchedule} />
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
            {audit.map((item) => <BocceAuditEntry key={item.id} item={item} matches={matches} teams={teams} players={players} />)}
          </div>
        </Card>
      )}
    </section>
  )
}

function BocceRosterEditor({ teams, players, updateTeam, updatePlayer }) {
  return (
    <Card title="Bocce Teams and Public Contacts">
      <p className="empty">Phone numbers and emails appear on public bocce match pages.</p>
      <div className="card-list">
        {[...teams].sort((a, b) => a.number - b.number).map((team) => {
          const teamPlayers = players.filter((player) => player.teamId === team.id)
          return (
            <article className="simple-card admin-team-card" key={team.id}>
              <div className="admin-team-head bocce-admin-team-head">
                <label className="field">
                  Team #
                  <input
                    type="number"
                    min="1"
                    value={team.number}
                    onChange={(event) => updateTeam(team.id, { number: Number(event.target.value) })}
                  />
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
                    <label className="field">Phone<input value={player.phone || ''} onChange={(event) => updatePlayer(player.id, { phone: event.target.value })} /></label>
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

function BocceScheduleEditor({ matches, teams, updateMatch, regenerateSchedule }) {
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  return (
    <Card title="Bocce Schedule Editor">
      <button type="button" onClick={regenerateSchedule}>Regenerate Round Robin</button>
      <p className="helper-text">Regenerating replaces bocce matches with a five-week Wednesday round robin.</p>
      <div className="card-list">
        {weeks.map((week) => (
          <section className="schedule-week" key={week}>
            <h3>Week {week}</h3>
            {matches.filter((match) => match.week === week).sort(bySchedule).map((match) => (
              <article className="simple-card admin-match-card" key={match.id}>
                <div className="admin-match-grid">
                  <label className="field">Date<input value={match.date} onChange={(event) => updateMatch(match.id, { date: event.target.value })} /></label>
                  <label className="field">Time<input value={match.time} onChange={(event) => updateMatch(match.id, { time: event.target.value })} /></label>
                  <label className="field">Status<select value={match.status} onChange={(event) => updateMatch(match.id, { status: event.target.value })}>{['scheduled', 'rescheduled', 'pending', 'final'].map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="field">Team A<select value={match.teamA} onChange={(event) => updateMatch(match.id, { teamA: event.target.value })}>{teams.map((team) => <option key={team.id} value={team.id}>{team.number}. {team.name}</option>)}</select></label>
                  <label className="field">Team B<select value={match.teamB} onChange={(event) => updateMatch(match.id, { teamB: event.target.value })}>{teams.map((team) => <option key={team.id} value={team.id}>{team.number}. {team.name}</option>)}</select></label>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </Card>
  )
}

function BocceAuditEntry({ item, matches, teams, players }) {
  const match = matches.find((entry) => entry.id === item.details?.matchId)
  const actor = item.details?.submittedBy ? playerName(players, item.details.submittedBy) : 'Commissioner'

  if (item.action === 'score_submitted' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} submitted a bocce score</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
        <p>{formatBocceScore(item.details.score)}</p>
      </article>
    )
  }

  if (item.action === 'match_rescheduled' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} marked a bocce match rescheduled</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
        <p>{item.details.note || 'No note provided.'}</p>
      </article>
    )
  }

  return (
    <article className="simple-card audit-entry">
      <p>{new Date(item.at).toLocaleString()}</p>
      <h2>{item.action.replaceAll('_', ' ')}</h2>
      {match && <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>}
    </article>
  )
}

function PaymentTracker({ teams = [], updateTeam, updatePaymentStatus }) {
  const [paymentSearch, setPaymentSearch] = useState('')
  const safeTeams = Array.isArray(teams) ? teams.filter(Boolean) : []
  const sortedTeams = [...safeTeams].sort((a, b) => Number(a?.number || 0) - Number(b?.number || 0))
  const paidCount = sortedTeams.filter((team) => Boolean(team?.paid)).length
  const searchTerm = paymentSearch.trim().toLowerCase()
  const matchesSearch = (team) => {
    if (!searchTerm) return true
    return [
      team?.name,
      team?.flight,
      team?.number,
      team?.paymentNote,
    ].some((value) => String(value || '').toLowerCase().includes(searchTerm))
  }
  const unpaidTeams = sortedTeams.filter((team) => !team?.paid && matchesSearch(team))
  const paidTeams = sortedTeams.filter((team) => team?.paid && matchesSearch(team))
  const visibleCount = unpaidTeams.length + paidTeams.length

  const renderPaymentRow = (team) => (
    <article className={`payment-row ${team?.paid ? 'paid' : ''}`} key={String(team?.id || team?.number || team?.name)}>
      <div>
        <p>Team {String(team?.number || '')} - {String(team?.flight || '')} Band</p>
        <h2>{String(team?.name || 'Unnamed team')}</h2>
      </div>
      <label className="payment-toggle">
        <input
          type="checkbox"
          checked={Boolean(team?.paid)}
          onChange={(event) => {
            if (updatePaymentStatus) {
              updatePaymentStatus(team.id, event.target.checked)
            } else if (updateTeam) {
              updateTeam(team.id, { paid: event.target.checked })
            }
          }}
        />
        Paid
      </label>
      <label className="field payment-note">
        Note
        <input
          value={String(team?.paymentNote || '')}
          placeholder="Check, Venmo, cash, etc."
          onChange={(event) => updateTeam?.(team?.id, { paymentNote: event.target.value })}
        />
      </label>
    </article>
  )

  return (
    <Card title="Registration Payments">
      <p className="helper-text">Players use the Square payment link from My Matches. After the payment appears, mark the team as paid here. Already paid teams are placed in the paid section below.</p>
      <div className="payment-summary">
        <Stat label="Paid" value={paidCount} />
        <Stat label="Unpaid" value={sortedTeams.length - paidCount} />
        <Stat label="Teams" value={sortedTeams.length} />
      </div>
      <label className="field payment-search">
        Search payments
        <input
          value={paymentSearch}
          placeholder="Team, flight, number, or note"
          onChange={(event) => setPaymentSearch(event.target.value)}
        />
      </label>
      <div className="card-list">
        {unpaidTeams.map(renderPaymentRow)}
        {!visibleCount && <p className="empty">No teams match that search.</p>}
      </div>
      <details className="paid-section">
        <summary>
          <span>Already Paid</span>
          <strong>{paidTeams.length}</strong>
        </summary>
        <div className="card-list">
          {paidTeams.map(renderPaymentRow)}
          {!paidTeams.length && <p className="empty">{searchTerm ? 'No paid teams match that search.' : 'No teams have been marked paid yet.'}</p>}
        </div>
      </details>
    </Card>
  )
}

function PaymentAuditEntry({ item }) {
  const markedPaid = item.action === 'payment_marked_paid'
  const details = item.details || {}
  const teamNumber = details.teamNumber ? String(details.teamNumber) : ''
  const teamLabel = details.teamName ? String(details.teamName) : (teamNumber ? `Team ${teamNumber}` : 'Unknown team')
  const teamMeta = [
    teamNumber ? `Team ${teamNumber}` : '',
    details.flight ? `${String(details.flight)} Band` : '',
  ].filter(Boolean).join(' - ')

  return (
    <article className="simple-card audit-entry payment-audit-entry">
      <p>{new Date(item.at).toLocaleString()}</p>
      <h2>{markedPaid ? 'Marked paid' : 'Unmarked paid'}</h2>
      <p>{teamLabel}{teamMeta ? ` - ${teamMeta}` : ''}</p>
    </article>
  )
}

function PaymentCallout() {
  return (
    <section className="payment-callout" aria-label="League payment">
      <div>
        <p className="eyebrow payment-needed-label">Payment needed</p>
        <h2>Submit your league payment</h2>
        <p>League dues are $10 per team. The commissioner will mark your team paid after the Square payment comes through.</p>
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

  if (item.action === 'payment_marked_paid' || item.action === 'payment_unmarked_paid') {
    return <PaymentAuditEntry item={item} />
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

function MyScheduleItemCard({ item, teams, players, viewerTeam, selectedPlayer, submitScore, markRescheduled }) {
  if (item.type === 'bye') return <ByeCard item={item} team={viewerTeam} />

  return (
    <MatchCard
      match={item.match}
      teams={teams}
      players={players}
      viewerTeam={viewerTeam}
      selectedPlayer={selectedPlayer}
      submitScore={submitScore}
      markRescheduled={markRescheduled}
      showContacts
      showPaymentWarnings={false}
    />
  )
}

function ByeCard({ item, team }) {
  return (
    <article className="bye-card">
      <div>
        <p>Week {item.week} - {formatDate(item.date)}</p>
        <h2>Bye Week</h2>
      </div>
      <span>{team?.name || 'Your team'} has no match scheduled.</span>
    </article>
  )
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
        <ContactTools match={match} teams={teams} players={players} selectedPlayer={selectedPlayer} />
      )}
    </article>
  )
}

function ContactTools({ match, teams, players, selectedPlayer }) {
  const [copied, setCopied] = useState('')
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const teamAPlayers = teamPlayers(players, match.teamA).filter(hasPlayerName)
  const teamBPlayers = teamPlayers(players, match.teamB).filter(hasPlayerName)
  const numbers = [...teamAPlayers, ...teamBPlayers].map((player) => player.phone).filter(Boolean)

  async function copyText(text, label) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
  }

  return (
    <div className="contacts">
      <p className="helper-text">Tap any player to begin a text message</p>
      <div className="team-text-grid">
        {[{ team: teamA, players: teamAPlayers }, { team: teamB, players: teamBPlayers }].map((group) => (
          <div className="team-text-column" key={group.team?.id || group.team?.name}>
            <h3>{group.team?.name || 'Team'}</h3>
            <div className="text-grid single-column">
              {group.players.map((player) => (
                cleanPhone(player.phone)
                  ? <a key={player.id} href={`sms:${cleanPhone(player.phone)}`}>Text {player.first} {player.last}</a>
                  : <span className="text-disabled" key={player.id}>Text {player.first} {player.last}</span>
              ))}
            </div>
          </div>
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
    const rounds = flightTeams.length === 9 ? buildPreservedNineTeamRounds(flightTeams) : buildRoundRobinRounds(flightTeams)

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

function buildPreservedNineTeamRounds(teams) {
  const pattern = [
    [[0, 7], [1, 6], [2, 5], [3, 4]],
    [[8, 0], [7, 5], [1, 4], [2, 3]],
    [[8, 5], [6, 4], [7, 3], [1, 2]],
    [[8, 3], [0, 4], [6, 2], [7, 1]],
    [[8, 4], [0, 3], [5, 1], [6, 7]],
    [[8, 1], [0, 2], [4, 7], [5, 6]],
    [[8, 2], [0, 1], [3, 6], [4, 5]],
    [[8, 6], [0, 5], [1, 3], [2, 7]],
    [[8, 7], [0, 6], [5, 3], [4, 2]],
  ]

  return pattern.map((round) => round.map(([teamA, teamB]) => [teams[teamA], teams[teamB]]))
}

function createBocceSchedule(teams) {
  const start = new Date('2026-06-24T12:00:00')
  const matches = []
  const rounds = buildRoundRobinRounds([...teams].sort((a, b) => a.number - b.number))

  rounds.forEach((round, roundIndex) => {
    const date = addDays(start, roundIndex * 7)

    round.forEach(([teamA, teamB], matchIndex) => {
      matches.push({
        id: `bocce-${roundIndex + 1}-${matchIndex + 1}`,
        week: roundIndex + 1,
        date: ymd(date),
        time: bocceTimes[matchIndex % bocceTimes.length],
        teamA: teamA.id,
        teamB: teamB.id,
        status: 'scheduled',
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

function buildBocceStandings(matches, teams) {
  const rows = teams.map((team) => ({ team, points: 0, matchWins: 0, matchLosses: 0, gameWins: 0, gameLosses: 0, diff: 0, played: 0 }))

  matches.filter((match) => match.status === 'final' && match.score).forEach((match) => {
    const a = rows.find((row) => row.team.id === match.teamA)
    const b = rows.find((row) => row.team.id === match.teamB)
    if (!a || !b) return

    const aPoints = match.score.reduce((total, game) => total + Number(game[0] || 0), 0)
    const bPoints = match.score.reduce((total, game) => total + Number(game[1] || 0), 0)
    const aGames = match.score.filter((game) => Number(game[0]) > Number(game[1])).length
    const bGames = match.score.length - aGames

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

  const sortedRows = rows.sort((a, b) =>
    b.gameWins - a.gameWins ||
    b.matchWins - a.matchWins ||
    b.points - a.points ||
    b.diff - a.diff ||
    a.team.name.localeCompare(b.team.name),
  )

  return withBocceRankLabels(sortedRows)
}

function withRankLabels(rows) {
  return rows.map((row, index) => {
    const rank = rows.findIndex((item) => item.points === row.points) + 1
    const isTied = rows.filter((item) => item.points === row.points).length > 1
    return { ...row, rank, rankLabel: isTied ? `T-${rank}` : String(rank) }
  })
}

function withBocceRankLabels(rows) {
  return rows.map((row) => {
    const rank = rows.findIndex((item) =>
      item.gameWins === row.gameWins &&
      item.matchWins === row.matchWins &&
      item.points === row.points &&
      item.diff === row.diff,
    ) + 1
    const isTied = rows.filter((item) =>
      item.gameWins === row.gameWins &&
      item.matchWins === row.matchWins &&
      item.points === row.points &&
      item.diff === row.diff,
    ).length > 1
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

function validateBocceScore(score) {
  if (score.length !== 3) return ['Bocce matches must include exactly 3 game scores.']

  return score.map((game, index) => {
    const a = Number(game[0])
    const b = Number(game[1])
    const winner = Math.max(a, b)
    const margin = Math.abs(a - b)

    if (Number.isNaN(a) || Number.isNaN(b)) return `Game ${index + 1}: both scores are required.`
    if (a < 0 || b < 0) return `Game ${index + 1}: scores cannot be negative.`
    if (a === b) return `Game ${index + 1}: each game must have a winner.`
    if (winner < 11) return `Game ${index + 1}: winner must score at least 11.`
    if (margin < 2) return `Game ${index + 1}: winner must win by at least 2.`
    return ''
  }).filter(Boolean)
}

function isOverdue(match) {
  return new Date(`${match.date}T23:59:59`) < new Date('2026-06-10T12:00:00') && !['final', 'pending'].includes(match.status)
}

function isPlayedForPlayer(match) {
  return (match.status === 'final' || match.status === 'pending') && !isOverdue(match)
}

function buildTeamScheduleItems(matches, team) {
  const flightMatches = matches.filter((match) => match.flight === team.flight)
  const weeks = [...new Set(flightMatches.map((match) => match.week))].sort((a, b) => a - b)

  return weeks.map((week) => {
    const weekMatches = flightMatches.filter((match) => match.week === week)
    const match = weekMatches.find((item) => item.teamA === team.id || item.teamB === team.id)
    if (match) return { id: match.id, type: 'match', week, date: match.date, time: match.time, match }

    const sample = weekMatches[0]
    return {
      id: `bye-${team.id}-${week}`,
      type: 'bye',
      week,
      date: sample?.date || '',
      time: '12:00 PM',
    }
  }).filter((item) => item.type === 'match' || item.date).sort(byScheduleItem)
}

function isPlayedScheduleItem(item) {
  if (item.type === 'match') return isPlayedForPlayer(item.match)
  return new Date(`${item.date}T23:59:59`) < new Date()
}

function bySchedule(a, b) {
  return scheduleTime(a) - scheduleTime(b)
}

function byScheduleItem(a, b) {
  return scheduleItemTime(a) - scheduleItemTime(b)
}

function scheduleTime(match) {
  return new Date(`${match.date} ${match.time}`).getTime()
}

function scheduleItemTime(item) {
  return new Date(`${item.date} ${item.time}`).getTime()
}

function publicStatus(match) {
  if (match.status === 'rescheduled') return 'Pending reschedule'
  if (isOverdue(match)) return 'Score needed or makeup required'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'final') return 'Final'
  return 'Scheduled'
}

function boccePublicStatus(match) {
  if (match.status === 'rescheduled') return 'Pending reschedule'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'final') return 'Final'
  if (new Date(`${match.date}T23:59:59`) < new Date()) return 'Score needed or makeup required'
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

function formatBocceScore(score) {
  return score ? score.map((game) => `${game[0]}-${game[1]}`).join(', ') : ''
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
  return String(phone || '').replace(/\D/g, '')
}

function BigButton({ label, onClick }) {
  return <button className="big-button" type="button" onClick={onClick}>{label}</button>
}

function Card({ title, children }) {
  return <section className="card"><h2>{title}</h2>{children}</section>
}

function PageTitle({ eyebrow, title }) {
  return <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1 className="page-title">{title}</h1></div>
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
