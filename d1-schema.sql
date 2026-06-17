CREATE TABLE IF NOT EXISTS league_state (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO league_state (id, data, updated_at)
VALUES ('haddon-glen-2026', '{}', datetime('now'));
