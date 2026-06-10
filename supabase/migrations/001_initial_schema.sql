create extension if not exists pgcrypto;

create table if not exists sports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists leagues (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid not null references sports(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  name text not null,
  year integer not null,
  is_active boolean not null default false,
  starts_on date,
  ends_on date,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  color_label text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  flight_id uuid not null references flights(id) on delete cascade,
  team_number integer not null,
  team_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  display_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  flight_id uuid not null references flights(id) on delete cascade,
  week_number integer not null,
  scheduled_date date not null,
  scheduled_time time not null,
  team_a_id uuid not null references teams(id) on delete cascade,
  team_b_id uuid not null references teams(id) on delete cascade,
  status text not null default 'scheduled' check (status in ('scheduled', 'rescheduled', 'pending_approval', 'final', 'rejected')),
  proposed_makeup_at timestamptz,
  reschedule_note text,
  rescheduled_by_player_id uuid references players(id) on delete set null,
  rescheduled_at timestamptz,
  actual_played_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists score_submissions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  submitted_by_player_id uuid not null references players(id) on delete restrict,
  submitted_by_team_id uuid not null references teams(id) on delete restrict,
  submitted_at timestamptz not null default now(),
  played_date date not null,
  game1_team_a_score integer not null,
  game1_team_b_score integer not null,
  game2_team_a_score integer not null,
  game2_team_b_score integer not null,
  team_a_total_points integer not null,
  team_b_total_points integer not null,
  team_a_game_wins integer not null,
  team_b_game_wins integer not null,
  team_a_match_win boolean not null,
  team_b_match_win boolean not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  user_agent text,
  ip_hash text,
  approved_by_admin_name text,
  approved_at timestamptz,
  rejected_by_admin_name text,
  rejected_at timestamptz,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists approved_scores (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references matches(id) on delete cascade,
  score_submission_id uuid not null references score_submissions(id) on delete restrict,
  approved_at timestamptz not null default now(),
  approved_by_admin_name text not null,
  game1_team_a_score integer not null,
  game1_team_b_score integer not null,
  game2_team_a_score integer not null,
  game2_team_b_score integer not null,
  team_a_total_points integer not null,
  team_b_total_points integer not null,
  team_a_game_wins integer not null,
  team_b_game_wins integer not null,
  team_a_match_win boolean not null,
  team_b_match_win boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references seasons(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  unique (season_id, key)
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  actor_type text not null,
  actor_player_id uuid references players(id) on delete set null,
  actor_admin_name text,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  snapshot_date date not null,
  snapshot_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (season_id, snapshot_date)
);

create table if not exists trophy_room_entries (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  season_name text not null,
  year integer not null,
  flight_name text not null,
  champion_team_name text not null,
  champion_player_names text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists season_archives (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  archived_at timestamptz not null default now(),
  archive_summary_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists leagues_sport_id_idx on leagues(sport_id);
create index if not exists seasons_league_id_idx on seasons(league_id);
create index if not exists flights_season_id_idx on flights(season_id);
create index if not exists teams_season_id_idx on teams(season_id);
create index if not exists players_season_id_idx on players(season_id);
create index if not exists matches_season_id_idx on matches(season_id);
create index if not exists score_submissions_match_id_idx on score_submissions(match_id);
create index if not exists score_submissions_status_idx on score_submissions(status);

alter table sports enable row level security;
alter table leagues enable row level security;
alter table seasons enable row level security;
alter table flights enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table score_submissions enable row level security;
alter table approved_scores enable row level security;
alter table app_settings enable row level security;
alter table audit_log enable row level security;
alter table daily_snapshots enable row level security;
alter table trophy_room_entries enable row level security;
alter table season_archives enable row level security;

create policy "public read sports" on sports for select using (true);
create policy "public read leagues" on leagues for select using (true);
create policy "public read seasons" on seasons for select using (true);
create policy "public read flights" on flights for select using (true);
create policy "public read teams" on teams for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read approved scores" on approved_scores for select using (true);
create policy "public read trophy room" on trophy_room_entries for select using (true);
create policy "public read season archives" on season_archives for select using (true);
