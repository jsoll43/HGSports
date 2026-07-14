import { useEffect, useMemo, useRef, useState } from 'react'

const PIN = 'glen'
const ADMIN_PASSWORD = 'glenadmin'
const PAYMENT_LINK = 'https://square.link/u/6oHmgu9w'
const SPORTS_STORAGE_KEY = 'hg-sports-data'
const CORNHOLE_STORAGE_KEY = 'cornhole'
const BOCCE_STORAGE_KEY = 'bocce'
const CORNHOLE_PLAYER_STORAGE_KEY = 'hg-cornhole-selected-player'
const BOCCE_PLAYER_STORAGE_KEY = 'hg-bocce-selected-player'
const CORNHOLE_SCHEDULE_VERSION = '2026-28-team-v2'
const CLOUD_POLL_MS = 8000
const LEGACY_STORAGE_KEYS = ['hg-cornhole-2026-data']
const LEGACY_STORAGE_PREFIXES = ['hg-2026-v4']

const flights = ['Green', 'Red', 'White']
const matchStatuses = ['scheduled', 'rescheduled', 'pending', 'final']
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
  { id: 'team-28', flight: 'White', number: 28, name: 'Dimeo / Haslam', paid: false, paymentNote: '' },
]

const initialPlayers = [
  { id: 'player-1a', first: 'Matthew', last: 'Tronco', phone: '6092029539', email: 'matthewtronco@yahoo.com', teamId: 'team-1' },
  { id: 'player-1b', first: 'Jon', last: 'Soll', phone: '6092302432', email: 'jsoll43@gmail.com', teamId: 'team-1' },
  { id: 'player-2a', first: 'Mike', last: 'Gatti', phone: '6096347552', email: 'm.gatti3@gmail.com', teamId: 'team-2' },
  { id: 'player-2b', first: 'John', last: 'Hourani', phone: '8562619462', email: 'jhourani@comcast.net', teamId: 'team-2' },
  { id: 'player-3a', first: 'Michael', last: 'Brody', phone: '609-556-9824', email: 'mbrody31@gmail.com', teamId: 'team-3' },
  { id: 'player-3b', first: 'Keith', last: 'Van Leeuwen', phone: '302-723-9449', email: 'Keith.vanleeuwen@gmail.com', teamId: 'team-3' },
  { id: 'player-4a', first: 'Brian', last: 'Kemner', phone: '856-261-3784', email: 'bkemner11@msn.com', teamId: 'team-4' },
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
  { id: 'player-28a', first: 'Michael', last: 'Dimeo', phone: '609-605-0278', email: 'Maddimeo@gmail.com', teamId: 'team-28' },
  { id: 'player-28b', first: 'Brendan', last: 'Haslam', phone: '215-528-3555', email: 'Brendan.Haslam@gmail.com', teamId: 'team-28' },
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

const cornholeRuleSections = [
  {
    title: 'League Rules and Regulations',
    items: [
      'All league members will follow and be subject to the Haddon Glen Swim Club bylaws, rules, and regulations.',
      'The league is managed by a committee approved by the Haddon Glen Board and must include a Haddon Glen executive board member.',
      'The committee can make league determinations and may remove a team for inability to comply with club or league rules, non-participation, unsportsmanlike behavior, or related issues.',
      'Children present while a guardian participates in a match must be supervised by their family according to Haddon Glen Swim Club bylaws and membership agreement.',
      'Pool use can only occur during swim club hours.',
    ],
  },
  {
    title: 'Teams',
    items: [
      'Teams are two adult Haddon Glen members who register for the league and pay the season sign-up fee as determined by the board.',
      'Team members cannot be interchanged or subbed out over the course of the season.',
      'Registered teams continue to be invited to return the following season pending annual approval of the league committee and continued eligibility.',
      'If one team member does not return, the returning player with a new partner is considered a new team. Original standings cannot be held, and a new spot cannot be guaranteed.',
    ],
  },
  {
    title: 'League Flights',
    items: [
      'Each season is divided into three flights: Green Band (top), Red Band (competitive), and White Band (co-ed for the 2026 season).',
      'The following season, flights can be reconfigured for returning and new teams based on prior results, team requests, and board determination.',
    ],
  },
  {
    title: 'Match-Ups and Scheduling',
    items: [
      'A match consists of two games to 21 points.',
      'After the match is concluded, teams report the score using the method announced for that season.',
      'There are 5 courts: 1 cement court and 4 HG wooden board courts.',
      'One set of boards is available per time slot for make-up matches.',
      'Teams will use bags provided by the league.',
      'Teams with the first match time are requested to help set up the playing areas.',
      'Teams with the last match time are requested to help break down the playing areas.',
    ],
  },
  {
    title: 'Rescheduling',
    items: [
      'Teams will be provided with a league schedule and league member contact list.',
      'If a team cannot make its weekly match-up, that team is responsible for communicating with its opponent and agreeing to a rescheduled date.',
      'Rescheduled match-ups must take place at Haddon Glen for the results to be recorded.',
    ],
  },
  {
    title: 'Haddon Glen Board Spacing',
    items: [
      'Green and Red Band cornhole boards will be spaced 27 feet apart.',
      'White Band cornhole boards will be spaced 24 feet apart.',
    ],
  },
  {
    title: 'Cornhole Rules',
    items: [
      'Cornhole is played with two teams of two players.',
      'Players pitch bags underhand from the pitcher box next to each side of the board.',
      'Players alternate turns tossing bags toward the opposite board.',
      'After each team has pitched four bags, players take score and resume pitching to the opposite board.',
      'First throw is determined by verbal agreement, rock/paper/scissors, or coin flip.',
      'The team that scored points in the previous inning throws first in the next inning. If the inning was tied, the team that went first in the last inning goes first again.',
    ],
  },
  {
    title: 'Scoring and Winning',
    items: [
      'A bag through the hole is worth 3 points.',
      'A bag that lands on the board and stays there is worth 1 point.',
      'A bag that lands on the ground or bounces onto the board is worth 0 points.',
      'Cancellation scoring applies: only one team can score points per inning. The higher score cancels out the opposing team in that inning.',
      'The first player or team to reach 21 points at the conclusion of an inning wins the game.',
    ],
  },
  {
    title: 'Terminology',
    items: [
      'Foul bags are bags designated as foul due to a rules violation. They are worth 0 points.',
      'Dead bags are bags that contact the court or ground before coming to rest on the board, or bags that strike a previously defined object such as a tree limb, wire, or indoor court ceiling. They are worth 0 points.',
    ],
  },
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

function readLocalPlayerId(key, fallback = '') {
  try {
    const playerId = localStorage.getItem(key)
    return playerId === null ? fallback : playerId
  } catch {
    return fallback
  }
}

function saveLocalPlayerId(key, playerId) {
  try {
    if (playerId) localStorage.setItem(key, playerId)
    else localStorage.removeItem(key)
  } catch {
    // The selection still works for this visit when browser storage is unavailable.
  }
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
  const audit = Array.isArray(data.audit) ? data.audit : []
  const matches = shouldRegenerateSchedule
    ? migrateSeasonSchedule(data.matches, teams)
    : Array.isArray(data.matches) ? data.matches : createSeasonSchedule(teams)

  return {
    selectedPlayerId: typeof data.selectedPlayerId === 'string' ? data.selectedPlayerId : '',
    teams,
    players,
    matches: restoreScoredMatchesFromAudit(matches, audit),
    audit,
    snapshots: Array.isArray(data.snapshots) ? data.snapshots : [],
    scheduleVersion: CORNHOLE_SCHEDULE_VERSION,
  }
}

function normalizeBocceData(data = {}) {
  const teams = migrateBocceTeams(Array.isArray(data?.teams) ? data.teams : initialBocceTeams)
  const players = Array.isArray(data?.players) ? data.players : initialBoccePlayers
  const audit = Array.isArray(data?.audit) ? data.audit : []
  const matches = Array.isArray(data?.matches) ? data.matches : createBocceSchedule(teams)

  return {
    selectedPlayerId: typeof data?.selectedPlayerId === 'string' ? data.selectedPlayerId : '',
    teams,
    players,
    matches: restoreScoredMatchesFromAudit(matches, audit),
    audit,
    snapshots: Array.isArray(data?.snapshots) ? data.snapshots : [],
  }
}

function restoreScoredMatchesFromAudit(matches, audit) {
  const scoreEvents = buildScoreEventsByMatch(audit)
  if (scoreEvents.size === 0) return matches

  return matches.map((match) => {
    const event = scoreEvents.get(match.id)
    if (event?.status === 'rejected') {
      return {
        ...match,
        status: match.status === 'final' || match.status === 'pending' ? 'scheduled' : match.status,
        score: undefined,
        submittedBy: undefined,
        submittedAt: undefined,
        approvedAt: undefined,
      }
    }
    if (!event?.score) return match

    if (event.status === 'final') {
      return {
        ...match,
        status: 'final',
        score: event.score,
        submittedBy: match.submittedBy || event.submittedBy,
        submittedAt: match.submittedAt || event.submittedAt,
        approvedAt: match.approvedAt || event.approvedAt,
        draftScore: undefined,
        draftGameSavedAt: undefined,
        draftUpdatedAt: undefined,
        draftSavedBy: undefined,
      }
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
    return existing ? { ...team, ...existing } : team
  })
}

function migrateRosterPlayers(players) {
  const existingById = new Map(players.map((player) => [player.id, player]))

  return initialPlayers.map((player) => {
    const existing = existingById.get(player.id)
    const merged = existing ? { ...player, ...existing } : player

    // Correct the previously seeded typo without overwriting later admin edits.
    if (player.id === 'player-4a' && String(merged.phone || '').replace(/\D/g, '') === '8562613748') {
      return { ...merged, phone: player.phone }
    }

    return merged
  })
}

function migrateSeasonSchedule(matches, teams) {
  const generatedMatches = createSeasonSchedule(teams)
  if (!Array.isArray(matches)) return generatedMatches

  const existingById = new Map(matches.map((match) => [match.id, match]))
  return generatedMatches.map((match) => existingById.get(match.id) || match).sort(bySchedule)
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
  const [selectedPlayerId, setSelectedPlayerId] = useState(() => readLocalPlayerId(CORNHOLE_PLAYER_STORAGE_KEY, storedData.selectedPlayerId))
  const [teams, setTeams] = useState(storedData.teams)
  const [players, setPlayers] = useState(storedData.players)
  const [matches, setMatches] = useState(storedData.matches)
  const [audit, setAudit] = useState(storedData.audit)
  const [snapshots, setSnapshots] = useState(storedData.snapshots)
  const [selectedBoccePlayerId, setSelectedBoccePlayerId] = useState(() => readLocalPlayerId(BOCCE_PLAYER_STORAGE_KEY, storedBocceData.selectedPlayerId))
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
      teams,
      players,
      matches,
      audit,
      snapshots,
      scheduleVersion: CORNHOLE_SCHEDULE_VERSION,
    },
    [BOCCE_STORAGE_KEY]: {
      teams: bocceTeams,
      players: boccePlayers,
      matches: bocceMatches,
      audit: bocceAudit,
      snapshots: bocceSnapshots,
    },
  }), [teams, players, matches, audit, snapshots, bocceTeams, boccePlayers, bocceMatches, bocceAudit, bocceSnapshots])

  function applySportsData(sportsData) {
    const normalized = normalizeSportsData(sportsData)
    const cornhole = normalized[CORNHOLE_STORAGE_KEY]
    const bocce = normalized[BOCCE_STORAGE_KEY]

    setTeams(cornhole.teams)
    setPlayers(cornhole.players)
    setMatches(cornhole.matches)
    setAudit(cornhole.audit)
    setSnapshots(cornhole.snapshots)
    setBocceTeams(bocce.teams)
    setBoccePlayers(bocce.players)
    setBocceMatches(bocce.matches)
    setBocceAudit(bocce.audit)
    setBocceSnapshots(bocce.snapshots)
  }

  useEffect(() => {
    saveLocalPlayerId(CORNHOLE_PLAYER_STORAGE_KEY, selectedPlayerId)
  }, [selectedPlayerId])

  useEffect(() => {
    saveLocalPlayerId(BOCCE_PLAYER_STORAGE_KEY, selectedBoccePlayerId)
  }, [selectedBoccePlayerId])

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
  const showCornholeNav = ['home', 'my', 'standings', 'schedule', 'rules', 'trophy', 'submitted'].includes(page)
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
    const submittedAt = new Date().toISOString()
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? {
              ...match,
              status: 'final',
              score,
              submittedBy,
              submittedAt,
              approvedAt: submittedAt,
              draftScore: null,
              draftGameSavedAt: null,
              draftUpdatedAt: null,
              draftSavedBy: null,
            }
          : match,
      ),
    )
    log('score_submitted', { matchId, submittedBy, score, autoApproved: true, approvedAt: submittedAt })
    setSubmissionConfirmation({ matchId, at: submittedAt })
    setPage('submitted')
  }

  function saveScoreGame(matchId, gameIndex, gameScore, savedBy) {
    const savedAt = new Date().toISOString()
    setMatches((items) =>
      items.map((match) => {
        if (match.id !== matchId) return match
        const draftScore = Array.isArray(match.draftScore) ? [...match.draftScore] : []
        const draftGameSavedAt = Array.isArray(match.draftGameSavedAt) ? [...match.draftGameSavedAt] : []
        draftScore[gameIndex] = gameScore
        draftGameSavedAt[gameIndex] = savedAt
        return { ...match, draftScore, draftGameSavedAt, draftUpdatedAt: savedAt, draftSavedBy: savedBy }
      }),
    )
    log('score_game_saved', { matchId, game: gameIndex + 1, savedBy, score: gameScore })
  }

  function unsaveScoreGame(matchId, gameIndex, savedBy) {
    const savedAt = new Date().toISOString()
    setMatches((items) =>
      items.map((match) => {
        if (match.id !== matchId) return match
        const draftScore = Array.isArray(match.draftScore) ? [...match.draftScore] : []
        const draftGameSavedAt = Array.isArray(match.draftGameSavedAt) ? [...match.draftGameSavedAt] : []
        draftScore[gameIndex] = undefined
        draftGameSavedAt[gameIndex] = undefined
        const hasSavedGame = draftScore.some((game) => Array.isArray(game))
        return {
          ...match,
          draftScore: hasSavedGame ? draftScore : null,
          draftGameSavedAt: hasSavedGame ? draftGameSavedAt : null,
          draftUpdatedAt: hasSavedGame ? savedAt : null,
          draftSavedBy: hasSavedGame ? savedBy : null,
        }
      }),
    )
    log('score_game_unsaved', { matchId, game: gameIndex + 1, savedBy })
  }

  function markRescheduled(matchId, submittedBy) {
    const match = matches.find((item) => item.id === matchId)
    const undo = match?.status === 'rescheduled'
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? undo
            ? {
                ...match,
                status: match.statusBeforeReschedule || 'scheduled',
                statusBeforeReschedule: undefined,
                rescheduleNote: undefined,
                rescheduledBy: undefined,
                rescheduledAt: undefined,
              }
            : {
                ...match,
                status: 'rescheduled',
                statusBeforeReschedule: match.status,
                rescheduleNote: undefined,
                rescheduledBy: submittedBy,
                rescheduledAt: new Date().toISOString(),
              }
          : match,
      ),
    )
    log(undo ? 'match_reschedule_undone' : 'match_rescheduled', { matchId, submittedBy })
  }

  function approveScore(matchId) {
    const match = matches.find((item) => item.id === matchId)
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'final', approvedAt: new Date().toISOString() } : match,
      ),
    )
    log('score_approved', { matchId, score: match?.score })
  }

  function rejectScore(matchId) {
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? { ...match, status: 'scheduled', score: undefined, submittedBy: undefined, submittedAt: undefined, approvedAt: undefined }
          : match,
      ),
    )
    log('score_rejected', { matchId })
  }

  function correctScore(matchId, score) {
    const match = matches.find((item) => item.id === matchId)
    setMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? {
              ...match,
              score,
              draftScore: null,
              draftGameSavedAt: null,
              draftUpdatedAt: null,
              draftSavedBy: null,
            }
          : match,
      ),
    )
    log('score_corrected', { matchId, score, status: match?.status || 'final' })
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

  function submitBocceScore(matchId, score, submittedBy) {
    const submittedAt = new Date().toISOString()
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? {
              ...match,
              status: 'final',
              score,
              submittedBy,
              submittedAt,
              approvedAt: submittedAt,
              draftScore: null,
              draftGameSavedAt: null,
              draftUpdatedAt: null,
              draftSavedBy: null,
            }
          : match,
      ),
    )
    logBocce('score_submitted', { matchId, submittedBy, score, autoApproved: true, approvedAt: submittedAt })
    setBocceSubmissionConfirmation({ matchId, at: submittedAt })
    setPage('bocce-submitted')
  }

  function saveBocceScoreGame(matchId, gameIndex, gameScore, savedBy) {
    const savedAt = new Date().toISOString()
    setBocceMatches((items) =>
      items.map((match) => {
        if (match.id !== matchId) return match
        const draftScore = Array.isArray(match.draftScore) ? [...match.draftScore] : []
        const draftGameSavedAt = Array.isArray(match.draftGameSavedAt) ? [...match.draftGameSavedAt] : []
        draftScore[gameIndex] = gameScore
        draftGameSavedAt[gameIndex] = savedAt
        return { ...match, draftScore, draftGameSavedAt, draftUpdatedAt: savedAt, draftSavedBy: savedBy }
      }),
    )
    logBocce('score_game_saved', { matchId, game: gameIndex + 1, savedBy, score: gameScore })
  }

  function unsaveBocceScoreGame(matchId, gameIndex, savedBy) {
    const savedAt = new Date().toISOString()
    setBocceMatches((items) =>
      items.map((match) => {
        if (match.id !== matchId) return match
        const draftScore = Array.isArray(match.draftScore) ? [...match.draftScore] : []
        const draftGameSavedAt = Array.isArray(match.draftGameSavedAt) ? [...match.draftGameSavedAt] : []
        draftScore[gameIndex] = undefined
        draftGameSavedAt[gameIndex] = undefined
        const hasSavedGame = draftScore.some((game) => Array.isArray(game))
        return {
          ...match,
          draftScore: hasSavedGame ? draftScore : null,
          draftGameSavedAt: hasSavedGame ? draftGameSavedAt : null,
          draftUpdatedAt: hasSavedGame ? savedAt : null,
          draftSavedBy: hasSavedGame ? savedBy : null,
        }
      }),
    )
    logBocce('score_game_unsaved', { matchId, game: gameIndex + 1, savedBy })
  }

  function markBocceRescheduled(matchId, submittedBy) {
    const match = bocceMatches.find((item) => item.id === matchId)
    const undo = match?.status === 'rescheduled'
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? undo
            ? {
                ...match,
                status: match.statusBeforeReschedule || 'scheduled',
                statusBeforeReschedule: undefined,
                rescheduleNote: undefined,
                rescheduledBy: undefined,
                rescheduledAt: undefined,
              }
            : {
                ...match,
                status: 'rescheduled',
                statusBeforeReschedule: match.status,
                rescheduleNote: undefined,
                rescheduledBy: submittedBy,
                rescheduledAt: new Date().toISOString(),
              }
          : match,
      ),
    )
    logBocce(undo ? 'match_reschedule_undone' : 'match_rescheduled', { matchId, submittedBy })
  }

  function approveBocceScore(matchId) {
    const match = bocceMatches.find((item) => item.id === matchId)
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'final', approvedAt: new Date().toISOString() } : match,
      ),
    )
    logBocce('score_approved', { matchId, score: match?.score })
  }

  function rejectBocceScore(matchId) {
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId ? { ...match, status: 'scheduled', score: undefined, submittedBy: undefined, submittedAt: undefined, approvedAt: undefined } : match,
      ),
    )
    logBocce('score_rejected', { matchId })
  }

  function correctBocceScore(matchId, score) {
    const match = bocceMatches.find((item) => item.id === matchId)
    setBocceMatches((items) =>
      items.map((match) =>
        match.id === matchId
          ? {
              ...match,
              score,
              draftScore: null,
              draftGameSavedAt: null,
              draftUpdatedAt: null,
              draftSavedBy: null,
            }
          : match,
      ),
    )
    logBocce('score_corrected', { matchId, score, status: match?.status || 'final' })
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
            saveScoreGame={saveBocceScoreGame}
            unsaveScoreGame={unsaveBocceScoreGame}
            markRescheduled={markBocceRescheduled}
          />
        )}
        {page === 'bocce-standings' && <BocceStandings standings={bocceStandings} matches={bocceMatches} teams={bocceTeams} />}
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
            correctScore={correctBocceScore}
            createSnapshot={createBocceSnapshot}
            updateTeam={updateBocceTeam}
            updatePlayer={updateBoccePlayer}
            updateMatch={updateBocceMatch}
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
            saveScoreGame={saveScoreGame}
            unsaveScoreGame={unsaveScoreGame}
            markRescheduled={markRescheduled}
            setPage={setPage}
          />
        )}
        {page === 'standings' && <Standings standings={standings} matches={matches} teams={teams} />}
        {page === 'schedule' && <Schedule matches={matches} teams={teams} />}
        {page === 'rules' && <CornholeRules />}
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
            correctScore={correctScore}
            createSnapshot={createSnapshot}
            importSchedule={importSchedule}
            updateTeam={updateTeam}
            updateTeamPaymentStatus={updateTeamPaymentStatus}
            updatePlayer={updatePlayer}
            updateMatch={updateMatch}
          />
        )}
      </main>

      {showCornholeNav && (
        <nav className="bottom-nav" aria-label="Main navigation">
          <button type="button" onClick={() => setPage('home')}>Home</button>
          <button type="button" onClick={() => setPage('my')}>My Matches</button>
          <button type="button" onClick={() => setPage('standings')}>Standings</button>
          <button type="button" onClick={() => setPage('rules')}>Rules</button>
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
          <p>Wednesday night matchups, team contacts, standings, and score corrections.</p>
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

function BocceMyMatches({ matches, teams, players, selectedPlayer, selectedTeam, selectedPlayerId, setSelectedPlayerId, standings, submitScore, saveScoreGame, unsaveScoreGame, markRescheduled }) {
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
            saveScoreGame={saveScoreGame}
            unsaveScoreGame={unsaveScoreGame}
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
              saveScoreGame={saveScoreGame}
              unsaveScoreGame={unsaveScoreGame}
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

function BocceStandings({ standings, matches, teams }) {
  const [selectedTeamId, setSelectedTeamId] = useState('')

  return (
    <section className="stack">
      <PageTitle title="Bocce Standings" />
      <p className="standings-help">Select a team to see the completed matches affecting their standings.</p>
      <section className="standings-grid bocce-standings-grid" aria-label="Bocce standings">
        <div className="standings-header">
          <span>Rank</span>
          <span>Team</span>
          <span>Record</span>
          <span>GB</span>
          <span>Pts</span>
        </div>
        {standings.map((row) => {
          const isSelected = selectedTeamId === row.team.id
          const breakdownId = `bocce-breakdown-${row.team.id}`

          return (
            <div className="standing-entry" key={row.team.id}>
              <button
                aria-controls={breakdownId}
                aria-expanded={isSelected}
                className={`standing-row ${isSelected ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedTeamId(isSelected ? '' : row.team.id)}
              >
                <strong>{row.rankLabel}</strong>
                <span className="team-name">{row.team.name}</span>
                <span className="points">{row.gameWins}-{row.gameLosses}</span>
                <span>{formatGamesBack(row.gamesBack)}</span>
                <span>{row.points}</span>
              </button>
              {isSelected && (
                <TeamMatchBreakdown
                  id={breakdownId}
                  matches={matches}
                  row={row}
                  teams={teams}
                />
              )}
            </div>
          )
        })}
      </section>
    </section>
  )
}

function BocceSchedule({ matches, teams, players }) {
  const [week, setWeek] = useState('All')
  const [status, setStatus] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  const filtered = matches.filter((match) =>
    (week === 'All' || match.week === Number(week)) &&
    (status === 'All' || match.status === status)
  )

  return (
    <section className="stack">
      <PageTitle eyebrow="Wednesday nights" title="Bocce Schedule" />
      <div className="filters">
        <label className="field">Week<select value={week} onChange={(event) => setWeek(event.target.value)}><option>All</option>{weeks.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field">Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">All Statuses</option>{matchStatuses.map((item) => <option key={item} value={item}>{formatStatusOption(item)}</option>)}</select></label>
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

function BocceMatchCard({ match, teams, players = [], viewerTeam, selectedPlayer, showContacts = false, submitScore, saveScoreGame, unsaveScoreGame, markRescheduled, compact = false }) {
  const [actionOpen, setActionOpen] = useState('')
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const opponent = viewerTeam ? getTeam(teams, viewerTeam.id === match.teamA ? match.teamB : match.teamA) : null
  const status = boccePublicStatus(match)

  return (
    <article className={`match-card bocce-match-card ${viewerTeam ? 'viewer-match-card' : ''}`}>
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
        <div className="match-status-actions">
          <StatusBadge status={status} />
          {!compact && showContacts && match.status !== 'final' && selectedPlayer && markRescheduled && (
            <button
              aria-pressed={match.status === 'rescheduled'}
              className={`reschedule-corner-button ${match.status === 'rescheduled' ? 'undo' : ''}`}
              type="button"
              onClick={() => {
                setActionOpen('')
                markRescheduled(match.id, selectedPlayer.id)
              }}
            >
              {match.status === 'rescheduled' ? 'Undo Reschedule' : 'Mark Rescheduled'}
            </button>
          )}
        </div>
      </div>
      <ScoreBreakdown score={match.score} teamA={teamA} teamB={teamB} viewerTeam={viewerTeam} />
      {!compact && showContacts && match.status !== 'final' && selectedPlayer && submitScore && markRescheduled && (
        <BocceMatchActions match={match} teams={teams} selectedPlayer={selectedPlayer} submitScore={submitScore} saveScoreGame={saveScoreGame} unsaveScoreGame={unsaveScoreGame} open={actionOpen} setOpen={setActionOpen} />
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

function BocceMatchActions({ match, teams, selectedPlayer, submitScore, saveScoreGame, unsaveScoreGame, open, setOpen }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const savedDraftGameCount = Array.isArray(match.draftScore)
    ? Math.max(1, ...match.draftScore.map((game, index) => Array.isArray(game) ? index + 1 : 0))
    : 1
  const [pin, setPin] = useState('')
  const [games, setGames] = useState(() => Array.from({ length: 3 }, (_, gameIndex) => [
    match.draftScore?.[gameIndex]?.[0] ?? '',
    match.draftScore?.[gameIndex]?.[1] ?? '',
  ]))
  const [visibleGameCount, setVisibleGameCount] = useState(savedDraftGameCount)
  const [attemptedGames, setAttemptedGames] = useState([])
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [pinAttempted, setPinAttempted] = useState(false)
  const [savedGameIndex, setSavedGameIndex] = useState(null)
  const score = games.map((game) => game.map(scoreNumber))
  const activeScore = score.slice(0, visibleGameCount)
  const errors = validateBocceScore(activeScore)
  const pinError = pinAttempted && !pin.trim()
    ? 'Enter the league PIN.'
    : pinAttempted && pin && !pinIsValid()
      ? 'PIN should be glen.'
      : ''
  const submitErrors = [
    ...(pinError ? [pinError] : []),
    ...(submitAttempted ? errors : []),
  ]

  function pinIsValid() {
    return pin.trim().toLowerCase() === PIN
  }

  function updateGame(gameIndex, teamIndex, value) {
    setSavedGameIndex(null)
    setGames((items) => items.map((game, index) => (
      index === gameIndex ? game.map((scoreValue, side) => (side === teamIndex ? value : scoreValue)) : game
    )))
  }

  function clearGame(gameIndex) {
    setGames((items) => items.map((game, index) => (index === gameIndex ? ['', ''] : game)))
    setAttemptedGames((items) => items.filter((index) => index !== gameIndex))
    setSavedGameIndex(null)
  }

  function gameIsSaved(gameIndex) {
    const savedGame = match.draftScore?.[gameIndex]
    return Boolean(savedGame) && savedGame.every((value, side) => Number(value) === score[gameIndex][side])
  }

  function handleSaveGame(gameIndex) {
    if (gameIsSaved(gameIndex)) {
      unsaveScoreGame(match.id, gameIndex, selectedPlayer.id)
      clearGame(gameIndex)
      return
    }

    setAttemptedGames((items) => items.includes(gameIndex) ? items : [...items, gameIndex])
    if (validateBocceGame(score[gameIndex], gameIndex)) return
    saveScoreGame(match.id, gameIndex, score[gameIndex], selectedPlayer.id)
    setSavedGameIndex(gameIndex)
  }

  function handleAddGame() {
    setVisibleGameCount((count) => Math.min(count + 1, 3))
    setSavedGameIndex(null)
  }

  function handleRemoveGame() {
    if (visibleGameCount <= 1) return
    const gameIndex = visibleGameCount - 1
    if (Array.isArray(match.draftScore?.[gameIndex])) {
      unsaveScoreGame(match.id, gameIndex, selectedPlayer.id)
    }
    clearGame(gameIndex)
    setVisibleGameCount((count) => Math.max(count - 1, 1))
  }

  return (
    <div className="actions">
      <div className="match-action-buttons">
        <button className={open === 'score' ? 'score-toggle active' : 'score-toggle'} type="button" onClick={() => setOpen(open === 'score' ? '' : 'score')}>
          {open === 'score' ? 'Close Score Submission' : 'Open Score Submission'}
        </button>
      </div>
      {open === 'score' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault()
          setPinAttempted(true)
          setSubmitAttempted(true)
          if (!pinIsValid() || errors.length) return
          submitScore(match.id, activeScore, selectedPlayer.id)
        }}>
          <p className="helper-text">Save games as you play. Saved games will be here when you return.</p>
          <div className="score-games">
            {games.slice(0, visibleGameCount).map((game, gameIndex) => {
              const gameError = validateBocceGame(score[gameIndex], gameIndex)
              const saved = gameIsSaved(gameIndex)
              const wasSaved = Boolean(match.draftScore?.[gameIndex])
              const showError = submitAttempted || attemptedGames.includes(gameIndex)
              const showSavedMessage = savedGameIndex === gameIndex && saved
              return (
                <section className={`score-game-card ${saved ? 'saved' : ''}`} key={gameIndex}>
                  <div className="score-game-heading">
                    <h3>Game {gameIndex + 1}</h3>
                    {saved && <span>Saved</span>}
                    {!saved && wasSaved && <span className="unsaved">Unsaved changes</span>}
                  </div>
                  <div className="score-game-entry-row">
                    <div className="score-grid bocce-score-grid">
                      <label><span className="score-team-name" title={teamA?.name || 'Team A'}>{teamA?.name || 'Team A'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[0]} onChange={(event) => updateGame(gameIndex, 0, event.target.value)} /></label>
                      <label><span className="score-team-name" title={teamB?.name || 'Team B'}>{teamB?.name || 'Team B'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[1]} onChange={(event) => updateGame(gameIndex, 1, event.target.value)} /></label>
                    </div>
                    <button className="secondary save-game-button" type="button" onClick={() => handleSaveGame(gameIndex)}>
                      {saved ? 'Unsave' : 'Save'}
                    </button>
                  </div>
                  {showError && gameError && <p className="error">{gameError}</p>}
                  {showSavedMessage && <p className="success-text" role="status">Game {gameIndex + 1} saved.</p>}
                </section>
              )
            })}
          </div>
          {(visibleGameCount < 3 || visibleGameCount > 1) && (
            <div className="game-count-actions">
              {visibleGameCount < 3 && (
                <button className="secondary add-game-button" type="button" onClick={handleAddGame}>
                  Add Game {visibleGameCount + 1}
                </button>
              )}
              {visibleGameCount > 1 && (
                <button className="secondary remove-game-button" type="button" onClick={handleRemoveGame}>
                  Remove Game {visibleGameCount}
                </button>
              )}
            </div>
          )}
          <p className="helper-text submit-helper">Submitting sends all {visibleGameCount} game{visibleGameCount === 1 ? '' : 's'} shown above for this match.</p>
          <div className="score-submit-row">
            <input className="score-pin-input" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" aria-label="League PIN" type="password" />
            <button className="final-score-submit" type="submit">Submit Final Score</button>
          </div>
          {submitErrors.length > 0 && <ValidationList title="Before submitting" items={submitErrors} tone="error" />}
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
        <BigButton label="Rules" onClick={() => setPage('rules')} />
        <BigButton label="Trophy Room" onClick={() => setPage('trophy')} />
        <BigButton label="Full Schedule" onClick={() => setPage('schedule')} />
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

function CornholeRules() {
  return (
    <section className="stack">
      <PageTitle eyebrow="Adult Cornhole League" title="Rules and Regulations" />
      <Card title="League Agreement">
        <p className="helper-text">As a league participant, you agree to comply with the following league rules and regulations.</p>
        <a className="download-link" href="https://www.playcornhole.org/pages/rules" target="_blank" rel="noreferrer">ACA rules reference</a>
      </Card>
      <div className="rules-grid cornhole-rules-grid">
        {cornholeRuleSections.map((section) => (
          <article className="simple-card rule-card cornhole-rule-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function MyMatches({ matches, teams, players, selectedPlayer, selectedTeam, selectedPlayerId, setSelectedPlayerId, standings, submitScore, saveScoreGame, unsaveScoreGame, markRescheduled }) {
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
        <Stat label="Record" value={`${row?.gameWins || 0}-${row?.gameLosses || 0}`} />
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
            saveScoreGame={saveScoreGame}
            unsaveScoreGame={unsaveScoreGame}
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
              saveScoreGame={saveScoreGame}
              unsaveScoreGame={unsaveScoreGame}
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

function Standings({ standings, matches, teams }) {
  const [flight, setFlight] = useState('Green')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const leaderPoints = standings[flight][0]?.points || 0

  function selectFlight(nextFlight) {
    setFlight(nextFlight)
    setSelectedTeamId('')
  }

  return (
    <section className="stack">
      <PageTitle title="Standings" />
      <Segmented options={flights} value={flight} onChange={selectFlight} />
      <p className="standings-help">Select a team to see the completed matches affecting their standings.</p>
      <section className="standings-grid" aria-label={`${flight} standings`}>
        <div className="standings-header">
          <span>Rank</span>
          <span>Team</span>
          <span>Pts</span>
          <span>Game</span>
          <span title="Points back">Back</span>
        </div>
        {standings[flight].map((row) => {
          const pointsBack = leaderPoints - row.points
          const isSelected = selectedTeamId === row.team.id
          const breakdownId = `cornhole-breakdown-${row.team.id}`

          return (
            <div className="standing-entry" key={row.team.id}>
              <button
                aria-controls={breakdownId}
                aria-expanded={isSelected}
                className={`standing-row ${isSelected ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedTeamId(isSelected ? '' : row.team.id)}
              >
                <strong>{row.rankLabel}</strong>
                <span className="team-name"><TeamName team={row.team} /></span>
                <span className="points">{row.points}</span>
                <span>{row.gameWins}-{row.gameLosses}</span>
                <span className={pointsBack === 0 ? 'back-value leader' : 'back-value'}>{pointsBack}</span>
              </button>
              {isSelected && (
                <TeamMatchBreakdown
                  id={breakdownId}
                  matches={matches}
                  row={row}
                  teams={teams}
                />
              )}
            </div>
          )
        })}
      </section>
    </section>
  )
}

function TeamMatchBreakdown({ id, matches, row, teams }) {
  const teamMatches = matches
    .filter((match) =>
      match.status === 'final' &&
      Array.isArray(match.score) &&
      (match.teamA === row.team.id || match.teamB === row.team.id)
    )
    .sort(bySchedule)

  return (
    <section className="team-match-breakdown" id={id} aria-label={`${row.team.name} match breakdown`}>
      <div className="breakdown-heading">
        <div>
          <span>Match breakdown</span>
          <h2>{row.team.name}</h2>
        </div>
        <span>{teamMatches.length} played</span>
      </div>
      <div className="breakdown-stats" aria-label="Team totals">
        <div><span>Points</span><strong>{row.points}</strong></div>
        <div><span>Games</span><strong>{row.gameWins}-{row.gameLosses}</strong></div>
        <div><span>Matches</span><strong>{row.played}</strong></div>
      </div>
      <div className="team-result-list">
        {teamMatches.map((match) => (
          <TeamMatchResult
            key={match.id}
            match={match}
            team={row.team}
            teams={teams}
          />
        ))}
      </div>
      {teamMatches.length === 0 && <p className="empty">No completed matches are affecting this team&apos;s standings yet.</p>}
    </section>
  )
}

function TeamMatchResult({ match, team, teams }) {
  const teamSide = match.teamA === team.id ? 0 : 1
  const opponent = getTeam(teams, teamSide === 0 ? match.teamB : match.teamA)
  const score = Array.isArray(match.score) ? match.score : []
  const gameWins = score.filter((game) => Number(game?.[teamSide]) > Number(game?.[teamSide === 0 ? 1 : 0])).length
  const gameLosses = score.length - gameWins
  const result = gameWins > gameLosses ? 'Win' : gameWins < gameLosses ? 'Loss' : 'Split'
  const resultClass = result.toLowerCase()
  const scoreLabel = score
    .map((game) => `${Number(game?.[teamSide] ?? 0)}-${Number(game?.[teamSide === 0 ? 1 : 0] ?? 0)}`)
    .join(' · ')

  return (
    <article className="team-result">
      <div className="team-result-main">
        <span className={`result-badge ${resultClass}`}>{result}</span>
        <div>
          <span>Week {match.week} · {formatDate(match.date)}</span>
          <h3>vs {opponent?.name || 'TBD'}</h3>
        </div>
      </div>
      <div className="team-result-score">
        {score.length > 0 ? (
          <>
            <strong>{gameWins}-{gameLosses} games</strong>
            <span>{scoreLabel}</span>
          </>
        ) : (
          <>
            <strong>{match.time}</strong>
            <span>No score yet</span>
          </>
        )}
      </div>
    </article>
  )
}

function Schedule({ matches, teams }) {
  const [flight, setFlight] = useState('All')
  const [week, setWeek] = useState(() => getCurrentScheduleWeek(matches))
  const [status, setStatus] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  const filtered = matches
    .filter((match) =>
      (flight === 'All' || match.flight === flight) &&
      (week === 'All' || match.week === Number(week)) &&
      (status === 'All' || match.status === status)
    )
    .sort(bySchedule)

  return (
    <section className="stack">
      <PageTitle eyebrow="Public schedule" title="Full Schedule" />
      <div className="filters schedule-filters">
        <strong>Full Schedule</strong>
        <label className="field">Band<select value={flight} onChange={(event) => setFlight(event.target.value)}><option>All</option>{flights.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field">Week<select value={week} onChange={(event) => setWeek(event.target.value)}><option>All</option>{weeks.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field">Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">All Statuses</option>{matchStatuses.map((item) => <option key={item} value={item}>{formatStatusOption(item)}</option>)}</select></label>
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
        <p className="eyebrow">Final score recorded</p>
        <h1>Score Submitted</h1>
        <p>Your score was saved and standings are updated. Admins can still correct it later if needed.</p>
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
  correctScore,
  createSnapshot,
  importSchedule,
  updateTeam,
  updateTeamPaymentStatus,
  updatePlayer,
  updateMatch,
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

  const scoredMatches = matches
    .filter((match) => ['pending', 'final'].includes(match.status) && Array.isArray(match.score))
    .sort((a, b) => {
      const statusSort = Number(a.status === 'final') - Number(b.status === 'final')
      return statusSort || bySchedule(a, b)
    })

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
        <Card title="Scores">
          {scoredMatches.length === 0 && <p className="empty">No scores submitted yet.</p>}
          <div className="card-list">
            {scoredMatches.map((match) => (
              <CornholeAdminScoreCard
                key={match.id}
                match={match}
                teams={teams}
                players={players}
                approveScore={approveScore}
                rejectScore={rejectScore}
                correctScore={correctScore}
              />
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
          audit={audit}
          updateTeam={updateTeam}
          updatePaymentStatus={updateTeamPaymentStatus}
        />
      )}
      {tab === 'Schedule' && (
        <ScheduleEditor matches={matches} teams={teams} updateMatch={updateMatch} />
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
          <AuditLog audit={audit} matches={matches} teams={teams} players={players} EntryComponent={AuditEntry} />
        </Card>
      )}
    </section>
  )
}

function CornholeAdminScoreCard({ match, teams, players, approveScore, rejectScore, correctScore }) {
  const [games, setGames] = useState(() => Array.from({ length: 2 }, (_, gameIndex) => [
    match.score?.[gameIndex]?.[0] ?? '',
    match.score?.[gameIndex]?.[1] ?? '',
  ]))
  const [attempted, setAttempted] = useState(false)
  const [message, setMessage] = useState('')
  const score = games.map((game) => game.map(scoreNumber))
  const errors = validateScore(score)
  const hasChanges = formatScore(score) !== formatScore(match.score)
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)

  function updateGame(gameIndex, teamIndex, value) {
    setMessage('')
    setGames((items) => items.map((game, index) => (
      index === gameIndex ? game.map((scoreValue, side) => (side === teamIndex ? value : scoreValue)) : game
    )))
  }

  function saveCorrection() {
    setAttempted(true)
    if (errors.length) return
    correctScore(match.id, score)
    setMessage('Score correction saved.')
  }

  return (
    <article className="simple-card admin-score-card">
      <p>Week {match.week} - {matchTitle(match, teams)}</p>
      <h2>{formatScore(match.score)}</h2>
      <p>{match.status === 'final' ? 'Final' : 'Pending'} - Submitted by {playerName(players, match.submittedBy)}</p>
      <details className="admin-score-editor">
        <summary>Edit score</summary>
        <div className="admin-score-games">
          {games.map((game, gameIndex) => {
            const gameError = validateCornholeGame(score[gameIndex], gameIndex)
            return (
              <section className="admin-score-game" key={gameIndex}>
                <h3>Game {gameIndex + 1}</h3>
                <div className="score-grid">
                  <label><span className="score-team-name" title={teamA?.name || 'Team A'}>{teamA?.name || 'Team A'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[0]} onChange={(event) => updateGame(gameIndex, 0, event.target.value)} /></label>
                  <label><span className="score-team-name" title={teamB?.name || 'Team B'}>{teamB?.name || 'Team B'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[1]} onChange={(event) => updateGame(gameIndex, 1, event.target.value)} /></label>
                </div>
                {attempted && gameError && <p className="error">{gameError}</p>}
              </section>
            )
          })}
        </div>
        <div className="button-row admin-score-actions">
          <button type="button" disabled={!hasChanges} onClick={saveCorrection}>Save Correction</button>
          {match.status === 'pending' ? (
            <button type="button" onClick={() => approveScore(match.id)}>Approve</button>
          ) : (
            <button type="button" className="secondary" disabled>Final</button>
          )}
          {match.status === 'pending' && <button type="button" className="secondary" onClick={() => rejectScore(match.id)}>Reject</button>}
        </div>
        {attempted && errors.length > 0 && <ValidationList title="Fix score before saving" items={errors} tone="error" />}
        {message && <p className="success-text" role="status">{message}</p>}
      </details>
    </article>
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
  correctScore,
  createSnapshot,
  updateTeam,
  updatePlayer,
  updateMatch,
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

  const scoredMatches = matches
    .filter((match) => ['pending', 'final'].includes(match.status) && Array.isArray(match.score))
    .sort((a, b) => {
      const statusSort = Number(a.status === 'final') - Number(b.status === 'final')
      return statusSort || bySchedule(a, b)
    })

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
        <Card title="Bocce Scores">
          {scoredMatches.length === 0 && <p className="empty">No bocce scores submitted yet.</p>}
          <div className="card-list">
            {scoredMatches.map((match) => (
              <BocceAdminScoreCard
                key={match.id}
                match={match}
                teams={teams}
                players={players}
                approveScore={approveScore}
                rejectScore={rejectScore}
                correctScore={correctScore}
              />
            ))}
          </div>
        </Card>
      )}
      {tab === 'Roster' && (
        <BocceRosterEditor teams={teams} players={players} updateTeam={updateTeam} updatePlayer={updatePlayer} />
      )}
      {tab === 'Schedule' && (
        <BocceScheduleEditor matches={matches} teams={teams} updateMatch={updateMatch} />
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
          <AuditLog audit={audit} matches={matches} teams={teams} players={players} EntryComponent={BocceAuditEntry} bocce />
        </Card>
      )}
    </section>
  )
}

function BocceAdminScoreCard({ match, teams, players, approveScore, rejectScore, correctScore }) {
  const [games, setGames] = useState(() => Array.from({ length: Math.max(1, match.score?.length || 1) }, (_, gameIndex) => [
    match.score?.[gameIndex]?.[0] ?? '',
    match.score?.[gameIndex]?.[1] ?? '',
  ]))
  const [attempted, setAttempted] = useState(false)
  const [message, setMessage] = useState('')
  const score = games.map((game) => game.map(scoreNumber))
  const errors = validateBocceScore(score)
  const hasChanges = formatBocceScore(score) !== formatBocceScore(match.score)
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)

  function updateGame(gameIndex, teamIndex, value) {
    setMessage('')
    setGames((items) => items.map((game, index) => (
      index === gameIndex ? game.map((scoreValue, side) => (side === teamIndex ? value : scoreValue)) : game
    )))
  }

  function addGame() {
    setMessage('')
    setGames((items) => items.length < 3 ? [...items, ['', '']] : items)
  }

  function removeGame() {
    setMessage('')
    setGames((items) => items.length > 1 ? items.slice(0, -1) : items)
  }

  function saveCorrection() {
    setAttempted(true)
    if (errors.length) return
    correctScore(match.id, score)
    setMessage('Score correction saved.')
  }

  return (
    <article className="simple-card admin-score-card">
      <p>Week {match.week} - {matchTitle(match, teams)}</p>
      <h2>{formatBocceScore(match.score)}</h2>
      <p>{match.status === 'final' ? 'Final' : 'Pending'} - Submitted by {playerName(players, match.submittedBy)}</p>
      <details className="admin-score-editor">
        <summary>Edit score</summary>
        <div className="admin-score-games">
          {games.map((game, gameIndex) => {
            const gameError = validateBocceGame(score[gameIndex], gameIndex)
            return (
              <section className="admin-score-game" key={gameIndex}>
                <h3>Game {gameIndex + 1}</h3>
                <div className="score-grid bocce-score-grid">
                  <label><span className="score-team-name" title={teamA?.name || 'Team A'}>{teamA?.name || 'Team A'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[0]} onChange={(event) => updateGame(gameIndex, 0, event.target.value)} /></label>
                  <label><span className="score-team-name" title={teamB?.name || 'Team B'}>{teamB?.name || 'Team B'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[1]} onChange={(event) => updateGame(gameIndex, 1, event.target.value)} /></label>
                </div>
                {attempted && gameError && <p className="error">{gameError}</p>}
              </section>
            )
          })}
        </div>
        <div className="game-count-actions">
          {games.length < 3 && <button className="secondary add-game-button" type="button" onClick={addGame}>Add Game {games.length + 1}</button>}
          {games.length > 1 && <button className="secondary remove-game-button" type="button" onClick={removeGame}>Remove Game {games.length}</button>}
        </div>
        <div className="button-row admin-score-actions">
          <button type="button" disabled={!hasChanges} onClick={saveCorrection}>Save Correction</button>
          {match.status === 'pending' ? (
            <button type="button" onClick={() => approveScore(match.id)}>Approve</button>
          ) : (
            <button type="button" className="secondary" disabled>Final</button>
          )}
          {match.status === 'pending' && <button type="button" className="secondary" onClick={() => rejectScore(match.id)}>Reject</button>}
        </div>
        {attempted && errors.length > 0 && <ValidationList title="Fix score before saving" items={errors} tone="error" />}
        {message && <p className="success-text" role="status">{message}</p>}
      </details>
    </article>
  )
}

function cloneRosterItems(items) {
  return items.map((item) => ({ ...item }))
}

function rosterSignature(teams, players) {
  return JSON.stringify({ teams, players })
}

function useRosterDraft(teams, players) {
  const [draftTeams, setDraftTeams] = useState(() => cloneRosterItems(teams))
  const [draftPlayers, setDraftPlayers] = useState(() => cloneRosterItems(players))
  const [message, setMessage] = useState('')
  const hasChanges = rosterSignature(teams, players) !== rosterSignature(draftTeams, draftPlayers)

  useEffect(() => {
    setDraftTeams(cloneRosterItems(teams))
    setDraftPlayers(cloneRosterItems(players))
  }, [teams, players])

  function updateDraftTeam(teamId, patch) {
    setMessage('')
    setDraftTeams((items) => items.map((team) => (team.id === teamId ? { ...team, ...patch } : team)))
  }

  function updateDraftPlayer(playerId, patch) {
    setMessage('')
    setDraftPlayers((items) => items.map((player) => (player.id === playerId ? { ...player, ...patch } : player)))
  }

  function undoChanges() {
    setDraftTeams(cloneRosterItems(teams))
    setDraftPlayers(cloneRosterItems(players))
    setMessage('Roster changes undone.')
  }

  return {
    draftTeams,
    draftPlayers,
    hasChanges,
    message,
    setMessage,
    updateDraftTeam,
    updateDraftPlayer,
    undoChanges,
  }
}

function commitRosterDraft({ teams, players, draftTeams, draftPlayers, updateTeam, updatePlayer }) {
  const teamsById = new Map(teams.map((team) => [team.id, team]))
  const playersById = new Map(players.map((player) => [player.id, player]))

  draftTeams.forEach((team) => {
    if (JSON.stringify(teamsById.get(team.id)) !== JSON.stringify(team)) updateTeam(team.id, team)
  })

  draftPlayers.forEach((player) => {
    if (JSON.stringify(playersById.get(player.id)) !== JSON.stringify(player)) updatePlayer(player.id, player)
  })
}

function BocceRosterEditor({ teams, players, updateTeam, updatePlayer }) {
  const {
    draftTeams,
    draftPlayers,
    hasChanges,
    message,
    setMessage,
    updateDraftTeam,
    updateDraftPlayer,
    undoChanges,
  } = useRosterDraft(teams, players)

  function saveChanges() {
    commitRosterDraft({ teams, players, draftTeams, draftPlayers, updateTeam, updatePlayer })
    setMessage('Roster changes saved.')
  }

  return (
    <Card title="Bocce Teams and Public Contacts">
      <p className="empty">Phone numbers and emails appear on public bocce match pages.</p>
      <div className="button-row roster-actions">
        <button type="button" disabled={!hasChanges} onClick={saveChanges}>Save Changes</button>
        <button type="button" className="secondary" disabled={!hasChanges} onClick={undoChanges}>Undo Changes</button>
      </div>
      {message && <p className="success-text" role="status">{message}</p>}
      <div className="card-list">
        {[...draftTeams].sort((a, b) => a.number - b.number).map((team) => {
          const teamPlayers = draftPlayers.filter((player) => player.teamId === team.id)
          return (
            <article className="simple-card admin-team-card" key={team.id}>
              <div className="admin-team-head bocce-admin-team-head">
                <label className="field">
                  Team #
                  <input
                    type="number"
                    min="1"
                    value={team.number}
                    onChange={(event) => updateDraftTeam(team.id, { number: Number(event.target.value) })}
                  />
                </label>
                <label className="field team-name-field">
                  Team Name
                  <input value={team.name} onChange={(event) => updateDraftTeam(team.id, { name: event.target.value })} />
                </label>
              </div>
              <div className="admin-player-grid">
                {teamPlayers.map((player) => (
                  <div className="admin-player-card" key={player.id}>
                    <label className="field">First<input value={player.first} onChange={(event) => updateDraftPlayer(player.id, { first: event.target.value })} /></label>
                    <label className="field">Last<input value={player.last} onChange={(event) => updateDraftPlayer(player.id, { last: event.target.value })} /></label>
                    <label className="field">Phone<input value={player.phone || ''} onChange={(event) => updateDraftPlayer(player.id, { phone: event.target.value })} /></label>
                    <label className="field">Email<input value={player.email || ''} onChange={(event) => updateDraftPlayer(player.id, { email: event.target.value })} /></label>
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

function BocceScheduleEditor({ matches, teams, updateMatch }) {
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  return (
    <Card title="Bocce Schedule Editor">
      <p className="helper-text">Edit individual matches below. Changes are saved immediately.</p>
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
  const actorId = item.details?.submittedBy || item.details?.savedBy
  const actor = actorId ? playerName(players, actorId) : 'Commissioner'

  if (item.action === 'score_game_saved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} saved bocce Game {item.details.game}</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
        <p>{item.details.score.join('-')}</p>
      </article>
    )
  }

  if (item.action === 'score_game_unsaved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} unsaved bocce Game {item.details.game}</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
      </article>
    )
  }

  if (item.action === 'score_submitted' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} submitted a bocce score{item.details.autoApproved ? ' (auto-approved)' : ''}</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
        <p>{formatBocceScore(item.details.score)}</p>
      </article>
    )
  }

  if (item.action === 'score_corrected' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin corrected a bocce score</h2>
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
      </article>
    )
  }

  if (item.action === 'match_reschedule_undone' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} undid a bocce reschedule</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
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

const AUDIT_BURST_WINDOW_MS = 15 * 60 * 1000

function auditGroupKey(item) {
  const details = item?.details || {}

  if (item?.action === 'match_rescheduled' || item?.action === 'match_reschedule_undone') {
    return details.matchId ? `schedule:${details.matchId}:${details.submittedBy || ''}` : null
  }

  if (item?.action === 'payment_marked_paid' || item?.action === 'payment_unmarked_paid') {
    return details.teamId ? `payment:${details.teamId}` : null
  }

  if (item?.action === 'score_game_saved' || item?.action === 'score_game_unsaved') {
    return details.matchId ? `score-draft:${details.matchId}:${details.savedBy || ''}` : null
  }

  return null
}

function auditGroupFamily(item) {
  if (item?.action === 'match_rescheduled' || item?.action === 'match_reschedule_undone') return 'schedule'
  if (item?.action === 'payment_marked_paid' || item?.action === 'payment_unmarked_paid') return 'payment'
  if (item?.action === 'score_game_saved' || item?.action === 'score_game_unsaved') return 'score-draft'
  return null
}

function consolidateAuditEntries(audit) {
  const groups = []

  for (const item of Array.isArray(audit) ? audit.filter(Boolean) : []) {
    const key = auditGroupKey(item)
    const previous = groups.at(-1)
    const previousItem = previous?.items?.at(-1)
    const elapsed = Math.abs(new Date(item.at).getTime() - new Date(previousItem?.at).getTime())
    const belongsToBurst = key
      && previous?.key === key
      && Number.isFinite(elapsed)
      && elapsed <= AUDIT_BURST_WINDOW_MS

    if (belongsToBurst) {
      previous.items.push(item)
    } else {
      groups.push({ key: key || `item:${item.id}`, family: auditGroupFamily(item), items: [item] })
    }
  }

  return groups
}

function AuditLog({ audit, matches, teams, players, EntryComponent, bocce = false }) {
  const groups = consolidateAuditEntries(audit)

  return (
    <div className="card-list">
      {groups.length === 0 && <p className="empty">No audit entries yet.</p>}
      {groups.map((group, index) => group.items.length === 1 ? (
        <EntryComponent
          key={group.items[0].id || `${group.key}-${index}`}
          item={group.items[0]}
          matches={matches}
          teams={teams}
          players={players}
        />
      ) : (
        <ConsolidatedAuditEntry
          key={`${group.key}:${group.items[0].id || index}`}
          group={group}
          matches={matches}
          teams={teams}
          players={players}
          EntryComponent={EntryComponent}
          bocce={bocce}
        />
      ))}
    </div>
  )
}

function ConsolidatedAuditEntry({ group, matches, teams, players, EntryComponent, bocce }) {
  const latest = group.items[0]
  const details = latest.details || {}
  const match = details.matchId ? matches.find((item) => item.id === details.matchId) : null
  const actorId = details.submittedBy || details.savedBy
  const actor = actorId ? playerName(players, actorId) : 'Admin'
  const count = group.items.length
  let title = `${count} similar actions`
  let context = ''
  let latestLabel = latest.action.replaceAll('_', ' ')

  if (group.family === 'schedule') {
    title = `${actor} changed ${bocce ? 'bocce ' : ''}schedule status ${count} times`
    context = match ? `${matchTitle(match, teams)} - ${gameDateLabel(match)}` : ''
    latestLabel = latest.action === 'match_rescheduled' ? 'Latest: marked rescheduled' : 'Latest: restored to scheduled'
  } else if (group.family === 'payment') {
    title = `Payment status changed ${count} times`
    context = details.teamName || (details.teamNumber ? `Team ${details.teamNumber}` : '')
    latestLabel = latest.action === 'payment_marked_paid' ? 'Latest: marked paid' : 'Latest: marked unpaid'
  } else if (group.family === 'score-draft') {
    title = `${actor} saved ${count} ${bocce ? 'bocce ' : ''}score updates`
    context = match ? `${matchTitle(match, teams)} - ${gameDateLabel(match)}` : ''
    latestLabel = `Latest: Game ${details.game}`
  }

  return (
    <article className="simple-card audit-entry audit-entry-group">
      <p>{new Date(latest.at).toLocaleString()}</p>
      <h2>{title}</h2>
      {context && <p>{context}</p>}
      <p>{latestLabel}</p>
      <details className="audit-group-details">
        <summary>View {count} individual actions</summary>
        <div className="card-list audit-group-list">
          {group.items.map((item, index) => (
            <EntryComponent
              key={item.id || `${group.key}-detail-${index}`}
              item={item}
              matches={matches}
              teams={teams}
              players={players}
            />
          ))}
        </div>
      </details>
    </article>
  )
}

function PaymentTracker({ teams = [], audit = [], updateTeam, updatePaymentStatus }) {
  const [paymentSearch, setPaymentSearch] = useState('')
  const safeTeams = Array.isArray(teams) ? teams.filter(Boolean) : []
  const sortedTeams = [...safeTeams].sort((a, b) => Number(a?.number || 0) - Number(b?.number || 0))
  const auditItems = Array.isArray(audit) ? audit.filter(Boolean) : []
  const paymentAudit = auditItems.filter((item) => item?.action === 'payment_marked_paid' || item?.action === 'payment_unmarked_paid')
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
      <details className="payment-audit-section">
        <summary>
          <span>audit trail</span>
          <strong>{paymentAudit.length}</strong>
        </summary>
        <div className="card-list">
          {paymentAudit.length === 0 && <p className="empty">No payment changes recorded yet.</p>}
          {consolidateAuditEntries(paymentAudit).map((group, index) => group.items.length === 1 ? (
            <PaymentAuditEntry key={String(group.items[0]?.id || `${group.key}-${index}`)} item={group.items[0]} />
          ) : (
            <ConsolidatedAuditEntry
              key={`${group.key}:${group.items[0]?.id || index}`}
              group={group}
              matches={[]}
              teams={teams}
              players={[]}
              EntryComponent={PaymentAuditEntry}
            />
          ))}
        </div>
      </details>
    </Card>
  )
}

function PaymentAuditEntry({ item = {} }) {
  const markedPaid = item?.action === 'payment_marked_paid'
  const details = item?.details && typeof item.details === 'object' ? item.details : {}
  const teamNumber = details.teamNumber ? String(details.teamNumber) : ''
  const teamLabel = details.teamName ? String(details.teamName) : (teamNumber ? `Team ${teamNumber}` : 'Unknown team')
  const teamMeta = [
    teamNumber ? `Team ${teamNumber}` : '',
    details.flight ? `${String(details.flight)} Band` : '',
  ].filter(Boolean).join(' - ')

  return (
    <article className="simple-card audit-entry payment-audit-entry">
      <p>{item.at ? new Date(item.at).toLocaleString() : 'Unknown time'}</p>
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
  const {
    draftTeams,
    draftPlayers,
    hasChanges,
    message,
    setMessage,
    updateDraftTeam,
    updateDraftPlayer,
    undoChanges,
  } = useRosterDraft(teams, players)

  function saveChanges() {
    commitRosterDraft({ teams, players, draftTeams, draftPlayers, updateTeam, updatePlayer })
    setMessage('Roster changes saved.')
  }

  return (
    <Card title="Teams, Players, Phones, and Admin Emails">
      <p className="empty">Emails are stored here for admin use only. Player pages only use phone numbers for texting.</p>
      <div className="button-row roster-actions">
        <button type="button" disabled={!hasChanges} onClick={saveChanges}>Save Changes</button>
        <button type="button" className="secondary" disabled={!hasChanges} onClick={undoChanges}>Undo Changes</button>
      </div>
      {message && <p className="success-text" role="status">{message}</p>}
      <div className="card-list">
        {[...draftTeams].sort((a, b) => a.number - b.number).map((team) => {
          const teamPlayers = draftPlayers.filter((player) => player.teamId === team.id)
          return (
            <article className="simple-card admin-team-card" key={team.id}>
              <div className="admin-team-head">
                <label className="field">
                  Team #
                  <input
                    type="number"
                    min="1"
                    value={team.number}
                    onChange={(event) => updateDraftTeam(team.id, { number: Number(event.target.value) })}
                  />
                </label>
                <label className="field">
                  Band
                  <select value={team.flight} onChange={(event) => updateDraftTeam(team.id, { flight: event.target.value })}>
                    {flights.map((flight) => <option key={flight}>{flight}</option>)}
                  </select>
                </label>
                <label className="field team-name-field">
                  Team Name
                  <input value={team.name} onChange={(event) => updateDraftTeam(team.id, { name: event.target.value })} />
                </label>
              </div>
              <div className="admin-player-grid">
                {teamPlayers.map((player) => (
                  <div className="admin-player-card" key={player.id}>
                    <label className="field">First<input value={player.first} onChange={(event) => updateDraftPlayer(player.id, { first: event.target.value })} /></label>
                    <label className="field">Last<input value={player.last} onChange={(event) => updateDraftPlayer(player.id, { last: event.target.value })} /></label>
                    <label className="field">Phone<input value={player.phone} onChange={(event) => updateDraftPlayer(player.id, { phone: event.target.value })} /></label>
                    <label className="field">Email<input value={player.email || ''} onChange={(event) => updateDraftPlayer(player.id, { email: event.target.value })} /></label>
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

function ScheduleEditor({ matches, teams, updateMatch }) {
  const [flight, setFlight] = useState('All')
  const weeks = [...new Set(matches.map((match) => match.week))].sort((a, b) => a - b)
  const filtered = matches
    .filter((match) => flight === 'All' || match.flight === flight)
    .sort(bySchedule)

  return (
    <Card title="Editable Schedule">
      <p className="helper-text">Edit individual matches below. Changes are saved immediately.</p>
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
  const actorId = item.details?.submittedBy || item.details?.savedBy
  const actor = actorId ? playerName(players, actorId) : 'Admin'

  if (item.action === 'score_game_saved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} saved Game {item.details.game}</h2>
        <p>{matchTitle(match, teams)} Â· {gameDateLabel(match)}</p>
        <p>{item.details.score.join('-')}</p>
      </article>
    )
  }

  if (item.action === 'score_game_unsaved' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} unsaved Game {item.details.game}</h2>
        <p>{matchTitle(match, teams)} Â· {gameDateLabel(match)}</p>
      </article>
    )
  }

  if (item.action === 'score_submitted' && match) {
    const teamA = getTeam(teams, match.teamA)
    const teamB = getTeam(teams, match.teamB)
    const score = item.details.score
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} submitted a score{item.details.autoApproved ? ' (auto-approved)' : ''}</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
        <p>{teamA?.name || 'Team A'}: {score[0][0]} + {score[1][0]} = {score[0][0] + score[1][0]} points</p>
        <p>{teamB?.name || 'Team B'}: {score[0][1]} + {score[1][1]} = {score[0][1] + score[1][1]} points</p>
      </article>
    )
  }

  if (item.action === 'score_corrected' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>Admin corrected a score</h2>
        <p>{matchTitle(match, teams)} - {gameDateLabel(match)}</p>
        <p>{formatScore(item.details.score)}</p>
      </article>
    )
  }

  if (item.action === 'match_rescheduled' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} marked a match rescheduled</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
      </article>
    )
  }

  if (item.action === 'match_reschedule_undone' && match) {
    return (
      <article className="simple-card audit-entry">
        <p>{new Date(item.at).toLocaleString()}</p>
        <h2>{actor} undid a reschedule</h2>
        <p>{matchTitle(match, teams)} · {gameDateLabel(match)}</p>
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

function MyScheduleItemCard({ item, teams, players, viewerTeam, selectedPlayer, submitScore, saveScoreGame, unsaveScoreGame, markRescheduled }) {
  if (item.type === 'bye') return <ByeCard item={item} team={viewerTeam} />

  return (
    <MatchCard
      match={item.match}
      teams={teams}
      players={players}
      viewerTeam={viewerTeam}
      selectedPlayer={selectedPlayer}
      submitScore={submitScore}
      saveScoreGame={saveScoreGame}
      unsaveScoreGame={unsaveScoreGame}
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

function ScoreBreakdown({ score, teamA, teamB, viewerTeam }) {
  if (!Array.isArray(score) || score.length === 0) return null

  const viewerSide = viewerTeam?.id === teamA?.id
    ? 0
    : viewerTeam?.id === teamB?.id
      ? 1
      : null
  const viewerGameWins = viewerSide === null
    ? null
    : score.filter((game) => Number(game?.[viewerSide]) > Number(game?.[viewerSide === 0 ? 1 : 0])).length
  const viewerGameLosses = viewerSide === null ? null : score.length - viewerGameWins

  return (
    <div className="score-line score-breakdown">
      {viewerSide !== null && (
        <div className="score-summary-pill">Your games: {viewerGameWins}-{viewerGameLosses}</div>
      )}
      <table className="score-table">
        <thead>
          <tr>
            <th scope="col">Team</th>
            {score.map((game, index) => <th scope="col" key={index}>G{index + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          <ScoreBreakdownRow team={teamA} fallback="Team A" score={score} side={0} viewerSide={viewerSide} />
          <ScoreBreakdownRow team={teamB} fallback="Team B" score={score} side={1} viewerSide={viewerSide} />
        </tbody>
      </table>
    </div>
  )
}

function ScoreBreakdownRow({ team, fallback, score, side, viewerSide }) {
  const isViewer = viewerSide === side

  return (
    <tr className={isViewer ? 'viewer-score-row' : ''}>
      <th scope="row">
        <span>{team?.name || fallback}</span>
        {isViewer && <em>Your team</em>}
      </th>
      {score.map((game, index) => <td key={index}>{Number(game?.[side] ?? 0)}</td>)}
    </tr>
  )
}

function MatchCard({ match, teams, players = [], viewerTeam, selectedPlayer, showContacts = false, showPaymentWarnings = true, submitScore, saveScoreGame, unsaveScoreGame, markRescheduled }) {
  const [actionOpen, setActionOpen] = useState('')
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const opponent = viewerTeam ? getTeam(teams, viewerTeam.id === match.teamA ? match.teamB : match.teamA) : null
  const status = publicStatus(match)

  return (
    <article className={`match-card ${viewerTeam ? 'viewer-match-card' : ''}`}>
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
        <div className="match-status-actions">
          <StatusBadge status={status} />
          {showContacts && match.status !== 'final' && selectedPlayer && markRescheduled && (
            <button
              aria-pressed={match.status === 'rescheduled'}
              className={`reschedule-corner-button ${match.status === 'rescheduled' ? 'undo' : ''}`}
              type="button"
              onClick={() => {
                setActionOpen('')
                markRescheduled(match.id, selectedPlayer.id)
              }}
            >
              {match.status === 'rescheduled' ? 'Undo Reschedule' : 'Mark Rescheduled'}
            </button>
          )}
        </div>
      </div>
      <ScoreBreakdown score={match.score} teamA={teamA} teamB={teamB} viewerTeam={viewerTeam} />
      {showContacts && match.status !== 'final' && (
        <MatchActions match={match} teams={teams} selectedPlayer={selectedPlayer} submitScore={submitScore} saveScoreGame={saveScoreGame} unsaveScoreGame={unsaveScoreGame} open={actionOpen} setOpen={setActionOpen} />
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

function MatchActions({ match, teams, selectedPlayer, submitScore, saveScoreGame, unsaveScoreGame, open, setOpen }) {
  const teamA = getTeam(teams, match.teamA)
  const teamB = getTeam(teams, match.teamB)
  const [pin, setPin] = useState('')
  const [games, setGames] = useState(() => Array.from({ length: 2 }, (_, gameIndex) => [
    match.draftScore?.[gameIndex]?.[0] ?? '',
    match.draftScore?.[gameIndex]?.[1] ?? '',
  ]))
  const [attemptedGames, setAttemptedGames] = useState([])
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [pinAttempted, setPinAttempted] = useState(false)
  const score = games.map((game) => game.map(scoreNumber))
  const errors = validateScore(score)

  function pinIsValid() {
    return pin.trim().toLowerCase() === PIN
  }

  function updateGame(gameIndex, teamIndex, value) {
    setGames((items) => items.map((game, index) => (
      index === gameIndex ? game.map((scoreValue, side) => (side === teamIndex ? value : scoreValue)) : game
    )))
  }

  function clearGame(gameIndex) {
    setGames((items) => items.map((game, index) => (index === gameIndex ? ['', ''] : game)))
    setAttemptedGames((items) => items.filter((index) => index !== gameIndex))
  }

  function gameIsSaved(gameIndex) {
    const savedGame = match.draftScore?.[gameIndex]
    return Boolean(savedGame) && savedGame.every((value, side) => Number(value) === score[gameIndex][side])
  }

  function handleSaveGame(gameIndex) {
    if (gameIsSaved(gameIndex)) {
      unsaveScoreGame(match.id, gameIndex, selectedPlayer.id)
      clearGame(gameIndex)
      return
    }

    setAttemptedGames((items) => items.includes(gameIndex) ? items : [...items, gameIndex])
    if (validateCornholeGame(score[gameIndex], gameIndex)) return
    saveScoreGame(match.id, gameIndex, score[gameIndex], selectedPlayer.id)
  }

  return (
    <div className="actions">
      <div className="match-action-buttons">
        <button className={open === 'score' ? 'score-toggle active' : 'score-toggle'} type="button" onClick={() => setOpen(open === 'score' ? '' : 'score')}>
          {open === 'score' ? 'Close Score Submission' : 'Open Score Submission'}
        </button>
      </div>
      {open === 'score' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault()
          setPinAttempted(true)
          setSubmitAttempted(true)
          if (!pinIsValid() || errors.length) return
          submitScore(match.id, score, selectedPlayer.id)
        }}>
          <p className="helper-text">Save games as you play. Enter the PIN only when submitting the final score.</p>
          <div className="score-games">
            {games.map((game, gameIndex) => {
              const gameError = validateCornholeGame(score[gameIndex], gameIndex)
              const saved = gameIsSaved(gameIndex)
              const wasSaved = Boolean(match.draftScore?.[gameIndex])
              const showError = submitAttempted || attemptedGames.includes(gameIndex)
              return (
                <section className={`score-game-card ${saved ? 'saved' : ''}`} key={gameIndex}>
                  <div className="score-game-heading">
                    <h3>Game {gameIndex + 1}</h3>
                    {saved && <span>Saved</span>}
                    {!saved && wasSaved && <span className="unsaved">Unsaved changes</span>}
                  </div>
                  <div className="score-game-entry-row">
                    <div className="score-grid">
                      <label><span className="score-team-name" title={teamA?.name || 'Team A'}>{teamA?.name || 'Team A'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[0]} onChange={(event) => updateGame(gameIndex, 0, event.target.value)} /></label>
                      <label><span className="score-team-name" title={teamB?.name || 'Team B'}>{teamB?.name || 'Team B'}</span><input type="number" min="0" max="21" step="1" inputMode="numeric" value={game[1]} onChange={(event) => updateGame(gameIndex, 1, event.target.value)} /></label>
                    </div>
                    <button className="secondary save-game-button" type="button" onClick={() => handleSaveGame(gameIndex)}>
                      {saved ? 'Unsave' : 'Save'}
                    </button>
                  </div>
                  {showError && gameError && <p className="error">{gameError}</p>}
                </section>
              )
            })}
          </div>
          <div className="score-submit-row">
            <input className="score-pin-input" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN" aria-label="League PIN" type="password" />
            <button className="final-score-submit" type="submit">Save &amp; Submit Final Score</button>
          </div>
          {pinAttempted && !pin.trim() && <p className="error">Enter the league PIN.</p>}
          {pinAttempted && pin && !pinIsValid() && <p className="error">PIN should be glen.</p>}
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
    const rounds = flightTeams.length === 9
      ? buildPreservedNineTeamRounds(flightTeams)
      : flightTeams.length === 10
        ? buildPreservedTenTeamRounds(flightTeams)
        : buildRoundRobinRounds(flightTeams)

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

function buildPreservedTenTeamRounds(teams) {
  const originalTeams = teams.slice(0, 9)
  const addedTeam = teams[9]
  const originalRounds = buildPreservedNineTeamRounds(originalTeams)

  return originalRounds.map((round) => {
    const scheduledTeamIds = new Set(round.flatMap(([teamA, teamB]) => [teamA.id, teamB.id]))
    const byeTeam = originalTeams.find((team) => !scheduledTeamIds.has(team.id))
    return [...round, [byeTeam, addedTeam]]
  })
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

  const sortedRows = rows.sort(compareBocceRows)
  const leader = sortedRows[0] || { gameWins: 0, gameLosses: 0 }
  const rowsWithGamesBack = sortedRows.map((row) => ({
    ...row,
    gamesBack: Math.max(0, ((leader.gameWins - row.gameWins) + (row.gameLosses - leader.gameLosses)) / 2),
  }))

  return withBocceRankLabels(rowsWithGamesBack)
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
      item.gameLosses === row.gameLosses &&
      item.points === row.points
    ) + 1
    const isTied = rows.filter((item) =>
      item.gameWins === row.gameWins &&
      item.gameLosses === row.gameLosses &&
      item.points === row.points
    ).length > 1
    return { ...row, rank, rankLabel: isTied ? `T-${rank}` : String(rank) }
  })
}

function compareBocceRows(a, b) {
  return gameWinPercentage(b) - gameWinPercentage(a) ||
    b.gameWins - a.gameWins ||
    a.gameLosses - b.gameLosses ||
    b.points - a.points ||
    a.team.name.localeCompare(b.team.name)
}

function gameWinPercentage(row) {
  const games = row.gameWins + row.gameLosses
  return games > 0 ? row.gameWins / games : 0
}

function formatGamesBack(value) {
  if (!Number.isFinite(value) || value <= 0) return '-'
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function scoreNumber(value) {
  return value === '' || value === null || value === undefined ? Number.NaN : Number(value)
}

function validateCornholeGame(game, index) {
  if (!Number.isFinite(game[0]) || !Number.isFinite(game[1])) return `Game ${index + 1}: both scores are required.`
  if (!Number.isInteger(game[0]) || !Number.isInteger(game[1])) return `Game ${index + 1}: scores must be whole numbers.`
  if (game[0] < 0 || game[1] < 0) return `Game ${index + 1}: scores cannot be negative.`
  if (game[0] > 21 || game[1] > 21) return `Game ${index + 1}: no score over 21.`
  if (game[0] === game[1]) return `Game ${index + 1}: no ties.`
  if (game[0] !== 21 && game[1] !== 21) return `Game ${index + 1}: one team must have 21.`
  if (game[0] === 21 && game[1] === 21) return `Game ${index + 1}: only one team can have 21.`
  return ''
}

function validateScore(score) {
  return score.map(validateCornholeGame).filter(Boolean)
}

function validateBocceGame(game, index) {
  const a = Number(game[0])
  const b = Number(game[1])
  const winner = Math.max(a, b)
  const margin = Math.abs(a - b)

  if (!Number.isFinite(a) || !Number.isFinite(b)) return `Game ${index + 1}: both scores are required.`
  if (!Number.isInteger(a) || !Number.isInteger(b)) return `Game ${index + 1}: scores must be whole numbers.`
  if (a < 0 || b < 0) return `Game ${index + 1}: scores cannot be negative.`
  if (a > 21 || b > 21) return `Game ${index + 1}: no score over 21.`
  if (a === b) return `Game ${index + 1}: each game must have a winner.`
  if (winner < 11) return `Game ${index + 1}: winner must score at least 11.`
  if (margin < 2) return `Game ${index + 1}: winner must win by at least 2.`
  return ''
}

function validateBocceScore(score) {
  if (score.length < 1 || score.length > 3) return ['Bocce matches must include 1 to 3 game scores.']
  return score.map(validateBocceGame).filter(Boolean)
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
  return compareScheduleItems(a, b)
}

function byScheduleItem(a, b) {
  return compareScheduleItems(a, b)
}

function compareScheduleItems(a, b) {
  const aTime = scheduleItemTime(a)
  const bTime = scheduleItemTime(b)
  const aIsFinite = Number.isFinite(aTime)
  const bIsFinite = Number.isFinite(bTime)

  if (aIsFinite && bIsFinite && aTime !== bTime) return aTime - bTime
  if (aIsFinite !== bIsFinite) return aIsFinite ? -1 : 1

  const weekDiff = Number(a.week || 0) - Number(b.week || 0)
  if (weekDiff) return weekDiff

  const timeDiff = parseScheduleTimeMinutes(a.time) - parseScheduleTimeMinutes(b.time)
  if (Number.isFinite(timeDiff) && timeDiff) return timeDiff

  return String(a.flight || '').localeCompare(String(b.flight || ''))
}

function getCurrentScheduleWeek(matches) {
  const weekStarts = [...new Set(matches.map((match) => match.week))]
    .map((week) => {
      const weekMatches = matches.filter((match) => match.week === week)
      const times = weekMatches.map((match) => scheduleTime(match)).filter(Number.isFinite)
      return {
        week,
        start: Math.min(...times),
      }
    })
    .filter((item) => Number.isFinite(item.start))
    .sort((a, b) => a.start - b.start)

  if (!weekStarts.length) return 'All'

  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const currentIndex = weekStarts.findIndex((item, index) => {
    const start = new Date(item.start)
    const startOfWeek = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
    const nextStart = weekStarts[index + 1]?.start
    const nextStartDate = nextStart ? new Date(nextStart) : null
    const nextStartOfWeek = nextStartDate ? new Date(nextStartDate.getFullYear(), nextStartDate.getMonth(), nextStartDate.getDate()).getTime() : null
    return todayStart >= startOfWeek && (!nextStartOfWeek || todayStart < nextStartOfWeek)
  })

  if (currentIndex !== -1) return String(weekStarts[currentIndex].week)

  const upcoming = weekStarts.find((item) => item.start >= todayStart)
  return String((upcoming || weekStarts[weekStarts.length - 1]).week)
}

function scheduleTime(match) {
  return parseScheduleDateTime(match.date, match.time)
}

function scheduleItemTime(item) {
  return parseScheduleDateTime(item.date, item.time)
}

function parseScheduleDateTime(date, time = '') {
  const parsedDate = parseScheduleDateParts(date)
  if (!parsedDate) return NaN

  const minutes = parseScheduleTimeMinutes(time)
  if (!Number.isFinite(minutes)) return NaN

  return new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day, Math.floor(minutes / 60), minutes % 60).getTime()
}

function parseScheduleDateParts(date) {
  const value = String(date || '').trim()
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) }

  const slash = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})/)
  if (!slash) return null

  const rawYear = Number(slash[3])
  return {
    year: rawYear < 100 ? 2000 + rawYear : rawYear,
    month: Number(slash[1]),
    day: Number(slash[2]),
  }
}

function parseScheduleTimeMinutes(time) {
  const value = String(time || '').trim()
  const match = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
  if (!match) return NaN

  let hour = Number(match[1])
  const minute = Number(match[2] || 0)
  const period = match[3]?.toUpperCase()

  if (period === 'PM' && hour < 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  if (hour > 23 || minute > 59) return NaN

  return hour * 60 + minute
}

function publicStatus(match) {
  if (match.status === 'rescheduled') return 'Rescheduled'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'final') return 'Final'
  if (match.draftScore?.some((game) => Array.isArray(game))) return 'Score in progress'
  if (isOverdue(match)) return 'Score needed or makeup required'
  return 'Scheduled'
}

function boccePublicStatus(match) {
  if (match.status === 'rescheduled') return 'Rescheduled'
  if (match.status === 'pending') return 'Pending commissioner approval'
  if (match.status === 'final') return 'Final'
  if (match.draftScore?.some((game) => Array.isArray(game))) return 'Score in progress'
  if (new Date(`${match.date}T23:59:59`) < new Date()) return 'Score needed or makeup required'
  return 'Scheduled'
}

function formatStatusOption(status) {
  if (status === 'pending') return 'Pending'
  return status.charAt(0).toUpperCase() + status.slice(1)
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
    status === 'Rescheduled' ? 'reschedule' : '',
  ].filter(Boolean).join(' ')

  return <span className={className}>{status}</span>
}

export default App
