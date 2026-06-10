begin;

delete from season_archives;
delete from daily_snapshots;
delete from audit_log;
delete from app_settings;
delete from approved_scores;
delete from score_submissions;
delete from matches;
delete from players;
delete from teams;
delete from flights;
delete from trophy_room_entries;
delete from seasons;
delete from leagues;
delete from sports;

with sport as (
  insert into sports (name, slug)
  values ('Cornhole', 'cornhole')
  returning id
),
league as (
  insert into leagues (sport_id, name, slug, description)
  select id, 'Haddon Glen Cornhole League', 'haddon-glen-cornhole', 'Haddon Glen Pool Club cornhole league'
  from sport
  returning id
),
season as (
  insert into seasons (league_id, name, year, is_active, starts_on, ends_on)
  select id, 'Summer 2026', 2026, true, '2026-05-07', '2026-06-18'
  from league
  returning id, league_id
),
green as (
  insert into flights (season_id, name, sort_order, color_label)
  select id, 'Green', 1, 'green'
  from season
  returning id, season_id
),
red as (
  insert into flights (season_id, name, sort_order, color_label)
  select id, 'Red', 2, 'red'
  from season
  returning id, season_id
),
white as (
  insert into flights (season_id, name, sort_order, color_label)
  select id, 'White', 3, 'white'
  from season
  returning id, season_id
),
team_seed as (
  select * from (
    values
      ('g-sharks', 'Green', 1, 'Glen Sharks'),
      ('g-dolphins', 'Green', 2, 'Deck Dolphins'),
      ('r-rays', 'Red', 3, 'Ripple Rays'),
      ('r-tides', 'Red', 4, 'Toss Tides'),
      ('w-caps', 'White', 5, 'Corner Caps'),
      ('w-waves', 'White', 6, 'White Waves')
  ) as t(seed_key, flight_name, team_number, team_name)
),
inserted_teams as (
  insert into teams (season_id, flight_id, team_number, team_name)
  select
    s.id,
    f.id,
    ts.team_number,
    ts.team_name
  from team_seed ts
  cross join season s
  join flights f on f.season_id = s.id and f.name = ts.flight_name
  returning id, season_id, flight_id, team_number, team_name
),
player_seed as (
  select * from (
    values
      (1, 'Jordan', 'Avery', '856-555-0101'),
      (1, 'Morgan', 'Baker', '856-555-0102'),
      (2, 'Casey', 'Carter', '856-555-0103'),
      (2, 'Taylor', 'Dawson', '856-555-0104'),
      (3, 'Jamie', 'Ellis', '856-555-0105'),
      (3, 'Riley', 'Foster', '856-555-0106'),
      (4, 'Alex', 'Garcia', '856-555-0107'),
      (4, 'Sam', 'Hughes', '856-555-0108'),
      (5, 'Robin', 'Irwin', '856-555-0109'),
      (5, 'Drew', 'Jones', '856-555-0110'),
      (6, 'Cameron', 'Kelly', '856-555-0111'),
      (6, 'Quinn', 'Lee', '856-555-0112')
  ) as p(team_number, first_name, last_name, phone)
)
insert into players (season_id, team_id, first_name, last_name, display_name, phone)
select t.season_id, t.id, p.first_name, p.last_name, p.first_name || ' ' || p.last_name, p.phone
from player_seed p
join inserted_teams t on t.team_number = p.team_number;

