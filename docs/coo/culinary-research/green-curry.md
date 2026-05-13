# Thai Green Curry

## Source recipe
`id: thai-green-curry` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/watch?v=lleTlMtbN8Q`  
**⚠️ Verification required:** Confirm URL is live and points to his green curry video before ship.

---

---

## Category taxonomy — multi-axis audit

### Discrepancy table

| Field | Current value | Proposed value | Action |
|---|---|---|---|
| `categories.cuisines` | `MISSING` | `['thai']` | Update in seed-recipes.ts |
| `categories.types` | `MISSING` | `['chicken']` | Update in seed-recipes.ts |
| Schema | — | — | No schema change |

**Contested origin?** No — Thai dish, no contest.

**Rationale:** Types: `chicken` for the base recipe. Note for engineer: a `curry` TypeId would be a useful future addition — both Thai Green Curry and Butter Chicken are curries and would benefit from a curry filter. Flagged but out of scope here.

**Pre-flight: READY FOR ENGINEER** — categories set in seed-recipes.ts. Schema additions applied to types.ts.

## DECISION-015: Substitution Colour Mapping

`seed-recipes.ts const: THAI_GREEN_CURRY`

| Ingredient | Substitution | Old quality | New colour | step_override | Notes |
|---|---|---|---|---|---|
| Chicken thighs | Prawns, peeled and deveined | `great_swap` | 🟡 yellow | **Yes — cook step** | Cooks in 3–4 min vs 10–15; add at the very end |
| Chicken thighs | Firm tofu, pressed and cubed | `great_swap` | 🟡 yellow | **Yes — cook step** | Needs only 5 min to heat through; earlier addition causes crumbling |
| Chicken thighs | Chicken breast, thinly sliced | `good_swap` | 🟡 yellow | No | Drier; overcooks at 12+ min; slice thinly and pull early |
| Coconut milk | Coconut cream | `great_swap` | 🟡 yellow | No | Richer and thicker; dilute with 50ml water if the sauce seems too heavy |
| Coconut milk | Light coconut milk | `compromise` | 🔴 red | No | Significantly less richness; the sauce is thin and the coconut character is diluted |
| Green curry paste | Red curry paste | `good_swap` | 🟡 yellow | No | Spicier, earthier, different flavour profile; not a green curry but still excellent |
| Green curry paste | Yellow curry paste | `good_swap` | 🟡 yellow | No | Milder, more turmeric-forward; a different but good curry |
| Eggplant | Zucchini (courgette), cut in rounds | `perfect_swap` | 🟢 green | No | Cooks in the same time as eggplant; no flavour compromise |
| Eggplant | Broccolini, cut into florets | `good_swap` | 🟡 yellow | No | More bitter, cruciferous note; works |
| Eggplant | Snow peas or sugar snap peas | `good_swap` | 🟡 yellow | No | Crunchy, sweeter; add in the last 2 minutes |
| Eggplant | Capsicum (red or green), sliced | `good_swap` | 🟡 yellow | No | Different vegetal note; works |
| Eggplant | Butternut pumpkin, cut in 3cm cubes | `good_swap` | 🟡 yellow | **Yes — cook step** | Needs 15–20 min in the sauce; add at the start with the coconut milk |
| Fish sauce | Light soy sauce | `good_swap` | 🟡 yellow | No | Less funky umami; vegan option; add extra pinch of salt to compensate |
| Fish sauce | Coconut aminos | `compromise` | 🟡 yellow | No | Sweeter, milder; the sauce will be noticeably sweeter; upgrade from 'compromise' — it works, just different |
| Palm sugar | Brown sugar | `great_swap` | 🟡 yellow | No | Lacks palm sugar's floral-caramel note; close enough in most contexts |
| Palm sugar | Coconut sugar | `great_swap` | 🟡 yellow | No | Slightly caramel note; very close to palm sugar; works well |
| Palm sugar | Honey | `good_swap` | 🟡 yellow | No | Floral note that's different from palm sugar; works |
| Kaffir lime leaves | Lime zest, freshly grated | `compromise` | 🔴 red | No | Kaffir lime leaves have a distinctive citronella-floral character that lime zest cannot replicate; the curry tastes noticeably different |
| Thai basil | Italian basil + fresh mint | `compromise` | 🟡 yellow | No | Different aromatic profile; still good; upgrade from 'compromise' — it's not a failure state |
| Thai basil | Holy basil | `great_swap` | 🟡 yellow | No | More medicinal-clove character than Thai basil; authentic alternative |
| Neutral oil | Coconut oil | `great_swap` | 🟡 yellow | No | Faint coconut note at the paste-frying stage; not detectable in the finished dish |
| Neutral oil | Vegetable oil or sunflower oil | `perfect_swap` | 🟢 green | No | Same neutral-flavour function; identical result |

**Colour summary:** 2 🟢 · 18 🟡 · 2 🔴

### step_overrides authored

**Prawns → cook step:**
*step_override → cook step:* "Add prawns in the last 3–4 minutes only — they turn rubbery past 5 minutes in a simmering sauce. They're done when they've turned fully pink and curled. Pull the pan off heat the moment they're cooked."

**Firm tofu → cook step:**
*step_override → cook step:* "Add tofu in the last 5 minutes. It doesn't need cooking — only heating through. Tofu added earlier breaks apart and disperses into the sauce."

**Butternut pumpkin → cook step:**
*step_override → cook step:* "Add pumpkin at the start of simmering, with the coconut milk. It needs 15–20 minutes to soften — other vegetables go in per the main steps."

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
