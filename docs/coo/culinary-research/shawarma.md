# Home Oven Lamb Shawarma

## Source recipe
`id: home-oven-lamb-shawarma` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Hone Kitchen (original in-house). No verification required.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **ADVANCE PREP — 6-hour or overnight marinade invisible at discovery**
   `time_min: 300` shown at card level but step 1 requires overnight or minimum 6-hour marination. Same issue as butter chicken and roast chicken. `before_you_start` must lead with this. `time_min` should be updated to reflect total time: at minimum ~360 minutes (6h marinade + 1h temp + 4h cook + 30 min rest), realistically overnight + 6 hours active.

2. **Description says "a London kitchen"** — should read "a home kitchen" or be removed. We're an Australian app.

3. **Tags include `'beef'`** — this is lamb. Should be `'lamb'`. Easy data fix.

4. **Cultural labelling: PASS** — `categories: { cuisines: ['levantine'] }`, tagline makes no Israeli claim. Correct.

---

## 1. Hero
**Title:** Home Oven Lamb Shawarma  
**Attribution:** Hone Kitchen (original)  
**Cuisine tags:** `levantine`  
**Type tags:** `lamb`  
**Base servings:** 6

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | Overnight + ~6 hours day-of |
| **Active time** | ~35 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — excellent. Built for it. |
| **Cuisine** | Levantine |

---

## 3. Description
*(existing description good — update "London kitchen" to "home kitchen")*  
Keep: "Real shawarma meat drips off a vertical spit. You will not build one of those in a home kitchen. But shoulder cooked low-and-slow, rested, then blasted high, gets you about 90% of the way — and the leftover fat in the tray is a treasure."

---

## 4. What to Know Before You Start

1. **Start the marinade the night before.** The yoghurt marinade needs at least 6 hours — overnight gives a noticeably better result. The salt seasons through the full thickness of the shoulder; less than 6 hours seasons the surface only.
2. **Don't peek during the 4-hour low-and-slow.** The sealed tray traps steam that keeps the meat from drying out as the collagen converts to gelatin. Opening it even once breaks the seal and you lose an hour of accumulated moisture. Set a timer and walk away.
3. **The fat in the tray after cooking is the most flavourful thing in the dish.** Don't drain it. Shred the meat directly into it so every piece gets coated before you serve.

---

## 5. Equipment

- Deep roasting tray (deep enough to hold the whole shoulder with clearance)
- Baking paper AND foil (both needed — paper prevents the foil from touching the meat directly)
- Two forks for shredding
- Meat thermometer (helpful: target ~90°C internal for pull-apart collagen conversion)

---

## 6. Ingredients
*(existing data is excellent — scaling notes only)*

**Scaling notes:**
- `Bone-in lamb shoulder, 2kg, scales: fixed` — correct. scaling_note: *"One shoulder = the unit. For 12 people, roast two shoulders separately — don't try to scale up one larger piece, as cook time changes significantly with weight."*
- All spices — `scales: fixed` — correct. The spice amounts are for the marinade rub, which covers the surface of one shoulder. scaling_note on each: *"Spices coat one 2kg shoulder regardless of serving count."*
- `Yoghurt, 200g, scales: fixed` — correct. The marinade volume is for one shoulder.
- `Garlic, 8 cloves, scales: linear` — should probably be `fixed` with a cap. 8 cloves is already a lot of garlic for a marinade. scaling_note: *"8 cloves gives strong garlic presence. For a milder result, use 4–6 cloves."*
- `Flatbreads, 6, scales: linear` — correct.
- `Tahini sauce, 150g, scales: linear` — correct.
- `Pickled turnips, 100g, scales: linear` — correct.

---

## 7. Mise en Place

*(Night before)*
- Combine all marinade ingredients (yoghurt, garlic, lemon, olive oil, all spices) into a thick paste
- Score the shoulder in a few places if not already done — push marinade into the cuts
- Coat every surface thoroughly, including under any skin flaps
- Cover and refrigerate overnight

