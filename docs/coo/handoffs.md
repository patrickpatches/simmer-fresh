# Handoffs

> The cross-chat baton-pass log. Every specialist reads this at session start and writes to it at session end.

## Format

Each handoff is a block. Newest at the top.

```
### HANDOFF → [Receiving specialist] · YYYY-MM-DD · [STATUS]
**From:** [Originating specialist]
**Subject:** One-line description
**Why:** Why this handoff exists
**What's done:** What the originating specialist completed
**What's needed:** What the receiving specialist should do
**Files touched:** Paths to anything they need to read
**Blocks:** What downstream work is blocked until this completes
```

Statuses: **OPEN** (waiting for receiver), **IN PROGRESS** (receiver started), **DONE** (receiver completed and confirmed).

When a handoff is DONE, leave it in the file for one week so it's auditable, then move it to `archive/handoffs-YYYY-MM.md` at the end of the month.

---

## Build log

> Mandatory for Engineer. One line per build, newest at top. If you push 3 commits and trigger 3 builds, that's 3 lines. Patrick should never have to ask "what's in build #N" — the answer is here before he asks.

| Build | Commit | Summary |
|---|---|---|
| #106 | `a1e15bb` | **FLOUR_TORTILLAS migration** — applies cook's `flour-tortillas.md` discrepancy table verbatim PLUS Patrick's 10×~30g yield override. Changes: `source.chef` → `Patrick N.`, `base_servings` 5 → 10, `output_default` 13 → 10. Primary fat flipped from Lard to Unsalted butter (lard moves to substitution, 'delicious' stripped from swap note per cook). Ingredient amounts scaled from cook's 13-tortilla spec to Patrick's 10-tortilla yield: bread flour 200g → 160g, butter 40g → 30g, water 130ml → 100ml, salt 6g → 5g (cook had 6g for 13; we scale to 5g for 10). All step content, mise, and before_you_start updated to the new amounts and butter-primary framing. Tortilla size note changed from 'side plate' to 'small saucer 12–13cm (taco size, not burrito size)'. (Hash filled in follow-up commit immediately after — required because the commit hash can only be known after the commit is created. New discipline rule going forward: log row lands in the SAME tree as the code.) |
| #105 | `b6d0c70` | Kitchen Editorial redesign — full rewrite of `(tabs)/index.tsx` per Designer prototype (`docs/prototypes/kitchen-editorial-v1.html`). Day/time + 'hone.' wordmark with gold period; gold-bordered search; 178dp hero card (Tonight badge + Cook → / Plan + CTA, falls back to top of active filter); 'Browse by cuisine' label + horizontal category tiles (All + 8 cuisines, active = solid gold fill + dark label); recipe list rendered as full-width rows with 58×58 thumb, gold cuisine tag, Playfair title, meta strip, planned-gold badge. Removed: mode chips (All/Quick/Weekend/Favourites/Yours), 'Cooking tonight' amber banner, old hero headline. Token change: `gold #F2CC2A` + `goldDim` added fresh — no callers existed for the COO-named `tokens.gold` previously, so no regression scan was applicable. Two files: tokens.ts, index.tsx. |
| #104 | `d52397f` | Shop -> pantry -> match-counter wiring. Ticking an item in Shop now upserts the pantry row with `have_it = true` (untick = false). Pantry tab `useFocusEffect` extended to refetch pantry items alongside shopping items, so the recipe-match carousel counters recompute on tab return. `pantryId` exported from pantry-helpers so shop.tsx hits the same row on upsert. Same architectural family as REGN-007 — derived state across surfaces. Files: shop.tsx, pantry.tsx, pantry-helpers.ts. |
| #103 | `d974880` | **Root-cause fix for the 4×-recurring 46-recipes regression.** seed-recipes.ts split into two arrays at the source: `SEED_RECIPES` (16 launch only — the seeder consumes this) and `SEED_RECIPES_HOLDING` (30 holding — defined but never inserted into SQLite). Holding recipes physically cannot reach the DB. Added `pruneOrphanedSeedRecipes` to clean Patrick's existing install (deletes any seeded row whose id is no longer in SEED_RECIPES on every launch — idempotent). Collapsed `getActiveRecipes` to an alias for `getAllRecipes`. Added dev-only `smokeAlarmSeedCount` tripwire that console.errors loudly if the seeded-row count drifts from `SEED_RECIPES.length`. R-016 root-cause closed. |
| #102 | `e663cfd` | Designer v2.2 visual polish for ServingsSelector — single-pill stepper with stacked number+unit in 52×40 centre cell. Drops the redundant top header label and the right-side "Makes N portions" block; verb ("Serves"/"Makes") moves to the left of the stepper. Stepper buttons 32×40 with opacity 0.28 + disabled state at min. Ingredient scaling math unchanged. |
| #101 | `7be6b3b` | Cook's 5 scaling-disparity fixes (SMASH_BURGER / PASTA_CARBONARA / BUTTER_CHICKEN / CHICKEN_SCHNITZEL / FLOUR_TORTILLAS — strip hardcoded quantities from step content & mise). Plus FALAFEL/BARRAMUNDI launch swap per Patrick — FALAFEL `not_yet_shipping=true→false` with placeholder DECISION-014 fields (`serve` / 4); BARRAMUNDI flipped to not_yet_shipping. |
| #100 | `9f53396` | UX polish — stripped "Scaled N× up" chip from recipe header. A multiplier with no visible baseline confused more than it clarified. Header now shows just "HOW MANY BURGERS" / etc. on the left; the stepper + "Makes N burgers" label already conveyed everything the chip did. |
| #99 | `418f8eb` | **Critical fix** — DECISION-014 portion-sizing fields now reach SQLite. Builds #96–#98 shipped the schema/seed/UI but the DB layer was blind to the new fields, so every recipe rendered the legacy "people / portions" fallback on-device. This commit adds schema migration 8 (4 new columns: output_unit, output_unit_plural, output_default, extra_for_tomorrow_label), extends RecipeRow / rowToRecipe / insertRecipe in database.ts, and extends refreshSeedRecipeFields in seed.ts. On Patrick's existing APK, migration 8 ALTERs the columns onto his recipes table on first launch; refreshSeedRecipeFields then UPDATEs the 16 launch rows with their authored values. **Install #99 to actually see "Makes 4 burgers" etc.** |
| #98 | `b4e83f2` | Polish — "Serves N portions" for per-person dishes (was "Serves N serves"); ServingsSelector special-cases unit==='serve'/'person' to render "portion/portions" while keeping cook's authored data verbatim. _NOTE: portion-sizing did not actually work on-device — see #99 fix._ |
| #97 | `b43ae55` | Docs only (COO push) — no app code change vs #96. Adds Designer's `docs/prototypes/recipe-detail-v2.2.html` + handoffs/decision-log updates. Functional behaviour identical to #96 |
| #96 | `ce3ff2b` | DECISION-014 per-recipe portion units (functional) — schema fields + 16 launch recipes migrated + ServingsSelector + Kitchen card chips + recipe-aware leftover hint |
| #95 | `4c4daf9` | v0.5.0 version bump + DECISION-013 launch scoping (16 user-visible) + CHICKEN_SHAWARMA created + LAMB_SHAWARMA flagged not_yet_shipping + FLOUR_TORTILLAS attributed to Patrick Nasr + burger sauce 3 separate shop rows + Equipment vertical wrap |

---

## Open handoffs

### HANDOFF → COO (Culinary Research) · 2026-05-12 · OPEN URGENT (DECISION-015 — substitution colour system + step_overrides, 16 launch recipes)
**From:** Patrick
**Subject:** Redesign substitution quality ratings from freetext tags to a 3-colour traffic-light system; add `step_overrides` where a substitution changes the technique; apply to all 16 launch recipes. Smash Burger is the test case.
**Why:** The current `perfect_swap / great_swap / good_swap / compromise` tags are inconsistent across files and require users to read prose to understand them. A traffic-light system (green / yellow / red) is instantly legible at a glance — no reading required. `step_overrides` closes the gap where a substitution genuinely changes what the cook does, but the steps still show the original method.

---

### DECISION-015 — Substitution colour system spec

**The three colours:**

| Colour | Meaning | Replaces |
|---|---|---|
| 🟢 `green` | Same result — cook notices no difference in outcome | `perfect_swap` |
| 🟡 `yellow` | Good alternative — different character, still excellent | `great_swap` + `good_swap` |
| 🔴 `red` | Significant compromise — different dish or inferior result | `compromise` |

**Colour decision rules:**
- `green`: The cook cannot tell the difference in the finished dish. Swap it silently. Example: Kosher salt for fine sea salt (same weight, same result).
- `yellow`: The cook gets a different but still high-quality result. The difference is worth noting — flavour, texture, or appearance changes — but the dish is still worth making. This covers both what was `great_swap` (e.g., lard for butter in tortillas — flakier, more traditional) and `good_swap` (e.g., plain flour for bread flour — lower protein, less extensible but still works).
- `red`: The result is noticeably inferior, or the dish becomes something different. The app should warn the cook before they commit to this swap. Example: chicken breast for thigh in shawarma at 220°C — it will dry out before it chars.

**`step_overrides` spec:**

Some substitutions change what the cook actually does — not just the ingredient. These need a `step_overrides` array on the substitution object. Each override targets a specific step by `step_id` and provides replacement or supplementary content.

Required when:
- Temperature changes (e.g., breast at 200°C not 220°C)
- Time changes significantly (e.g., veal schnitzel cooks 2 min per side, not 3)
- A step can be skipped entirely (e.g., no brining needed with a pre-salted substitute)
- A technique step differs fundamentally (e.g., gluten-free flour requires less kneading)

Not required when:
- The cook simply uses less or more of something (handled by `scales` annotation)
- The only difference is flavour or appearance (covered by the substitution description)

Format in the research file:
```
*Substitution:* [Ingredient] — 🟡 yellow. [One sentence on what changes.]
*Step override (step N — [step title]):* [What the cook does differently.]
```

---

### Smash Burger — test case (do this first)

Apply DECISION-015 to `docs/coo/culinary-research/smash-burger.md` before touching any other recipe. Use it to pressure-test the colour decisions and step_override format. If anything in the spec feels wrong when applied to a real recipe, flag it before rolling out to the other 15.

**Known substitutions in Smash Burger that need colour + possible step_overrides:**
- Turkey or chicken mince for beef 80/20 — 🔴 red (lower fat, won't smash the same way, crust won't form correctly at high heat; different dish). Step override: reduce heat to medium-high, expect no crust formation.
- American cheese for cheddar — 🟢 green (melts identically, same flavour register for this application)
- Brioche vs standard burger bun — 🟡 yellow (brioche adds richness and sweetness; standard bun is neutral but structurally fine)
- Any other swaps in the existing file — assess and colour-code on the day

**Mandatory deliverable for Smash Burger:**
1. Discrepancy table at the top of the file (the tortilla pattern) — what's in seed-recipes.ts vs what the research file says. Mandatory on every recipe from this point forward.
2. All substitutions coloured 🟢 / 🟡 / 🔴
3. `step_overrides` authored where applicable
4. Pre-flight checklist passed and signed off at the bottom of the file

---

### Rollout order for remaining 15 recipes

After Smash Burger is validated:

**Batch A (5 recipes — do in one session):**
PASTA_CARBONARA, BUTTER_CHICKEN, CHICKEN_SHAWARMA, CHICKEN_SCHNITZEL, FLOUR_TORTILLAS

**Batch B (5 recipes — second session):**
WEEKDAY_BOLOGNESE, THAI_GREEN_CURRY, BEEF_LASAGNE, ROAST_CHICKEN, ROAST_LAMB

**Batch C (5 recipes — third session if needed, otherwise fold into B):**
FISH_AND_CHIPS, PAVLOVA, HUMMUS, PAD_THAI, FALAFEL

Target: ~2 sessions total (Smash Burger + Batch A in session 1; B + C in session 2). Pace to the content, not the clock.

---

### Standing rules for this work (R-014 applies)

- **R-014:** Run `tail -c 200` on the file immediately after every write/save to confirm the file ends correctly. The flour-tortillas.md truncation (`aff3bc4`) happened because a write silently cut the file at 80 lines. `tail -c 200` catches this before commit.
- **Discrepancy table is mandatory** on every research file — what seed-recipes.ts currently has vs what the research file says. Engineer reads this table to know exactly what to change.
- **Pre-flight checklist is mandatory** before declaring any recipe ready. All boxes must be checked and explained, not just ticked.
- **Colour decisions must be justified** in the research file — not just "🟡 yellow" but "🟡 yellow — flakier, more traditional, cook notices the difference in texture."

**Files touched:** `docs/coo/culinary-research/smash-burger.md` (test case), then all 15 remaining launch recipe research files  
**Blocks:** Engineer schema update for substitution colour field + step_overrides array (separate engineer handoff will follow once COO spec is validated on Smash Burger)

---

