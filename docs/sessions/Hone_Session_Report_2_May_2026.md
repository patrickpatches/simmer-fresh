# Hone — Senior Engineer Session Report
**Date:** 2 May 2026
**Role:** Senior Product Engineer
**Priority:** Pantry v0.5.0 redesign (Patrick confirmed brief and said "Go ahead!")

---

## Summary

Completed the full Pantry screen redesign as specified in `docs/prototypes/pantry-redesign-v2.html`. All five spec items delivered and committed to main. Build #90 is running.

**Patrick's actions:** Install the new APK once build #90 completes (GitHub Actions → Hone Android Build). Run the smoke-test checklist below.

---

## What was done

### 1 — `pantry-helpers.ts` — `missingIngredients[]` added to `RecipeMatchResult`

**Why:** The Variant A chips need to display ingredient quantity and unit (e.g. "2 tbsp olive oil"), not just a name string. `RecipeMatchResult.missingNames` was `string[]` only. The new `missingIngredients: Array<{name, amount, unit}>` field carries the raw data from the `Ingredient` object so chips can show context.

**Also:** Missing ingredients are now sorted before slicing to 4 — ingredients that have substitutions available come first. Reason: if you're missing something but there's a swap option, that's the most actionable chip to show first.

**Files:**
- `mobile/src/data/pantry-helpers.ts` — interface + `scoreRecipeAgainstPantry` updated

---

### 2 — `IngredientSearchOverlay.tsx` — new full-screen search modal

**Why:** The inline dropdown fought with the keyboard, collapsed to a tiny scroll zone on short screens, and its positioning logic required a `zIndex: 30` battle with the pill cloud. A full-screen Modal slide-up gives the user the entire device surface to browse the ingredient catalog.

**Behaviour:**
- Tapping the search bar on the main Pantry screen opens this overlay (instead of activating an inline TextInput)
- Input autofocuses after the slide animation — keyboard is up immediately, no extra tap
- Have-it pills row shown in the overlay header so the user can see what they've already added while browsing
- SectionList grouped by `PantryCategory`, sticky section headers
- Query highlighting: matched substring is bold + ink colour, rest is inkSoft
- Already-in-pantry entries dimmed (opacity 0.45) with "In pantry" tag — visible but not tappable
- Tapping a catalog row calls `onAdd(name, category)` in the parent. Overlay stays open so multiple items can be added in one session
- "Add new" fallback for custom ingredient names not in the catalog
- Back button (‹ gold) + Android back gesture both close the overlay

**File:** `mobile/src/components/IngredientSearchOverlay.tsx` (new, ~320 lines)

---

### 3 — `pantry.tsx` — v0.5.0 full rewrite

#### Search bar → tappable Pressable
The inline `TextInput` + `showDropdown` state is gone. The search bar is now a `Pressable` that sets `overlayVisible = true`. This removes ~120 lines of suggestion/dropdown logic from the main screen.

#### Have-it pills → horizontal ScrollView
The old flex-wrap pill cloud (inside a cream card) is replaced with a horizontal `ScrollView` strip directly below the search bar. Pills use sage-light background with sage-border. The card chrome (border, shadow, unified zone) is removed — pills read as a status strip, not a data-entry container.

The `Pill` component is updated with the border from the prototype spec (from `rgba(170,204,168,0.50)`). Fresh-add flash is preserved (brief gold tint before settling to sage).

#### Gold match summary banner
A compact bordered card with a gold left strip now lives above the carousel when `ranked.length > 0`. Shows:
- "X recipe(s) ready to cook" if full matches exist
- "Getting close" if only near-misses
- Subtitle: count breakdown

This replaces the old sage pill affordance as the primary "here's what you can cook" signal.

#### Variant A chips → add to shopping list
`MissingPill` (which added to pantry) is replaced by `ChipAdd` (gold-tinted, adds to shopping list).

