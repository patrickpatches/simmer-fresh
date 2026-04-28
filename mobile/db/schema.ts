/**
 * SQLite schema — CREATE TABLE statements.
 * Each string is run once during initDatabase.
 * Foreign keys with ON DELETE CASCADE keep child rows tidy when a recipe is deleted.
 */

export const SCHEMA_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS recipes (
    id                     TEXT PRIMARY KEY,
    title                  TEXT NOT NULL,
    tagline                TEXT NOT NULL,
    description            TEXT,
    base_servings          INTEGER NOT NULL DEFAULT 2,
    time_min               INTEGER NOT NULL DEFAULT 30,
    difficulty             TEXT NOT NULL DEFAULT 'Easy',
    tags                   TEXT NOT NULL DEFAULT '[]',
    source_chef            TEXT,
    source_video_url       TEXT,
    source_notes           TEXT,
    hero_url               TEXT,
    hero_fallback          TEXT,
    emoji                  TEXT,
    user_added             INTEGER NOT NULL DEFAULT 0,
    generated_by_claude    INTEGER NOT NULL DEFAULT 0,
    leftover_extra_servings INTEGER,
    leftover_note          TEXT,
    created_at             TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS ingredients (
    id          TEXT NOT NULL,
    recipe_id   TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    name        TEXT NOT NULL,
    amount      REAL NOT NULL DEFAULT 0,
    unit        TEXT NOT NULL DEFAULT '',
    scales      TEXT NOT NULL DEFAULT 'linear',
    cap         REAL,
    prep        TEXT,
    curve       TEXT,
    PRIMARY KEY (id, recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS method_steps (
    id              TEXT NOT NULL,
    recipe_id       TEXT NOT NULL,
    step_order      INTEGER NOT NULL,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    stage_note      TEXT,
    lookahead       TEXT,
    timer_seconds   INTEGER,
    photo_url       TEXT,
    why_note        TEXT,
    ingredient_refs TEXT,
    PRIMARY KEY (id, recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS pantry_items (
    id        TEXT PRIMARY KEY,
    name      TEXT NOT NULL,
    category  TEXT NOT NULL DEFAULT 'Pantry Staples',
    quantity  REAL,
    unit      TEXT,
    have_it   INTEGER NOT NULL DEFAULT 1
  )`,

  `CREATE TABLE IF NOT EXISTS meal_plan (
    id         TEXT PRIMARY KEY,
    date       TEXT NOT NULL,
    recipe_id  TEXT NOT NULL,
    servings   INTEGER NOT NULL DEFAULT 2,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS favorites (
    recipe_id  TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS shopping_items (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'Pantry Staples',
    quantity        REAL,
    unit            TEXT,
    notes           TEXT,
    manually_added  INTEGER NOT NULL DEFAULT 0,
    in_cart         INTEGER NOT NULL DEFAULT 0,
    added_at        INTEGER NOT NULL DEFAULT 0,
    sources_json    TEXT NOT NULL DEFAULT '[]'
  )`,

  `CREATE TABLE IF NOT EXISTS app_meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
];
