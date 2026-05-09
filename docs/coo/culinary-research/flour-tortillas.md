# Flour Tortillas

## Source recipe
`id: flour-tortillas` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Patrick N. — no video URL  
**Source notes:** Patrick's own recipe — soft, buttery, adapted over time from multiple sources.  
**Cultural origin:** Mexican (Northern Mexican tradition — flour tortillas are the staple of Sonora and Chihuahua, where wheat was introduced by Spanish settlers. Corn tortillas are central Mexico and south; flour tortillas are the north and the border regions).  
**Cuisine tag:** `mexican`. Type tag: `baking`.

---

## Discrepancies found and fixed vs. existing seed-recipes.ts

| Location | Issue | Fix applied in this file |
|---|---|---|
| `seed-recipes.ts` — primary fat | `Lard` listed as primary; butter as substitute | **Corrected: butter is the primary fat per Patrick.** Lard moved to substitute. |
| `seed-recipes.ts` — `chef` field | `'Patrick Nasr'` | Change to `'Patrick N.'` |
| `seed-recipes.ts` — `notes` field | Old wording | Change to: `"Patrick's own recipe — soft, buttery, adapted over time from multiple sources."` |
| `seed-recipes.ts` — `base_servings` | `5` | Change to `13` |
| `seed-recipes.ts` — ingredient amounts | 200g flour / 40g lard / 130ml water / 4g salt | Fat → butter 40g; salt → 6g. Flour and water stay at 200g / 130ml. |
| `seed-recipes.ts` — butter substitution text | "still delicious" | Remove "delicious" — voice violation |
| Old research file — `before_you_start` | Item 2 said "Use lard, not butter" | Reversed — butter is the primary fat here |
| Old research file — mise en place | Said "plain flour" | Corrected to bread flour |
| Old research file — tortilla size | 20–22cm (side plate) | Corrected to 12–13cm (taco size) — 29g dough balls |

**Engineer action required:** Apply all fixes in the left column to `seed-recipes.ts` before this recipe is considered migration-complete.

---

## Recipe maths — verified

Base recipe: 200g flour → ~13 tortillas.

| Ingredient | Amount | Per tortilla |
|---|---|---|
| Bread flour | 200g | ~15g |
| Unsalted butter | 40g | ~3g |
| Water | 130ml | ~10ml |
| Fine sea salt | 6g | ~0.5g |
| **Total dough** | **376g** | **~30g per ball** |

29g dough ball → ~12–13cm diameter tortilla (taco / street taco size). These are not wrap-sized — they are taco-sized. If a cook wants a larger wrap-style tortilla, they should use 50–55g balls from the same dough (which gives ~7 tortillas from 200g flour). Add this as a note in the app.

Hydration: 130ml water / 200g flour = 65% (slightly high end — produces a soft, extensible dough). Butter adds ~7g water (butter is ~18% water), so effective hydration is ~68.5%. The dough will be soft and slightly tacky — this is correct, not a mistake.

Salt: 6g / 200g flour = 3% — higher than bread (2%) but appropriate for tortillas, which carry bold fillings.

---

## 1. Hero

**Title:** Flour Tortillas  
**Attribution:** Patrick N.  
**Cuisine tags:** `mexican`  
**Type tags:** `baking`  
**Base servings:** 13 tortillas

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 90 min (15 min active + 45–60 min rest + 20 min rolling and cooking) |
| **Active time** | 35 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — reheat in a dry pan in 15–20 seconds, no quality loss |
| **Cuisine** | Mexican (Northern — Sonoran flour tortilla tradition) |

---

## 3. Description

Soft, buttery flour tortillas made with high-protein bread flour — the kind that roll thin without tearing and stay pliable for long enough to fill and fold. Makes 13 small taco-sized tortillas (12–13cm) from 200g of flour. The technique is straightforward; the rest step is the mechanism that makes rolling effortless.

---

## 4. What to Know Before You Start