*(Day of, 1 hour before roasting)*
- Take shoulder out of fridge — it needs time to temper before going into the oven
- Preheat oven to 160°C (fan 140°C)
- Cut baking paper to fit the tray, tear foil for the seal
- Warm the flatbreads (in a dry pan just before serving)
- Prepare the condiments: tahini sauce, pickled turnips

---

## 8. Cook Steps
*(existing steps are outstanding — best narrative writing in the library. Adding doneness cues only)*

**Step 1 — Build the marinade and rub (overnight)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After overnight, the marinade will have slightly changed colour where it contacts the meat — the yoghurt proteins will look set against the surface. The shoulder should smell deeply spiced."

**Step 2 — Out of the fridge an hour before (1 hour)**  
*Existing content correct.*  
**Doneness cue:** "Press the thickest part with your finger — it should feel significantly less cold than straight from the fridge. Not warm, but not cold."

**Step 3 — Low and slow, covered (4 hours)**  
*Existing content and why_note are excellent. "Do not peek" is the right instruction.*  
**Doneness cue:** "At 4 hours: pull a fork through the thickest part — the meat should offer almost no resistance and pull apart in long fibres. If it resists, seal and continue for 30 more minutes."

**Step 4 — Rest, then crank the heat (20 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After resting, the surface of the shoulder should look dull and slightly tacky — the steam has dried it. This is the surface that will crisp in the blast."

**Step 5 — Blast for crust (10–15 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The fat cap and exposed spice bark should be deep brown and caramelised — not burnt black, not pale golden. You can see this visually without a thermometer."

**Step 6 — Pull, shred, wrap**  
*Existing content and why_note are the best closing step in the library. No changes.*  
"Eat standing up if you have to" — keep exactly as written.

---

## 9. Finishing & Tasting

Taste a shred of lamb from the tray before serving. It should be deeply spiced, savoury, slightly caramelised at the edges. Season the assembled tray with a little extra salt if the meat needs it — the shredded pieces vary in how much marinade clings to each. The wrap needs three things to be balanced: fatty, spiced lamb + creamy tahini or toum + the sharp acid of pickled turnips. If the pickled turnips you bought are not actually sour, add a splash of white wine vinegar to a bowl of sliced raw onion as a quick substitute.

---

## 10. Leftovers & Storage
*(existing leftover_mode is excellent — keep exactly)*  
"This is built for leftovers. Shredded shawarma keeps 3 days in the fridge, freezes well, and reheats best in a pan with a splash of water — not the microwave."

---

## Photography Notes

1. The marinated shoulder — before going in the oven, showing the thick yoghurt-spice coating
2. The sealed tray — showing the double-seal of baking paper then foil
3. After 4 hours uncovered — showing the pull-apart texture before the blast
4. The blasted shoulder — deep brown spice bark, fat cap caramelised
5. The shred — forks pulling the meat apart in the tray, coated in rendered spiced fat
6. The wrap assembly — the complete wrap showing all components

---

## Culinary Audit Entry

```
## home-oven-lamb-shawarma · Home Oven Lamb Shawarma · levantine/lamb
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** PASS — Hone Kitchen original. No chef fabricated. No Israeli attribution.
**Cultural origin:** PASS — categories: levantine. Tagline and description make no Israeli claim. Cuisine correctly attributed to the Levantine tradition.
**Substitutions:** PASS — goat shoulder correctly flagged 'great_swap' (historically accurate). Boneless shoulder correctly noted as needing reduced cook time.
**Whole-food claim:** PASS — all whole ingredients. Yoghurt, fresh spices, lamb, olive oil.
**Australian English:** PASS — no issues.
**Minor data fixes:** (1) Description "London kitchen" → "home kitchen". (2) Tags 'beef' → 'lamb'. (3) time_min needs updating to reflect overnight marinade.
**Recommendation:** FIX BEFORE SHIP — minor data fixes (easy). Content is outstanding. One of the strongest recipes in the library.
```
