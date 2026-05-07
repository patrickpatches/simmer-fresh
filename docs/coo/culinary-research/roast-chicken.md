# Perfect Roast Chicken

## Source recipe
`id: perfect-roast-chicken` in `mobile/src/data/seed-recipes.ts`

### Attribution
Need to check — reading source field now from seed data.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **ADVANCE PREP — overnight dry brine invisible at discovery**
   Step 1 requires overnight dry brining ("at minimum 2 hours"). The `time_min: 130` shown at the card level doesn't reflect the advance prep. Same issue as butter chicken. `before_you_start` section needs to lead with this.

2. **Attribution:** Check source.chef in seed data — noted below.

---

## Source check
From seed-recipes.ts line ~427:  
`source: { chef: 'Hone Kitchen', notes: 'Standard professional-kitchen dry-brine and high-roast method. The butter-under-skin technique is universal.' }`  
**Attribution: Hone Kitchen — clean. No verification required.**

---

## 1. Hero
**Title:** Perfect Roast Chicken  
**Attribution:** Hone Kitchen (original in-house)  
**Cuisine tags:** `australian`  
**Type tags:** `chicken`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 14+ hours (overnight dry brine) or 3h (2h min brine + cook) |
| **Active time** | ~25 min |
| **Difficulty** | Easy |
| **Leftover-friendly** | Yes — excellent cold, in sandwiches, soups, stock |
| **Cuisine** | Australian (universal technique) |

---

## 3. Description
*(existing tagline strong — keep)*  
Add: "The technique here is professional-kitchen standard: dry brine overnight, butter under the skin, high heat to start, rest properly before carving. Each step has one job. Do them all and the result is a better chicken than most restaurants serve."

---

## 4. What to Know Before You Start

1. **Dry brine the day before.** The overnight salt rest is the single most important thing you can do for a roast chicken — it seasons the meat through its full thickness, not just the surface, and it desiccates the skin so it crisps instead of steams. Two hours is the minimum; overnight is the difference between good and memorable.
2. **Butter under the skin, not just on top.** The butter on the outside browns the skin; the butter under the skin bastes the breast meat directly as it melts. The breast is the first part of a chicken to dry out — this solves it.
3. **Rest before carving, for real.** Fifteen minutes minimum. Cutting into it early pours all the juices onto the board. A rested chicken carved properly pools its juice in the bowl, not on the cutting board.

---

## 5. Equipment

- Roasting pan or heavy oven dish (not too large — excess space causes the drippings to burn)
- Meat thermometer (optional but strongly recommended for the breast: 72–74°C, thigh: 82°C)
- Rack inside the roasting pan if available (air circulation under the bird = crispier skin)
- Basting brush (optional — if you want to add butter during cooking)
- Carving board

---

## 6. Ingredients

*(From seed-recipes.ts — need to verify exact ingredients list, but noting scaling guidelines)*

**Scaling notes (applies to whole chicken recipes):**
- `Whole chicken — scales: fixed, scaling_note: "One chicken = 4 servings. For 8 people, roast two chickens — do not try to substitute one large chicken, as cook time and heat distribution change significantly."*`
- `Butter for under-skin — scales: fixed` — 30–40g is enough regardless of bird size up to 2kg
- `Garlic, thyme — scales: fixed` — aromatics are fixed regardless of chicken weight
- `Salt for dry brine — scales: custom`, scaling_note: *"Use approximately ¾ tsp salt per 500g of chicken weight. Season the breast, thighs, and inside the cavity."*

---

## 7. Mise en Place

*(Day before)*
- Pat chicken completely dry inside and out with paper towel — moisture is the enemy of crispy skin
- Rub ¾ tsp salt per 500g chicken over all surfaces including inside the cavity
- Place on a rack in the fridge, uncovered — the cold dry air finishes desiccating the skin overnight
- Do NOT cover it — covering traps moisture

*(Day of, 1 hour before cooking)*
- Take chicken out of fridge 45 minutes before cooking to temper
- Soften butter and mix with crushed garlic and thyme leaves
- Preheat oven to 230°C (fan 210°C) during the last 20 minutes of tempering

---

## 8. Cook Steps
*(existing steps are strong — adding doneness cues and recovery)*

**Step 1 — Dry brine (overnight)**  
*Existing content correct.*  
**Doneness cue:** "After overnight, the skin should look tight and dry — slightly papery to the touch. The salt will have drawn some moisture and reabsorbed it. This is correct."

**Step 2 — Bring to room temp and preheat (45 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The chicken should feel slightly warmer than room temperature in the thickest part when you press it — not cold."

**Step 3 — Butter under and over the skin**  
*Existing content and why_note correct.*  
**Technique note:** "Slide your fingers between the skin and breast meat starting from the neck end — it separates easily if you push gently. Don't tear through the skin. Push the butter in and massage it across the whole breast from outside."

**Step 4 — Roast high then reduce (15 min at 230°C → 50–60 min at 190°C)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After the full cook: thigh juices run clear when pierced at the thickest point. With a thermometer: 72–74°C in the thickest part of the breast, 82°C in the thigh. The skin should be an even, deep golden-brown — not pale golden."  
**Recovery:** "If skin is colouring too fast before the inside is cooked, tent loosely with foil. If the inside is cooked but skin is pale, increase to 230°C for 5–8 minutes and watch closely."

**Step 5 — Rest (15 min)**  
*Existing content and why_note correct.*  
**Critical:** "15 minutes is not optional — it's not 5 minutes, not 10 minutes. Set a timer and resist. The chicken will still be very hot after 15 minutes — you have not lost anything."

---

## 9. Finishing & Tasting

Carve the chicken and taste a piece of breast without any sauce. It should taste genuinely seasoned all the way through — not just salted on the surface. If it does, the dry brine worked. The skin should shatter slightly when you bite it. The pan drippings are the most flavourful thing in the whole dish — don't pour them away. Deglaze with a splash of water or white wine, scrape up all the fond, and pour it over the carved chicken as a simple jus.

---

## 10. Leftovers & Storage

Roast chicken leftovers are excellent. Cold sliced chicken keeps 3 days refrigerated. Use the carcass for chicken stock — cover with cold water, add a halved onion, carrot, celery, bay leaf, simmer 2 hours. The stock freezes perfectly and is the difference between a good soup and a great one.

---

## Photography Notes

1. The dry-brined chicken after overnight — showing the dry, papery skin before cooking
2. The butter going under the skin — fingers pushing butter under, visible through the skin
3. The chicken in the oven at high heat — showing the skin starting to colour and blister
4. The finished chicken before resting — deep golden-brown skin
5. The rested chicken on the board before carving — showing the intact juices
6. The carved chicken — breast and thigh showing the juice distribution and cooked-through colour

---

## Culinary Audit Entry

```
## perfect-roast-chicken · Perfect Roast Chicken · australian/chicken
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** PASS — Hone Kitchen original. No chef fabricated. No link to verify.
**Cultural origin:** PASS — Australian (universal technique). No contested labelling.
**Substitutions:** PASS — limited substitutions for a straightforward technique recipe. All appropriate.
**Australian English:** PASS — no issues found.
**Voice:** PASS — calm, anticipatory, doneness cues throughout. "This is not optional" on the rest step is correctly firm without being preachy.
**Data fix required:** time_min must reflect overnight brine commitment. At-a-glance must show "14+ hours with overnight brine / 3h with 2h minimum brine."
**Recommendation:** FIX BEFORE SHIP — time display fix required. Content is strong.
```
