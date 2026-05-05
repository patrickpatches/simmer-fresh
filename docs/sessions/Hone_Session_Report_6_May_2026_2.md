# Hone Session Report — 6 May 2026 (Report 2)

**Date:** 6 May 2026  
**Engineer:** Claude  
**Build triggered:** EAS build queued (run ID 25404751608) — commit de86d257 + e253b0e7

---

## Summary

Continuation session. Completed three major tasks:
1. Programmed all 12 chef-notes recipes into `seed-recipes.ts` with full DECISION-009 fields
2. Applied culinary audit fixes from the COO handover notes
3. Retired 28 incomplete recipes to a holding folder — active seed library is now clean

---

## What was done

### UI fixes (from previous session in this chain — already pushed as commit `3a9da3ca3cf8`)

**Bug: Equipment pills horizontal scroll (too long for items)**  
Replaced `<ScrollView horizontal>` with `<View flexWrap="wrap">` in the equipment section of `recipe/[id].tsx`. Long items like "Cast iron skillet or heavy carbon steel pan (minimum 26cm)" now wrap naturally instead of requiring horizontal scrolling.

**Bug: Mise en place radio buttons cut off on left**  
Android clips child Views near the edges of a parent with `borderRadius + overflow: 'hidden'`. Increased `paddingHorizontal` on the MiseItem row from 16 → 20, pushing the 20×20 circle away from the clipping mask.

---

### Chef recipe data — DECISION-009 fields added (commit `bf0b2f85`)

Added all 7 required fields (`total_time_minutes`, `active_time_minutes`, `equipment`, `before_you_start`, `mise_en_place`, `finishing_note`, `leftovers_note`) to all 12 chef-notes recipes:

| Recipe | Notable |
|---|---|
| Smash Burger | `whole_food_verified` → `false` (American cheese is processed) |
| Pasta Carbonara | Whole egg `scales` → `linear` (was incorrectly `fixed`) |
| Roast Chicken | `time_min` confirmed includes overnight brine warning |
| Hummus | Full overnight soak and 2h cook reflected in times |
| Thai Green Curry | `'Thai aubergine'` → `'Thai eggplant'` (Australian English fix) |
| Pad Thai | Prawns substitution corrected — tofu is a co-ingredient, not a swap |
| Weekday Bolognese | Full 75 min total including reduction time |
| Lamb Shawarma | `'a London kitchen'` → `'a home kitchen'`, `'beef'` → `'lamb'` tag |
| Butter Chicken | `time_min` 90 → 330 (4h+ marinade now correctly reflected) |
| Barramundi | 50 min total (includes 30 min acid marinade) |
| Pavlova | 210 min total; conventional oven warning prominent in before_you_start |
| Falafel | Already had DECISION-009 fields — no changes needed |

**Culinary audit fixes also applied:**
- `smash-burger`: `whole_food_verified: true` → `false` — American cheese slices are processed food. Patrick's rule: flag is only valid when every ingredient is unprocessed.
- `pasta-carbonara`: whole egg `scales: 'fixed'` → `scales: 'linear'` — one egg per two servings is correct scaling
- `pad-thai` prawns substitutions: removed incorrect "Firm tofu only (no meat)" entry. Tofu is a co-ingredient in authentic pad thai, not a substitute for prawns. Replaced with:
  - Extra firm tofu, increase to 200g (vegetarian version)
  - Chicken thigh, thinly sliced (great_swap)
  - Squid, scored and sliced (great_swap, traditional)
- `lamb-shawarma`: categories `['lamb', 'beef']` fix was already applied by earlier script; verified correct at `types: ['lamb']`

---

### Recipe retirement (commits `de86d257` + `e253b0e7`)

**Problem:** The active `SEED_RECIPES` array contained 45 recipes. 28 of them had no DECISION-009 fields — they would render on the recipe screen with empty equipment, no mise en place, no before_you_start, etc. This creates a broken user experience.

**Decision:** Retire all 28 incomplete recipes to `mobile/src/data/recipes-holding/index.ts`. They remain in the codebase for future work but are excluded from `SEED_RECIPES`.

**Active recipes (17) — all have full DECISION-009 data:**
smash-burger, pasta-carbonara, roast-chicken, hummus, thai-green-curry, pad-thai, weekday-bolognese, lamb-shawarma, butter-chicken, barramundi, pavlova, chicken-schnitzel, chicken-vegetable-stir-fry, beef-lasagne, roast-lamb, fish-and-chips, falafel

**Held recipes (28) — pending content expansion:**
chicken-adobo, beef-stew, musakhan, kafta, fattoush, prawn-tacos-pineapple, sourdough-maintenance, sourdough-loaf, risotto, fish-tacos, french-onion-soup, braised-short-ribs, ramen, beef-wellington, dal, scrambled-eggs, aglio-e-olio, mujadara, sheet-pan-harissa-chicken, egg-fried-rice, nasi-lemak, beef-rendang, curry-laksa, char-kway-teow, saag-paneer, chicken-katsu, tom-yum, flour-tortillas

**Holding file:** `mobile/src/data/recipes-holding/index.ts`  
- Contains all 28 const definitions
- Has clear header explaining the graduation process
- Exports `HOLDING_RECIPES: Recipe[]` for reference (unused in app)
- Graduation steps: populate all 7 fields → delete from holding → add to seed-recipes.ts → add to SEED_RECIPES array

---

## Files changed

| File | Change | Commit |
|---|---|---|
| `mobile/app/recipe/[id].tsx` | Equipment flex-wrap, MiseItem paddingHorizontal 16→20 | `3a9da3ca3cf8` |
| `mobile/src/data/seed-recipes.ts` | D009 fields added to 12 recipes + audit fixes | `bf0b2f85` |
| `mobile/src/data/seed-recipes.ts` | Retired 28 recipes — active array now 17 | `de86d257` |
| `mobile/src/data/recipes-holding/index.ts` | **NEW** — 28 incomplete recipes held here | `e253b0e7` |

---

## What Patrick needs to do

1. **Install the new APK** when the EAS build completes (run ID 25404751608)
2. **Test on device:**
   - Recipe screen: equipment should now wrap to multiple lines (not horizontal scroll)
   - Recipe screen: mise en place circles should not be cut off on the left
   - Recipe library: should now show 17 recipes (not 45)
   - Spot-check a few recipes for the expanded content (Equipment, What to Know, Mise en Place sections)
3. **Verify attribution URLs** — two recipes still need URL verification before ship:
   - Andy Cooks smash burger: `https://www.youtube.com/watch?v=oa2g6gB_1BU`
   - Andy Cooks pad thai: `https://www.youtube.com/watch?v=6Lb1PyJxVQM`
   - Andy Cooks weekday bolognese: URL is to Andy's channel, not specific video — needs the specific video URL
   - Hummus: attributed to Reem Kassis / *The Palestinian Table* (Phaidon, 2017) — book citation, no URL needed

---

## Outstanding for next session

- **Attribution URLs:** weekday-bolognese needs the specific Andy Cooks video URL; Confirm YouTube URLs for smash burger and pad thai are live
- **28 holding recipes:** Each needs the full 7 DECISION-009 fields populated before it can graduate to the active library
- **`whole_food_verified` audit across active recipes:** The smash-burger and carbonara flags were the confirmed issues. A complete audit of the other 15 active recipes' `whole_food_verified` flags is recommended.
- **Photography placeholder:** All active recipes display "Photos coming soon" banners. Stage-by-stage photos remain out of scope until content is locked.
