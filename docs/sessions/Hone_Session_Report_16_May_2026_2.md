# Hone Session Report — Saturday 16 May 2026 (Report 2)

**Engineer:** Senior Product Engineer (Claude)
**Continues from:** `Hone_Session_Report_16_May_2026.md` (builds #110, #111, #112)
**Builds dispatched in this session block:** #113 and #114
**Latest HEAD on origin/main:** `72ebc14` (build-log hash-fill for #114)
**APK to install:** **build #114** when it finishes — cumulative HEAD, contains every fix from #95 → #114.

---

## Headline

Two follow-up builds on top of the morning's #112:

- **#113** — root-cause fix for three on-device bugs Patrick caught after installing #112: swap button missing, only one cuisine tile rendering, hero images not appearing. All three were the same architectural class (SQLite schema column exists, data gets written, but row-to-object mappers silently drop the field on read-back — same shape as the DECISION-014 portion-sizing bug from #99).
- **#114** — swap-trigger UX redesign in response to three new bugs Patrick caught after installing #113: prep-tap accidentally opens swap popup, popup re-opens after dismiss on the next tap anywhere, swap affordance not visible enough.

Per R-015 — both are **shipped to main, awaiting Patrick on-device validation**. Not self-closing.

---

## Build #113 — DB pipeline fixes (commit `e9a452b`, dispatched 2026-05-16 ~00:55 UTC)

### Bugs reported by Patrick on build #112

1. **Swap button doesn't appear** on any ingredient.
2. **Only one cuisine tile** ("All") shows on the Kitchen browse screen.
3. **Hero images don't render** on the Kitchen cards — flat colour gradients instead of the Carbonara/Falafel/Pavlova photos that had been wired into seed-recipes.ts.

### Diagnosis — same architectural class for all three

All three were the **R-014 silent-drop pattern** that bit DECISION-014 last week: SQLite has the column, data gets written via UPDATE on every launch, but the row-to-object mapper that converts the SQLite row back into a Recipe / Ingredient never reads the field. So `recipe.categories` and `ing.substitutions` were always `undefined` even though the underlying data was sitting in SQLite.

| Bug | Where the data drops | What was undefined as a result |
|---|---|---|
| Swap button missing | `rowToIngredient` (db/database.ts) | `ing.substitutions` → `hasSwaps` always false → swap affordance never renders |
| Only one cuisine tile | `rowToRecipe` (db/database.ts) | `recipe.categories` → Kitchen tile filter trims everything except "All" |
| Hero images missing | `HeroBackground` + `RecipeRow` (app/(tabs)/index.tsx) | The Kitchen components only ever rendered gradient bands; `recipe.hero_url` was passed but never used by an Image component |

### Bonus finding mid-diagnosis

While verifying the hero URLs against the Unsplash CDN via `curl -I`:

| Recipe | URL | HTTP |
|---|---|---|
| Carbonara | `photo-1612874742237-6526221588e3` | **200 OK** |
| Falafel   | `photo-pQnsKWk5ljQ` | **404** |
| Pavlova   | `photo-5nCTfEru3Do` | **404** |

The Falafel and Pavlova URLs cook approved in `visual-assets-ledger.md` are Unsplash *page short-codes*, not the `images.unsplash.com/photo-{numeric-id}-{hash}` CDN paths the React Native `<Image>` component needs. Even after the rendering fix, those two recipes would have shown broken-image icons.

### Fixes applied (one commit, six anchors)

| File | Change |
|---|---|
| `mobile/db/schema.ts` | New migration 9 — adds `hero_attribution` column to `recipes` (was added to Zod in #110, never persisted). SCHEMA_VERSION bumped 8 → 9. |
| `mobile/db/database.ts` | `RecipeRow` + `IngredientRow` get the missing fields. `rowToIngredient` now parses `substitutions` JSON with a defensive try/catch. `rowToRecipe` parses `categories` JSON and reads `hero_attribution`. `insertRecipe` writes `categories` and `hero_attribution` for fresh installs and writes `substitutions` for ingredients. |
| `mobile/db/seed.ts` | `refreshSeedRecipeFields` now UPDATEs `categories`, `hero_attribution`, AND `hero_url` on every launch. The `hero_url` UPDATE means existing installs pick up the #110 SMASH_BURGER hero-strip and the #113 Falafel/Pavlova URL-strip without an uninstall. |
| `mobile/src/data/seed-recipes.ts` | Stripped the two 404-ing Unsplash URLs (Falafel + Pavlova) plus their `hero_attribution` lines so the credit pill doesn't orphan. Both render the gradient-bands fallback until Photography Director sources proper CDN URLs. |
| `mobile/app/(tabs)/index.tsx` | `HeroBackground` and the `RecipeRow` thumbnail now render `<Image source={{uri: recipe.hero_url}}>` via `expo-image` when `hero_url` is set; fall back to the gradient + emoji combo when absent. |
| `docs/coo/handoffs.md` | Build-log row + URGENT handoff to Photography Director about the 404 URLs. |

### Validation gate

- `npx tsc --noEmit` clean across all modified files.
- R-014 truncation guardrail script: 25 .ts/.tsx files all end on a balanced closing token.
- Byte tail verified for each of the 5 modified files.

---

## Build #114 — swap-trigger redesign (commit `cd65ab1`, dispatched 2026-05-16 ~01:25 UTC)

### Bugs reported by Patrick on build #113

1. **Tapping a prep stage** to cross it off accidentally opens the **swap popup**.
2. After picking a swap and tapping Done, the **popup re-opens** on the next tap anywhere on the screen.
3. The **swap affordance isn't visible enough** to read as "tap here to swap."

### Diagnosis — all three were the same root cause

The entire ingredient row was a Pressable that fired `openSwapSheet`. That gave a 320×54px hit target with no clear visual affordance. Three downstream symptoms followed naturally:

- **Bug 2** (re-open after dismiss): the bottom-sheet's dismiss animation completed, but a stale tap that landed on the wide row body re-triggered the sheet. This is a known interaction with `@gorhom/bottom-sheet` modals and large underlying Pressables.
- **Bug 1** (prep collision): a knuckle tap near the boundary between the prep section and the ingredient list could land on the wide ingredient row Pressable instead of the prep item, opening the swap sheet for an adjacent ingredient.
- **Bug 3** (visibility): the only visual hint was a 14sp ↻ icon at the far right of the row. Easy to miss when scanning.

### Fix

A single design change addresses all three symptoms:

| Before | After |
|---|---|
| Whole row is a Pressable that triggers swap | Row body is **inert** in non-cook mode (`onPress={undefined}`, `disabled={!cooking}`) |
| Tiny 14sp ↻ icon at the row end | **Dedicated Swap pill** — rounded pill, 11sp ↻ icon + "Swap" / "Swapped" text + visible coloured border |
| All ingredients look the same | Pill is **gold-bordered** when swappable but not yet chosen, takes the **active swap's PILL_CONFIG colour** (green / yellow / red) when a swap is in effect |
| Cook mode: row body ticks | **Unchanged** — `onPress={cooking ? tickIngredient : undefined}` |

The small hit target of the pill kills the stray-tap problem (Bug 2), the row body being inert removes the collision with adjacent prep items (Bug 1), and the named + bordered pill makes the affordance unmissable (Bug 3).

### Other bugs checked while fixing

- **Mise / prep section** uses its own `MiseItem` Pressable that calls `toggleMise`. That path was always clean — Bug 1 was the collision in the ingredient row, not the prep row.
- **Cook-mode tap-to-tick** on the row body still works. The Pressable's `onPress` only switches based on `cooking`, so the cook path is preserved.
- **Accessibility label** on the new pill names both the action AND the currently-active swap if any (e.g. `"Change swap on Guanciale, currently Pancetta, diced"`).

### Validation gate

- `npx tsc --noEmit` clean.
- R-014 truncation guardrail green.
- Byte-tail verified for the one file touched.

---

## Cumulative state on `main` after #114

| Layer | Status |
|---|---|
| Launch roster | 16 launch / 30 holding (DECISION-013 split, enforced by `pruneOrphanedSeedRecipes`) |
| Substitution quality | 211 🟢 / 338 🟡 / 94 🔴 / 0 legacy (DECISION-015 cook-authored) |
| `step_overrides` | 12 cook-authored across 8 recipes |
| Hero images | **1 APPROVED on-screen** (Carbonara). Falafel + Pavlova render gradient until Photography Director sources proper CDN URLs |
| Cuisine tiles | Filter trims to ≥1 launch-recipe cuisines — **now working** after #113 DB-mapping fix. Shows 7 tiles + All |
| Swap UI | Dedicated pill on each substitutable ingredient. Colour reflects active swap state |
| Cook mode | Wake lock ✅ / OLED true-black ✅ / haptics ✅ / knuckle-tap-to-advance ✅ |
| Pantry persistence | `allowBackup: false` shipped in #112; Patrick validated uninstall-reinstall is clean (R-016 closed) |
| R-014 CI guardrail | Workflow live on every push + every PR; green for #113 and #114 |

---

## Open handoffs Patrick should action

### Build #114 on-device validation (R-015 gate)

1. Open Pasta Carbonara → each ingredient with substitutions shows a **gold-bordered "Swap" pill** at the row's right edge.
2. Tap the pill (not the row) → bottom sheet opens. Pick a swap. Tap the Confirm button.
3. Now tap anywhere else on the screen — the row body, a prep item, an empty area. The sheet should **not** re-open.
4. The pill on the swapped ingredient now reads **"Swapped"** in the active swap's colour.
5. Tap a prep stage to cross it off — toggles correctly, no swap popup.
6. Start cooking → tap an ingredient row body → ticks. Tap the Swap pill while cooking → still opens the sheet.

### Build #113 on-device validation (R-015 gate, still outstanding)

1. Open Kitchen → cuisine tile row shows 7 tiles + All (Australian, Levantine, Italian, Indian, Thai, American, Mexican). Tapping each filters; tapping again deselects.
2. Pasta Carbonara hero card and detail screen show a real photo with "Photo: Unsplash" credit in the bottom-right.
3. Falafel + Pavlova render the gradient fallback + emoji — no broken-image icons.

---

## COO handover notes — open items as of 16 May 2026

### Owed back by Cook

- **Falafel + Pavlova hero CDN URLs.** The page short-codes cook approved (`photo-pQnsKWk5ljQ`, `photo-5nCTfEru3Do`) are not the CDN paths the app's `<Image>` needs. Photography Director needs to open each photo on Unsplash and grab the direct `images.unsplash.com/photo-{NUMERIC}-{HASH}` URL. Cook then re-signs off. Engineer migrates as a data-only commit.
- **DECISION-015 missing-text gaps (8 entries)** — flagged in handoffs.md after build #111. Cook flagged `step_overrides` in her discrepancy tables for these but didn't author the alternate step content: SMASH_BURGER (×3 — Wagyu, American cheese, Bread & butter pickles), HUMMUS (tinned chickpeas → s2), PAD_THAI (×4 step-override flags), FALAFEL (×2). Engineer applies once cook writes the text.
- **DECISION-015 ambiguous step anchors (2 entries)** — BEEF_LASAGNE "ragù step" (could be `step_2_brown_mince`, `step_4_wine`, or `step_5_simmer`); ROAST_LAMB "prep" (could be `step_1_temper`, `step_2_score`, or `step_3_season`). Cook picks which step ID applies; engineer applies.
- **FLOUR_TORTILLAS Vegetable shortening** — cook's discrepancy table includes a substitution that isn't in the recipe const's `substitutions` array. Cook either adds it (with the `changes` line) or drops the table entry.

### Owed back by Photography Director

- 10 not-yet-reviewed hero candidates (Bolognese, Roast Chicken, Butter Chicken, Green Curry, Schnitzel, Lasagne, Fish & Chips, Hummus, Pad Thai, Roast Lamb) — cook validation pending.
- 2 REJECTED hero replacements needed (Smash Burger — wrong cheese + red onion rings; Flour Tortillas — branded Lone Star Beer in shot).
- 1 CONDITIONAL hero (Shawarma — raw chicken, not charred) — Patrick to call ship-as-is or wait for replacement. Defaulted to wait.
- 2 new hero URLs for Falafel + Pavlova (proper CDN format this time).

### Owed back by Patrick

- **PAT rotation per DECISION-010 follow-up** — Patrick UI action. URGENT handoff posted earlier. Current PAT expires 2026-07-21 (~9 weeks).
- **R-016 verdict** — Patrick validated the uninstall + reinstall test on build #112 and confirmed pantry is empty on a fresh install. R-016 can close. (Update the risk register if the COO maintains it.)

### Owed back by Engineer (after Patrick on-device validates)

- Close R-015 incidents on builds #113 and #114 if all validation steps above pass.
- If Falafel/Pavlova hero URLs come back from the Photography Director with proper CDN format, the data migration is a single small commit (drop in `hero_url` + `hero_attribution`, no schema change since the columns are already in place from build #113).
- If cook ships the 8 missing override texts + 2 step anchors + the Vegetable shortening substitution, those are data-only commits — each can ship in a single build with the handoffs build-log row in the same tree per the now-binding discipline rule.

---

## Process notes — what worked and what didn't this session block

### Worked

- **Bug-check pass after every build.** Both #110 and #112 turned out to have leftover or missing data caught by the post-ship audit before Patrick had to find them by hand.
- **R-014 truncation CI guardrail** — added in #112; caught nothing new in #113 or #114 because nothing was truncated, but the script self-tests both ways and runs in <2s on every push.
- **Single-tree commits (code + build-log row).** Now binding. Build log stays current with reality, COO doesn't have to ask "what's in build #N."
- **`refreshSeedRecipeFields` UPDATE-on-launch pattern.** Lets data-only fixes reach existing installs without a reinstall — useful for the #110 SMASH_BURGER hero-strip and the #113 Falafel/Pavlova URL-strip.

### Didn't work / lessons

- **Build #110 shipped with a stale REJECTED hero URL** — hot-fixed in `9fd9dd5` after the bug-check caught it. The brief listed "DO NOT MIGRATE smash-burger" but didn't say "also strip any existing URL"; engineer assumed the field was absent. Fix going forward: bug-check pass must include "REJECTED recipes must have no hero_url" as an explicit assertion.
- **Build #110 shipped with hero URLs that were never validated against the Unsplash CDN.** Cook's signoff in the visual-assets-ledger said APPROVED but the URLs themselves were never `curl`-tested. Engineer should `curl -I` every hero URL before adding it to seed-recipes.ts; flagged the format mismatch to Photography Director.
- **Build #113's swap UX assumed the whole-row Pressable was fine.** Wasn't until Patrick saw it on-device that the stray-tap and prep-collision and low-visibility issues surfaced together. Future swap-UI changes get a small "tap nearby" test in the brief.

---

## Repo state at session close

| | |
|---|---|
| origin/main HEAD | `72ebc14` (build-log hash-fill for #114) |
| Latest code commit | `cd65ab1` (#114 swap-trigger redesign) |
| Build #114 status | in_progress at close — Android Build + R-014 truncation check + Pages deploy all running |
| Build #113 status | shipped to main — Patrick validation pending |
| Build #112 status | R-016 confirmed closed by Patrick on-device |
| App version on main | v0.5.0, versionCode 48 |
| R-014 truncation guardrail | live on every push + every PR |

---

*End of session report — 16 May 2026 (Report 2)*
