# Hone Session Report — 5 May 2026 (3)

## Summary

Diagnosed and fixed the root cause of missing DECISION-009 sections (mise en place, equipment, what to know, finishing note, leftovers) on Patrick's device after build #73.

## Root cause

Three compounding bugs prevented the new content fields from ever reaching the UI:

1. **No columns in SQLite** — The 7 DECISION-009 columns (equipment, mise_en_place, etc.) were added to `seed-recipes.ts` but never to the database schema. The recipes table had no columns for them.
2. **Migration runner never wired** — `SCHEMA_MIGRATIONS` was defined in `schema.ts` for 5 versions but `initDatabase` in `database.ts` never called a migration runner. Migrations never ran.
3. **Seeding guard** — Once `app_meta.seeded = '1'` is set on first install, `seedDatabase` is never called again. Re-seeding on update was never possible regardless of the schema issue.

## Fix (build #74)

Four files changed, one commit each:

**`mobile/src/data/types.ts`** (commit `a46da96`)
- Expanded `DifficultyLevel` enum to accept both old (`'Easy'`, `'Intermediate'`, `'Involved'`) and new (`'beginner'`, `'intermediate'`, `'advanced'`) values — backward compatible, no existing rows break
- Added 7 new optional fields to Recipe schema: `total_time_minutes`, `active_time_minutes`, `equipment`, `before_you_start`, `mise_en_place`, `finishing_note`, `leftovers_note`

**`mobile/db/schema.ts`** (commit `74bda5a`)
- Bumped `SCHEMA_VERSION` to 6
- Added 7 new columns to `SCHEMA_SQL` recipes `CREATE TABLE` (for fresh installs)
- Added `SCHEMA_MIGRATIONS[6]` with 7 `ALTER TABLE recipes ADD COLUMN` statements (for existing installs)

**`mobile/db/seed.ts`** (commit `7e7b12e`)
- Added `refreshSeedRecipeFields()` — runs every launch, UPDATEs all seed recipe rows with the latest field data from `SEED_RECIPES`. This is the permanent fix for the seeding guard: new content fields ship in the next APK without requiring a reinstall.

**`mobile/db/database.ts`** (commit `cf827ac`)
- Added `runMigrations()` function using `PRAGMA user_version` as version counter — wires `SCHEMA_MIGRATIONS` into the init path for the first time
- Updated `initDatabase` to: (1) call `runMigrations` before the seed gate, (2) call `syncNewSeedRecipes` + `refreshSeedRecipeFields` on every subsequent launch
- Updated `RecipeRow` interface, `rowToRecipe`, and `insertRecipe` to handle all 7 new columns

## Launch sequence on Patrick's device (build #74)

1. `initDatabase` runs
2. `CREATE TABLE IF NOT EXISTS` — no-op (tables exist)
3. `runMigrations`: reads `PRAGMA user_version = 0`, runs migrations 1–6, adds 7 new columns to recipes table, sets `user_version = 6`
4. `app_meta.seeded = '1'` exists → goes to else branch
5. `syncNewSeedRecipes` — no new IDs, all skip
6. `refreshSeedRecipeFields` — UPDATEs all seed recipe rows with equipment, mise_en_place, difficulty, etc.
7. Next time `getRecipeById` runs, reads new columns, returns full Recipe object
8. recipe/[id].tsx renders mise en place, equipment, what to know, finishing note, leftovers ✅

## Patrick's actions

- Install build #74 APK when the Actions run completes
- Open Chicken Schnitzel (or any of the 6 cook batch recipes) and verify:
  - [ ] "At a glance" shows total time (35 min) and difficulty (Beginner)
  - [ ] "What to know" section visible with 3 bullet points
  - [ ] "Equipment" row visible
  - [ ] "Mise en place" section visible with prep steps
  - [ ] "Finishing & tasting" note visible after cook steps
  - [ ] "Leftovers" section visible at bottom

## Open items

- Cook Batch 2 — cook is writing 11 launch-priority recipes; no action needed until she ships
- PAT rotation — open handoff (repo went private)
