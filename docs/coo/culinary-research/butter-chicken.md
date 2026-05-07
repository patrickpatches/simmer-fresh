# Butter Chicken from Scratch

## Source recipe
`id: butter-chicken` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Joshua Weissman — `https://www.youtube.com/watch?v=mrDJ2K3JXsA`  
**⚠️ Verification required:** Confirm URL is live and points to his butter chicken video before ship.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **UX CRITICAL — 4-hour marinade invisible at discovery**
   `time_min: 90` is shown at the recipe card level, but step 1 has `timer_seconds: 14400` (4 hours) for the marinade. A user who selects this recipe expecting to cook tonight will hit this without warning. The `total_time_minutes` at-a-glance field must honestly reflect the real commitment. Recommend: `total_time_minutes: 330` (4h 30m) with a `before_you_start` flag. Update `time_min` in seed-recipes.ts accordingly.

2. **Attribution verification:** Confirm YouTube URL before ship.

---

## 1. Hero
**Title:** Butter Chicken from Scratch  
**Attribution:** Joshua Weissman (verify link before ship)  
**Cuisine tags:** `indian`  
**Type tags:** `chicken`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 4 hours 30 min (includes marinade) — or overnight |
| **Active time** | ~45 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — sauce improves next day |
| **Cuisine** | Indian (North Indian, Mughlai-origin) |

**Note for Engineer:** Update `time_min` from `90` to `330` (or add a note field) to reflect the genuine total time commitment.

---

## 3. Description
*(existing — strong, keep as-is)*
Includes the Kundan Lal Gujral / Kundan Lal Jaggi origin story — good. Keep it.

---

## 4. What to Know Before You Start

1. **Start with the marinade — ideally the night before.** The chicken needs at least 4 hours in the yoghurt marinade. If you haven't done this yet, do it now and come back. Overnight gives a noticeably better result: the spices penetrate deeper and the lactic acid does more work on the texture.
2. **The char on the chicken is not a mistake — it's the point.** When you grill the marinated chicken, you want edges that look slightly burned. Those charred bits are the tikka quality that gives butter chicken its depth. A uniformly pale, oven-roasted piece of chicken produces a flat, restaurant-jar-tasting sauce.
3. **Blend the sauce completely smooth.** A stick blender in the pot is fine. The silk is non-negotiable — chunks of onion in butter chicken sauce are a different dish.

---

## 5. Equipment