### HANDOFF → COO · 2026-05-10 · IN PROGRESS (build #105 — Kitchen Editorial redesign + gold accent introduced)
**From:** Senior Engineer
**Subject:** Build #105 dispatched on commit `b6d0c70`. Per R-015 — shipped, awaiting Patrick on-device validation. Not self-closing.

**Token change note for the audit trail:**
The COO handoff specified migrating `tokens.gold` from `#C9A84C` to `#F2CC2A`. The codebase did **not** have a `gold` token previously — closest neighbours were `ochre` (`#C07038`, mise en place zone) and `amber` (`#1E1408` dark amber tint). No callers of `tokens.gold` existed anywhere in the mobile tree. So this commit **adds the token fresh** rather than migrating one. There is nothing to regression-scan because there were no prior callers.

```
gold:    '#F2CC2A',
goldDim: 'rgba(242,204,42,0.15)',
```

**Implementation per Designer spec:**
1. Header — day-of-week + period (`dayTimeLabel(new Date())`) above 'hone.' wordmark in Playfair 30sp; period rendered with `tokens.gold`. Avatar circle (32dp) on the right with the user initial 'P'.
2. Search — surface bg, `borderWidth: 1.5, borderColor: tokens.gold`, ingredient search behaviour preserved.
3. Hero card — 178dp, full-width, 20px radius. Picks the first planned recipe → `Tonight` gold badge + `Cook →` rust CTA. Otherwise picks the top of the active filter → cuisine name badge + `Plan +` CTA. Gradient overlay over the recipe's `hero_fallback` bands (no expo-image dependency in the hero so it always renders).
4. Category tiles — `Browse by cuisine` label, then horizontal scroll of 9 tiles (All + Levantine, Indian, Japanese, Italian, Malaysian, Thai, French, Australian — Designer-locked order). Tiles hide if no recipe in the active roster carries that cuisine. Active tile: solid gold fill + dark label. 62dp width.
5. Recipe rows — `(tabs)/index.tsx` now renders rows instead of cards. 58×58 thumbnail (gradient bands + emoji), gold cuisine tag (uppercase 9sp), Playfair title 14sp 700, meta strip (chef · time · difficulty in muted ink), Planned badge in gold-dim, chevron right.

**Removed (intentional):**
- Mode chips (All / Quick / Weekend / Favourites / Yours). Editorial spec is cuisine-only filtering. If you want quick/weekend/favourites back as a separate surface, that's a follow-up.
- 'Cooking tonight' amber banner — superseded by the hero card's 'Tonight' badge.
- Old 'What are you cooking tonight?' hero text — replaced by wordmark + day/time line.

**Visual regression scan:**
- Searched for `tokens.gold` callers across `mobile/`: zero. The new token has no upstream legacy.
- `ochre`, `amber`, `primary`, `sage` callers untouched — those tokens did not change colour.
- The Editorial direction does not yet apply to other tabs (Pantry, Shop, Plan, recipe detail). Those screens will continue rendering with their existing palette. If Patrick wants the gold accent rolled into the recipe detail eyebrow or anywhere else, that's a separate pass.

**Colour clashes to flag:** none observed in static review. The new gold reads cleanly on `tokens.cream` (card surface) and against `tokens.bg` (screen). The dark text on solid gold (`#0F1A14` literal in the active tile and goldDim badges via `tokens.gold` text) gives high contrast for the active state. Will verify on-device.

**On-device validation Patrick should walk:**
1. Open Kitchen → header reads day + time + 'hone.' with a gold period; avatar 'P' top right.
2. Search bar has a thin gold border.
3. Hero card: if a recipe is planned, hero is that recipe with 'Tonight' gold badge and 'Cook →' rust pill. If nothing is planned, hero is the top of the All filter with cuisine name as badge and 'Plan +' rust pill.
4. Tap a category tile (e.g. Italian) → it fills with solid gold; the recipe rows below filter to that cuisine. Tap All to clear.
5. Recipe rows are tight 58×58-thumb + cuisine-tag + title + meta. Ingredient search still narrows the list.
6. Tap any row or the hero → recipe detail opens as before.

**Files touched (2):** `mobile/src/theme/tokens.ts`, `mobile/app/(tabs)/index.tsx`.

**Status:** **shipped, awaiting Patrick on-device validation** per R-015. Not self-closing.

---

### HANDOFF → COO · 2026-05-10 · IN PROGRESS (build #104 — shop tick mirrors to pantry, carousel match counter updates)
**From:** Senior Engineer
**Subject:** Build #104 dispatched on commit `d52397f`. Per R-015 — shipped, awaiting Patrick on-device validation. Not self-closing.

**Diagnosis matched the COO hypothesis exactly:**
1. `handleToggleInCart` in `shop.tsx` only toggled `in_cart` on the shopping row — no side-effect into pantry.
2. Pantry tab's `useFocusEffect` re-fetched shopping items but not pantry items, so even if the DB were updated, the carousel stayed stale on tab return.
3. Match counters are derived from `pantryItems` state correctly — they just never saw the new ingredient.

**Fix (3 files, 1 commit):**
- `mobile/app/(tabs)/shop.tsx` — `handleToggleInCart` now also `upsertPantryItem(db, { ..., have_it: willBeInCart })`. Tick adds to pantry; untick clears `have_it` (we set false rather than delete so quantity/unit/category set elsewhere isn't clobbered, and so the pantry catalog stays whole for `initializePantryItems`' purposes).
- `mobile/src/data/pantry-helpers.ts` — `pantryId` exported (was file-private). shop.tsx needs to compute the same id so an existing pantry row is hit on UPSERT instead of a duplicate created.
- `mobile/app/(tabs)/pantry.tsx` — `useFocusEffect` now `Promise.all`s `getShoppingItems` + `getPantryItems`. Carousel match counters recompute via the existing `useMemo` on `pantryItems`.

**On-device validation Patrick should walk:**
1. Open a recipe with missing ingredients (e.g. Smash Burger when pantry is empty).
2. Tap a chip on the recipe to add the ingredient to the shopping list.
3. Go to Shop tab. Tick the item.
4. Return to Pantry tab. The recipe-match counter on the carousel for that recipe should now show that ingredient as matched, and the count should be one higher than before.
5. Go back to Shop tab. Untick the item.
6. Return to Pantry tab. The counter should drop back.

**Files touched:** 3 — `mobile/app/(tabs)/shop.tsx`, `mobile/app/(tabs)/pantry.tsx`, `mobile/src/data/pantry-helpers.ts`.

**Status:** **shipped, awaiting Patrick on-device validation** per R-015. Not self-closing.

---

### HANDOFF → COO · 2026-05-10 · IN PROGRESS (build #103 — R-016 root-cause fix + 3 prior items cumulative)
**From:** Senior Engineer
**Subject:** Build #103 dispatched on commit `d974880`. R-016 (the 4×-recurring "46 recipes coming back") root-caused and architecturally fixed. Per R-015 — shipped, awaiting Patrick on-device validation. Not self-closing.

**Root cause of the regression:**

The `not_yet_shipping` flag lived only in memory on each Recipe const. It was in the Zod schema and on each in-memory recipe, but **never persisted to SQLite** — no column, no INSERT, no rowToRecipe mapping, no UPDATE in `refreshSeedRecipeFields`. Every launch the DB read returned all 46 recipes with `r.not_yet_shipping === undefined`, the JS-side filter `!r.not_yet_shipping` evaluated `true` for every row, Kitchen showed all 46. Earlier "fixes" all touched the in-memory seed array — the data never reached SQLite.

**Architectural fix instead of another patch:**

1. `seed-recipes.ts` split at the source. `SEED_RECIPES` is exactly 16 launch recipes — the only array the seeder consumes. `SEED_RECIPES_HOLDING` holds the 30 (defined, never inserted). To promote one later: move its name from HOLDING into SEED_RECIPES.
2. `pruneOrphanedSeedRecipes(db)` runs every launch in `setupDatabase`. Deletes any seeded row whose id is no longer in `SEED_RECIPES`. Cleans up Patrick's existing install where the 30 holding rows still sit in SQLite from earlier seeds. ON DELETE CASCADE handles meal_plan / favorites / ingredient_swaps.
3. `getActiveRecipes` collapsed to an alias for `getAllRecipes` — the old filter was always a no-op at runtime. Kept the name so the 2 callers (Kitchen, Pantry) don't need to be touched.
4. `smokeAlarmSeedCount(db)` dev-only tripwire. After seed/sync/refresh/prune, if seeded-row count != `SEED_RECIPES.length`, `console.error` with the offending ids. Production APK silent.