**Why shopping list, not pantry?** If you're missing an ingredient, the right action is "put it on the list for next shop" — not "pretend you own it." The old behaviour of marking missing items as pantry items broke the recipe match scores (recipes looked fully matched but the user still couldn't cook them).

**Shopping list write:** calls `upsertShoppingItem(db, item)` with `sources: [{kind: 'pantry-suggestion', recipe_id}]` so the shopping tab knows where the item came from.

**3-second undo toast:** separate from the clear-all 5-second undo. Shows "X added to shopping list · Undo". Undo calls `deleteShoppingItem`.

**ChipAdd states:**
- Default: gold-light bg, dashed gold border, `+` prefix, gold text
- Added: solid gold bg, `✓` prefix, bgDeep text
- Both toasts can coexist — shop undo offsets upward if clear-all toast is also showing

#### % badge removed from `RecipeMatchCard`
The floating percentage badge (top-right of hero image) is gone. The "X of Y matched" counter below the title carries the same information with more context and no layout cost.

#### EmptyPantry updated
The empty state now has a gold CTA button ("Add ingredients") that directly opens the overlay.

---

## Files changed

| File | Change |
|---|---|
| `mobile/src/data/pantry-helpers.ts` | Added `missingIngredients[]` to `RecipeMatchResult`; sort missing by substitution availability |
| `mobile/src/components/IngredientSearchOverlay.tsx` | **New** — full-screen ingredient search modal |
| `mobile/app/(tabs)/pantry.tsx` | Full v0.5.0 rewrite — overlay search, pills row, match banner, Variant A chips, shopping list add |

**Commit:** `f7cb9e077c689df2df8eb84425927c324c95b6e0`
**Build:** #90 (triggered automatically by push to main)

---

## Smoke-test checklist for Patrick

### Search overlay
- [ ] Tapping the search bar on Pantry opens the full-screen overlay (slides up)
- [ ] Keyboard is up immediately — no extra tap needed
- [ ] Typing "chick" filters results to chicken-related entries
- [ ] Matched query characters are bold in the result name
- [ ] Tapping a result adds it to the pantry (pill appears in main screen row)
- [ ] Overlay stays open after adding — can add multiple items in one session
- [ ] Back button (‹) closes the overlay
- [ ] Android back gesture closes the overlay
- [ ] "Already in pantry" items are dimmed and not tappable
- [ ] Typing an ingredient not in the catalog shows "+ Add 'X'" button

### Have-it pills
- [ ] Pills appear as a horizontal scrollable row below the search bar (not a wrapped cloud)
- [ ] Scrolling left/right reveals all pills
- [ ] Newly added pill flashes gold briefly before settling to sage
- [ ] Tapping × on a pill removes it from the pantry

### Match banner
- [ ] When ingredients are added and recipes match, a gold-bordered banner appears above the carousel
- [ ] Banner shows correct ready/close count
- [ ] Banner is absent when pantry is empty

### Recipe match cards — Variant A chips
- [ ] Missing ingredient chips are gold-tinted (not outline-only)
- [ ] Tapping a chip does NOT add to the pantry pills
- [ ] Tapping a chip shows "X added to shopping list" undo toast (3 s)
- [ ] Undo tap removes the item from the shopping list
- [ ] Tapped chip flips to solid gold with ✓ checkmark
- [ ] % badge is absent from recipe card hero image corner

### Misc
- [ ] Empty pantry state shows a gold "Add ingredients" button that opens the overlay
- [ ] Clear all still shows 5-second undo toast
- [ ] Both toasts can appear simultaneously without overlapping

---

## Patrick's next actions

1. **Install APK** — GitHub Actions → Hone Android Build → run #90
2. **Run smoke-test checklist** above
3. **Unblock Culinary Verifier** — start a Culinary & Cultural Verifier session to deliver the 6 source recipe files. Chicken schnitzel first — Photography Director needs it before the 10–11 May shoot weekend
4. **Confirm launch date** — `docs/coo/handoffs.md` has an open handoff asking Patrick to confirm or amend the 24 July 2026 target