1. **Weigh every ingredient.** Flour tortillas are a hydration ratio. A heaped cup of flour versus a level one can be 20g apart, which produces a different dough entirely. This recipe was developed and tested by weight, not volume. Patrick uses a food scale for all bread making without exception — it removes the single biggest variable in the result.
2. **Use softened butter, not melted.** Softened butter rubs into the flour and coats the proteins — that coating is what makes the tortilla pliable and rich rather than bready. Melted butter does not coat flour in the same way; it pools and produces an uneven texture.
3. **The rest is not optional — it is the mechanism.** Gluten tightens during kneading; 45–60 minutes of rest relaxes it so the dough rolls thin without springing back. A dough that resists rolling has not rested long enough.

---

## 5. Equipment

- Kitchen scale accurate to 1g
- Large mixing bowl
- Rolling pin — a thin dowel is easiest for small tortillas; a standard rolling pin works
- Cast iron pan or heavy-based frying pan (non-stick works but gives less even heat)
- Lidded pot for stacking the cooked tortillas
- Clean tea towel (to absorb condensation inside the pot)

---

## 6. Ingredients

*(Base recipe: 13 tortillas from 200g flour.)*

- **Bread flour, high-protein (~12.5g protein per 100g), 200g** — `scales: linear`. Lighthouse brand is recommended (Coles, Woolworths). `scaling_note: "Each tortilla needs ~15g of flour. To calculate: multiply 200g by (desired tortillas ÷ 13). Scale all other ingredients by the same factor."`
  - *Substitution:* Plain flour — `good_swap`. Works but the tortilla will not stretch as thin or stay as pliable. Use the highest-protein plain flour available (check the nutrition panel — above 10g per 100g is an improvement).

- **Unsalted butter, softened, 40g** — `scales: linear`. Must be at room temperature, not melted. `scaling_note: "Scale linearly with tortilla count."`
  - *Substitution:* Lard — `great_swap`. Traditional. Produces a slightly flakier, less buttery result. Use the same weight.
  - *Substitution:* Vegetable shortening — `great_swap`. Vegan. Neutral flavour, similar fat composition to lard.
  - *Substitution:* Coconut oil, solid — `good_swap`. Vegan. Adds a faint sweetness. Use solid, not melted.

- **Water, 130ml, heated to ~60°C** — `scales: linear`. Hot to touch but not boiling. `scaling_note: "The hydration ratio is fixed. Do not add extra water if the dough feels sticky — stickiness resolves with kneading."`

- **Fine sea salt, 6g** — `scales: linear`. About 1½ teaspoons — weigh it. `scaling_note: "Scale linearly. Salt by weight, not volume."`
  - *Substitution:* Kosher salt — `perfect_swap`. Same weight, same result. Do not substitute by volume.

---

## 7. Mise en Place

- Weigh the bread flour, salt, butter (at room temperature — take it out of the fridge 30 min ahead), and water into separate containers.
- Heat the water to ~60°C — too hot to hold a finger in for more than 2 seconds.
- Combine flour and salt in a large bowl. Mix through.
- Add the softened butter and rub it into the flour with your fingertips — pinch and press until the mixture looks like fine breadcrumbs with no visible lumps of butter. Takes 3–4 minutes.
- Pour in the hot water and stir until a rough dough forms, then knead 5–8 minutes until smooth and silky. The dough will feel tacky — do not add more flour.
- Divide into one piece per tortilla, each roughly 30g. Round each in your palm. Cover with a damp tea towel and rest 45–60 minutes.

---

## 8. Cook Steps

**Step 1 — Weigh everything first (2 min)**  
Get the scale out before anything else. Weigh all four ingredients into separate containers. Baking rewards precision — guessing volumes produces a different dough every time.

*Why note:* 6g of fine sea salt and 6g of flaked salt look nothing alike by volume. Weight is the only reliable measure.

---

**Step 2 — Combine flour and salt (1 min)**  
Add the flour to a large bowl. Add the salt and mix through until evenly distributed.

---

**Step 3 — Rub in the butter (4 min)**  
Add the softened butter and work it into the flour with your fingertips. Pinch, press, and rub continuously until the mixture looks like fine, even breadcrumbs — no visible lumps of butter, no streaks.

