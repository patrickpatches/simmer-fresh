/**
 * Seed loader — runs once on first app launch, gated by the `app_meta.seeded`
 * flag set inside `initDatabase`.
 *
 * The job here is deliberately thin:
 *   1. iterate SEED_RECIPES
 *   2. validate each one at runtime against the Zod schema
 *   3. write it through the same `insertRecipe` CRUD path user-added recipes use
 *
 * Why validate at runtime when the array is already typed as `Recipe[]`?
 * Because Zod's `.refine()` on Recipe (the rule that a non-user-added, non-
 * Claude-generated recipe must have a `source`) runs at runtime, not at the
 * TS level. A seed that ships without attribution would silently break
 * Golden Rule #2 in production. Better to crash loudly in dev.
 *
 * Why reuse `insertRecipe` instead of writing a bespoke bulk path? One write
 * path means "does the seed work" and "does user-add work" are the same
 * question. Twenty-eight inserts on first launch is not a perf problem.
 */

import type { SQLiteDatabase } from 'expo-sqlite';

import { Recipe as RecipeSchema } from '../src/data/types';
import { SEED_RECIPES } from '../src/data/seed-recipes';
import { insertRecipe } from './database';

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  for (const raw of SEED_RECIPES) {
    const parsed = RecipeSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new Error(
        `seed: recipe "${(raw as { id?: string }).id ?? '(unknown)'}" failed ` +
          `validation at "${first.path.join('.')}" — ${first.message}`,
      );
    }
    await insertRecipe(db, parsed.data);
  }
}

/**
 * Insert any seed recipes that are not yet in the database.
 *
 * Runs every launch. Skips recipes whose ID already exists, so it is safe
 * and cheap after the initial seed (one SELECT per recipe). This is what
 * makes new seed recipes appear on existing installs without a reinstall.
 */
export async function syncNewSeedRecipes(db: SQLiteDatabase): Promise<void> {
  for (const raw of SEED_RECIPES) {
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM recipes WHERE id = ?',
      [(raw as { id: string }).id],
    );
    if (existing) continue;

    const parsed = RecipeSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new Error(
        `seed: recipe "${(raw as { id?: string }).id ?? '(unknown)'}" failed ` +
          `validation at "${first.path.join('.')}" — ${first.message}`,
      );
    }
    await insertRecipe(db, parsed.data);
  }
}

/**
 * Refresh DECISION-009 content fields on existing seed recipes.
 *
 * Runs every launch (cheap: one SELECT + one UPDATE per recipe, all on the
 * same connection). Idempotent — running it again produces the same rows.
 *
 * This is the fix for the seeding-guard problem: once `app_meta.seeded = '1'`
 * is set, seedDatabase never runs again. Any new content fields added to
 * SEED_RECIPES after the initial install are invisible unless we explicitly
 * UPDATE the existing rows. This function does that for all authored seed
 * recipes on every launch, so new field data ships in the next APK with no
 * reinstall required.
 *
 * Only updates rows where user_added = 0 and generated_by_claude = 0 —
 * user recipes are never clobbered. Silently skips recipes that fail
 * validation (safeParse) so a broken seed entry cannot crash the launch.
 */
export async function refreshSeedRecipeFields(db: SQLiteDatabase): Promise<void> {
  for (const raw of SEED_RECIPES) {
    const recipeId = (raw as { id: string }).id;

    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM recipes WHERE id = ? AND user_added = 0 AND generated_by_claude = 0',
      [recipeId],
    );
    if (!existing) continue;

    const parsed = RecipeSchema.safeParse(raw);
    if (!parsed.success) continue;

    const r = parsed.data;
    await db.runAsync(
      `UPDATE recipes SET
        total_time_minutes = ?,
        active_time_minutes = ?,
        equipment = ?,
        before_you_start = ?,
        mise_en_place = ?,
        finishing_note = ?,
        leftovers_note = ?,
        difficulty = ?
       WHERE id = ? AND user_added = 0`,
      [
        r.total_time_minutes ?? null,
        r.active_time_minutes ?? null,
        r.equipment ? JSON.stringify(r.equipment) : null,
        r.before_you_start ? JSON.stringify(r.before_you_start) : null,
        r.mise_en_place ? JSON.stringify(r.mise_en_place) : null,
        r.finishing_note ?? null,
        r.leftovers_note ?? null,
        r.difficulty,
        r.id,
      ],
    );
  }
}

/**
 * Sync substitution data from seed recipes into the DB.
 *
 * Runs every launch (idempotent UPDATE — no data loss). This ensures that
 * when swap data is added or updated in seed-recipes.ts, existing installs
 * get the new data without requiring a full re-seed (which would wipe meal
 * plan entries via cascade delete).
 */
export async function updateSubstitutions(db: SQLiteDatabase): Promise<void> {
  for (const recipe of SEED_RECIPES) {
    for (const ing of recipe.ingredients) {
      if (ing.substitutions && ing.substitutions.length > 0) {
        await db.runAsync(
          'UPDATE ingredients SET substitutions = ? WHERE id = ? AND recipe_id = ?',
          [JSON.stringify(ing.substitutions), ing.id, recipe.id],
        );
      }
    }
  }
}
