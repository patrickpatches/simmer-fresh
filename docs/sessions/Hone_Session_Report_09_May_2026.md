# Hone Session Report — 09 May 2026

**Role:** COO (Culinary Research)  
**Commit:** `13b0cbd`  
**Branch:** main

---

## What was done

### Job 1 — Scaling-disparity audit (COMPLETE)

Scanned all 16 launch recipe research files for step `content` and mise fields that contain hardcoded ingredient quantities. These break the app's promise of accurate step instructions at any serving count: the ingredient list scales correctly, but the step text still shows the original amount.

**Scan method:** Python regex across all 16 launch recipe consts in `seed-recipes.ts`, classifying every number+unit hit as either (a) ingredient-quantity violation or (b) technique reference (temperatures, times, cut sizes — not violations).

**Result — 11 recipes CLEAN, 5 needed fixing:**

| Recipe | Violation | Fix |
|---|---|---|
| SMASH_BURGER | `"100g balls"` in mise + step 1 | → `"one ball per patty"` |
| PASTA_CARBONARA | `"Reserve 200ml of pasta water"` in step | → `"generous ladleful"` (engineer note) |
| BUTTER_CHICKEN | Inline qty list in mise + step 1 marinade paste | → references by ingredient name only |
| CHICKEN_SCHNITZEL | `"Dish 2: 2 beaten eggs"` in mise; `"1 L of cold water"` in brine step | → `"the beaten eggs"`; `"enough to submerge"` (engineer note) |
| FLOUR_TORTILLAS | `"13 pieces"` in mise + step 5 | → `"one piece per tortilla, roughly 30g"` |

**CLEAN recipes (no changes):** WEEKDAY_BOLOGNESE, THAI_GREEN_CURRY, BEEF_LASAGNE, ROAST_CHICKEN, ROAST_LAMB, FISH_AND_CHIPS, PAVLOVA, HUMMUS, PAD_THAI, FALAFEL, CHICKEN_SHAWARMA.

### flour-tortillas.md — full file restored

Discovered that commit `aff3bc4` (previous session) had silently truncated `flour-tortillas.md` to 80 lines — sections 5–10 (Equipment, Ingredients, Mise en Place, Cook Steps, Finishing, Leftovers, Photography, Pre-flight Checklist, Audit Entry) were never committed to git. This session restored the complete 269-line file with the scaling-disparity fix already applied.

### Research files updated

- `docs/coo/culinary-research/smash-burger.md` — mise + step 1 rewritten
- `docs/coo/culinary-research/carbonara.md` — step 3 engineer fix note added
- `docs/coo/culinary-research/butter-chicken.md` — mise + step 1 rewritten
- `docs/coo/culinary-research/chicken-schnitzel.md` — mise fix + brine engineer note
- `docs/coo/culinary-research/flour-tortillas.md` — full file restored + scaling fixes

### Handoff issued

New handoff added to `docs/coo/handoffs.md` → Senior Engineer with exact seed-recipes.ts changes required per recipe. Engineer applies these to seed-recipes.ts; COO files are the authoritative source.

---

## What Patrick needs to do next

Nothing from this session — this is all COO → Engineer work. The engineer handoff is open in `handoffs.md`.

**Open engineer handoffs (priority order):**
1. **Scaling-disparity fixes** (`13b0cbd`) — 5 recipes, exact changes in handoffs.md
2. **FLOUR_TORTILLAS data fixes** (from `aff3bc4`) — 6 field corrections in seed-recipes.ts
3. **CHICKEN_SHAWARMA const** — new recipe to author from chicken-shawarma.md
4. **ATTR-FAIL** — 16 broken attribution URLs to fix

**Open Patrick validation:**
- Build #99 on-device dark theme validation — still pending

---

## Audit note — file tool / bash mount discrepancy

Observed this session: the Write/Edit file tools (Windows path C:\Users\patri\hone) and bash (Linux mount /sessions/.../mnt/hone/) do not always sync in real time. Edits made via file tools may not be immediately visible to bash, and vice versa. Standing procedure: always use bash `cp` to the clean clone, then verify with bash `grep`/`wc -l` before committing. Do not rely on file tool "success" confirmation alone for large file writes.
