/**
 * Seed loader — runs once on first app launch, gated by the `app_meta.seeded`
 * flag set inside `initDatabase`.
 *
 * The job here is deliberately thin:
 *   1. iterate `SEED_RECIPES`
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
