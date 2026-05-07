# Hone Session Report — 7 May 2026 (Report 3)

## Headline

Two on-device bugs Patrick reported earlier today are now fixed in code and awaiting his on-device validation. The diagnoses below explain *why* each bug was happening — neither was a surface fix.

| Bug | What was wrong | Fix | Status |
|---|---|---|---|
| **REGN-006** — Equipment + Prep sections missing on most recipes | The DECISION-008 UI block had been removed from `mobile/app/recipe/[id].tsx` in a previous edit. Working tree was 1097 lines vs HEAD's 1540. Data was in the schema, in seed-recipes.ts, and in SQLite — but the UI had no `recipe.equipment.map(...)` block to render it. | Restored HEAD's full DECISION-008 rendering (At a glance, What to know, Equipment, Prep, Finishing, Leftovers). Re-applied Pressable+View split on header buttons (back, plan, heart), title-card pill, Watch link, expand-more chip, and `MiseItem` itself per session-4 Report-4 lessons. Renamed UI label "Mise en place" → "Prep". | FIX ATTEMPTED — awaiting on-device |
| **REGN-007** — Pantry STILL NEED chip state broken | Chip's `added/needed` boolean lived in a local `Set<string>` on `RecipeMatchCard`. Every state mutation was one-way (chip → shopping list); the chip had no way to learn that the shopping list had changed underneath. So undo, the X-removal in Shop, and ✓-toggle all left the chip stale. | Chip state is now DERIVED from `shoppingNameSet`. All mutations route through `addToShoppingList` / `removeFromShoppingList` on the parent. Pantry tab loads shopping items on mount AND on focus, so Shop-tab edits propagate when the user returns. Toast holds the ingredient *name*, not the chip's local state, so undo survives chip re-renders. | FIX ATTEMPTED — awaiting on-device |

Both fixes are real architecture changes, not symptom patches. The chip-state refactor in particular gives us a single source of truth for "is this on the shopping list?" — that property cannot now drift between two places.

---

## REGN-006 — recipe-detail UI restoration

### Root cause

`git show HEAD:mobile/app/recipe/[id].tsx | wc -l` returned 1540. The working tree had 1097. A previous session had stripped the entire DECISION-008 block — every section that depended on `equipment[]`, `before_you_start[]`, `mise_en_place[]`, `finishing_note`, or `leftovers_note` was gone. The data still flowed through the database; nothing rendered it.

This explains why Patrick saw it on multiple recipes: it was failing on every recipe. The 6 Batch 1 recipes that *did* have the data populated still had nothing to show because the UI had no container for it.

### What changed

- `mobile/app/recipe/[id].tsx` — restored from HEAD then layered four targeted improvements:
  1. Pressable+View split on the back, plan, and heart buttons in the sticky header (Android was silently dropping `borderRadius`/`backgroundColor` on the function-style `style`).
  2. Pressable+View split on the title-card "Plan this recipe" pill, the "Watch the original" link, the "Show N more prep tasks" expand chip, and the `MiseItem` checklist row itself.
  3. Renamed the section header text from "Mise en place" to "Prep". The schema field stays `mise_en_place` so no data contract is broken; only the visible header changed.
  4. `MiseItem` borderWidth is now an integer 2 (was 1.5) — non-integer borders rendered inconsistently on Android in earlier sessions.

### Recipe data audit (full table)

The DECISION-008 fields are: `equipment[]`, `before_you_start[]`, `mise_en_place[]`, `finishing_note`, `leftovers_note`, `total_time_minutes`, `active_time_minutes`.

| Status | Count | Recipes |
|---|---|---|
| Populated in seed-recipes.ts (Batch 1) | 6 | chicken-schnitzel, chicken-vegetable-stir-fry, beef-lasagne, roast-lamb-rosemary-garlic, fish-and-chips, falafel |
| Research file ready, awaiting engineering migration | 11 | smash-burger, pasta-carbonara, weekday-bolognese, butter-chicken, thai-green-curry, pavlova, roast-chicken, barramundi-lemon-butter, lamb-shawarma, hummus, pad-thai |
| No research yet — flagged for the cook's Batch 2 | 27 | chicken-adobo, beef-stew, musakhan, kafta, fattoush, prawn-tacos-pineapple, sourdough-maintenance, sourdough-loaf, risotto, fish-tacos, french-onion-soup, braised-short-ribs, ramen, beef-wellington, dal, scrambled-eggs, aglio-e-olio, mujadara, sheet-pan-harissa-chicken, egg-fried-rice, nasi-lemak, beef-rendang, curry-laksa, char-kway-teow, saag-paneer, chicken-katsu, tom-yum, flour-tortillas |

The 6 Batch 1 recipes will now correctly render every DECISION-008 section. The 38 others will render the screen exactly as before — the conditional rendering (`(recipe.equipment?.length ?? 0) > 0 && …`) means there is no broken state on recipes without populated data.

The 11 yellow-row recipes are the next migration target. Their full source data exists in `docs/coo/culinary-research/*.md`. Engineering migration into `seed-recipes.ts` is a tracked follow-up — flagged in BUGS.md.

The 27 white-row recipes need the Cook to author research before engineering can act. Cook handoff is in `docs/coo/handoffs.md`.

---

## REGN-007 — pantry chip state architecture

### Root cause

