# Hone Session Report — 6 May 2026
**Role:** Culinary & Cultural Verifier  
**Session focus:** DECISION-009 Batch 2 — 11 launch-priority existing seed library recipes expanded + chef audit

---

## What was done

### 1. Git push resolved (DECISION-009 Batch 2)

The Batch 2 commit from the previous session (`8a86c3d`) had been rejected — the remote had moved ahead by 3 engineer commits while the virtiofs mount blocked all standard recovery paths (stash, reset --hard, rebase all fail on Windows virtiofs from the Linux side).

Resolution: cloned a clean copy of origin/main to `/tmp/hone-clean`, applied the Batch 2 patch via `git am`, and pushed from there. Clean push: `ef127b3..b350945`. All 11 files are now on origin/main.

---

### 2. DECISION-009 Batch 2 — 11 launch-priority recipe expansions

All 11 files written to `docs/coo/culinary-research/` with the full 10-section DECISION-009 template, plus a chef audit section per file flagging any data or cultural issues.

| File | Audit result | Key flags |
|---|---|---|
| `carbonara.md` | CONDITIONAL SHIP | Whole egg `scales: 'fixed'` → must be `'linear'`; attribution URL verify |
| `bolognese.md` | FIX BEFORE SHIP | Channel URL (not recipe URL) — Golden Rule 1 violation; garlic timing why_note added |
| `butter-chicken.md` | FIX BEFORE SHIP | `time_min: 90` hides 4h 30m+ commitment (overnight marinade invisible at discovery) |
| `green-curry.md` | FIX BEFORE SHIP | `'Thai aubergine'` → `'Thai eggplant'` (Australian English violation); attribution verify |
| `smash-burger.md` | FIX BEFORE SHIP | `whole_food_verified: true` but American cheese is processed — Patrick to decide |
| `roast-chicken.md` | FIX BEFORE SHIP | `time_min` hides overnight dry brine commitment |
| `pavlova.md` | CONDITIONAL SHIP | Fan oven warning moved to before-you-start; attribution verify |
| `barramundi.md` | SHIP AS-IS | Minor: salt/white pepper combined into one ingredient field |
| `shawarma.md` | FIX BEFORE SHIP | Overnight marinade invisible; "London kitchen" → "home kitchen"; tags `'beef'` → `'lamb'` |
| `hummus.md` | FIX BEFORE SHIP | Attribution URL is homepage not recipe — fix to book citation (Reem Kassis) |
| `pad-thai.md` | FIX BEFORE SHIP | Tofu appears as both ingredient and substitution — Patrick to decide |

---

### 3. Chef's assessment (from previous session, completed)

Seven concrete issues identified across the 11 launch-priority recipes — all documented in each file's audit section and summarised in `handoffs.md` for the Engineer.

The most significant finding: **three recipes have advance-prep timing invisible at discovery** (butter chicken, roast chicken, shawarma). A user picks "butter chicken tonight" based on `time_min: 90`, starts Step 1, and finds a 4-hour marinade. This is a UX critical issue, not a data quality issue. The `time_min` field must reflect the full commitment including advance prep.

---

### 4. Handoffs updated

- DECISION-009 Culinary Verifier handoff updated: Batch 2 marked DONE ✅ with all 11 files, data fix list for Engineer, Patrick decisions required, attribution URLs to verify.
- Batch 3 checklist added with all ~25 remaining seed library recipes.

---

## What Patrick needs to do

Two decisions flagged — nothing urgent, but needed before Engineer touches those recipes:

1. **Smash burger — `whole_food_verified` flag.** The recipe carries `whole_food_verified: true` but American cheese slices are processed (sodium citrate, milk protein concentrates, preservatives). Options: (a) remove the whole-food claim entirely, or (b) add a note that the whole-food version uses a slice of quality cheddar instead. Patrick decides which way the app communicates this.

2. **Pad Thai — tofu intent.** The recipe currently has `{ name: 'Tofu, firm, cubed', amount: 100g }` as a listed ingredient AND `'tofu'` as a substitution for prawns. Traditional pad thai often includes both prawn and tofu together — this isn't wrong. But the app needs to know: is tofu a default ingredient (listed), a substitution-only option, or a user-choice between the two? Patrick decides.

---

## Data fixes for Engineer (from Batch 2 audit)

All flagged in `handoffs.md`. Summary:

- **Carbonara:** `whole egg` → change `scales: 'fixed'` to `scales: 'linear'`; add scaling_note ("Scale with the servings — the ratio of 3 yolks to 1 whole egg per 2 serves gives richness without turning rubbery.")
- **Butter chicken:** `time_min` 90 → 330
- **Roast chicken:** `time_min` update to reflect overnight brine (14h+ if overnight, 3h if 2h minimum day-of)
- **Shawarma:** `time_min` update; description "London kitchen" → "home kitchen"; tags `'beef'` → `'lamb'`
- **Green curry:** ingredient name `'Thai aubergine'` → `'Thai eggplant'`
- **Bolognese:** `video_url` is channel homepage — either find specific Andy Cooks bolognese video URL, or change `source.chef` to `'Hone Kitchen'` (treat as traditional)
- **Hummus:** attribution URL (`https://www.reemkassis.com/`) → book citation `"After Reem Kassis, The Palestinian Table (Phaidon, 2017)"`

---

## Attribution URLs to verify before ship

Four recipe files have YouTube attribution URLs that could not be verified in-session. These must be confirmed before the app ships — Golden Rule 1 says every link must be correct.

- Carbonara: `https://www.youtube.com/watch?v=5t7JLjr1FxQ` — claimed Gordon Ramsay carbonara
- Butter Chicken: `https://www.youtube.com/watch?v=mrDJ2K3JXsA` — claimed Joshua Weissman
- Green Curry: `https://www.youtube.com/watch?v=lleTlMtbN8Q` — claimed Andy Cooks
- Pad Thai: `https://www.youtube.com/watch?v=6Lb1PyJxVQM` — claimed Andy Cooks

---

## Next session (Culinary Verifier)

**Batch 3 — remaining ~25 existing seed library recipes**, in seed-recipes.ts order:

Chicken Adobo, Classic Beef Stew, Musakhan, Kafta Meshwi, Fattoush, Prawn Tacos with Pineapple Salsa, Sourdough Starter, Sourdough Country Loaf, Mushroom Risotto, Baja Fish Tacos, French Onion Soup, Red Wine Braised Short Ribs, Shoyu Ramen, Beef Wellington, Tarka Dal, Perfect Scrambled Eggs, Spaghetti Aglio e Olio, Mujadara, Sheet-Pan Harissa Chicken, Proper Egg Fried Rice, Nasi Lemak, Beef Rendang, Curry Laksa, Char Kway Teow, Saag Paneer, Chicken Katsu, Tom Yum Goong, Flour Tortillas.

Cultural checks to carry forward for Batch 3:
- Musakhan, Fattoush, Mujadara — Palestinian dishes. No Israeli labels. Attribution: Palestinian/Levantine communal tradition.
- Nasi Lemak — Malaysian. Attribution: Malaysian national dish / communal tradition.
- Beef Rendang, Curry Laksa, Char Kway Teow — Malaysian/Singaporean. Attribution with care — these cross both cultures.
- Tarka Dal, Saag Paneer — North Indian. No fabricated chef unless a verifiable specific source exists.
