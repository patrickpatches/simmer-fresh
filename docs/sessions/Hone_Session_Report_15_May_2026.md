# Hone Session Report — 15 May 2026

**Session scope:** Photography director handover — full cook accuracy review of all 13 CANDIDATE hero images; sourcing of 8 replacement candidates from Unsplash; `visual-assets-ledger.md` updated throughout.

---

## What was completed this session

### 1. Full cook accuracy review — all 13 CANDIDATE hero images

Reviewed every CANDIDATE hero image against its recipe-specific accuracy checklist. Results:

| Recipe | Photo ID | Verdict | Reason |
|---|---|---|---|
| weekday-bolognese | `photo-1622973536968` | ✅ APPROVED | Spaghetti, dark meat ragù, parmesan — accurate |
| butter-chicken | `photo-1603894584373` | ✅ APPROVED | Orange-amber sauce, chicken pieces, cream drizzle, coriander |
| thai-green-curry | `photo-1668665772043` | ❌ REJECTED | Sauce is beige/brown, no Thai eggplant, sliced breast not pieces |
| chicken-schnitzel | `photo-1599921841143` | ✅ APPROVED | Large golden cutlet, pounded thin, lemon wedge |
| beef-lasagne | `photo-1633436374784` | ❌ REJECTED | Cross-section shows spinach/ricotta — vegetarian, wrong dish |
| roast-lamb | `photo-1625604087024` | ✅ APPROVED | Bone-in shoulder, mahogany char, rosemary visible |
| fish-and-chips | `photo-kmQw0_2A9xQ` | ❌ DEAD URL | 404 — image removed from Unsplash |
| chicken-shawarma (replacement 1) | `photo-1561620141` | ❌ REJECTED | Tacos al pastor — corn tortillas, pineapple, tequila shots visible |
| hummus | `photo-14X4iiiF3t4` | ❌ DEAD URL | 404 — image removed from Unsplash |
| pad-thai | `photo-_wBJ0cvKhIE` | ❌ DEAD URL | 404 — image removed from Unsplash |
| roast-chicken | `photo-1598103442097` | ❌ DEAD URL | 404 — image removed from Unsplash |
| flour-tortillas (replacement) | `photo-1693193433392` | ✅ APPROVED | Warm tortillas in cloth wrap, taco-size, no branding |
| smash-burger (replacement 1) | `photo-1678110707493` | ❌ REJECTED | Tomato slice, ring-cut white onion, American cheese |

**Results carried from prior session (14 May):** carbonara ✅, falafel ✅, pavlova ✅, smash-burger original ❌, flour-tortillas original ❌, shawarma original ⚠️ → REPLACED.

**Running totals after full review pass:**
- APPROVED: 8 heroes (carbonara, falafel, pavlova, bolognese, butter-chicken, chicken-schnitzel, roast-lamb, flour-tortillas replacement)
- REJECTED: 11 (smash-burger ×2, flour-tortillas original, thai-green-curry, beef-lasagne, roast-chicken dead URL, fish-and-chips dead URL, shawarma ×2, hummus dead URL, pad-thai dead URL)
- REPLACED: 1 (shawarma `photo-kYi1eN--guM`)

### 2. Dead URL investigation — Unsplash CDN ID recovery

Three of four dead-URL photos still exist on Unsplash.com but their CDN numeric IDs differ from their short slug. Recovery process: navigate to `unsplash.com/photos/[slug]`, extract the `img[src*="images.unsplash.com"]` CDN path via JavaScript.

| Old slug ID | Status | Resolution |
|---|---|---|
| `_wBJ0cvKhIE` (pad-thai) | Exists on Unsplash | New CDN ID: `photo-1637806930600-37fa8892069d` |
| `14X4iiiF3t4` (hummus) | Exists on Unsplash | Sourced replacement via search |
| `kmQw0_2A9xQ` (fish-and-chips) | Exists on Unsplash | Sourced replacement via search (`photo-1611599538235`) |
| `1598103442097` (roast-chicken) | Confirmed removed | New candidate sourced via search |