**Cumulative state in build #103:**
- Item 1 (chip removal) — already in #100 (`9f53396`)
- Item 2 (Designer v2.2 polish) — already in #102 (`e663cfd`)
- Item 3 (Cook's 5 fixes) — already in #101 (`7be6b3b`)
- Item 4 (R-016 root-cause fix) — **this commit** (`d974880`, build #103)

Patrick should install build #103 — it's cumulative HEAD of main.

**On-device validation:**
1. Open Kitchen → exactly 16 cards. Force-close, reopen → still 16. **The "creep back" is gone.**
2. Open Pantry → "What I have" matching only considers the 16.
3. Deep-link to Smash Burger / Carbonara / Roast Chicken / Hummus / Flour Tortillas / Falafel still works.
4. Sanity: any meal-plan entries you set on a holding recipe (very unlikely since they were never browseable) will be cascade-deleted by the prune. Verify on-device.

**Files touched (4):** `mobile/src/data/seed-recipes.ts`, `mobile/db/seed.ts`, `mobile/db/database.ts`, `mobile/app/_layout.tsx`.

**Status:** **shipped, awaiting Patrick on-device validation** per R-015. Not self-closing.

---

### HANDOFF → Senior Engineer · 2026-05-10 · OPEN (Kitchen screen redesign — Editorial direction)
**From:** Product Designer
**Subject:** Redesign the Kitchen browse screen to the locked Editorial direction
**Why:** Patrick approved the Editorial layout, category tile design, gold search border, and updated gold token. This replaces the current Kitchen screen layout entirely.

**What's done:**
- Full prototype at `docs/prototypes/kitchen-editorial-v1.html` — two states (All / Levantine filtered), bottom nav, all components
- Colourway exploration at `docs/prototypes/kitchen-colourways.html` (reference only — dark sage direction confirmed)

**Locked design decisions:**

1. **Gold token updated** — `#F2CC2A` replaces `#C9A84C` throughout. Update `tokens.ts` first; everything downstream inherits it.

2. **Wordmark header** — Replace current screen title with:
   - Small day/time context line above: derive from `new Date()`, format as `{dayName} {morning/afternoon/evening}`
   - `hone.` in Playfair Display 900, lowercase, 30sp. The period is `#F2CC2A`.
   - User avatar (initial) top-right, 32dp circle, `surface2` fill

3. **Gold search border** — Search bar: `border: 1.5px solid #F2CC2A` (solid). Background stays `surface`.

4. **Category tiles** (replaces current horizontal chip row):
   - Scrollable row, each tile 62dp wide, `surface` bg, `borderRadius: 14`
   - Emoji (20sp) stacked above cuisine label (9sp, `ink2`)
   - Section label above: "Browse by cuisine" 11sp uppercase `ink2`
   - **Active: solid `#F2CC2A` fill + border, label `#0F1A14` weight 600**
   - Order: All · Levantine · Indian · Japanese · Italian · Malaysian · Thai · French · Australian
   - Tapping filters the recipe list to that cuisine

5. **Hero card** — full-width, `borderRadius: 20`, height 178dp, above category row:
   - Tonight's planned recipe if one exists; otherwise top recipe in active filter
   - Gradient overlay top→bottom (transparent to 88% dark)
   - Badge top-right: "Tonight" or cuisine name
   - Bottom: gold cuisine tag → Playfair title 19sp → chef · time strip + rust CTA pill

6. **Recipe list rows** (replaces card grid):
   - Full-width rows, `surface` bg, `borderRadius: 14`, `border: 1px solid line`
   - 58×58dp thumbnail left, `borderRadius: 10`
   - Gold cuisine tag (9sp uppercase) → Playfair title (14sp 700) → meta (chef · time · difficulty, `ink3`)
   - Chevron right. Planned badge: gold-dim. Pantry match: sage-dim.

7. **Section header** above list: recipe count right-aligned `ink3`.

**Files touched:** `mobile/src/constants/tokens.ts`, `mobile/app/(tabs)/index.tsx`, new components in `mobile/src/components/`

**Prototype:** `docs/prototypes/kitchen-editorial-v1.html`

**Blocks:** COO to sequence. `tokens.gold` change will propagate everywhere — verify no regressions on other screens before shipping.

---

### HANDOFF → Senior Engineer · 2026-05-09 · OPEN URGENT (build #100 — three items, one build)
**From:** Patrick (via COO)
**Subject:** Three items Patrick wants in the next build, all small, all queued. Bundle into one commit / one build.
**Why:** Patrick installed #99, portion sizing now actually shows on-device (good), but two things he's asked for previously haven't been actioned yet, plus the cook just shipped a content-disparity fix. Group them into build #100.

**What's needed:**

1. **Remove the "Scaled Nx up" chip from the recipe screen.** It still shows on-device after picking a non-default count (e.g., "Scaled 1.3x up"). The chip is meaningless — user has no baseline to compare to. The +/− stepper and the "Makes N burgers" copy already convey everything needed. Strip the chip from `mobile/app/recipe/[id].tsx` (or wherever it renders). ~5 minutes.

2. **Implement the Designer's v2.2 visual polish** per the existing handoff below ("scaling control visual polish — implement v2.2 design"). Centre cell resize to 52×40px, stack number + unit label vertically, dimmed +/− on min/max with pointerEvents:none, conditional render of extra-for-tomorrow row. Reference `docs/prototypes/recipe-detail-v2.2.html` for measurements. Designer's mockup has been waiting; ship it now. ~half a session.

3. **Apply the cook's 5-recipe content fixes** per the existing handoff below ("scaling-disparity fix"). Five recipes (SMASH_BURGER, PASTA_CARBONARA, BUTTER_CHICKEN, CHICKEN_SCHNITZEL, FLOUR_TORTILLAS) need their step content / mise text updated to remove hardcoded ingredient quantities so step copy stops lying when the user scales. Exact replacements listed in that handoff. ~30 minutes.

**Validation gate per R-015:**
- `npx tsc --noEmit` clean
- `tail -c 200` of every modified file confirms clean end of byte stream
- Engineer does NOT declare done — declares "shipped to main, awaiting Patrick on-device validation"
- Build log entry written for #100 in the table at the top of this file (per R-015 build-note rule)

**Files touched:** `mobile/app/recipe/[id].tsx` (chip removal + v2.2 wiring), `mobile/src/components/ServingsSelector.tsx` (v2.2 visual), `mobile/src/data/seed-recipes.ts` (cook's 5 recipe content fixes).

**Cost:** ~1 session combined.
**Blocks:** Patrick installing build #100 and walking the validation list.

---

### HANDOFF → Senior Engineer · 2026-05-09 · OPEN (scaling-disparity fix — remove hardcoded quantities from step content in seed-recipes.ts)
**From:** COO (Culinary Research)
**Subject:** Five recipes in seed-recipes.ts have hardcoded ingredient quantities in step `content` or `mise` fields that don't scale when the user changes serving count. Research files have been corrected — engineer applies the fixes to seed-recipes.ts.
**Why:** Step content with "Combine 200g flour..." still shows 200g at 3× scale. The ingredient list scales correctly; the step text doesn't. This is a UX lie — the user sees a scaled ingredient list, then reads a step telling them the unscaled amount.

**What's needed — exact changes to seed-recipes.ts:**

1. **SMASH_BURGER** — Step "Ball and season" `content`:
   - REMOVE: `"Divide the beef into 100g balls per patty."`
   - REPLACE WITH: `"Divide the beef into one ball per patty. Don't pack it — a loose ball smashes better than a dense one. Season the outside of each ball directly in the pan immediately before smashing, not before."`

2. **PASTA_CARBONARA** — Step "Cook pasta" `content` (whichever step reserves pasta water):
   - REMOVE: `"Reserve 200ml of pasta water before draining."`
   - REPLACE WITH: `"Reserve a generous ladleful of pasta water before draining."`

3. **BUTTER_CHICKEN** — Step "Marinate the chicken" `content` AND matching mise:
   - REMOVE all inline quantities: `"Mix yoghurt, lemon juice, 4 crushed garlic cloves, half the grated ginger, kashmiri chilli, 1 tsp garam masala, cumin, coriander, turmeric, and 1 tsp salt into a paste."`
   - REPLACE WITH: `"Combine all marinade ingredients into a paste — the yoghurt, lemon juice, crushed garlic, half the grated ginger, and all the marinade spices."`

4. **CHICKEN_SCHNITZEL** — Mise `content` (breading station setup):
   - REMOVE: `"Dish 2: 2 beaten eggs"`
   - REPLACE WITH: `"Dish 2: the beaten eggs"`
   Also Step 0 brine `content` (if present):
   - REMOVE: `"Dissolve the salt in 1 L of cold water."`
   - REPLACE WITH: `"Dissolve the salt in enough cold water to fully submerge the chicken."`

5. **FLOUR_TORTILLAS** — Step "Divide and rest" `content` AND matching mise:
   - REMOVE: `"Divide the dough into 13 pieces of ~30g each."` (or similar with "13")
   - REPLACE WITH: `"Divide the dough into one piece per tortilla, each roughly 40g."`

**Recipes confirmed CLEAN (no changes needed):** WEEKDAY_BOLOGNESE, THAI_GREEN_CURRY, BEEF_LASAGNE, ROAST_CHICKEN, ROAST_LAMB, FISH_AND_CHIPS, PAVLOVA, HUMMUS, PAD_THAI, FALAFEL, CHICKEN_SHAWARMA. All number references in these are temperatures, times, or cut sizes — not ingredient quantities.

**Files touched:** `mobile/src/data/seed-recipes.ts` (5 recipe consts)
**Reference files:** See engineer-fix notes at the bottom of each corresponding research file in `docs/coo/culinary-research/`

**Blocks:** Content accuracy guarantee for all 16 launch recipes at any serving count.

---

### HANDOFF → Senior Engineer · 2026-05-09 · OPEN (scaling control visual polish — implement v2.2 design)
**From:** Product Designer
**Subject:** Visual polish pass for the per-recipe scaling control — wire in the v2.2 design spec on top of the functional build shipped in `ce3ff2b`
**Why:** Per Patrick's direction, Engineer shipped the functional unit-aware scaling control first. This handoff closes the parallel design track — v2.2 prototype is done and delivers the visual treatment the functional build doesn't yet have.

**What's done:**
- `docs/prototypes/recipe-detail-v2.2.html` — full interactive prototype with:
  - 5 component states (person / burger / loaf / cup / tortilla) in singular and plural
  - Centre cell resized to 52×40px (was 28×32px) to accommodate stacked number + unit label
  - Number sits above the unit label; unit label in `var(--text-secondary)` at 11px
  - 3 interactive in-context demos (Carbonara / Smash Burger / Sourdough) with live ingredient scaling
  - 4 button states: normal, min (− dimmed at 0.28 opacity + `pointerEvents: none`), max (+ dimmed), with hint
  - "Make extra for tomorrow" reads recipe-specific `extra_for_tomorrow_label`; falls back to generic hint when absent
  - Conditional rendering: entire extra-for-tomorrow row omits when field is absent — no broken UI on old seed recipes

**What's needed:**

1. **Resize the centre cell** on `ServingsSelector.tsx` from its current dimensions to `width: 52px, height: 40px`. Stack number and unit label vertically (`flexDirection: 'column', alignItems: 'center', justifyContent: 'center'`).
2. **Unit label row**: `fontFamily: fonts.sans, fontSize: 11, color: tokens.textSecondary, marginTop: 2`. Reads the derived unit string (`output_unit_plural ?? output_unit + 's'` or `"people"` for serve-unit recipes).
3. **Disabled-state spec**: `opacity: 0.28` + `pointerEvents: 'none'` on − when `count === 1`; same on + when `count === output_max` (if `output_max` is absent, no upper clamp).
4. **Extra-for-tomorrow row**: if `extra_for_tomorrow_label` is present on the recipe, render it verbatim. If absent, keep current generic fallback. If no `extra_for_tomorrow_label` AND no generic concept applies, omit the row entirely.
5. Reference `docs/prototypes/recipe-detail-v2.2.html` for all visual measurements. All tokens already exist in v0.7 — no new token additions required.

**Files touched:** `mobile/app/recipe/[id].tsx` (ServingsSelector usage), `mobile/src/components/ServingsSelector.tsx`

**Blocks:** v0.6.x polish milestone. Functional build is already live — this is cosmetic only, non-blocking for Patrick's on-device validation of build #96.

---

### HANDOFF → Patrick · 2026-05-08 · ON-DEVICE VALIDATION (build #96 — DECISION-014 portion-sizing live)
**From:** Senior Engineer
**Subject:** Per-recipe units shipped on `ce3ff2b`. v0.6.0 milestone work landed. Build #96 dispatched on Patrick's go.

**Commit:** `ce3ff2b` — DECISION-014 per-recipe portion units (4 launch-only files: types.ts, seed-recipes.ts, ServingsSelector.tsx, recipe/[id].tsx, RecipeCard.tsx)

**State after this commit:**
- Schema has 4 new optional fields: `output_unit`, `output_unit_plural`, `output_default`, `extra_for_tomorrow_label`. All `.optional()` — non-launch recipes untouched.
- 16 launch recipes carry their unit data verbatim from cook's `launch-recipe-units.md`.
- ServingsSelector renders "Makes 4 burgers" / "Serves 4 people" / "Makes 1 loaf" / "Makes 13 tortillas" / "Makes 2 cups" depending on the recipe.
- RecipeCard chip on the Kitchen screen reads "4 burgers" / "1 chicken" / "8 tortillas" instead of bare "4".
- Default count on recipe-open uses `output_default ?? base_servings`.
- "Make extra for tomorrow" reads recipe-specific label when authored, falls back to generic leftover hint when not.

**On-device checklist Patrick should walk:**
1. **Smash Burger** opens at "4 burgers" (not "4 people"). Stepper increments: "1 burger / 2 burgers / 3 burgers". Right side reads "Makes 4 burgers".
2. **Roast Chicken** opens at "1 chicken". Stepper goes 1 → 2 (capped UI side at 20 by the existing stepper guards). Right side reads "Makes 1 chicken".
3. **Hummus** opens at "2 cups". Stepper increments cups. Right side reads "Makes 2 cups".
4. **Flour Tortillas** opens at "13 tortillas". Right side reads "Makes 13 tortillas".
5. **Pasta Carbonara** opens at "4 serves". Right side reads "Serves 4 serves" — note: this reads slightly oddly because the unit is "serve" and the prefix becomes "Serves", giving "Serves 4 serves". If you want this to read "Serves 4 people" we'll need to set `output_unit_plural: "people"` on those recipes (or special-case the "serve" unit). Flag this if it bothers you and we'll tighten in a follow-up.
6. Tap a non-tonight leftover mode (lunch / 3-day / week). On Smash Burger the hint reads "Make only what you'll eat — smash burgers don't reheat once the crust softens" instead of the generic "+1 portion per person — tomorrow's lunch sorted." Verify recipe-specific labels surface correctly on butter chicken, bolognese, hummus.
7. **Kitchen browse cards**: each card's meta chip should show the unit ("4 burgers", "1 chicken") instead of just "4".
8. **Non-launch recipes** (e.g., open via deep link to `chicken-adobo`): should fall back to legacy "people / portions" rendering, no errors.

**Designer parallel handoff:** still open below. Designer is producing the visual treatment for the new scaling control. This shipped commit is the functional version per Patrick's "ship functional first" direction. Visual polish lands as a follow-up commit.

**Issue that needs your call:** the "Serves 4 serves" oddity above. Three options:
- (a) Special-case unit==='serve' to render right-side caption as "people" (so it reads "Serves 4 people"). Cleanest UX but a magic string in the UI.
- (b) Update each cook-spec recipe's `output_unit_plural` to "people" for the serve-unit recipes (so it reads "Serves 4 people"). Data-driven.
- (c) Leave as-is. "Serves 4 serves" is grammatically valid even if it reads odd.

I recommend (a) — it's a 2-line code change and keeps the cook's spec verbatim. Confirm preference and I'll ship it as a small follow-on.

**Per CLAUDE.md:** GitHub issue NOT closed. Patrick validates on-device and closes himself.

---

### HANDOFF → Senior Engineer · 2026-05-08 · DONE ✅ (portion-sizing redesign — recipe-aware units per Cook's spec)
**Closed by Senior Engineer 2026-05-08 in commit `ce3ff2b`.** All five sub-tasks landed:
- Schema additions (4 fields, all optional)
- 16 launch recipes migrated from cook's launch-recipe-units.md
- ServingsSelector rebuilt with recipe-aware copy + recipe-aware mode hint
- recipe/[id].tsx wires the new props + uses output_default for first-render count
- RecipeCard meta chip on Kitchen surface uses the per-recipe unit

Backwards-compatible: non-launch recipes fall back to legacy "people / portions" rendering. tsc clean. Brace/paren balance 0.

### Original handoff (preserved for audit) → Senior Engineer · 2026-05-08 · OPEN URGENT (portion-sizing redesign — recipe-aware units per Cook's spec)
**From:** Patrick (via COO)
**Subject:** Replace the generic "Servings = N people" scaling model with per-recipe units (burger / loaf / cup / person / item) per Cook's `launch-recipe-units.md`
**Why:** The current scaling math is wrong because it treats every recipe as if "servings" means "people." Burgers are per-person, hummus is by cup, sourdough is one loaf regardless, tortillas are per-tortilla. Cook has authored the per-recipe unit spec at `docs/coo/culinary-research/launch-recipe-units.md` — engineer needs to wire it into the schema and the scaling UI. Cook owns the chef knowledge; engineer owns the math that respects it (per DECISION-007).

**What's needed:**

1. **Schema additions** to `mobile/src/data/types.ts` Recipe Zod schema. Additive only:
   - `output_unit: z.string()` — e.g., `"burger"`, `"loaf"`, `"cup"`, `"person"`, `"tortilla"`, `"piece"`, `"batch"`
   - `output_unit_plural: z.string().optional()` — e.g., `"burgers"`, `"loaves"`, `"cups"`, `"people"`, `"tortillas"`. If omitted, default to `output_unit + "s"`.
   - `output_default: z.number().int().positive()` — sensible default count for one batch (e.g., 4 burgers, 1 loaf, 8 tortillas, 4 people)
   - `extra_for_tomorrow_label: z.string().optional()` — what tapping "Make extra for tomorrow" actually does for THIS recipe (e.g., `"+1 extra burger"`, `"Double the batch"`, `"+4 extra tortillas"`). If omitted, default to `+1 ${output_unit}`.

2. **Migrate the 16 launch recipes' values from Cook's spec.** Read `docs/coo/culinary-research/launch-recipe-units.md`, populate the four new fields per recipe in `seed-recipes.ts`. The 29 not-yet-shipping recipes can stay with sensible defaults for now; cook handles them in v1.1.

3. **Rebuild the scaling control on `mobile/app/recipe/[id].tsx`.** Replace "Servings: 4" with `"Makes ${count} ${output_unit_plural}"` (or `"Serves ${count} ${output_unit_plural}"` when `output_unit === "person"`). The +/− stepper adjusts count, ingredients re-scale per existing `scales` flag + `scaling_note`. UI label updates dynamically: "Makes 4 burgers" → "Makes 6 burgers" → "Makes 8 burgers."

4. **Make "Make extra for tomorrow" recipe-aware.** Read `extra_for_tomorrow_label` for the recipe; if absent, fall back to `+1 ${output_unit}`. Stop the current generic-leftover behaviour that just adds one person.

5. **Designer handoff is in flight in parallel** (separate handoff below). Coordinate with Designer on the visual treatment of the new scaling control once their mockup lands. Don't block engineering on designer — ship the functional version first; restyle in a second pass if needed.

**Files touched:** `mobile/src/data/types.ts`, `mobile/src/data/seed-recipes.ts`, `mobile/app/recipe/[id].tsx`, possibly the Pantry recipe-match-card if it shows serving info.

**Cost:** ~1 session.

**Validation gate:**
- `npx tsc --noEmit` clean
- Recipe screen shows correct unit per recipe — burger says burgers, sourdough says loaf, hummus says cups
- Scaling math respects existing `scales` and `scaling_note` per ingredient
- "Make extra for tomorrow" produces the right delta per recipe
- All 16 launch recipes verified on-device

**Blocks:** v0.6.0 milestone (per DECISION-012, v0.6.0 marks "portion-sizing redesign live").

---

### HANDOFF → Product Designer · 2026-05-08 · DONE ✅ (portion-sizing visual treatment — new scaling control)
**Closed by Product Designer 2026-05-09 — `docs/prototypes/recipe-detail-v2.2.html` delivered. Implementation handoff issued above (→ Senior Engineer · 2026-05-09).**

**From:** Patrick (via COO)
**Subject:** Design the new per-recipe scaling control to display the right unit per recipe ("Makes 4 burgers" / "Makes 1 loaf" / "Serves 4 people")
**Why:** The current "Servings = 4" component on the recipe-detail screen treats every recipe identically. Engineer is migrating the schema and logic per Cook's spec; you need to design how the new scaling reads on-screen.

**What's needed:**

1. Update or extend `docs/prototypes/recipe-detail-v2.html` (or a new `recipe-detail-v2.2.html`) showing the scaling control across these recipe types:
   - **Person-scaled** ("Serves 4 people" — bolognese, butter chicken, carbonara, lamb)
   - **Item-scaled** ("Makes 4 burgers" — smash burger, schnitzel)
   - **Loaf-scaled** ("Makes 1 loaf" — sourdough)
   - **Cup/batch-scaled** ("Makes 2 cups" — hummus, sauces)
   - **Piece-scaled** ("Makes 8 tortillas" — flour tortillas)

2. The control still has a +/− stepper; the *label* changes per recipe.

3. The "Make extra for tomorrow" toggle/button should display the recipe-specific label (Engineer is wiring the data: `extra_for_tomorrow_label`). Show how this reads: `"+1 lunch tomorrow"` for person-scaled, `"+1 extra burger"` for burgers, `"Double the batch"` for hummus, etc.

4. **Constraint:** v0.7 dark sage tokens locked. No visual direction change — same surfaces, same gold accent, same Inter/Playfair type. Just relabel the control honestly.

5. Engineer handoff block at the bottom of the prototype — implementation notes, conditional rendering rules, accessibility labels.

**Files touched:** `docs/prototypes/recipe-detail-v2.html` (update) or `docs/prototypes/recipe-detail-v2.2.html` (new).

**Cost:** ~half a session.

**Coordination:** Engineer's handoff (above) is in flight in parallel. They will ship the functional version first; your visual treatment lands as a polish pass on top. Don't be blocked on Engineer; ship the mockup at your own pace.

**Blocks:** Engineer's polish pass on the scaling control. Functional version ships without you.

---

### HANDOFF → Patrick · 2026-05-08 · ON-DEVICE VALIDATION (build #95 — five fixes incl. v0.5.0 bump, smash-burger sauce split, Equipment redesign, CHICKEN_SHAWARMA, DECISION-013 launch scope)
**From:** Senior Engineer
**Subject:** Five-commit package on `4c4daf9`; build #95 dispatched on Patrick's go.

**Commits:**
- `08529ff` — chore(version): bump to v0.5.0 per DECISION-012
- `a03f0e1` — fix(seed): SMASH_BURGER — burger sauce split into mayo + ketchup + mustard (Patrick on-device 8 May: compound name landed as one shop-list row)
- `f8a4750` — feat(recipe): Equipment as vertical wrap pill list (was horizontal scroll). Recommended over collapsible dropdown — zero-tap, consistent with Prep section, no Android gesture conflict
- `d7c7c5a` — feat(seed): CHICKEN_SHAWARMA new recipe (replaces lamb in v1.0 launch slot per Patrick 8 May)
- `4c4daf9` — feat(seed,ui): DECISION-013 — `not_yet_shipping` flag + filter 30 non-launch recipes; FLOUR_TORTILLAS chef = 'Patrick Nasr'

**State on origin/main after this batch:**
- App version: 0.5.0
- Recipes total: 46 (added CHICKEN_SHAWARMA; LAMB_SHAWARMA stays as not_yet_shipping)
- Recipes user-visible in v1.0: 16 (the launch-16 from DECISION-013)
- Recipes with full DECISION-008 sections: 45 of 46 (sourdough-maintenance still empty by intent — placeholder renders)
- Build #95 queued: https://github.com/patrickpatches/hone/actions/runs/25532238312

**On-device checks Patrick should walk through after the APK lands:**

For DECISION-013 (launch-scope):
1. Kitchen browse — exactly 16 recipes visible. No CHICKEN_ADOBO, no FALAFEL, no KAFTA, no LAMB_SHAWARMA.
2. Search "rendang" → no results (not_yet_shipping).
3. Pantry-match — only suggests from the 16. Even if pantry contains lamb + chickpeas, lamb-shawarma and falafel won't appear.

For SMASH_BURGER:
4. Open Smash Burger → 'Plan this recipe' → switch to Shop tab. Should see three separate items: Mayonnaise, Tomato ketchup, American (yellow) mustard. NOT a single 'Burger sauce (mayo + ketchup + mustard)' row.
5. Tap Mayonnaise on the recipe screen → substitution sheet should show Kewpie + Aioli swaps.

For Equipment UX:
6. Open any recipe with Equipment populated. Should show a vertical wrap of pills, NOT a horizontal side-scroll.
7. Items wrap onto 2-3 lines naturally. Smash Burger (4 items) likely fits 1 line; Beef Wellington (7 items) wraps to 2-3.

For CHICKEN_SHAWARMA:
8. Open chicken-shawarma. Title should read 'Home Oven Chicken Shawarma'. Total time 150 min. Method has 5 steps including "Marinate (2 hours, ideally overnight)". Equipment shows 4 items. Prep shows 7 items.

For FLOUR_TORTILLAS:
9. Open Soft Buttery Flour Tortillas. Source attribution should read 'Patrick Nasr', not 'Hone Kitchen'. Notes: "Patrick's own recipe — soft, buttery, adapted over time from multiple sources."

For v0.5.0 version bump:
10. Settings (or wherever app version is displayed) should show 0.5.0 not 0.4.1.

**Per CLAUDE.md:** GitHub issues NOT closed. Patrick validates on-device and closes himself.

---

### HANDOFF → Senior Engineer · 2026-05-08 · DONE ✅ (DECISION-013 — scope build to 16 launch recipes; tag the rest)
**Closed by Senior Engineer 2026-05-08 in commit `4c4daf9`.** All five sub-tasks landed:
- Schema field `not_yet_shipping?: boolean` added to types.ts (optional, not default(false), so launch-set recipes don't need explicit declarations)
- `getActiveRecipes(db)` helper added to db/database.ts
- 30 non-launch recipes flagged (was 29 in handoff; +1 = CHICKEN_VEG_STIR_FRY which the handoff's "plus any others not in the launch 16" caught)
- Kitchen browse + Pantry match wired through getActiveRecipes
- Shop tab kept on getAllRecipes (lookup map for meal-plan source breakdowns; recipes already in plans must still resolve)
- FLOUR_TORTILLAS chef = 'Patrick Nasr', source.notes updated, video_url removed

### HANDOFF → Senior Engineer · 2026-05-08 · DONE ✅ (CHICKEN_SHAWARMA — new recipe required for v1.0 launch slot)
**Closed by Senior Engineer 2026-05-08 in commit `d7c7c5a`.** New CHICKEN_SHAWARMA const created using cook's research file (chicken-shawarma.md, committed by COO in 6dbbe8e) as content source. Inserted directly after LAMB_SHAWARMA in the seed file and the SEED_RECIPES export array. LAMB_SHAWARMA flagged `not_yet_shipping: true` in commit `4c4daf9` (DECISION-013 batch). Method: 5 steps, 21 ingredients, full DECISION-008 sections. Cultural tag: levantine + chicken.

### HANDOFF → Senior Engineer · 2026-05-08 · DONE ✅ (DECISION-012 — bump version to v0.5.0 on next push)
**Closed by Senior Engineer 2026-05-08 in commit `08529ff`.** Single line change in mobile/app.json: expo.version "0.4.1" → "0.5.0". No other changes.

---

### HANDOFF → Senior Engineer · 2026-05-08 · OPEN URGENT — superseded by DONE entry above (DECISION-013 — scope build to 16 launch recipes; tag the rest)
**From:** Patrick (via COO)
**Subject:** Add `not_yet_shipping` schema flag, tag 29 non-launch recipes, ensure Patrick's flour tortilla attribution is correct
**Why:** Per DECISION-013 (decision-log.md, 8 May), v1.0 ships with 16 specific recipes only. The other 29 stay in the seed file but must be hidden from the build. Patrick's own flour tortilla recipe is the 16th and needs attribution set to him.

**The 16 launch recipes (everything else gets `not_yet_shipping: true`):**
1. Roast Chicken
2. Spaghetti Bolognese
3. Spaghetti Carbonara
4. Butter Chicken
5. Smash Burger
6. Thai Green Curry
7. Chicken Schnitzel
8. Beef Lasagne
9. Roast Lamb with Rosemary & Garlic
10. Fish & Chips
11. Pan-Fried Fish (Barramundi)
12. Pavlova
13. **Chicken** Shawarma (NOT lamb — separate handoff already open to create CHICKEN_SHAWARMA const)
14. Hummus
15. Pad Thai
16. **Soft Buttery Flour Tortillas — Patrick's recipe**

**What's needed:**
1. Add `not_yet_shipping: z.boolean().default(false)` to the Recipe Zod schema in `mobile/src/data/types.ts`. Additive only.
2. In `mobile/src/data/seed-recipes.ts`, set `not_yet_shipping: true` on every recipe NOT in the 16 above (29 recipes — `LAMB_SHAWARMA`, `MUSAKHAN`, `KAFTA`, `FATTOUSH`, `MUJADARA`, `RISOTTO`, `RAMEN`, `SCRAMBLED_EGGS`, `AGLIO_E_OLIO`, `DAL`, `EGG_FRIED_RICE`, `NASI_LEMAK`, `BEEF_RENDANG`, `CURRY_LAKSA`, `CHAR_KWAY_TEOW`, `SAAG_PANEER`, `CHICKEN_KATSU`, `TOM_YUM`, `CHICKEN_ADOBO`, `BEEF_STEW`, `SOURDOUGH_LOAF`, `SOURDOUGH_MAINTENANCE`, `FRENCH_ONION_SOUP`, `BRAISED_SHORT_RIBS`, `BEEF_WELLINGTON`, `SHEET_PAN_HARISSA_CHICKEN`, `PRAWN_TACOS_PINEAPPLE`, `FISH_TACOS`, plus any others not in the launch 16). The 16 launch recipes default to `false` — leave them unset or explicit `false`.
3. Update browse, search, and pantry-match queries to filter `WHERE not_yet_shipping = false` (or equivalent). Hidden from all user-visible surfaces in v1.0.
4. **Patrick's flour tortillas (FLOUR_TORTILLAS const):**
   - `chef`: `"Patrick Nasr"`
   - `source.notes`: `"Patrick's own recipe — soft, buttery, adapted over time from multiple sources"`
   - `source.video_url`: `null`
   - The cook's existing `docs/coo/culinary-research/flour-tortillas.md` is the structural template. Content alignment with Patrick's actual recipe is a separate cook handoff (Patrick provides his ingredient ratios and technique; cook re-formats to 10-section template).
   - Mark FLOUR_TORTILLAS as `not_yet_shipping: false` so it ships in v1.0.

**Files touched:** `mobile/src/data/types.ts`, `mobile/src/data/seed-recipes.ts`, `mobile/app/(tabs)/index.tsx` (Kitchen browse query), `mobile/app/(tabs)/pantry.tsx` (match query), `mobile/db/database.ts` if queries live there.
**Cost:** ~30 minutes for schema + tagging + query updates.
**Blocks:** v1.0 launch scope. Until this lands, the build still shows all 45 recipes to users.

---

### HANDOFF → Culinary Verifier · 2026-05-08 · OPEN (Patrick's flour tortilla recipe — content alignment)
**From:** Patrick (via COO)
**Subject:** Re-author `docs/coo/culinary-research/flour-tortillas.md` to match Patrick's actual recipe with him as the chef
**Why:** Per DECISION-013, Patrick's own flour tortilla recipe is the 16th launch recipe. The current `flour-tortillas.md` research file you wrote in Batch 2/3 may have used a different chef attribution or source. Patrick is the chef-of-record now: it's his recipe, learnt and tweaked from multiple sources over time.
**What's needed:**
1. Open `docs/coo/culinary-research/flour-tortillas.md`.
2. Update the Hero section: `chef: Patrick Nasr`. `source.notes`: "Patrick's own recipe — soft, buttery, adapted over time from multiple sources." `source.video_url`: null.
3. Patrick will provide his actual ingredient ratios and technique notes in a follow-up message in this chat. Reformat his input to the 10-section template (Hero / At a glance / Description / What to know before you start / Equipment / Ingredients / Prep / Cook steps / Finishing & tasting / Leftovers & storage).
4. Apply your pre-flight checklist before declaring it ready — ingredient/step parity, hidden time accounted for, doneness cues on every step, scaling annotations populated, Australian English throughout.
5. Add an entry to `docs/coo/culinary-research/launch-recipe-units.md` for tortillas: unit = "tortilla", default = 8, "make extra" = "+N tortillas".
**Files touched:** `docs/coo/culinary-research/flour-tortillas.md`, `docs/coo/culinary-research/launch-recipe-units.md`
**Blocks:** Engineer's flour tortilla migration into seed-recipes.ts (so FLOUR_TORTILLAS can ship in v1.0)

---

### HANDOFF → Senior Engineer · 2026-05-08 · OPEN (CHICKEN_SHAWARMA — new recipe required for v1.0 launch slot)
**From:** Culinary & Cultural Verifier
**Subject:** Author `CHICKEN_SHAWARMA` recipe const; flag `LAMB_SHAWARMA` as not yet shipping
**Why:** Patrick confirmed 2026-05-08 that the v1.0 launch slot is chicken shawarma, not lamb. The library currently has `LAMB_SHAWARMA` only. A new recipe needs to be created.
**What's done:** Portion sizing spec is locked in `docs/coo/culinary-research/launch-recipe-units.md` (section 13). `LAMB_SHAWARMA` stays in the seed file but must be flagged `not_yet_shipping` — it is a v1.2 candidate.
**What's needed:**
1. Create a new `CHICKEN_SHAWARMA` recipe const in `seed-recipes.ts`. Use the existing `LAMB_SHAWARMA` recipe object as the structural template — replace lamb with boneless chicken thighs, update marinade ratios, adjust cook time to 25–30 min at 220°C, update attribution.
2. Set `LAMB_SHAWARMA` status to `not_yet_shipping` (or remove from the launch set — whichever the schema supports).
3. Culinary Verifier will need to author a full DECISION-009 research file for `CHICKEN_SHAWARMA` before it can pass the pre-flight checklist — create a skeleton `.md` file at `docs/coo/culinary-research/chicken-shawarma.md` as a placeholder so the Verifier knows it's needed.
**Files touched:** `mobile/src/data/seed-recipes.ts`, `docs/coo/culinary-research/launch-recipe-units.md`
**Blocks:** DECISION-009 migration for the shawarma slot; photography scheduling

---

### HANDOFF → Senior Engineer · 2026-05-08 · OPEN (DECISION-012 — bump version to v0.5.0 on next push)
**From:** Patrick (via COO)
**Subject:** Set `version` in `mobile/app.json` to `"0.5.0"` on the next commit. Adopt new versioning policy.
**Why:** Per DECISION-012 (decision-log.md, 8 May), `v1.0.0` is reserved for Play Store production launch day. Pre-launch we use v0.x. Only the COO bumps minor versions — engineer continues to bump patches and build numbers freely. Current state has shipped enough to justify a retroactive bump from `0.4.1` to `0.5.0` to mark the Pantry v3/v4 + dark/sage palettes + Kitchen improvements + recipe template skeleton package.
**What's needed:**
1. In `mobile/app.json`, change `expo.version` from `"0.4.1"` to `"0.5.0"`. No other code changes.
2. `expo.android.versionCode` (the build number) keeps auto-incrementing as normal — that's separate.
3. Going forward: do NOT auto-bump the minor version on your own. Bug-fix patches go `0.5.0 → 0.5.1 → 0.5.2`. Minor bumps (`0.5.x → 0.6.0`) only happen on explicit COO instruction. The milestone map is in DECISION-012.
4. Commit message: `chore(version): bump to v0.5.0 per DECISION-012`.
**Files touched:** `mobile/app.json` only.
**Cost:** ~5 minutes.
**Blocks:** Nothing. Land alongside any other build.

---

### HANDOFF → Patrick · 2026-05-08 · ON-DEVICE VALIDATION (three jobs landed, awaiting your install)
**From:** Senior Engineer
**Subject:** ATTR-FAIL + 11-recipe DECISION-009 + 27-recipe Batch 3+4 + audit placeholder all on origin/main; build not triggered per CLAUDE.md.
**Commits:**
- `ee111a0` — ATTR-FAIL: 16 broken attribution URLs converted to book citations
- `5ac153b` — DECISION-009 Batch 2 (11 launch-priority recipes)
- `e649f0f` — DECISION-009 Batch 3+4 (27 cook-extras)
- `c5f6a2d` — UI placeholder for the one remaining empty recipe (sourdough-maintenance)

**State after all four commits:**
- 44 of 45 seed recipes carry full DECISION-008 sections (Equipment, Prep, Before-you-start, Finishing, Leftovers, total/active timings)
- 1 still empty: `sourdough-maintenance` — intentional, it's a starter-feeder guide, not a meal recipe; renders the new "Equipment and prep notes are coming" placeholder
- Zero broken attribution URLs in `seed-recipes.ts`
- Zero `whole_food_verified` references anywhere outside historical session reports

**On-device checks Patrick should walk through after triggering a build:**
1. Open chicken-adobo (now book-cited "Anthony Bourdain, No Reservations Philippines" with no URL) — Equipment, Prep, Finishing, Leftovers should render
2. Open butter-chicken — total time should read 270 min (4h 30m, including the 4-hour marinade) instead of the previous understated 90
3. Open roast-chicken — total time should read 840 min (14h, dry-brine overnight) instead of 90
4. Open lamb-shawarma — Prep checklist should be tappable, count should tick
5. Open sourdough-maintenance — should show the sage-tinted "Equipment and prep notes are coming" placeholder, NOT empty space
6. Open carbonara — `Watch the original` button should still work (the URL was already clean)

**Per CLAUDE.md:** GitHub issue NOT closed. Patrick validates on-device and closes himself.

**Build trigger:** Patrick decides when. The fixes are stacked on top of `4725618` (REGN-006 + REGN-007 fix that was last built as #92/#93). A new build dispatched on `c5f6a2d` will carry everything since the last validated APK.

---

### HANDOFF → Senior Engineer · 2026-05-08 · DONE ✅ (ATTR-FAIL — 16 broken attribution URLs fixed)
**Closed by Senior Engineer 2026-05-08 in commit `ee111a0`.** All 16 recipes converted to book citations per Patrick's default. Andy Cooks recipes (PRAWN_TACOS_PINEAPPLE, WEEKDAY_BOLOGNESE) used 'inspired by, no URL' framing because Andy Cooks doesn't have a published book. No video_url remains broken in seed-recipes.ts. Patrick validates on-device.

### Original handoff (preserved for audit) → Senior Engineer · 2026-05-08 · OPEN (ATTR-FAIL — fix 16 broken attribution URLs in seed-recipes.ts)
**From:** Culinary & Cultural Verifier
**Subject:** 16 recipes have `video_url` values that violate Golden Rule 1 — fix before any recipe ships
**Why:** The full attribution audit (`docs/coo/culinary-audit.md`, 2026-05-08) found 16 of 45 seed recipes link to a channel homepage, site root, about page, or chef listing page — none of which point to a specific recipe. Under Golden Rule 1, every chef-attributed link must be live and point to the specific recipe, not a channel or site. None of these recipes can ship until the link is correct or the attribution is reframed as a book citation / "inspired by" with no URL.
**What's needed:**
For each recipe below, either:
(a) Find the specific YouTube `watch?v=` video or specific recipe page URL and update `video_url` in `seed-recipes.ts`, OR
(b) Change attribution to a book citation format — update `source.notes` to include the book title, and remove or null `video_url`. The `chef` field stays as-is.

| Recipe const | Chef | Current broken URL | Fix type |
|---|---|---|---|
| `CHICKEN_ADOBO` | Anthony Bourdain / No Reservations | `@AnthonyBourdainPartsUnknown` (channel + wrong show) | Find No Reservations Philippines clip or use book citation |
| `BEEF_STEW` | Jacques Pépin | `/c/HomeCookingwithJacquesPepin` (channel) | Find specific beef stew episode on that channel |
| `ROAST_CHICKEN` | Thomas Keller / Bouchon | `@ChefThomasKeller` (channel) | Find specific roast chicken video or use Bouchon book citation |
| `PRAWN_TACOS_PINEAPPLE` | Andy Cooks | `@andy_cooks` (channel) | Find specific prawn taco/pineapple video |
| `FRENCH_ONION_SOUP` | Anthony Bourdain / Les Halles | `@AnthonyBourdainPartsUnknown` (channel + wrong show) | Find Les Halles video or use *Les Halles Cookbook* citation |
| `SCRAMBLED_EGGS` | Gordon Ramsay | `@GordonRamsay` (channel) | The F Word scrambled eggs clip is widely available — find `watch?v=` |
| `WEEKDAY_BOLOGNESE` | Andy Cooks | `@andy_cooks` (channel) | Find specific bolognese video |
| `MUSAKHAN` | Reem Kassis / The Palestinian Table | `reemkassis.com/` (site root) | Find specific musakhan page or use *The Palestinian Table* book citation |
| `KAFTA` | Anissa Helou / Feast | `anissas.com/` (site root) | Find specific kafta page or use *Feast* book citation |
| `HUMMUS` | Reem Kassis / The Palestinian Table | `reemkassis.com/` (site root) | Find specific hummus page or use *The Palestinian Table* book citation |
| `FATTOUSH` | Anissa Helou / Lebanese Cuisine | `anissas.com/` (site root) | Find specific fattoush page or use *Lebanese Cuisine* book citation |
| `SOURDOUGH_MAINTENANCE` | Chad Robertson / Tartine Bakery | `tartinebakery.com/about` (about page) | Find specific video or use *Tartine Bread* book citation |
| `SOURDOUGH_LOAF` | Chad Robertson / Tartine Bakery | `tartinebakery.com/about` (about page) | Find specific video or use *Tartine Bread* book citation |
| `RISOTTO` | Marcella Hazan | `giulianohazan.com/` (site root — also Giuliano's site, not Marcella's) | Find specific mushroom risotto page or use *Essentials of Classic Italian Cooking* book citation |
| `RAMEN` | Ivan Orkin / Ivan Ramen | `ivanramen.com/` (site root) | Find specific recipe page or use *Ivan Ramen* book citation |
| `DAL` | Madhur Jaffrey | `thehappyfoodie.co.uk/chefs/madhur-jaffrey/` (chef listing page) | Find specific tarka dal page on Happy Foodie or use *Madhur Jaffrey's Curry Easy* book citation |

**Also flag for review:** `BEEF_LASAGNE` — the URL `https://www.nytimes.com/recipes/12869/marcella-hazans-bolognese-meat-sauce.html` is a specific page (PASS) but it links to a Bolognese sauce recipe, not a lasagne. The attribution notes should clarify: "Sauce adapted from Marcella Hazan's bolognese; assembled as lasagne — Hone Kitchen." Update `source.notes` accordingly.

**Files touched:** `mobile/src/data/seed-recipes.ts` — `source.video_url` and `source.notes` fields only. No step or ingredient changes.
**Full audit detail:** `docs/coo/culinary-audit.md` — per-recipe attribution notes with context on each failure.
**Blocks:** All 16 affected recipes from shipping. This is a brand-safety issue, not just a QA item.

---

### HANDOFF → COO · 2026-05-07 · DONE ✅ (Cook briefed in writing — engineer unblocked for 11-recipe migration)
**Closed by COO 2026-05-07.** Cook's brief at `docs/coo/specialists/culinary-verifier.md` now carries an explicit "RETIRED FIELDS — DO NOT USE" section at the top of "How you work," naming `whole_food_verified` and instructing zero use in any new research file. A session-end `grep -i "whole_food..."` check has been added to the cook's "At session end" ritual so any drift is caught before close. Patrick is sending the cook a paste-back to acknowledge directly. Engineer cleared to proceed with the 11-recipe migration.

### Original handoff (preserved for audit) → COO · 2026-05-07 · OPEN URGENT (brief the Cook — whole-food field is dead)
**From:** Patrick (via Senior Engineer)
**Subject:** The cook's research database had whole-food references throughout. Engineer cleaned them. Cook must be told to never use the term again.
**Why:** The `whole_food_verified` field was retired across the entire repo on 2026-05-07 (commits `21198e5` + `474f500`). When the engineer ran the cleanup, fifteen of the sixteen recipe research files in `docs/coo/culinary-research/` still had a "Whole-food claim:" or "Whole-food verified:" line in their audit sections — the cook had been adding it as a standard audit checkbox. The lines have been stripped, but if the cook keeps following the old pattern, the term will leak back in next time research lands. Patrick's words: he wants this fully addressed before the 11-recipe migration proceeds, so we don't ship an APK with the term re-introduced through a new research file.

**What's already done (Engineer):**
- Stripped 15 `Whole-food claim:` / `Whole-food verified:` lines from the cook's research files in `docs/coo/culinary-research/`. Smash-burger left intentionally as the retirement narrative.
- Verified `docs/coo/culinary-research/TEMPLATE.md` (the cook's template) is clean — no mention there.
- Verified `docs/coo/specialists/culinary-verifier.md` (the cook's brief) is clean — Patrick had already cleaned this earlier.
- Schema, seed data, SQLite column, prototypes, BUGS.md, command-centre.md, roadmap.md, handoffs.md — all stripped. Only the URGENT handoff and the smash-burger retirement narrative still mention it, both deliberately.

**What's needed (COO actions):**
1. **Brief the Cook explicitly:** the whole-food concept is retired. Don't add `whole_food_verified` to any new recipe data. Don't include a "Whole-food claim" or "Whole-food verified" line in the audit section of new research files.
2. **Update the cook's standing brief if needed.** The current `docs/coo/specialists/culinary-verifier.md` is clean — confirm no follow-up edits required, or add an explicit "do not use" note if you think the cook needs the reminder in writing.
3. **Confirm to Senior Engineer when done** so the 11-recipe migration can proceed without risk of re-introducing the term through new research files.
4. **Future-proof:** consider adding a one-line check to the cook's session-end checklist — `grep "whole_food" docs/coo/culinary-research/<new-file>.md` should return zero hits.

**Files referenced:**
- `docs/coo/culinary-research/*.md` (cleaned, except smash-burger.md retirement narrative)
- `docs/coo/specialists/culinary-verifier.md` (already clean)
- `docs/coo/culinary-research/TEMPLATE.md` (already clean)

**Blocks:**
- The 11-recipe DECISION-009 migration (separate handoff below) is paused until the COO confirms the Cook has been briefed. Patrick's call — he doesn't want the term to come back in a Cook update.

---

### HANDOFF → Senior Engineer · 2026-05-07 · DONE ✅ (kill whole_food_verified + verify Prep + Equipment populated)
**Closed by Senior Engineer 2026-05-08.** Both tasks landed:
- TASK 1 (kill whole_food_verified) — completed in commits `21198e5` + `474f500` on 2026-05-07. Removed from Zod schema, all 45 seed recipes, SQLite v7 migration, prototypes, BUGS.md, command-centre.md, handoffs.md, culinary-research/*.md, roadmap.md. Only deliberate retirement-doc references remain. tsc clean.
- TASK 2 (verify Prep + Equipment populated) — completed in commits `5ac153b` + `e649f0f` + `c5f6a2d` on 2026-05-08. 44 of 45 recipes now carry full DECISION-008 fields. Sourdough-maintenance is the lone exception and renders the new "Equipment and prep notes are coming" placeholder.
Patrick validates on-device. Per CLAUDE.md, the GitHub issue is not closed by the engineer.

### Original handoff (preserved for audit) → Senior Engineer · 2026-05-07 · OPEN URGENT (kill whole_food_verified + verify all recipes show Prep + Equipment)
**From:** Patrick (via COO)
**Subject:** Two related cleanups: remove the whole-food-verified concept from the entire repo, and verify every recipe actually renders the Prep and Equipment sections on-device
**Why:** The `whole_food_verified` field has caused recurring problems — it blocked SMASH_BURGER from rendering (6 May), the `.refine()` was removed, but the field remains in the schema and data. Patrick has decided to drop the concept entirely. Separately, Patrick is still seeing many recipes on-device with no Prep section and no Equipment list. Both need a definitive end.

**TASK 1 — Remove whole_food_verified from the entire repo, locally and on GitHub.**

Surfaces to clean (30 files referenced; engineer should grep to confirm):
- `mobile/src/data/types.ts` — remove the field from the Zod schema
- `mobile/src/data/seed-recipes.ts` — strip the field from every recipe object
- `mobile/db/schema.ts` — remove the SQLite column (write a migration if data exists)
- `mobile/db/seed.ts` and any seeder code — remove field references
- Any UI rendering the badge: `mobile/app/recipe/[id].tsx`, RecipeCard, recipe-detail-v2.html, recipe-card-v2.html, recipe-detail-v2.1.html prototypes
- Documentation: `BUGS.md`, `docs/coo/handoffs.md` (this file), `docs/coo/command-centre.md`, all session reports under `docs/sessions/` (these are historical — leave session-report mentions alone, they're the diary; only strip live reference docs)
- Cook's research files: `docs/coo/culinary-research/*.md` — strip the field from each (the COO has already removed the rule from CLAUDE.md and the cook brief)

Approach:
1. Grep to find every reference. Keep historical session reports as-is (they're the diary).
2. Remove the Zod field, the data field on every recipe, the SQLite column with a migration, the UI badges, and any tests.
3. Run `npx tsc --noEmit` to confirm nothing else references it.
4. Commit with a clear message and push to `main`.

**TASK 2 — Audit and complete the Prep + Equipment data on every recipe Patrick can browse.**

Patrick is finding recipes on-device with empty Prep and Equipment sections. The 11-recipe DECISION-009 migration handoff (also in this file, queued before this) covers 11 of those. After that lands, this task adds the verification layer:

1. Run a script or manual pass: for every recipe in `seed-recipes.ts`, check `equipment.length > 0` AND `mise_en_place.length > 0`. Output the list of recipes still empty.
2. For each empty recipe, check whether a research file exists in `docs/coo/culinary-research/<recipe-slug>.md`. If yes, migrate the data. If no, that recipe is on Cook's Batch 2 — list it back to the COO for Cook handoff.
3. The UI must NOT silently hide the section if the data is empty. Instead, when both fields are empty, the recipe should not yet be browsable — or render a clear "Recipe being upgraded" state. Pick the cleanest option, document the call.
4. Verify on-device that every recipe Patrick can open has both sections visible with real content.

**Validation gate before declaring done:**
- `npx tsc --noEmit` passes
- Brace + JSX balance check passes (per R-014 mitigation)
- `tail -c 200` of every modified large file shows clean end of file
- All recipes browsable show Prep + Equipment with content
- No grep hit for `whole_food_verified` anywhere except historical session reports
- Patrick validates on-device — and only Patrick closes the issue per CLAUDE.md

**Files touched:** Per grep — `mobile/src/data/types.ts`, `mobile/src/data/seed-recipes.ts`, `mobile/db/schema.ts`, `mobile/db/seed.ts`, multiple UI files in `mobile/app/`, multiple prototype HTML files, multiple culinary-research markdown files, BUGS.md, this handoffs file
**Cost:** ~1 session for both tasks combined
**Blocks:** Recipe quality on-device — currently Patrick sees empty sections even on supposedly-completed recipes

---

### HANDOFF → Senior Engineer · 2026-05-07 · DONE ✅ (DECISION-009 — 11-recipe migration)
**Closed by Senior Engineer 2026-05-08 in commit `5ac153b`.** All 11 recipes ported from `docs/coo/culinary-research/*.md` into `seed-recipes.ts` with `total_time_minutes`, `active_time_minutes`, `equipment[]`, `before_you_start[]` (capped at 3 per Zod schema), `mise_en_place[]`, `finishing_note`, `leftovers_note`. Markdown bold (`**text**`) stripped from inserted strings — they would not have rendered in React Native Text. Time strings normalised to integer minutes (e.g. "4 hours 30 min" → 270, overnight → 720 floor). Cook authored research for an additional 27 recipes during the same window; those landed as a follow-on commit `e649f0f`. Patrick validates on-device.

### Original handoff (preserved for audit) → Senior Engineer · 2026-05-07 · OPEN (DECISION-009 — 11-recipe migration)
**From:** COO
**Subject:** Migrate 11 recipes that already have research files into seed-recipes.ts with full DECISION-009 fields
**Why:** Per the engineer's 7 May handover, the recipe audit found 6 recipes fully populated (Batch 1), **11 recipes that have research `.md` files in `docs/coo/culinary-research/` ready to migrate**, and 27 recipes still waiting on Cook's Batch 2 research. The 11-recipe migration is unblocked — research already exists, no Cook input needed.
**Recipe ↔ source file ↔ seed line map (verified 2026-05-07):**

| Seed const | Line | Recipe id | Research file |
|---|---|---|---|
| `SMASH_BURGER` | 42 | `smash-burger` | `culinary-research/smash-burger.md` |
| `PASTA_CARBONARA` | 253 | `pasta-carbonara` | `culinary-research/carbonara.md` |
| `ROAST_CHICKEN` | 432 | `roast-chicken` | `culinary-research/roast-chicken.md` |
| `HUMMUS` | 676 | `hummus` | `culinary-research/hummus.md` |
| `THAI_GREEN_CURRY` | 1150 | `thai-green-curry` | `culinary-research/green-curry.md` |
| `PAD_THAI` | 1320 | `pad-thai` | `culinary-research/pad-thai.md` |
| `WEEKDAY_BOLOGNESE` | 1775 | `weekday-bolognese` | `culinary-research/bolognese.md` |
| `LAMB_SHAWARMA` | 2178 | `lamb-shawarma` | `culinary-research/shawarma.md` |
| `BUTTER_CHICKEN` | 2709 | `butter-chicken` | `culinary-research/butter-chicken.md` |
| `BARRAMUNDI` | 3130 | `barramundi-lemon-butter` | `culinary-research/barramundi.md` |
| `PAVLOVA` | 3200 | `pavlova` | `culinary-research/pavlova.md` |

`FALAFEL` (line 4416) is the migration template — copy field shapes verbatim. Note `culinary-research` filenames don't always match recipe ids (e.g. `barramundi.md` → `barramundi-lemon-butter`, `green-curry.md` → `thai-green-curry`, `shawarma.md` → `lamb-shawarma`, `bolognese.md` → `weekday-bolognese`, `carbonara.md` → `pasta-carbonara`).

**Note:** the `whole_food_verified` field was retired 2026-05-07 — the concept caused recurring data drift. Don't add it. Schema, seed data, and DB column have all been removed; the migration is in `db/schema.ts` v7.
**What's needed:**
1. For each of the 11 recipes, read the corresponding `.md` source and migrate the new sections into `mobile/src/data/seed-recipes.ts`: `total_time_minutes`, `active_time_minutes`, `difficulty`, `equipment[]`, `before_you_start[]`, `mise_en_place[]`, `finishing_note`, `leftovers_note`. Existing fields (steps, ingredients, etc.) stay untouched.
2. After each recipe migration, validate the schema parses (`npx tsc --noEmit`) and visually verify last 5 lines (per R-014 mitigation).
3. After all 11, run a full `tsc --noEmit` on `seed-recipes.ts` and trigger a build.
4. **Don't combine with the step-flow audit fixes** (separate 6 May handoff, 10 HIGH-priority items). Keep this as its own commit and build for review.
**Cost:** Engineer estimates ~half a session.
**Files touched:** `mobile/src/data/seed-recipes.ts`
**Blocks:** Patrick seeing the full DECISION-008 sections on these 11 launch-priority recipes (currently they render with the same UI but with empty equipment/prep/finishing/leftovers — looks broken even though it's just missing data).

---

### HANDOFF → COO · 2026-05-07 · OPEN
**From:** Senior Engineer (Claude)
**Subject:** REGN-006 + REGN-007 fixed; build #93 dispatched on `4725618`; Cook Batch 2 + 11-recipe migration still open
**Why:** Patrick reported Equipment + Prep sections missing on most recipes (REGN-006), and Pantry STILL NEED chip state broken across three symptoms (REGN-007). Both have been root-caused, fixed in code, pushed to `main`, and a fresh APK build is in flight. There are tracked follow-ups the COO should be aware of and route correctly.

**What's done:**
- Diagnosed REGN-006 as a UI regression in `mobile/app/recipe/[id].tsx` — working tree had dropped 443 lines including the entire DECISION-008 UI block (At a glance / What to know / Equipment / Prep / Finishing & tasting / Leftovers & storage). Data was in the schema and SQLite; UI just wasn't rendering it. Restored from HEAD; re-applied the Pressable+View Android split on header buttons, title-card pill, Watch link, expand chip, and `MiseItem`. Renamed UI label "Mise en place" → "Prep" per Patrick — schema field `mise_en_place` unchanged.
- Diagnosed REGN-007 as a single architectural bug behind three symptoms: chip's `added` boolean lived in a local `Set<string>` on `RecipeMatchCard`. Inverted the state flow — chip state is now DERIVED from `shoppingNameSet` (a memoised normalised name set off the live `shoppingItems`). All mutations route through `addToShoppingList` / `removeFromShoppingList` on the parent. `useFocusEffect` re-fetches the shopping list on tab return so Shop-tab edits propagate. Toast holds the ingredient *name*, not chip state, so undo survives chip re-renders. All 5 chip paths Patrick called out are wired in code.
- Audited every recipe in `seed-recipes.ts`. Result: 6 fully populated (Batch 1), 11 have research files ready and need engineering migration, 27 have no research yet (Cook's Batch 2). Audit table is in BUGS.md and the session report.
- Pushed commit `4725618` to `origin/main`.
- Dispatched build #93 (`https://github.com/patrickpatches/hone/actions/runs/25489339565`) on Patrick's explicit go.
- Wrote session report `docs/sessions/Hone_Session_Report_07_May_2026_3.md`.
- Per CLAUDE.md, **no GitHub issues self-closed**. Patrick validates and closes.

**What's needed (COO actions):**
1. **Track build #93.** When it finishes and Patrick validates the on-device fixes for REGN-006 and REGN-007, close those tickets in BUGS.md and update the issue tracker.
2. **Open a new handoff to the Engineer for the 11-recipe DECISION-009 migration.** Source data is in `docs/coo/culinary-research/*.md` for: smash-burger, pasta-carbonara, weekday-bolognese, butter-chicken, thai-green-curry, pavlova, roast-chicken, barramundi-lemon-butter, lamb-shawarma, hummus, pad-thai. Estimate: half a session. Until that lands, those 11 recipes will render the screen exactly as before — no broken state, just fewer sections.
3. **Cook's Batch 2 (27 recipes)** still has no research and is blocked on the Cook authoring `docs/coo/culinary-research/<recipe-id>.md` files. The list is in BUGS.md REGN-006 audit table. Decide whether to escalate or spread across multiple cook sessions.
4. **Risk register entry needed.** The Edit tool truncated `pantry.tsx` and `recipe/[id].tsx` mid-write twice during this session — same class as REGN-003 (3 May). Caught both times by `npx tsc --noEmit` flagging JSX-not-closed errors at impossible-looking line numbers, then verified with `tail -c` showing the byte stream ending mid-attribute. Worth an `R-NNN` entry calling for "always run `tsc --noEmit` after any large file edit; verify the last line before assuming the write completed."

**Files touched:**
- `mobile/app/recipe/[id].tsx` — DECISION-008 sections restored, "Prep" rename, 5× Pressable+View splits.
- `mobile/app/(tabs)/pantry.tsx` — chip state architecture inverted, `useFocusEffect` added, `useRef` typing fixed (pre-existing TS error).
- `BUGS.md` — REGN-006 + REGN-007 entries with full root-cause notes and audit table.
- `docs/sessions/Hone_Session_Report_07_May_2026_3.md` — session report.
- This file — current handoff.

**Blocks:**
- Cook's Batch 2 authoring blocks the 27-recipe DECISION-009 migration to seed data.
- Engineering 11-recipe migration is unblocked — research files exist; just needs Engineer time.

---

### HANDOFF → Senior Engineer · 2026-05-06 · OPEN
**From:** Culinary Verifier (Claude)
**Subject:** Step-flow audit — 28 issues across 19 recipes in seed-recipes.ts
**Why:** Full chef's audit of every cook step in all 39 recipes in `mobile/src/data/seed-recipes.ts`. Cross-referenced steps against ingredients and prep fields. 28 issues found across 19 recipes: missing steps, hidden advance prep time, unreferenced ingredient prep, and one Golden Rule 1 violation.
**Full audit:** `docs/coo/culinary-research/step-flow-audit.md` — read before touching seed data.

**HIGH priority — fix before ship (10 issues):**

1. **sourdough-loaf** — Add s6 `{ id: 's6', title: 'Rest — do not cut yet', content: '...1 hour on wire rack...', timer_seconds: 3600 }`. The current why_note in s5 is the only place this appears. User who cuts early gets a gummy crumb.

2. **ramen** — Chashu pork (i7) is a 2-hour preparation with no step. Options in priority order: (a) add a make-ahead s0 with the chashu method; (b) add a prep note in i7 linking to an external method; (c) replace with `'Roasted pork shoulder, sliced (or store-bought char siu)'`. Minimum: option (b).

3. **chicken-adobo** — s4 says "Serve over steamed white rice" but rice is not an ingredient and no step cooks it. Add rice as an ingredient with a parallel cook note (start rice at s2 — the 35-min braise window is plenty of time).

4. **beef-rendang** — Kerisik (i3) requires toasting desiccated coconut and pounding it in a mortar (~10–15 min active). This exists only as ingredient prep. Add a kerisik-making step between s4 and s5 with a note that it can be done during the 2-hour braise window.

5. **curry-laksa** — Tofu (i2) is listed with prep "pan-fried until golden" but no step fries it. s5 just adds it to the broth. Add a tofu pan-frying step between s3 and s4.

6. **barramundi** — `time_min: 20` hides a mandatory 30-min skin-drying step (s1 timer_seconds: 1800). Update time_min to 50. Also: asparagus (i9) has prep "Blanched 2 minutes" but no step blanches it — add a note in s3 (5–6 min window while fish sears skin-side).

7. **pavlova** — `time_min: 150` understates actual time (minimum ~3h 10min). Update to 210. Also: add room-temp egg white instruction as the first line of s1.

8. **saag-paneer** — `video_url: 'https://www.youtube.com/@JoshuaWeissman'` is the channel homepage — Golden Rule 1 violation. Find the specific Joshua Weissman saag paneer video URL, or change `source.chef` to `'Hone Kitchen'` and remove the video_url.

9. **butter-chicken** — `time_min: 90` hides 4-hour minimum marinade. Update to 330. *(Already flagged Batch 2 — confirming still open.)*

10. **roast-chicken** — `time_min: 90` hides overnight dry brine. *(Already flagged Batch 2 — confirming still open.)*

**MEDIUM priority — fix before ship (9 issues):**

11. **kafta** — s5 references "sumac onions" (thinly sliced onion tossed with sumac) but: (a) no sliced onion exists in the ingredients, (b) no step makes this. Add `{ id: 'i11', name: 'White onion, thinly sliced, for serving', ... }` and add a prep instruction to s5.

12. **musakhan** — i9 `'Pine nuts, toasted'` — no step toasts them. Add to s4: "Toast pine nuts in a dry pan 2–3 min over medium heat, stirring constantly, until golden."

13. **pad-thai** — s3 says "Add protein to the wok edge" without differentiating tofu-first timing. Tofu takes 2–3 min longer than prawns. Update s3: fry tofu first until lightly golden, push aside, then add prawns. (Linked to the substitution data fix already documented in `pad-thai.md`.)

14. **nasi-lemak** — Dried chillies need a 20-min pre-soak before s1 can start; no step or timing note tells the user. Also: belacan is listed as "toasted" in ingredient prep but no step toasts it. Add both to an opening instruction or the start of s1.

15. **beef-rendang** — Same dried chilli soak issue as nasi-lemak. Add opening instruction: soak chillies in boiling water 20 min before starting s1.

16. **curry-laksa** — s4 says "Add chicken stock and prawn stock" but the volume of prawn stock to use is only in the s1 why_note. Move to s4 step content: "Add 400ml chicken stock and all the prawn stock."

17. **saag-paneer** — s5 "Serve with basmati rice or naan" — neither in ingredients, no cook step. Add rice as a side ingredient with a concurrent cooking note (start rice at the beginning of s3's 15–18 min masala build).

18. **chicken-katsu** — Rice (i19) has no cook step. Add a rice-cooking note within s1 (curry simmers 20 min — enough time to cook rice concurrently).

19. **pavlova** — Add room-temp egg white instruction as first line of s1 (already listed under HIGH item 7 above — same fix).

**LOW priority — improve before ship (9 issues):**

20. **thai-green-curry** — s4 uses generic "vegetables". Name "Thai eggplant" specifically.
21. **braised-short-ribs** — s2 (sear all sides, ~15–20 min) missing `timer_seconds`. Add `timer_seconds: 1200`.
22. **nasi-lemak** — Belacan toasting instruction missing from steps (see item 14).
23. **curry-laksa** — Rice vermicelli soak (i3) and bean sprout blanch (i19) are in ingredient prep only. Add timing to s6 or a mise en place note.
24. **char-kway-teow** — Noodle room-temp requirement (i1 prep) not flagged in steps. Add to s1: "If noodles were refrigerated, take them out 30 min before starting — cold noodles kill wok hei." Also: pre-mix soy sauce, kecap manis, fish sauce, and white pepper in a small bowl before starting the 4-min cook.
25. **chicken-katsu** — Cabbage dressing (i20 prep: "dressed with a little rice wine vinegar") not in any step. Add to s5.
26. **flour-tortillas** — s7 (rolling) and s8 (heating pan) should be flagged as concurrent. Add note to s7: start the pan during rolling.

**Files touched:** `mobile/src/data/seed-recipes.ts`  
**Reference:** `docs/coo/culinary-research/step-flow-audit.md` (full per-recipe detail with exact wording for each fix)  
**Blocks:** Launch quality — users will hit missing steps mid-cook.

---

### HANDOFF → Senior Engineer · 2026-05-05 · OPEN
**From:** Product Designer
**Subject:** Two design additions to `recipe/[id].tsx` — "A note" truncation + recipe card v2 redesign
**Why:** Patrick confirmed both items in the 05 May design session. Neither requires schema changes. Both can ship independently of each other and independently of the v2 section handoff already in this file.

---

**ITEM 1 — "A note" collapsible text block**

The field is `recipe.description`. Currently it renders in full, no truncation, inside a `bgDeep` rounded box with a bold "A note: " label prefix (line 454 of `recipe/[id].tsx`).

**What to change:**
- Clamp the text to **3 lines** by default (`numberOfLines={3}` on the inner `<Text>`).
- Below the clamped text, render a `<Pressable>` with label **"Read more"** in `tokens.primary` (rust), 12px, `fonts.sansBold`.
- When expanded, show full text and change the label to **"Show less"**.
- State: `const [noteExpanded, setNoteExpanded] = useState(false)` — local, no persistence.
- Only render the toggle if the text actually overflows 3 lines. Use `onTextLayout` to measure — if `nativeEvent.lines.length <= 3`, hide the Pressable entirely.
- The outer container and styling stay the same — no visual change to the box itself.

**Microcopy:** "Read more" / "Show less" — lowercase, no ellipsis on the label itself. The clamped text naturally trails off with the OS ellipsis (`ellipsizeMode="tail"`).

**Accessibility:** The Pressable needs `accessibilityLabel="Read full note"` when collapsed and `accessibilityLabel="Show less of note"` when expanded. `accessibilityRole="button"`.

**Files to touch:** `mobile/app/recipe/[id].tsx` only.

---

**ITEM 2 — Recipe card redesign for Kitchen list**

The v2 design language established in `docs/prototypes/recipe-detail-v2.html` needs to carry through to the browse cards on the Kitchen screen. Currently the cards use a simpler layout. The redesign should bring the card visual language into alignment without a full component rewrite — it's a style pass, not a structural change.

**Spec (see `docs/prototypes/recipe-card-v2.html` for the visual reference):**

Card surface: `tokens.surface` (`#FFFFFF`), `borderRadius: 14`, `border: 1px solid tokens.line` (`#D8E4D6`), subtle shadow `0 2px 8px rgba(0,0,0,0.06)`.

Layout (top to bottom):
1. **Hero image** — square crop, full card width, `borderTopLeftRadius: 14`, `borderTopRightRadius: 14`. "Photos soon" badge bottom-right if `hasStagePhotos === false` (existing logic — keep as-is).
2. **Source chip** — overlaid bottom-left of the image (on top of hero scrim). `👨‍🍳 [Chef name]` in `tokens.primary` on a rust-tint pill (`rgba(184,64,48,0.10)` bg, `rgba(184,64,48,0.18)` border). Only render if `recipe.source?.chef` is present.
3. **Card body** — padding `12px 14px 14px`.
   - Recipe title: `fonts.display` (Playfair Display), 17px, `tokens.ink`, `letterSpacing: -0.3`. Single line, truncate with ellipsis.
   - Tagline: `fonts.sans`, 12px, italic, `tokens.muted`. 2-line max, ellipsis.
   - **At-a-glance strip** — horizontal row, `marginTop: 8`, separated by a thin `tokens.line` divider above. Three data points only: total time (⏱ `total_time_minutes` min), difficulty (📊 beginner/intermediate/advanced), and cuisine (first cuisine category tag). Font: `fonts.sans`, 11px, `tokens.muted`. If `total_time_minutes` is absent (old seed recipes), omit the strip entirely — don't show dashes.

**What does NOT change:** card tap behaviour, favourite icon, match badge (pantry context), planned-recipe indicator. Those stay exactly as-is.

**Conditional rendering rule:** the at-a-glance strip is conditional — cards without that data look like slightly simplified current cards, not broken.

**Files to touch:** `mobile/src/components/RecipeCard.tsx` (or equivalent card component), `mobile/app/(tabs)/index.tsx` if card layout is inlined there.

**Prototype reference:** `docs/prototypes/recipe-card-v2.html`

---

**Blocks:** Kitchen browse experience polish. At-a-glance strip also reinforces DECISION-009 data (gives Patrick a visible reason that the template expansion matters — the data shows up on the card).

---

### HANDOFF → Senior Engineer · 2026-05-05 · OPEN (after Patrick flips repo private)
**From:** Patrick (via COO)
**Subject:** Rotate the GitHub PAT and update the embedded remote URL
**Why:** Per DECISION-010, the repo just went private. The GitHub PAT embedded in `.git/config` remote URL was visible during the public period. Standard hygiene: rotate the token, update the remote, verify push/pull still works.
**Pre-condition:** Patrick has flipped the repo to private on GitHub. Verify by visiting `github.com/patrickpatches/hone` in an incognito window — should show 404 or login prompt.
**What's needed:**
1. Patrick generates a new fine-grained PAT in GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens. Scopes: `repo` (read + write) + `workflow`. Expiry: ~365 days, enough to comfortably reach launch.
2. Engineer (or Patrick) updates the `.git/config` remote URL with the new token, replacing the old one. The format is `https://<username>:<token>@github.com/patrickpatches/hone.git`.
3. Engineer runs a test push (e.g., a tiny commit to `docs/` or a no-op trailing newline) to verify the new token works end-to-end.
4. Patrick revokes the old PAT in GitHub Settings (so even if it was scraped during the public window, it's now dead).
5. Update `CLAUDE.md` Part 3 with the new PAT expiry date if the previous date was hardcoded.
**Files touched:** `.git/config` (local only — never committed), `CLAUDE.md` if expiry date is hardcoded
**Cost:** ~10 minutes.
**Blocks:** Nothing — current PAT keeps working until revoked. But should be done within the next session for hygiene.

---

### HANDOFF → Senior Engineer · 2026-05-04 · DONE ✅ (2026-05-05 — all 6 sections implemented in recipe/[id].tsx)
**From:** Product Designer
**Subject:** Implement the 6 new recipe-detail sections from `docs/prototypes/recipe-detail-v2.html`
**Why:** Schema pass (8 new fields) lands first. This UI pass lands after. Don't start until schema is committed and Carbonara's seed data has been expanded by the Culinary Verifier — you need real data to QA the new sections.

**What's done (Designer):**
- `docs/prototypes/recipe-detail-v2.html` — full Carbonara prototype with all 8 sections, rationale, and this engineer handoff.

**What to implement (in `mobile/app/recipe/[id].tsx`):**

1. **At-a-glance row** — below recipe header, above servings selector. Fields: `total_time_minutes`, `active_time_minutes`, `difficulty`, first cuisine category, `leftover_mode !== 'none'`. Horizontal row of 5 icon+label pairs, separated by thin lines.

2. **What to know block** — from `before_you_start: string[]`. Left border `#5B8FD4` (not a new token — inline only). Conditionally rendered; omit entirely if array is empty.

3. **Equipment row** — from `equipment: string[]`. Horizontal `ScrollView` of pills. Conditionally rendered.

4. **Mise en place** — from `mise_en_place: string[]`. Tappable rows with circular checkboxes, progress counter. State: `useState<Set<number>>(new Set())`, **session-only** (no SQLite write). Left accent `#F2D896` (ochre, existing token). Conditionally rendered. **Expand pattern — threshold 4 (Designer decision, 2026-05-04):** show first 4 items; if array length > 4, render an ochre "Show N more prep tasks" chip below item 4 (N = total − 4). Tap reveals remaining items (150ms opacity fade). Chip disappears once expanded — no re-collapse. Progress counter counts all items including hidden ones. Threshold is 4 not 5: keeps "Start cooking" CTA above the fold on standard phones after scrolling ingredients and equipment.

5. **Finishing & tasting block** — from `finishing_note?: string`. Left border `#C4A882` (inline only). Conditionally rendered.

6. **Leftovers block** — from `leftovers_note?: string`. Dark low surface. Conditionally rendered.

**Critical rule — conditional rendering:** Every new section must render nothing (no blank card, no section gap) when its data field is absent or empty. The page must be backwards-compatible with unexpanded recipes.

**Do NOT change:** Ingredients, SubstitutionSheet, ServingsSelector, cook steps, hero, back/favourite/plan/share controls.

**Files to touch:** `mobile/app/recipe/[id].tsx` only. No new component files needed.

**Blocks:** Launch quality — every recipe page currently shows none of these sections.

---

### INCIDENT NOTE → COO · 2026-05-03 · RESOLVED (build #53 in progress)
**From:** Senior Engineer
**Subject:** Build failures #51 and #52 — root causes diagnosed and fixed
**Why this exists:** Patrick reported APK build failures after the session-2 push. Two separate bugs were responsible; both are now resolved.

**Root cause 1 — stale import (build #51)**
`IngredientSearchOverlay.tsx` was correctly deleted from GitHub in the prior session, but `pantry.tsx` was never updated on GitHub to match (the local v0.6.0 write was not pushed). GitHub was holding the old v0.5.x `pantry.tsx` which still imported the now-deleted file. Metro bundler failed: `Unable to resolve module IngredientSearchOverlay`. Fix: pushed the correct local v0.6.0 `pantry.tsx` to GitHub (commit `5a9a1db`).

**Root cause 2 — truncated file (build #52)**
The v0.6.0 `pantry.tsx` file was itself truncated at line 1218 mid-expression (`{undo`). The file write during the original Pantry v3 session was cut off before the undo toast was completed, and before any of the five subcomponent function definitions (`Pill`, `EmptyPantry`, `NoMatchesState`, `RecipeMatchCard`, `ChipAdd`). Metro bundler reported `SyntaxError: Unexpected token, expected "}" (1219:17)`. This is a variant of the REGN-002 class of issue (file write truncation, not null-byte corruption this time). Fix: completed the toast expression, restored both toast blocks, closed `KeyboardAvoidingView`, and restored all five subcomponents. Brace/paren balance verified at 0. Pushed as commit `7292f07`.

**Build #53 triggered at 2026-05-03T12:31:47Z — currently in progress.**

**Action needed from COO:**
- None right now. Wait for build #53 to complete, then hand off the APK to Patrick for smoke test.
- Once Patrick validates on-device, update the open Photography Director handoff (still waiting on his review).
- Consider adding a "verify file not truncated" step to the release checklist (last N lines of every large file should be inspected before push — `tail -5 pantry.tsx` takes 2 seconds).

---

### HANDOFF → Senior Engineer · 2026-05-05 · DONE ✅ (2026-05-05 — types.ts expanded, difficulty normalised, ADR-002 written)
**From:** Patrick (via COO)
**Subject:** Add 8 new fields to the Recipe Zod schema for the full recipe template
**Why:** DECISION-009 adopts a full 8-section recipe template across every recipe in the database. The cook authors content; you provide the schema fields; Designer designs the page; you implement the UI in a second pass after Designer ships. This is the additive schema work that unblocks both cook (long-running) and Designer (page redesign).
**What's needed:**
1. In `mobile/src/data/types.ts`, add to the `Recipe` Zod schema:
   - `total_time_minutes: z.number().int().positive()`
   - `active_time_minutes: z.number().int().positive()`
   - `difficulty: z.enum(["beginner", "intermediate", "advanced"])`
   - `equipment: z.array(z.string()).default([])`
   - `before_you_start: z.array(z.string()).max(3).default([])`
   - `mise_en_place: z.array(z.string()).default([])`
   - `finishing_note: z.string().optional()`
   - `leftovers_note: z.string().optional()`
2. All new fields are additive and optional or have sensible defaults — no breaking change to existing recipes that don't have them populated.
3. Update the TypeScript `Recipe` type accordingly.
4. **Do NOT update the recipe-detail UI yet** — wait for Designer's page redesign (separate Designer handoff). UI implementation lands in your second pass after the design ships.
5. Write an ADR (next number) covering the schema expansion.
**Files touched:** `mobile/src/data/types.ts`, `docs/adr/NNN-recipe-template-expansion.md`
**Cost:** ~1-2 hours.
**Sequencing:** Can be done in any order relative to Pantry v3 work — additive schema doesn't conflict with Pantry refactor.
**Blocks:** Cook's seed-recipes.ts repopulation (she can author into source `.md` files in `docs/coo/culinary-research/` in parallel; only the typed seed file blocks on this).

---

### HANDOFF → Product Designer · 2026-05-05 · DONE ✅ (delivered 2026-05-04 — verified by COO 5 May, no delta against DECISION-009)
**Delivered:** `docs/prototypes/recipe-detail-v2.html` — full 10-section Carbonara prototype. Hero, title/tagline/attribution, at-a-glance row (5 facts horizontal, <2s read), before-you-start framing block (blue), servings selector, ingredients with swap chips, equipment (gold-tint pills), mise en place (ochre, lighter type, no photos, tappable checkboxes, expand chip at 4), start cooking CTA, cook steps (unchanged), finishing & tasting (warm-brown framing, italic chef voice), leftovers (low surface, muted), attribution footer. Engineer handoff + conditional-rendering rules + risks section included. Cognitive-mode distinction (mise = fridge-open, cook steps = hands-wet) is the core of the design.
**Note:** COO's later "8-section template" wording was a counting error — referring to *new* sections being added, not total. Designer's prototype correctly shipped with all 10. Decision log corrected.
**From:** Patrick (via COO)
**Subject:** Redesign the recipe-detail page to display the new 10-section template
**Why:** DECISION-009 adopts a full recipe template. Each recipe now has additional sections — at-a-glance, before-you-start, equipment, mise en place, finishing & tasting, leftovers — that the current recipe page doesn't surface. The page needs to be redesigned with the right typographic and visual hierarchy. This is the page that defines whether Hone reads as a cookbook or as a recipe app.
**What's needed:**
1. Mockup the new recipe-detail page in `docs/prototypes/recipe-detail-v2.html`. Show one recipe end to end (use Pasta Carbonara since it's the canonical reference).
2. Display all sections in a clear vertical flow that reads top-to-bottom like a cookbook entry, not a long unstructured list.
3. Visual distinctions to spec:
   - **At-a-glance** is a compact horizontal row of facts (time, difficulty, leftover-friendly, cuisine) — read in <2 seconds
   - **What to know before you start** is a visually distinct framing block — short, prominent, before any heat-related content
   - **Equipment** sits separate from ingredients — possibly a collapsible row or pill row
   - **Mise en place** is visually distinct from cook steps — the cook reads prep with the fridge open, and reads cook steps with hands wet, so the section needs different treatment (lighter typography, no photos)
   - **Cook steps** stay as currently designed — photos, why-notes, doneness cues
   - **Finishing & tasting** is a final framing block, similar treatment to "What to know before you start" but at the end
   - **Leftovers & storage** is the last block — light, conclusive
4. Preserve all current design tok