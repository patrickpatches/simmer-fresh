# Smash Burger

## Source recipe
`id: smash-burger` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/watch?v=oa2g6gB_1BU`  
**⚠️ Verification required:** Confirm URL is live and points to his smash burger video.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **WHOLE FOOD CLAIM — RESOLVED ✅ (Patrick 2026-05-06)**
   `whole_food_verified: true` → **REMOVE**. Patrick's rule: whole_food_verified only applies to completely unprocessed meals. American cheese is processed. Remove the claim.
   **Engineer action:** Set `whole_food_verified: false` (or remove the field) on `smash-burger`.
   **Note for Engineer:** Apply Patrick's rule across the entire seed library — audit every recipe with `whole_food_verified: true` and remove the flag wherever any ingredient is processed (sauces with additives, canned goods with preservatives, processed cheese, commercial condiments, etc.). Only dishes made entirely from unprocessed whole ingredients should carry the flag.

2. **Description references "London kitchen"**
   Description currently in seed data doesn't mention this but the description could be improved with Australian context.

3. **Attribution verification:** Confirm URL before ship.

---

## 1. Hero
**Title:** Smash Burger  
**Attribution:** Andy Cooks (verify link before ship)  
**Cuisine tags:** `american`  
**Type tags:** `burgers`, `beef`  
**Base servings:** 2

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 20 min |
| **Active time** | 20 min |
| **Difficulty** | Easy (but requires cast iron or heavy steel) |
| **Leftover-friendly** | No — eat immediately |
| **Cuisine** | American (diner) |

---

## 3. Description
*(existing tagline good — "The crispy-edged diner classic")*  
Add: "A smash burger is not a recipe, it's a technique — one that produces a crispier, beefier result than any other method. 80/20 mince, very hot iron, smashed thin, single flip. Everything else is condiment."

---

## 4. What to Know Before You Start

1. **Cast iron or heavy steel is not optional.** Non-stick pans can't reach the temperature this needs and will warp. A cheap non-stick at maximum heat is also a PFOA risk. If you don't own cast iron, a stainless steel frying pan works — just heat it longer.
2. **80/20 beef only.** The fat is not flavour in the background — it's the crust. Lean mince has no fat to render into a crispy lace. If your mince says "extra lean" or anything above 90/10, don't use it for this.
3. **Season outside only, right before cooking.** Salt on the ball draws moisture to the surface, which kills the crust. Season the outside of the ball, in the pan, immediately before smashing.

---

## 5. Equipment

- Cast iron skillet or heavy carbon steel pan (minimum 26cm)
- Flat, rigid spatula (a fish slice or burger spatula — not a slotted one)
- Baking paper (a small square — goes between spatula and patty)
- Burger press or flat-bottomed heavy pan (alternative to spatula for the smash)

---

## 6. Ingredients
*(existing data is correct — scaling notes to add)*

**Scaling notes:**
- `Beef mince 80/20, 200g, scales: linear` — correct. At 2 serves: 200g = 2x100g balls = 2 patties. scaling_note: *"100g per patty. For a double patty (smash-stack), use 2x100g balls per bun — don't increase to 200g per ball or you lose the smash technique."*
- `Burger buns, 2, scales: linear` — correct (already fixed in seed data with code comment).
- `American cheese slices, 2, scales: linear` — correct. 1 slice per patty.
- `White onion, 30g, scales: linear` — correct. scaling_note: *"Dice as fine as you can — raw onion on a burger needs to be small enough to eat without biting through a large chunk."*
- `Dill pickles, 4 slices, scales: linear` — correct.
- `Burger sauce, 2 tbsp, scales: linear` — correct (already fixed in seed data from 'fixed').
- `Salt, ½ tsp, scales: linear` — correct.

---

## 7. Mise en Place

- Weigh and roll the beef into 100g balls — don't overwork, just enough to form a rough sphere. Set on a plate. Do NOT pack tightly.
- Mix burger sauce (mayo, ketchup, mustard — adjust ratios to taste)
- Slice pickles, dice onion finely
- Have baking paper squares cut and ready (1 per patty)
- Slice the buns (don't pre-toast — this happens in the pan)
- Cast iron on maximum heat now — it needs 3 full minutes to get hot enough

---

## 8. Cook Steps
*(existing steps are excellent — strong why_notes throughout. Adding doneness cues only)*

**Step 1 — Ball and season**  
*Existing content correct.*  
**Doneness cue:** "The ball should hold together loosely — you're not making a rissole. If it's packed tight, it won't smash properly and will spring back."

**Step 2 — Get the pan screaming (3 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "Hold your hand 10cm above the pan — it should be uncomfortable in under a second. If you see smoke coming off a dry pan, it's there."  
**Safety note:** "Ventilation on. This will smoke. That's correct."

**Step 3 — Smash hard and hold (10 sec)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The patty should be about 1cm thick and 12–14cm across. You should hear aggressive sizzling the moment it hits the pan — if it's quiet, the pan isn't hot enough."

**Step 4 — Cook and cheese (90 sec + 45 sec)**  
*Existing content and why_note correct.*  
**Doneness cue:** "Before flipping: the edges should be brown and lacy, the top matte and grey (no raw pink). The crust will release from the pan on its own when it's ready — if it's sticking, wait 15 more seconds."  
**Recovery:** "If the cheese isn't melted after 45 seconds on the second side, cover the pan with a lid for 10 seconds — the trapped steam finishes it instantly."

**Step 5 — Toast the bun (30–45 sec)**  
*Existing content correct.*  
**Doneness cue:** "Cut side golden-brown with some darker spots where the fat hit it. Not pale; not burnt."

**Step 6 — Stack and serve**  
*Existing content correct.*  
No changes needed — "eat within 2 minutes" is the right call.

---

## 9. Finishing & Tasting

There is no finishing. Stack it, eat it. The crust softens with every minute that passes and cannot be recovered. If you're making multiple burgers, cook them in sequence and eat as they come — don't hold them warm in an oven. The whole point of a smash burger is that 30-second window when the crust is still shatteringly crisp.

---

## 10. Leftovers & Storage

No. A smash burger is not a leftover. The crust becomes chewy within 10 minutes and cannot be revived. Make only what you'll eat.

---

## Photography Notes

1. The smash — spatula pressed down on ball with baking paper, showing the smashing action
2. The crust forming — close-up of the edge with the lacey brown crust visible
3. The flip — showing the crust side (the money shot: deep mahogany-brown patty face)
4. The cheese melt — American cheese melting into glossy translucence over the patty
5. The assembled burger — cross-section showing layers: bun, sauce, pickle, onion, patty, cheese, top bun

---

## Culinary Audit Entry

```
## smash-burger · Smash Burger · american/burgers/beef
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Andy Cooks with specific YouTube URL. URL not yet verified live.
**Cultural origin:** PASS — American diner. No contested labelling.
**Substitutions:** PASS — lean beef correctly flagged 'compromise'. Cheddar cheese correctly flagged 'compromise' (inferior melt). Honest throughout.
**Whole-food claim:** FLAG — 'whole_food_verified: true' but American cheese slices are processed. Patrick to decide: remove claim or note whole-food version uses cheddar.
**Australian English:** PASS — no issues.
**Voice:** PASS — urgent, short steps match the fast cook. "Eat immediately" is 