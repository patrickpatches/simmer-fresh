# Hone Session Report — 14 May 2026 (Session 2)

**Session scope:** DECISION-015 Batch C completion (continued from Session 1) + whole_food_verified removal + cheddar-as-primary cheese change + multi-category audit of all 16 launch recipes + hero image accuracy review (6 accuracy-sensitive recipes)

---

## What was completed this session

### 1. DECISION-015 Batch C — final 4 launch recipes

Applied 3-colour substitution colour mapping (🟢/🟡/🔴) and `step_overrides` to:

- **Pavlova** — 3🟢/10🟡/1🔴 (aquafaba 🔴: marshmallow interior reduced + step_override on s2)
- **Hummus** — 0🟢/4🟡/2🔴 (tinned chickpeas 🔴 + bicarb boil step_override; white wine vinegar for lemon 🔴)
- **Pad Thai** — 0🟢/13🟡/2🔴 (tamarind substitutes 🔴; 5 step_overrides for noodle type and protein swaps)
- **Falafel** — 3🟢/7🟡/1🔴 (baking-powder-only 🔴 loses jade-green interior; fava bean step_override for skin peeling)

All 16 launch recipes now have DECISION-015 applied. DECISION-009 migration remains a separate engineer task.

### 2. Whole food verified — concept retired

Stripped 28 occurrences of `whole_food_verified: true` from `mobile/src/data/recipes-holding/index.ts`. The field was already retired in `types.ts` comments; this removes the last references in the codebase.

### 3. Smash burger — cheddar as primary cheese

In `mobile/src/data/seed-recipes.ts` (SMASH_BURGER, ingredient i3):
- **Before:** American cheese slices (primary)
- **After:** Cheddar, thinly sliced (primary) — Australian market rationale (American cheese barely stocked at Coles/Woolworths)
- American cheese moved to `great_swap` substitution with step_override noting no lid needed
- `smash-burger.md` research file updated with discrepancy table and photography note change

### 4. Multi-category audit — all 16 launch recipes

Assigned honest `categories.cuisines[]` and `categories.types[]` to all 16 launch recipes in `seed-recipes.ts`. Six recipes required corrections; all recipes now have dual-axis taxonomy populated.

Extended `CuisineId` enum in `mobile/src/data/types.ts` with 5 new values:
- `palestinian` (Hummus, Falafel — explicit cultural attribution)
- `filipino` (Chicken Adobo — recipes-holding)
- `chinese` (Egg Fried Rice — recipes-holding)
- `german` (Chicken Schnitzel — broader label for Australian users)
- `british` (Fish & Chips)

Added `## Category taxonomy — multi-axis audit` section to all 16 launch recipe research files with discrepancy tables and contested-decision rationale.

URGENT engineer handoff added to `docs/coo/handoffs.md`: verify `npx tsc --noEmit`, check cuisine filter tiles in index.tsx, confirm z.preprocess handles new enum values on existing device installs.

### 5. Hero image accuracy review — 6 accuracy-sensitive recipes

Navigated to all 6 Unsplash photo pages via Chrome browser and applied cook accuracy checklists.

| Recipe | Photo ID | Verdict | Reason |
|---|---|---|---|
| Smash Burger | `photo-1639020715088-e7afebe6cb25` | ❌ REJECTED | Red onion rings (recipe uses white onion, finely diced); cheese no longer matches primary (cheddar) |
| Spaghetti Carbonara | `photo-1612874742237-6526221588e3` | ✅ APPROVED | Golden egg-yolk sauce, spaghetti, pancetta/guanciale, no cream |
| Chicken Shawarma | `photo-kYi1eN--guM` | ⚠️ CONDITIONAL | Vertical Levantine spit format correct; chicken is uncooked/marinated — prefer finished charred product |
| Pavlova | `photo-5nCTfEru3Do` (Eugene Krasnaok) | ✅ APPROVED | White meringue, whipped cream, fresh strawberries + blueberries; individual-size noted but visual language unmistakable |
| Falafel | `photo-pQnsKWk5ljQ` (Anton) | ✅ APPROVED | Jade-green interior visible in halved falafel; golden crust; ball shape; no pita |
| Flour Tortillas | `photo-N__68TkGeOY` (Thomas Park) | ❌ REJECTED | Lone Star Beer can (branded product) is primary subject; tortillas are props |

`docs/coo/visual-assets-ledger.md` updated with all signoffs, photographer names confirmed, statistics and summary table updated.

---

## Files changed

| File | Change |
|---|---|
| `mobile/src/data/seed-recipes.ts` | SMASH_BURGER cheese → cheddar primary; all 16 recipe categories updated |
| `mobile/src/data/recipes-holding/index.ts` | 28 `whole_food_verified: true` lines removed |
| `mobile/src/data/types.ts` | CuisineId enum extended with 5 new values |
| `docs/coo/culinary-research/pavlova.md` | DECISION-015 section added |
| `docs/coo/culinary-research/hummus.md` | DECISION-015 section added |
| `docs/coo/culinary-research/pad-thai.md` | DECISION-015 section added |
| `docs/coo/culinary-research/falafel.md` | DECISION-015 section added |
| `docs/coo/culinary-research/smash-burger.md` | Discrepancy table updated; cheddar primary noted |
| `docs/coo/culinary-research/*.md` (all 16) | `## Category taxonomy — multi-axis audit` section added |
| `docs/coo/handoffs.md` | URGENT engineer handoff added for TypeScript/category verification |
| `docs/coo/visual-assets-ledger.md` | Cook accuracy signoffs for 6 accuracy-sensitive heroes; statistics updated |

---

## Open items for next session

### Replacement heroes needed (REJECTED)
1. **Smash burger** — need Unsplash candidate: smashed thin patties, brioche bun, cheddar melt, caramelised white onion, pickles. No lettuce, no tomato, no red onion, no visible American cheese.
2. **Flour tortillas** — need Unsplash candidate: taco-size flour tortillas (12–13 cm), char marks from comal/cast iron, stacked or as tacos presentation. No branded products, no alcohol.

### Shawarma hero (CONDITIONAL)
Seek a replacement showing finished charred chicken sliced off a vertical spit, or accept current if no better option found.

### Remaining hero reviews (10 non-sensitive recipes — all CANDIDATE)
Not accuracy-sensitive but should be validated before launch: weekday-bolognese, roast-chicken, butter-chicken, thai-green-curry, chicken-schnitzel, beef-lasagne, fish-and-chips, hummus, pad-thai (+ roast-lamb manual source still needed).

### Engineer actions (from handoffs.md)
- Run `npx tsc --noEmit` to verify 3 new CuisineId values compile
- Check cuisine filter tile components for `palestinian`, `german`, `british` entries
- Confirm `z.preprocess` handles new enum values on existing device DB (no crash on schema mismatch)

---

## What Patrick needs to do

Nothing blocking. All changes are code/doc only. Wait for engineer to run tsc verification before triggering a build.

---

*Written by COO — 2026-05-14*