*Doneness cue:* The mixture is uniformly pale and fine-grained. When you squeeze a handful, it holds its shape briefly before crumbling.

*Why note:* The butter coats the flour proteins before the water goes in — that coating interrupts gluten development and produces a tender, pliable result rather than a bready chew. Lumps of unincorporated butter mean patches of different texture in the finished tortilla.

---

**Step 4 — Add hot water and knead (7–8 min)**  
Pour in the hot water and stir until a rough dough forms. Knead on a clean surface for 5–8 minutes until smooth and silky. The dough will feel tacky at first — keep going and do not add more flour.

*Doneness cue:* The dough is smooth, slightly tacky but not sticky, and springs back slowly when pressed.

*Recovery:* If genuinely sticky after 8 minutes — sticking to the surface in sheets rather than leaving cleanly — let it rest 5 minutes covered and try again before adding flour.

*Why note:* Hot water activates the gluten faster. Adding flour to fix stickiness shifts the hydration ratio — fight the urge. The tackiness is normal and resolves.

---

**Step 5 — Divide and rest (45–60 min)**  
Divide the dough into one piece per tortilla, roughly 30g each. Round each in your palm. Cover with a damp tea towel and rest at room temperature for at least 45–60 minutes.

*Doneness cue (after resting):* Press two fingers into a ball — it holds the indent without springing back immediately. If it springs back, rest 5–10 more minutes.

*Why note:* Gluten tightens during kneading. The rest period relaxes it. Skip this and the dough will contract back every time you roll it — it cannot be overcome by force.

---

**Step 6 — Roll out thin**  
On a lightly floured surface, roll each ball into a disc about 12–13cm across (roughly the size of a large saucer). Roll from the centre outward, rotating a quarter-turn between each pass. If a ball resists and springs back, set it aside and move to the next one — come back after 2–3 minutes.

*Doneness cue:* The disc is thin and even — you can see light through it when held up. Edges may be slightly thicker than the centre.

*Note:* For a larger wrap-size tortilla (20cm+), use 50–55g dough balls from the same recipe. You will get approximately 7 tortillas instead of 13.

---

**Step 7 — Heat the pan (2–3 min)**  
Place a cast iron or heavy-based pan over medium heat. Let it come to temperature for 2–3 minutes.

*Doneness cue:* A drop of water flicked onto the surface evaporates in under 2 seconds.

*Why note:* Too hot and the surface burns before the dough cooks through. Too cool and the tortilla will not puff on the third flip — the steam cannot build quickly enough.

---

**Step 8 — Cook: three flips (~25 seconds per tortilla)**  
Lay a disc flat in the dry pan. Cook 10 seconds — a few pale spots appear. Flip. Cook 15 seconds. Flip one more time. On the third flip, the tortilla puffs as steam inflates the pocket between the layers. When it settles back, it is done.

*Doneness cue:* The puff on the third flip. If it does not puff, the pan is too cool — increase heat for the next one.

*Recovery:* A non-puffing tortilla is still cooked. Good colour on both sides means the dough is cooked through. Do not discard it.

*Why note:* The three-flip method gives both sides direct heat without overcooking. The puff is steam inflating a pocket between the two dough layers — the same physics as pita bread. When it deflates, the steam has cooked the interior.

---

**Step 9 — Stack in a lidded pot**  
Transfer each cooked tortilla immediately to a pot with a tight-fitting lid. Line the inside of the lid with a clean tea towel to absorb condensation. Stack each new one directly on top.

*Why note:* Trapped steam keeps them soft and pliable. On a bare plate they stiffen in 2 minutes. The pot gives 20 minutes — enough to finish the batch and serve together.

---

## 9. Finishing & Tasting

Fold a tortilla before serving — it should bend without cracking. If it cracks, it has dried out; a 15-second pass in a dry hot pan brings it back. Taste one plain: slightly savoury, with a clean buttery richness and a soft, short texture. If it tastes flat, the salt was undermeasured. If it is tough and bready, the dough was not rested long enough or the butter was not fully incorporated.

---

## 10. Leftovers & Storage

