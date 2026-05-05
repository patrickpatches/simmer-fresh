# Pan-Seared Barramundi, Lemon Butter

## Source recipe
`id: barramundi` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Hone Kitchen (original in-house). No verification required.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **MINOR — "Salt and white pepper, 1 tsp" is a combined ingredient**
   `{ id: 'i8', name: 'Salt and white pepper', amount: 1, unit: 'tsp' }` — bundling salt and pepper into one ingredient with a combined amount is imprecise. How much is salt, how much is white pepper? Recommend splitting into:
   - `{ name: 'Salt', amount: 1, unit: 'tsp', scales: 'fixed' }` — for the skin side only
   - `{ name: 'White pepper', amount: ½, unit: 'tsp', scales: 'fixed' }` — for the skin side
   Or simplify: `name: 'Salt and white pepper', unit: 'to taste'` — makes the combination explicit.

2. **No other issues.** This is one of the cleanest, most technically correct recipes in the library.

---

## 1. Hero
**Title:** Pan-Seared Barramundi, Lemon Butter  
**Attribution:** Hone Kitchen (original)  
**Cuisine tags:** `australian`  
**Type tags:** `seafood`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 50 min (including 30 min skin-drying) |
| **Active time** | 15 min |
| **Difficulty** | Easy |
| **Leftover-friendly** | Poor — fish is best eaten immediately |
| **Cuisine** | Australian |

---

## 3. Description
*(existing — keep as-is. Excellent.)*  
"Barramundi is Australia's best fish — firm, sweet, and forgiving. The skin is the prize..."

---

## 4. What to Know Before You Start

1. **Dry the skin 30 minutes before cooking.** This is the whole technique. Wet skin steams against the pan and never crisps — dry skin contacts the hot metal and Maillard-browns immediately. Set a timer and put the fillets skin-side up on a rack in the fridge uncovered.
2. **Don't touch the fish while the skin is searing.** It will stick initially, then release naturally when the skin is ready. Lifting it early tears the skin and ruins the crust. Set a timer for 5 minutes and step back.
3. **Brown butter happens fast — watch it.** The butter goes from golden to burnt in about 30 seconds at the end. Have your lemon juice measured and ready to stop the browning the moment you see the right colour.

---

## 5. Equipment

- Stainless steel or cast iron pan (NOT non-stick — you need direct contact heat, and non-stick can't go as hot safely)
- Fish spatula (thin and flexible — for flipping without breaking the fillet)
- Wire rack over a baking tray (for skin drying)
- Ladle or large spoon (for basting and spooning butter sauce)
- Kitchen thermometer (optional — target 60°C internal)

---

## 6. Ingredients
*(existing data is strong — scaling notes only)*

**Scaling notes:**
- `Barramundi fillets, 4 × 180g, scales: linear` — correct. scaling_note: *"Cook in batches if your pan won't hold all fillets with space between them. Crowding drops the pan temperature and the skin steams instead of crisps."*
- `Unsalted butter, 80g total, scales: fixed` — correct. scaling_note: *"80g makes the sauce. For 8 serves, make two batches of butter sauce — don't try to double it in one pan, as the butter-to-pan-size ratio matters for browning speed."*
- `Neutral oil, 2 tbsp, scales: fixed` — correct. Oil depth in pan matters, not total volume.
- `Capers, 2 tbsp, scales: fixed` — correct. Capers are flavouring, not a main ingredient.
- `Lemon, 2, scales: fixed` — correct. scaling_note: *"One lemon for juice in the sauce is enough regardless of serving count. The second is for garnish — scale that with serves."*
- `Garlic, 2 cloves, scales: fixed` — correct.
- `Flat-leaf parsley, 1 handful, scales: fixed` — correct.
- `Asparagus, 200g, scales: linear` — correct.

---

## 7. Mise en Place

*(30 min before cooking)*
- Pat fillets completely dry with paper towel, place skin-side up on a wire rack over a tray
- Put in fridge uncovered for 30 minutes

*(Just before cooking)*
- Pat skin one more time — any remaining moisture will pop and spit in the hot pan
- Season skin side with salt and white pepper just before placing in pan (not before)
- Squeeze lemon juice into a small bowl and have it ready — this stops the butter browning in the final step
- Pat capers completely dry — wet capers in hot butter spit violently
- Slice garlic thinly
- Roughly chop parsley

---

## 8. Cook Steps
*(existing steps are outstanding — some of the best technique writing in the library. Minimal additions needed)*

**Step 1 — Dry the fish thoroughly (30 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After 30 minutes, the skin surface should feel papery-dry when you touch it. Run your finger across it — if it feels even slightly damp, pat dry with paper towel again."

**Step 2 — Get the pan properly hot (3 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "When a drop of water flicked into the pan skitters and evaporates immediately (not splashes) — it's ready. The butter will foam the moment it hits the pan. Wait for the foam to fully subside before adding fish."

**Step 3 — Sear skin-side down — resist touching (5–6 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "Opacity should travel up the fillet from the bottom as it cooks — when it's ¾ of the way up, it's ready to flip. The skin will release from the pan without tearing when it's ready. If it resists, give it 30 more seconds."

**Step 4 — Flip and finish (60–90 sec)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The flesh side should be just opaque — not translucent, not overcooked white. 60°C internal at the thickest point. It should flake when pressed gently with a finger."

**Step 5 — Brown butter and plate (90 sec)**  
*Existing content and why_note correct.*  
**Doneness cue:** "Golden-brown = hazelnut smell, amber colour. Dark brown = burnt, bitter. The lemon juice goes in the moment you see golden-brown — have it in your hand ready."  
**Safety note:** "The lemon juice will spit when it hits the hot butter. Turn your face away momentarily."

---

## 9. Finishing & Tasting

Taste the brown butter sauce before plating. It should be nutty, bright from the lemon, salty from the capers, and rounded from the garlic. If it's too sharp, a small extra knob of cold butter whisked in will soften it. Plate the fish skin-side up always — never rest the crispy skin on a plate. Spoon the sauce over generously, scatter parsley, and serve with the asparagus alongside. Eat immediately.

---

## 10. Leftovers & Storage

Pan-seared fish is not a leftover dish. The skin goes flabby within 10 minutes and cannot be revived. If you have leftover fish, flake it cold into a salad the next day — but the crispy skin experience is gone.

---

## Photography Notes

1. The fillets on the rack — skin-side up, showing the dry skin surface pre-cook
2. The sear — skin side down in the pan, showing the skin making full contact with the metal, edges starting to colour
3. The 3/4 opacity cue — side-on shot showing the opacity line rising through the fillet
4. The flip — fish turned over, showing the golden-brown, crispy skin face
5. The brown butter — showing the foam settling and the amber colour developing around the capers and garlic
6. Plated — skin-side up, butter sauce spooned over, parsley scattered, asparagus alongside

---

## Culinary Audit Entry

```
## barramundi · Pan-Seared Barramundi, Lemon Butter · australian/seafood
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** PASS — Hone Kitchen original. No chef fabricated.
**Cultural origin:** PASS — Australian. Barramundi correctly positioned as the Australian fish of choice.
**Substitutions:** PASS — all fish substitutions are legitimate Australian species (snapper, kingfish, flathead). Honest about salmon needing lower heat. 
**Whole-food claim:** PASS — all whole ingredients. Capers in brine are fine.
**Australian English:** PASS — 'flat-leaf parsley', no issues.
**Minor data fix:** Combined 'Salt and white pepper' ingredient should be split or changed to 'to taste'.
**Recommendation:** SHIP AS-IS (minor data fix recommended but non-blocking). One of the best recipes in the library.
```