- Large ziplock bag or covered bowl (for marinating)
- Oven rack over a baking tray (essential for the grill step — a flat tray won't char the underside)
- Heavy-based pot or Dutch oven (for the sauce)
- Stick blender or countertop blender
- Fine grater for ginger

---

## 6. Ingredients
*(existing data is excellent — scaling notes to add)*

**Scaling notes:**
- `Chicken thighs, 800g, scales: linear` — correct.
- `Full-fat yoghurt, 150g, scales: linear` — correct.
- `Lemon juice, 2 tbsp, scales: fixed` — correct. scaling_note: *"The acid is for the marinade, not for flavour — 2 tbsp is enough regardless of chicken quantity."*
- `Garlic, 8 cloves, scales: linear` — the recipe splits 4+4 (marinade and sauce). scaling_note: *"Scale linearly but note the 4+4 split — 4 cloves for the marinade, 4 for the sauce."*
- `Fresh ginger, 6cm, scales: fixed` — *This should arguably be 'custom'*. For double the recipe (8 serves), 6cm is probably enough for the sauce but the marinade would benefit from more. Recommend `scales: 'custom'`, scaling_note: *"For 2× the recipe, use 9cm total — scale the marinade portion (4cm) proportionally, keep the sauce portion (5cm) fixed."*
- `Kashmiri chilli powder, 2 tsp, scales: fixed` — correct. The colour comes from this — it's fixed because the visual effect doesn't need to double.
- `Garam masala, cumin, coriander, turmeric — all scales: fixed` — correct. Spices in a sauce like this don't scale linearly; the sauce concentration is what matters.
- `Tinned crushed tomatoes, 400g, scales: linear` — correct.
- `Unsalted butter, 60g, scales: fixed` — correct. The butter is enrichment, not a structural ingredient.
- `Double cream, 150ml, scales: linear` — correct.
- `Cardamom, cloves, cinnamon — all scales: fixed` — correct.
- `Yellow onion, 1 large, scales: linear` — correct.
- `Honey, 1 tsp, scales: fixed` — correct.

---

## 7. Mise en Place

*(Day before / 4+ hours ahead)*
- Combine all marinade ingredients (yoghurt, lemon, 4 crushed garlic, half the grated ginger, Kashmiri chilli, 1 tsp garam masala, cumin, coriander, turmeric, 1 tsp salt) into a paste
- Cut chicken thighs into large chunks (roughly 5–6cm), coat thoroughly in marinade, cover and refrigerate

*(Day of, 30 min before cooking)*
- Take chicken out of the fridge to temper slightly — straight-from-fridge chicken won't char properly
- Dice the onion finely
- Grate remaining ginger, slice remaining garlic
- Measure spices, stock the pot nearby
- Set oven rack position: middle-high, not top (for grill/broil — you want proximity to the element but not scorching)

---

## 8. Cook Steps
*(existing steps are strong — adding doneness cues and recovery)*

**Step 1 — Marinate the chicken (4h–overnight)**  
*Existing content correct.*  
**Add before you start framing** (already captured in section 4).  
**Doneness cue:** "After 4 hours, the chicken surface will look opaque and slightly cured — the yoghurt will have adhered to the surface. The spice colour should have deepened into the meat."

**Step 2 — Grill or roast the chicken hard (15–18 min)**  
*Existing content correct. Stage note and why_note are excellent.*  
**Add recovery:** "If the oven isn't charring the edges, switch to the grill/broil function and watch it closely — char can go from 'right' to 'too far' in 2 minutes."  
**Doneness cue:** "Internal temperature 75°C at the thickest part, edges showing black-brown char marks. Not uniformly golden — that's not what we're after."

**Step 3 — Build the makhani sauce (20–25 min)**  
*Existing content correct.*  
**Add doneness cue:** "The onion should be a deep, even golden-brown — not pale (raw tasting) and not dark brown (bitter). If you see any dark-brown bits, reduce heat immediately."  
**Add lookahead:** "The sauce needs to simmer 20 minutes — use this time to clean up and prepare a serving bowl."

**Step 4 — Blend the sauce smooth**  
*Existing content correct.*  
**Add safety note:** "If using a countertop blender, fill no more than half full and hold the lid with a folded tea towel. Hot liquid in a full blender can force the lid off and burn you."

**Step 5 — Finish with cream, simmer with chicken (10 min)**  
*Existing content correct.*  
**Add doneness cue:** "The finished sauce should be a deep, glossy orange-red — not brown, not pale orange. Taste: it should be savoury-sweet with warmth, not heat."  
**Add finishing note (see section 9).**

---

## 9. Finishing & Tasting

Before plating, taste for three things: salt (it probably needs more), sweetness (an extra half teaspoon of honey if the tomatoes are acidic), and heat (if it's too mild for your household, a pinch of cayenne now). The sauce should be thick enough to coat a spoon — if it's too thin, simmer uncovered 5 more minutes. Serve over basmati with naan alongside. A small swirl of extra cream on top before serving is traditional and not for show — it cools the surface temperature so the dish isn't scalding when it hits the table.

---

## 10. Leftovers & Storage

The sauce genuinely improves overnight — the spices integrate and the sweetness from the tomatoes rounds out. Refrigerate for up to 3 days or freeze (sauce only, not rice) for 3 months. Reheat gently — don't boil, the cream can split. Reheat with a splash of water stirred through.

---

## Photography Notes

1. The marinade — chicken pieces coated in the vivid orange-red yoghurt marinade (beautiful colour)
2. The grill result — chicken pieces on the rack showing the char marks and bright orange-red crust
3. The onion at golden-deep stage — showing the colour target (not pale, not dark)
4. Blending the sauce — stick blender in pot, sauce transforming to silk
5. The final sauce colour — deep orange-red, glossy, with cream swirled through
6. Plated with basmati — close frame showing the sauce coating the chicken

---

## Culinary Audit Entry

```
## butter-chicken · Butter Chicken from Scratch · indian/chicken
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Joshua Weissman with specific YouTube URL. URL not yet verified live. Flag for verification before ship.
**Cultural origin:** PASS — Indian (North Indian / murgh makhani origin). Historical context in description is accurate and well-sourced.
**Substitutions:** PASS — quality flags honest. Coconut cream dairy-free swap flagged accurately. Ground ginger flagged 'compromise' correctly — it is a last resort.
**Australian English:** PASS — "thickened cream" listed as perfect_swap for double cream. Correct.
**Data fix required:** time_min must change from 90 to reflect real total (4h 30m minimum). UX critical.
**Recommendation:** FIX BEFORE SHIP — time display issue is the most important fix; attribution needs verification.
```