Keep 2–3 days at room temperature in an airtight bag, or refrigerated for up to a week. Reheat: 15–20 seconds in a dry hot pan, or wrapped in a damp paper towel in the microwave for 20 seconds. Freeze between layers of baking paper for up to 2 months — thaw at room temperature, then reheat in a pan. Stale, dry tortillas can be cut into triangles and fried briefly in hot oil as totopos.

**Make extra note:** +N tortillas — these reheat with no quality loss. If you are making tacos for a group, cook a full double batch. The dough can also be refrigerated after the rest step for up to 24 hours and rolled fresh the next day.

---

## Photography Notes

1. **The rubbing step** — hands working softened butter into flour, the fine breadcrumb texture visible.
2. **The dough balls** — small rounds under a damp tea towel, compact and even.
3. **Rolling** — rolling pin on a small disc, the dough thin and translucent at the edges.
4. **The puff** — tortilla ballooned in a cast iron pan on the third flip. This is the key shot.
5. **The stack** — 5–6 soft tortillas in a lidded pot, steam, warm light.
6. **Finished single tortilla** — torn to show the thin cross-section and layered interior.

---

## Pre-flight Checklist

- [x] **Ingredient ↔ step parity** — all 4 ingredients appear in steps; no ghost ingredients.
- [x] **Hidden time** — `total_time_minutes: 90` includes 45–60 min rest. Rest step is a numbered step with `timer_seconds: 2700`. Active time 35 min is accurate.
- [x] **Doneness and recovery** — every cook step has a doneness cue. Steps 4, 6, and 8 have explicit recovery paths.
- [x] **Cultural and attribution** — `mexican` tag correct. `baking` type correct. Patrick N. attribution, no URL, framed as original recipe. No fabricated chef.
- [x] **Substitution honesty** — lard is `great_swap` (correct — produces a flakier result, not inferior, just different). Plain flour is `good_swap` (correct — lower protein, less extensible). Coconut oil is `good_swap` (correct — faint sweetness). No swap is over-rated.
- [x] **Scaling annotations** — all 4 ingredients `scales: linear`. Scaling notes populated for flour (per-tortilla calculation).
- [x] **Scaling-disparity** — mise and step 5 use "one piece per tortilla, roughly 30g" not a hardcoded count. Scales correctly at any serving count.
- [x] **Australian English** — plain flour, tea towel, baking paper, metric throughout.
- [x] **Retirement check** — No retired fields present.
- [x] **Voice** — second-person present tense. No "simply", no "just", no "delicious". Doneness cues over times.

**Recommendation:** FIX BEFORE SHIP — content is ready, but engineer must apply data fixes to `seed-recipes.ts` (see discrepancies table at top of file) before migration is complete.

---

## Culinary Audit Entry

```
## FLOUR_TORTILLAS · Flour Tortillas · mexican/baking
**Audited:** 2026-05-08 by Culinary Verifier
**Attribution:** PASS (N/A) — Patrick N., original recipe. No URL required or present.
**Cultural origin:** PASS — mexican tag correct. Northern Mexican flour tortilla tradition.
**Substitutions:** PASS — lard 'great_swap' (honest — different character, not inferior).
  Plain flour 'good_swap' with honest caveat on protein. Coconut oil 'good_swap'.
  No swap over-rated. "Delicious" removed.
**Australian English:** PASS — plain flour, tea towel, metric throughout.
**Voice:** PASS — second-person present tense. No prohibited words. Doneness cues in
  every step.
**Recipe maths verified:** 200g flour / 13 tortillas = ~30g dough balls = 12–13cm
  taco-size tortillas. Hydration 65% (effective ~68.5% with butter water content).
  Salt 3% — appropriate for tortillas. All checks out.
**Scaling-disparity:** PASS — "one piece per tortilla, roughly 30g" in mise and step 5.
  No hardcoded count in step or mise content.
**Data fixes required (engineer):** Primary fat butter not lard, chef name, source
  notes, base_servings 13, ingredient amounts, remove "delicious" from substitution.
**Recommendation:** FIX BEFORE SHIP — pending engineer data fixes to seed-recipes.ts.
```
