# Hone Session Report — 8 May 2026 (Report 3)

**Session type:** Senior Product Engineer
**Build dispatched:** #95 on commit `4c4daf9`
**Commits pushed (5):** `08529ff`, `a03f0e1`, `f8a4750`, `d7c7c5a`, `4c4daf9`

## Headline

Five-commit launch-scoping package landed on origin/main. Build #95 dispatched on Patrick's go. v1.0 now ships exactly 16 recipes (the launch-16 from DECISION-013); the other 30 stay in the seed file but are filtered out of every user-visible surface. Two on-device fixes Patrick reported earlier (Smash Burger sauce showing as one shop-list row, Equipment side-scroll being clunky) are also in this build. Version bumped to 0.5.0 per DECISION-012.

## What landed

| Commit | Subject | Touch |
|---|---|---|
| `08529ff` | bump app.json to v0.5.0 per DECISION-012 | 1 line |
| `a03f0e1` | SMASH_BURGER — split burger sauce into mayo + ketchup + mustard | seed-recipes.ts |
| `f8a4750` | Equipment as vertical wrap pill list (was horizontal scroll) | recipe/[id].tsx |
| `d7c7c5a` | CHICKEN_SHAWARMA new recipe + LAMB_SHAWARMA→not_yet_shipping prep | seed-recipes.ts |
| `4c4daf9` | DECISION-013 — not_yet_shipping flag + 30 non-launch flagged + FLOUR_TORTILLAS chef = Patrick Nasr | types.ts, db/database.ts, index.tsx, pantry.tsx, seed-recipes.ts |

## Per-commit detail

### `08529ff` — version bump (DECISION-012)
Single-line change in `mobile/app.json`: `"version": "0.4.1"` → `"0.5.0"`. Per the new versioning policy: 1.0.0 reserved for Play Store production; only the COO bumps minor versions; engineer continues auto-incrementing the build number freely.

### `a03f0e1` — SMASH_BURGER sauce breakdown (Patrick's report)
Patrick reported on-device that tapping 'Plan this recipe' on Smash Burger landed `Burger sauce (mayo + ketchup + mustard)` as a single shop-list row — the user couldn't add the components to their list independently, and the substitutions array on the compound name read awkwardly.

Root cause: the ingredient was named as one item even though it's three condiments. `applyMealAdd` in shopping-helpers.ts uses `cleanIngredientName(ing.name)` — the full string becomes the canonical name and three rows collapse into one.

Fix: split into three first-class ingredients with a 4:1:1 ratio (the standard burger-sauce ratio). Substitutions migrated onto the appropriate line — Kewpie/Aioli swaps move to mayo, Tomato relish swap to ketchup, Dijon swap to mustard.

### `f8a4750` — Equipment vertical wrap (Patrick's report)
Patrick asked for collapsible/dropdown OR a better alternative on the Equipment side-scroll. I chose vertical wrap pills, always visible.

Why vertical wrap beats both side-scroll and dropdown:
- Zero taps to read. A dropdown adds friction for content the user wants at a glance. Side-scroll requires gesture discovery and hides items.
- Equipment lists are short (3–7 items for nearly every recipe). Vertical wrap adds 2–3 short rows = 80–180px. Cheap.
- Consistent with the Prep section's vertical stack — same mental model on the recipe screen.
- No outer/inner scroll conflict on Android (PanGestureHandler swallows vertical scroll when a horizontal ScrollView is mid-gesture inside a vertical parent).

Implementation: replaced `<ScrollView horizontal>` with a flex-wrap row View. Same per-item pill styling (gold 8% bg, 22% border).

### `d7c7c5a` — CHICKEN_SHAWARMA new recipe
Resolves the Senior Engineer handoff dated 2026-05-08 (CHICKEN_SHAWARMA new recipe required for v1.0 launch slot). Patrick decided 2026-05-08 that the v1.0 launch slot is chicken shawarma, not lamb.

Source content: `docs/coo/culinary-research/chicken-shawarma.md` (committed by COO in `6dbbe8e`). Cook authored the full DECISION-009 template; this commit ports it into seed-recipes.ts as a new const.

Recipe shape:
- id: `chicken-shawarma`
- title: 'Home Oven Chicken Shawarma'
- 4 base servings, 150 min total (incl. marinade), 30 min active, beginner
- categories: levantine + chicken
- source: 'Hone Kitchen' — a traditional Levantine method
- 21 ingredients (1 protein, 13 marinade spices/aromatics, 7 to-serve)
- 5 cook steps with stage_note / lookahead / why_note / recovery throughout
- Full DECISION-008 fields: equipment[], before_you_start[3], mise_en_place[7], finishing_note, leftovers_note, total/active timings

Cultural and substitution honesty per cook's audit:
- Tagged `levantine` only (Palestinian / Lebanese tradition). No Israeli label.
- Chicken breast swap flagged 'compromise' — dries out at 220°C before surface colours.
- Toum substitutes tiered: aioli ('good'), yoghurt+garlic+lemon ('compromise').
- Allspice flagged as the distinctly Levantine note — no substitute offered (intentional; using something else makes it generic spiced chicken).

Append position: directly after LAMB_SHAWARMA in the file. Added to the SEED_RECIPES export array immediately after LAMB_SHAWARMA so the two shawarmas stay grouped.

### `4c4daf9` — DECISION-013 launch scope
Five sub-changes in one commit:

1. **types.ts** — added optional `not_yet_shipping?: boolean` to Recipe schema. Optional (not `.default(false)`) so launch-set recipes don't need explicit declarations. Documented as DECISION-013 launch-scope flag.

2. **db/database.ts** — new `getActiveRecipes(db)` helper that wraps `getAllRecipes` and filters `!r.not_yet_shipping`. Documented: `getRecipeById` and `getAllRecipes` stay unfiltered so deep links and meal-plan lookups still resolve recipes that aren't in the v1.0 set.

3. **seed-recipes.ts** — flagged 30 non-launch recipes with `not_yet_shipping: true`. Launch-16 left unflagged (the absent-equals-false pattern).

4. **seed-recipes.ts** — FLOUR_TORTILLAS source updated. `chef: 'Patrick Nasr'`, `notes: "Patrick's own recipe — soft, buttery, adapted over time from multiple sources."`, `video_url` removed. Per DECISION-013, Patrick is the chef-of-record. The cook will re-author the research file content (separate handoff to Culinary Verifier remains open).

5. **app/(tabs)/index.tsx** + **app/(tabs)/pantry.tsx** — Kitchen browse and pantry-match now use `getActiveRecipes`. Shop tab kept on `getAllRecipes` (lookup map for meal-plan source breakdowns; recipes already in plans must resolve even if `not_yet_shipping`).

Final ships count: 16 recipes (verified via grep). Final not_yet_shipping count: 30. Total: 46.

The 16-recipe launch list (no flag set, the absent-equals-false pattern):
- ROAST_CHICKEN, WEEKDAY_BOLOGNESE, PASTA_CARBONARA, BUTTER_CHICKEN, SMASH_BURGER, THAI_GREEN_CURRY
- CHICKEN_SCHNITZEL, BEEF_LASAGNE, ROAST_LAMB, FISH_AND_CHIPS, BARRAMUNDI, PAVLOVA
- CHICKEN_SHAWARMA, HUMMUS, PAD_THAI, FLOUR_TORTILLAS

## Validation

`npx tsc --noEmit -p .` clean across all 5 commits (excluding pre-existing errors in `recipes-holding/` — that's a separate retired-recipes folder unrelated to this session's scope).

Brace/paren/bracket balance verified after each commit:
- seed-recipes.ts: 1582/1582, 614/614, 752/752
- types.ts: 14/14, 173/173
- db/database.ts: 77/77, 191/191
- index.tsx: 155/155, 126/126
- pantry.tsx: 594/594, 534/534

`tail -c` byte verification on every modified large file confirmed intact end markers (export array `];`, function closing `}`, JSX `</View>`, etc.).

## File-write integrity events

Five truncation/file-corruption events caught and recovered mid-session, all REGN-002/REGN-003 class:
1. `seed-recipes.ts` truncated at line 5512 mid-comment after the SMASH_BURGER edit. Restored the export array via heredoc append.
2. `types.ts` got null bytes appended after the not_yet_shipping field edit. Stripped via `data.rstrip(b'\\x00')`.
3. `recipe/[id].tsx` truncated at line 1617 mid-fontFamily after the Equipment edit. Restored from HEAD via Python.
4. `database.ts`, `index.tsx`, `pantry.tsx` all simultaneously truncated after a Python rewrite. All recovered from HEAD.
5. `types.ts` truncated again at line 400 mid-`parseRecipe` after the `.optional()` switch. Recovered.

Each event was caught by `npx tsc --noEmit` flagging unbalanced braces/JSX, then verified with `tail -c 30` showing the byte stream ending mid-attribute. Recovery used `git show HEAD:<path>` (read from origin's tree) and re-applied my targeted edit via Python rather than the Edit tool.

This pattern is now well-rehearsed enough that it should go into the regression checklist as REGN-006 (file-write truncation, Edit tool variant of REGN-003). Tracked follow-up.

## What Patrick needs to do next

Build #95 is queued: https://github.com/patrickpatches/hone/actions/runs/25532238312. ~15-25 min to APK.

When the APK lands, walk the 10-point on-device checklist in the new `Patrick · 2026-05-08 · ON-DEVICE VALIDATION` handoff at the top of `docs/coo/handoffs.md`.

If anything fails, raise a GitHub Issue — I won't be closing them per CLAUDE.md.

## Tracked follow-ups

- **Step-flow audit fixes** (10 HIGH, 9 MEDIUM, separate Senior-Engineer handoff dated 2026-05-06) — still open, not touched in this session per Patrick's "keep them separate" direction.
- **`flour-tortillas.md` re-author** (Culinary Verifier handoff dated 2026-05-08) — still open. The chef attribution is now `Patrick Nasr` in the seed data; the research file content needs to be re-aligned to Patrick's actual recipe once he provides his ingredient ratios and technique notes.
- **`sheet-pan-harissa-chicken` cuisine tag** — culinary-audit flagged it as more accurately `north_african` than `levantine`. Content/cuisine-tag fix, separate from launch scoping.
- **REGN-006 entry for the regression checklist** — file-write truncation via Edit tool. Recovery pattern documented in this report's "File-write integrity events" section. Should formalise.

## Repo state

- Local main: `4c4daf9`
- Origin main: `4c4daf9` (synced)
- Build #95: queued on `4c4daf9`
- Build #94: completed success on `7deb2f1` (the previous APK Patrick has been validating)
