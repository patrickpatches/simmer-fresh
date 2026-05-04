# Hone Session Report — 5 May 2026
**Role:** Culinary & Cultural Verifier  
**Session focus:** DECISION-009 Batch 1 — full 10-section template applied to all 6 new recipe source files + ingredient derivations Phase 1

---

## What was done

### 1. ingredient-derivations.ts — Phase 1 (DONE ✅)
Created `mobile/src/data/ingredient-derivations.ts` — the source→derived ingredient map that closes the pantry-match derivation gap Patrick identified (having "eggs" in the pantry didn't match recipes requiring "egg yolks").

Key genuine gaps addressed:
- `eggs` → egg yolks, egg whites, beaten egg, egg wash
- `parmesan` ↔ `parmigiano` (bidirectional name variant)
- `whole chicken` → stock, breast, thighs, drumsticks, bones
- `unsalted butter` → ghee
- `desiccated coconut` → kerisik
- `prawns` → prawn stock

Plus annotation entries for lemon/lime/garlic/ginger/spices/tomatoes/chickpeas/bread — confirming that the existing substring matcher already handles these without new derivation entries.

Senior Engineer is unblocked for Phase 2 (updating `pantry-helpers.ts` to use the lookup).

---

### 2. Six new recipe source files — Batch 1 DONE ✅

All 6 files written to `docs/coo/culinary-research/` with full 10-section template per DECISION-009. Every ingredient carries `scales` flag and `scaling_note` where chef knowledge changes naïve multiplication.

| File | Attribution | Notes |
|---|---|---|
| `chicken-schnitzel.md` | Traditional Australian pub schnitzel / Austrian Wiener Schnitzel tradition | Photography priority. Oil depth fixed regardless of batch count. Batch-frying note for 6+ serves. |
| `chicken-vegetable-stir-fry.md` | Traditional Australian weeknight / Cantonese-inspired | Velveting technique. Vegetables in order of hardness. Sesame oil off-heat only. |
| `beef-lasagne.md` | After Marcella Hazan, *Essentials of Classic Italian Cooking* (1992) | Hazan's milk-first sequence. 3-hour braise. Tinned tomatoes fixed-scale (not a tomato-heavy sauce). |
| `roast-lamb-rosemary-garlic.md` | Traditional Australian Sunday roast (Maggie Beer cultural reference) | One leg = the unit (not weight-scalable). Two-temperature method with probe targets. 20-min no-foil rest. |
| `fish-and-chips.md` | Traditional Australian Friday fish and chips | Beer batter mixed at last moment. Twice-cooked chips (150°C then 190°C). Dish must be eaten within 10–15 min. |
| `falafel.md` | Levantine — Palestinian, Lebanese, Syrian, Jordanian communal tradition | Dried chickpeas only (non-negotiable — tinned won't bind). Coarse grainy blitz, not smooth. Test-fry protocol. Levantine attribution with no fabricated chef. |

---

## Cultural rules applied

- Falafel: no Israeli label. Attribution: "Palestinian, Lebanese, Syrian, Jordanian communal tradition." Cultural notes section included with correct app attribution framing.
- No chef attributions fabricated. Lasagne uses a book citation (verifiable). Lamb uses Maggie Beer as a cultural reference without claiming a specific URL.
- All recipes: Australian English throughout (capsicum, coriander, plain flour, cornflour, mince, chips).

---

## Handoffs updated

- **Culinary Verifier DECISION-009 handoff** — updated from `OPEN` to `IN PROGRESS`. Batch 1 (6 new recipes) marked DONE ✅. Batch 2 checklist (28 existing seed library recipes) listed with priority order.
- **Derivation handoff** — marked `PHASE 1 DONE — ENGINEER UNBLOCKED` in previous session context.

---

## What Patrick needs to do

Nothing urgent from this session. All work is internal culinary/content work.

If Patrick wants to review any recipe before photography, the files are at `docs/coo/culinary-research/`. Chicken schnitzel is flagged as photography priority and is the logical first shoot candidate.

---

## Next session (Culinary Verifier)

**Batch 2 — existing seed library, launch-priority order:**

1. carbonara
2. bolognese
3. butter-chicken
4. green-curry
5. smash-burger
6. roast-chicken
7. pavlova
8. barramundi
9. shawarma
10. hummus
11. pad-thai

Then remaining ~17 recipes.

For each: at-a-glance numbers, before-you-start framings, equipment list, mise en place, finishing & tasting, leftovers note, ingredient scaling flags.

Tell COO when the 11 launch-priority batch is complete.