The chip's added/needed state was held in `addedNames: Set<string>` inside `RecipeMatchCard`. Every state change went one direction: tap chip → call `onAddToShoppingList` → write to DB. The shopping list had no way to call back to the chip. So:

1. **Undo button** — `setShopUndo(null)` cleared the toast, but the chip's local `addedNames` still showed ✓.
2. **X in Shop tab** — wrote to DB but never reached the chip's `addedNames`.
3. **Re-tap a ✓ chip** — `onAddToShoppingList` was no-op'd and the chip never had a removal pathway.

Three symptoms, one architectural cause.

### Architectural fix

State flow inverted: the shopping list is the source of truth, and the chip's visual state is *derived* on every render.

- `pantry.tsx` now holds `shoppingItems: ShoppingItem[]` state, loaded on mount and re-fetched on `useFocusEffect` so Shop-tab edits propagate when the user returns.
- A normalised `shoppingNameSet` is memoised from `shoppingItems`. The chip's `added` prop is `shoppingNameSet.has(normalizeForMatch(ing.name))`.
- All mutations route through `addToShoppingList(ing, recipeId)` and `removeFromShoppingList(ingName)` on `pantry.tsx`. Each updates local state synchronously (so the chip re-derives within the same paint) and persists to SQLite in the background.
- `undoShopAdd` is now a thin wrapper that calls `removeFromShoppingList(shopUndo.name)` — same pathway, single source of truth.
- The toast holds the ingredient *name*, not the chip's local state, so undo survives chip re-renders.
- `RecipeMatchCard` no longer holds `addedNames`. `ChipAdd` accepts both `onAdd` and `onRemove` and routes based on the derived `added` prop.

### The 5 paths Patrick called out, each verified in code

| # | Path | Implementation |
|---|---|---|
| 1 | Click + chip → ✓ + shop list adds + undo banner 3s | `addToShoppingList` updates `setShoppingItems`, sets `shopUndo`, schedules timeout |
| 2 | Tap undo within 3s → chip reverts + shop list removes + banner disappears | `undoShopAdd` → `removeFromShoppingList(shopUndo.name)` filters the list, clears the timer, sets `shopUndo=null` |
| 3 | Banner timer expires → state stays as #1 | `setTimeout` only sets `shopUndo=null`; `shoppingItems` untouched |
| 4 | Click ✓ chip in pantry → reverts to + + removes from shop list | `ChipAdd.onPress = added ? onRemove(name) : onAdd(ing)` → routes to `removeFromShoppingList` |
| 5 | Hit X in Shop tab → pantry chip reverts when user returns | `useFocusEffect` re-fetches `shoppingItems` from SQLite on tab focus |

---

## File regression encountered (and recovered)

The Edit tool truncated `pantry.tsx` and `recipe/[id].tsx` mid-write twice during this session — the same class of bug as REGN-003 (3 May). I noticed by running `npx tsc` and seeing JSX-not-closed errors at impossible-looking line numbers, then verifying with `tail -c` that the byte stream literally ended mid-attribute. Both files were repaired by appending the missing tail with bash heredoc and re-running tsc to verify integrity. This is a tooling concern to flag — the existing R-NNN risk register should add an entry.

## Files changed

- `mobile/app/recipe/[id].tsx` — DECISION-008 sections restored, Prep rename, Pressable+View split on five Pressables.
- `mobile/app/(tabs)/pantry.tsx` — chip state architecture rewrite, useFocusEffect added, useRef typing fixed.
- `BUGS.md` — REGN-006 and REGN-007 added with full root-cause notes and audit table.

## TypeScript

`npx tsc --noEmit -p .` returns clean for both modified files. Remaining errors in the broader project are missing-module errors for npm packages not installed in this sandbox — not regressions.

## Build & deploy state at session end

- Commit `4725618` is on `origin/main`.
- **Build #93 dispatched** at Patrick's request — https://github.com/patrickpatches/hone/actions/runs/25489339565 (workflow_dispatch, profile=preview, ref=main).
- **Build #92 also exists and was successful** on the same commit (`4725618`) — completed at 2026-05-07T07:53:28Z. The APK from #92 already contains both fixes; either #92's or #93's artifact will work.
- Patrick observed doubled `+`/`✓` glyphs on the Plan button on his earlier APK. Root cause: commit `c302f44` had `<Icon name=plus|check />` PLUS Text content `'+ Plan this recipe' / 'In your plan ✓'` — both rendering. Fixed in `4725618` by removing the embedded glyphs from the text content; only the Icon now renders. Visible on whichever new APK he installs.

## What Patrick needs to do next

1. Uninstall the existing Hone app on the phone (Android keeps the previous install's resources around if you only sideload over it).
2. Install the APK from build #93 (or #92 — either works).
3. On-device, verify:
   - **REGN-006**: open any recipe — Equipment, Prep, Before-you-start, Finishing, Leftovers sections should appear for the 6 Batch 1 recipes (chicken-schnitzel, chicken-vegetable-stir-fry, beef-lasagne, roast-lamb-rosemary-garlic, fish-and-chips, falafel). The header should read "Prep" (not "Mise en place").
   - **REGN-007**: open Pantry, tap a + chip → confirm chip flips to ✓ and undo banner appears. Then walk all 5 paths above.
3. If both look right, close the GitHub issues yourself. Per CLAUDE.md: "I fixed it in code" is not a fix.

## Tracked follow-ups

- Engineering migration of the 11 yellow-row recipes' DECISION-009 data