with active_season as (
  select id from seasons where is_active = true and name = 'Summer 2026'
),
match_seed as (
  select * from (
    values
      (1, '2026-05-07'::date, '18:30'::time, 'Green', 1, 2, 'final', 21, 18, 16, 21),
      (1, '2026-05-07'::date, '19:15'::time, 'Red', 3, 4, 'final', 21, 12, 21, 19),
      (1, '2026-05-07'::date, '20:00'::time, 'White', 5, 6, 'final', 17, 21, 21, 14),
      (2, '2026-05-14'::date, '18:30'::time, 'Green', 2, 1, 'pending_approval', null, null, null, null),
      (2, '2026-05-14'::date, '19:15'::time, 'Red', 4, 3, 'rescheduled', null, null, null, null),
      (2, '2026-05-14'::date, '20:00'::time, 'White', 6, 5, 'scheduled', null, null, null, null),
      (3, '2026-05-21'::date, '18:30'::time, 'Green', 1, 2, 'final', 21, 10, 21, 20),
      (3, '2026-05-21'::date, '19:15'::time, 'Red', 3, 4, 'scheduled', null, null, null, null),
      (3, '2026-05-21'::date, '20:00'::time, 'White', 5, 6, 'pending_approval', null, null, null, null),
      (4, '2026-05-28'::date, '18:30'::time, 'Green', 2, 1, 'scheduled', null, null, null, null),
      (4, '2026-05-28'::date, '19:15'::time, 'Red', 4, 3, 'final', 21, 15, 12, 21),
      (4, '2026-05-28'::date, '20:00'::time, 'White', 6, 5, 'scheduled', null, null, null, null),
      (5, '2026-06-04'::date, '18:30'::time, 'Green', 1, 2, 'scheduled', null, null, null, null),
      (5, '2026-06-04'::date, '19:15'::time, 'Red', 3, 4, 'scheduled', null, null, null, null),
      (5, '2026-06-04'::date, '20:00'::time, 'White', 5, 6, 'rescheduled', null, null, null, null),
      (6, '2026-06-11'::date, '18:30'::time, 'Green', 2, 1, 'scheduled', null, null, null, null),
      (6, '2026-06-11'::date, '19:15'::time, 'Red', 4, 3, 'scheduled', null, null, null, null),
      (6, '2026-06-11'::date, '20:00'::time, 'White', 6, 5, 'scheduled', null, null, null, null),
      (7, '2026-06-18'::date, '18:30'::time, 'Green', 1, 2, 'scheduled', null, null, null, null),
      (7, '2026-06-18'::date, '19:15'::time, 'Red', 3, 4, 'scheduled', null, null, null, null),
      (7, '2026-06-18'::date, '20:00'::time, 'White', 5, 6, 'scheduled', null, null, null, null)
  ) as m(week_number, scheduled_date, scheduled_time, flight_name, team_a_number, team_b_number, status, g1a, g1b, g2a, g2b)
),
inserted_matches as (
  insert into matches (season_id, flight_id, week_number, scheduled_date, scheduled_time, team_a_id, team_b_id, status)
  select s.id, f.id, m.week_number, m.scheduled_date, m.scheduled_time, ta.id, tb.id, m.status
  from match_seed m
  cross join active_season s
  join flights f on f.season_id = s.id and f.name = m.flight_name
  join teams ta on ta.season_id = s.id and ta.team_number = m.team_a_number
  join teams tb on tb.season_id = s.id and tb.team_number = m.team_b_number
  returning id, week_number, scheduled_date, scheduled_time, team_a_id, team_b_id, status
),
final_seed as (
  select im.id as match_id, ms.g1a, ms.g1b, ms.g2a, ms.g2b
  from inserted_matches im
  join match_seed ms on ms.week_number = im.week_number and ms.scheduled_date = im.scheduled_date and ms.scheduled_time = im.scheduled_time
  where im.status = 'final'
),
submission_insert as (
  insert into score_submissions (
    match_id, submitted_by_player_id, submitted_by_team_id, submitted_at, played_date,
    game1_team_a_score, game1_team_b_score, game2_team_a_score, game2_team_b_score,
    team_a_total_points, team_b_total_points, team_a_game_wins, team_b_game_wins,
    team_a_match_win, team_b_match_win, status, approved_by_admin_name, approved_at
  )
  select
    fs.match_id,
    p.id,
    m.team_a_id,
    now(),
    m.scheduled_date,
    fs.g1a,
    fs.g1b,
    fs.g2a,
    fs.g2b,
    fs.g1a + fs.g2a,
    fs.g1b + fs.g2b,
    (case when fs.g1a > fs.g1b then 1 else 0 end) + (case when fs.g2a > fs.g2b then 1 else 0 end),
    (case when fs.g1b > fs.g1a then 1 else 0 end) + (case when fs.g2b > fs.g2a then 1 else 0 end),
    ((case when fs.g1a > fs.g1b then 1 else 0 end) + (case when fs.g2a > fs.g2b then 1 else 0 end)) > 1,
    ((case when fs.g1b > fs.g1a then 1 else 0 end) + (case when fs.g2b > fs.g2a then 1 else 0 end)) > 1,
    'approved',
    'Seed Admin',
    now()
  from final_seed fs
  join matches m on m.id = fs.match_id
  join players p on p.team_id = m.team_a_id
  where p.created_at = (select min(p2.created_at) from players p2 where p2.team_id = m.team_a_id)
  returning *
)
insert into approved_scores (
  match_id, score_submission_id, approved_at, approved_by_admin_name,
  game1_team_a_score, game1_team_b_score, game2_team_a_score, game2_team_b_score,
  team_a_total_points, team_b_total_points, team_a_game_wins, team_b_game_wins,
  team_a_match_win, team_b_match_win
)
select
  match_id, id, now(), 'Seed Admin',
  game1_team_a_score, game1_team_b_score, game2_team_a_score, game2_team_b_score,
  team_a_total_points, team_b_total_points, team_a_game_wins, team_b_game_wins,
  team_a_match_win, team_b_match_win
from submission_insert;

insert into app_settings (season_id, key, value)
select id, 'player_pin_enabled', 'true'::jsonb from seasons where is_active = true
union all
select id, 'player_pin_hash', to_jsonb(encode(digest(lower('Glen'), 'sha256'), 'hex')) from seasons where is_active = true
union all
select id, 'snapshot_enabled', 'false'::jsonb from seasons where is_active = true
union all
select id, 'snapshot_time', '"02:00"'::jsonb from seasons where is_active = true;

insert into app_settings (season_id, key, value)
values (null, 'admin_password_hash', to_jsonb(encode(digest('GlenAdmin', 'sha256'), 'hex')));

insert into trophy_room_entries (league_id, season_name, year, flight_name, champion_team_name, champion_player_names)
select l.id, entry.season_name, entry.year, entry.flight_name, entry.team_name, entry.players
from leagues l
cross join (
  values
    ('Summer 2025', 2025, 'Green', 'Glen Sharks', 'Jordan Avery, Morgan Baker'),
    ('Summer 2025', 2025, 'Red', 'Ripple Rays', 'Jamie Ellis, Riley Foster'),
    ('Summer 2025', 2025, 'White', 'White Waves', 'Cameron Kelly, Quinn Lee'),
    ('Summer 2024', 2024, 'Green', 'Deck Dolphins', 'Casey Carter, Taylor Dawson'),
    ('Summer 2024', 2024, 'Red', 'Toss Tides', 'Alex Garcia, Sam Hughes'),
    ('Summer 2024', 2024, 'White', 'Corner Caps', 'Robin Irwin, Drew Jones')
) as entry(season_name, year, flight_name, team_name, players)
where l.slug = 'haddon-glen-cornhole';

commit;