### 3. Sourced 8 replacement hero candidates from Unsplash

For all 8 recipes missing an approved hero, sourced candidates via Unsplash search + CDN ID extraction using JavaScript in Chrome MCP. All candidates visually verified before being logged.

| Recipe | New Candidate CDN ID | Accuracy notes |
|---|---|---|
| smash-burger (3rd) | `photo-1607013251379-e6eecfffe234` (Eiliv Aceron) | Smashed thin patties, brioche bun, cheddar melt, caramelised onion — strong |
| roast-chicken | `photo-1606728035253-49e8a23146de` | Whole bird, deep golden-brown herb crust, untrussed — strong |
| thai-green-curry | `photo-1716959669858-11d415bdead6` | Yellow-green sauce — conditional; cook to confirm coconut milk ratio |
| beef-lasagne | `photo-1709429790175-b02bb1b19207` | Cross-section shows meat ragù layers — excellent |
| fish-and-chips | `photo-1611599538235-128e54f1250f` | Correct battered fish; chips thin-cut not thick pub chips — conditional |
| chicken-shawarma | `photo-1583060095186-852adde6b819` | Vertical spit, charred chicken, Levantine presentation — excellent |
| hummus | `photo-1637949385162-e416fb15b2ce` | Tahini swirl, olive oil, chickpeas — excellent |
| pad-thai | `photo-1637806930600-37fa8892069d` | Original photo recovered via CDN ID extraction — excellent |

### 4. `visual-assets-ledger.md` — updated throughout

All candidate and verdict entries written into the ledger in real time. Final state:
- Every recipe section has accurate status rows
- 8 new CANDIDATE rows added (one per recipe needing replacement)
- Hero sourcing summary table rebuilt to reflect all current photo IDs and statuses
- Statistics updated: 8 APPROVED, 10 CANDIDATE, 11 REJECTED, ~90 PENDING, 2 INTEGRATED

---

## Files changed this session

| File | Change |
|---|---|
| `docs/coo/visual-assets-ledger.md` | Cook accuracy verdicts for 13 CANDIDATE images; 8 replacement CANDIDATE rows added; hero sourcing summary table rebuilt; statistics updated |
| `docs/sessions/Hone_Session_Report_15_May_2026.md` | This file |

---

## Open items for next session

### Cook accuracy review — 8 new CANDIDATE heroes

These images were sourced today and are pending cook accuracy review. Two are flagged conditional:

| Recipe | Photo ID | Flag |
|---|---|---|
| smash-burger (3rd) | `photo-1607013251379` | — |
| roast-chicken | `photo-1606728035253` | — |
| thai-green-curry | `photo-1716959669858` | ⚠️ Sauce yellow-green, not vibrant green |
| beef-lasagne | `photo-1709429790175` | — |
| fish-and-chips | `photo-1611599538235` | ⚠️ Thin-cut fries, not thick pub chips |
| chicken-shawarma | `photo-1583060095186` | — |
| hummus | `photo-1637949385162` | — |
| pad-thai | `photo-1637806930600` | — |

### Roast Chicken attribution discrepancy
Chef source in culinary research file says "Hone Kitchen"; `seed-recipes.ts` says "Thomas Keller". COO to resolve which is correct before launch.

### Engineer actions (carried from prior sessions)
- Run `npx tsc --noEmit` with full dependency install to verify 3 new CuisineId values
- Check cuisine filter tile components for `palestinian`, `german`, `british`
- Confirm `z.preprocess` handles new enum values on existing device DB (no crash)
- Migrate `recipes-holding/index.ts` quality strings to green/yellow/red (DECISION-009)

---

## What Patrick needs to do

Nothing blocking. All changes are doc-only this session. Wait for engineer tsc verification before triggering a build.

Once the 8 new CANDIDATE heroes are cook-reviewed, the engineer can integrate approved ones into `seed-recipes.ts` photo_url fields.

---

*Written by COO — 2026-05-15*
