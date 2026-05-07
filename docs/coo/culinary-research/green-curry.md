# Thai Green Curry

## Source recipe
`id: thai-green-curry` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/watch?v=lleTlMtbN8Q`  
**⚠️ Verification required:** Confirm URL is live and points to his green curry video before ship.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **Australian English — "Thai aubergine" should be "Thai eggplant"**
   `{ id: 'i4', name: 'Thai aubergine' }` — we use eggplant, not aubergine. The substitutions in the same recipe use "Zucchini (courgette)" using the Australian term first. Inconsistent. Fix: `name: 'Thai eggplant'`.

2. **Attribution verification:** Confirm YouTube URL before ship.

---

## 1. Hero
**Title:** Thai Green Curry  
**Attribution:** Andy Cooks (verify link before ship)  
**Cuisine tags:** `thai`  
**Type tags:** `chicken`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 35 min |
| **Active time** | 30 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — keeps 3 days, flavour deepens |
| **Cuisine** | Thai |

---

## 3. Description
*(existing tagline is good — "Aromatic, balanced, deeply fragrant")*  
Add: "This is a curry built on three moments of heat: the paste frying until fragrant, the coconut cream cracking to release its fat, and the slow simmer that lets the lime leaf and basil do their work. Get all three right and it tastes nothing like a jar."

---

## 4. What to Know Before You Start

1. **Full-fat coconut milk only.** The fat in the coconut cream is what carries the curry paste flavour through the whole dish. Light coconut milk breaks and goes watery. This is the one ingredient substitution in this recipe that genuinely changes the dish.
2. **Cracking the coconut cream is the technique.** When you add the thick cream from the top of the can, you stir it with the hot paste until the oil separates — you'll see it pool visibly. This is correct and is the foundation of the dish's flavour depth.
3. **Everything from the wok happens fast.** Prep all your vegetables and protein before the wok goes on. Once the paste hits the oil, the dish moves at pace.

---

## 5. Equipment

- Wok (preferred) or very wide, deep frying pan
- Wooden spoon or wok spatula
- Can opener (for coconut milk — don't shake it)
- Rice cooker or pot for jasmine rice (start before the curry)

---

## 6. Ingredients
*(existing data is strong — scaling notes and one data fix)*

**Data fix:**
- `'Thai aubergine'` → `'Thai eggplant'` (Australian English — see audit flag)

**Scaling notes:**
- `Chicken thighs, 600g, scales: linear` — correct.
- `Coconut milk, 400ml, scales: linear` — correct. scaling_note: *"Use full-fat only. For double the recipe, use two cans — don't stretch one can further with water."*
- `Green curry paste, 3 tbsp, scales: fixed` — correct. scaling_note: *"Paste heat and flavour intensity is about concentration, not volume. 3 tbsp makes a well-spiced curry for 4; doubling to 6 tbsp for 8 people would be punishingly hot. Keep at 3–4 tbsp regardless of batch size and taste before adding more."*
- `Thai eggplant, 200g, scales: linear` — correct. scaling_note: *"Thai eggplant (the small, golf-ball-sized green ones) absorbs the sauce differently to large eggplant — it stays slightly firm. Add at the start of the coconut milk simmer."*
- `Fish sauce, 2 tbsp, scales: fixed` — correct. scaling_note: *"Seasoning is about concentration, not volume. 2 tbsp seasons 4 servings; doubling for 8 doesn't double the saltiness because the extra liquid dilutes it. Taste and adjust at the end."*
- `Palm sugar, 1 tsp, scales: fixed` — correct.
- `Kaffir lime leaves, 4, scales: fixed` — correct. scaling_note: *"Kaffir lime is aromatic, not a main flavour. 4 leaves is enough regardless of batch size — more would dominate."*
- `Thai basil, 1 handful, scales: fixed` — correct.
- `Neutral oil, 2 tbsp, scales: fixed` — correct.

---

## 7. Mise en Place

- Slice chicken thighs into bite-sized pieces
- Open coconut milk without shaking — spoon the thick cream from the top into a separate bowl (roughly the top ¼ of the can)
- Halve the Thai eggplants (or prepare your chosen vegetable)
- Measure fish sauce, palm sugar into a small bowl
- Tear kaffir lime leaves slightly to release their oils (leave whole — remove before eating)
- Have Thai basil ready, leaves picked
- Start jasmine rice now — it takes 12–15 minutes and should be ready when the curry finishes

---

## 8. Cook Steps
*(existing steps are solid — adding doneness cues and lookaheads)*

**Step 1 — Fry the paste (2 min)**  
*Existing content correct.*  
**Doneness cue:** "The paste will darken slightly, separate from the oil, and smell fragrant — galangal and lemongrass turning sweet and toasty. If it smells harsh, the heat is too high."  
**Safety note:** "It will spit. Keep a lid nearby."

**Step 2 — Add coconut cream first ("cracking") (2–3 min)**  
*Existing content and why_note are excellent.*  
**Doneness cue:** "You'll see the oil pool visibly — golden droplets separating from the white cream and sitting on the surface. The mixture will look 'broken'. This is correct. Stir to combine the paste into the fat."

**Step 3 — Cook the chicken (3–4 min)**  
*Existing content correct. Short step — missing why_note.*  
**Add why_note:** *"Sealing the chicken in the paste-cream coats every piece in the fat-soluble spice compounds before the liquid goes in — it's the difference between chicken in a curry and curried chicken."*  
**Doneness cue:** "Chicken should be opaque on the outside — not cooked through yet. It finishes in the simmer."

**Step 4 — Add remaining coconut milk and simmer (12 min)**  
*Existing content and why_note are strong.*  
**Doneness cue:** "Chicken is cooked when it pulls apart easily at the thickest point. Eggplant should be just tender — it shouldn't be mushy."  
**Add:** "Taste the sauce now. Fish sauce for salt, palm sugar for sweetness, a squeeze of lime for brightness. The balance shifts during cooking — trust your palate more than the measurements."

**Step 5 — Finish with basil (off heat)**  
*Existing content and why_note are correct.*  
**Doneness cue:** "The basil wilts in about 30 seconds from the residual heat. Serve immediately."

---

## 9. Finishing & Tasting

Taste before serving: Thai cooking is built on the balance of salty (fish sauce), sweet (palm sugar), sour (lime), and aromatic (kaffir lime, basil). These need to be in harmony — no single element should dominate. Add a squeeze of lime now if it tastes flat. A little extra fish sauce if it needs salt. If it's too spicy, a teaspoon more palm sugar softens the heat. Serve in deep bowls over jasmine rice.

---

## 10. Leftovers & Storage

Keeps 3 days refrigerated. The flavour actually deepens — the lime leaf and spices continue to infuse. Reheat gently on the stove (not microwave — the coconut milk can separate unevenly). Stir in a splash of water to loosen if it's thickened. Add the remaining fresh basil again on reheating.

---

## Photography Notes

1. The paste frying — close-up showing the paste changing colour in the wok, oil beginning to separate
2. The coconut crack — showing the oil visibly pooling on the surface (the technique moment)
3. The chicken coating — pieces coated in the green paste-cream before liquid goes in
4. The finished curry in the wok — vivid green, vegetables just visible, glossy coconut surface
5. Plated over jasmine rice — clean frame, Thai basil leaves visible, kaffir lime leaf removed

---

## Culinary Audit Entry

```
## thai-green-curry · Thai Green Curry · thai/chicken
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Andy Cooks with specific YouTube URL. URL not yet verified live.
**Cultural origin:** PASS — Thai. No contested labelling.
**Substitutions:** PASS — light coconut milk correctly flagged 'compromise' (will separate — this is honest). Kaffir lime leaf has accurate local_alternative note.
**Australian English:** FAIL — 'Thai aubergine' should be 'Thai eggplant'. Fix in seed-recipes.ts.
**Voice:** PASS — second person, present tense, doneness cues used.
**Data fix required:** 'Thai aubergine' → 'Thai eggplant'.
**Recommendation:** FIX BEFORE SHIP — one data fix (easy). Attribution verification pending.
```
