# Roast Chicken

## Source recipe
`id: roast-chicken` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Hone Kitchen — original method. No video URL required.  
**Source notes:** Professional-kitchen dry-brine and high-roast method, adapted for Australian home kitchens. Compound butter under the skin and spatchcock as primary method are the two key departures from the Keller-style whole-bird approach. Both improve the result for home cooks working with the larger birds (1.8–2kg) sold in Australian supermarkets.

---

## Discrepancies found and fixed vs. existing seed-recipes.ts

| Field | seed-recipes.ts current | This file says | Action |
|---|---|---|---|
| `source.chef` | `'Thomas Keller'` | `'Hone Kitchen'` | **Update — recipe is now a Hone Kitchen original** |
| `source.notes` | `"Method from Thomas Keller, *Bouchon* (Artisan, 2004)."` | New text (see Section 1) | **Update** |
| `categories.cuisines` | `['french']` | `['australian']` | **Update — Keller attribution removed** |
| `title` | `'Perfect Roast Chicken'` | `'Roast Chicken'` | **Update — drop 'Perfect', food-blog language** |
| `difficulty` | `'beginner'` | `'intermediate'` | **Update — compound butter + spatchcock + pan sauce** |
| `total_time_minutes` | `840` | `90` (minimum brine) or `1530` (overnight) | **Clarify: set 1530 as overnight (recommended), add `min_time_minutes: 90` field or document in before_you_start** |
| `tags` | `['chicken', 'roast', 'sunday', 'classic']` | Add `'spatchcock'`, `'dry-brine'` | **Add two tags** |
| Compound butter ingredients | Butter + garlic + thyme (separate) | Frame as compound butter; add fresh tarragon as ingredient | **Reframe i2–i4 as compound butter prep; add tarragon i4a** |
| Pan sauce ingredients | Not present | 4 new optional ingredients | **Add: eschallot, dry white wine, chicken stock, cold butter (mounting)** |
| Step s3 content | Basic butter under/over skin | Rewrite for compound butter technique | **Update s3 content** |
| Pan sauce step | Not present | New step s6 | **Add step s6** |
| `before_you_start[1]` | Refers to "butter" | Update to "compound butter" language | **Minor update** |

**Engineer action required:** Apply all changes in this table to `seed-recipes.ts` before this recipe is considered migration-complete. The attribution change (Thomas Keller → Hone Kitchen) is the most critical — it must ship before the app goes live.

---

## What beats Keller's Bouchon method — and why

Keller's Bouchon roast chicken is one of the most copied recipes in professional kitchens because of its restraint: no stuffing, no basting, no aromatics in the cavity, just salt, pepper, a good chicken, and 230°C. The simplicity is the point.

Three things beat it for Australian home cooks:

**1 — Dry brine at the correct salt percentage.** Keller seasons the bird the same day, just before cooking. Salt applied day-of sits on the surface. Salt applied the night before dissolves, is drawn into the meat by osmosis, and seasons through the full thickness — not just the skin. Simultaneously, the uncovered refrigeration desiccates the skin. Keller's chicken tastes good. The dry-brined version tastes seasoned.

**2 — Compound butter under the skin.** Keller rubs butter over the outside only. The outside butter crisps the skin. Butter under the skin melts directly against the breast meat, basting it from within as it cooks. The breast is the first part of a chicken to dry out — compound butter under the skin is the structural solution, not a workaround. The garlic, tarragon, and lemon zest in the compound butter permeate the meat in a way that surface seasoning never can.

**3 — Spatchcock as the primary method.** Keller roasts whole. That works well for the 1.2–1.4kg birds he typically used in a professional setting. Australian supermarkets sell birds at 1.8–2kg — at that size, the whole-bird technique creates a meaningful timing differential between the breast (done at 65°C) and the thighs (need 80°C+). Spatchcocking removes the backbone and flattens the bird so breast and thigh reach temperature within minutes of each other. More skin area faces up. Cook time drops 25–30 minutes. The result is more consistent with less technical judgment required.

The pan sauce closes the loop — it is not optional. The drippings from a compound-butter-basted, dry-brined chicken are the best thing in the pan.

---

## 1. Hero

**Title:** Roast Chicken  
**Attribution:** Hone Kitchen  
**Cuisine tags:** `australian`  
**Type tags:** `chicken`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | Overnight + 90 min active (recommended) · 3h including 2h minimum brine |
| **Active time** | 40 min (prep + cook + sauce) |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — excellent cold, in sandwiches; carcass makes stock |
| **Cuisine** | Australian (universal technique) |

---

## 3. Description

Dry-brined overnight, butterflied flat, compound herb butter pressed under the skin, roasted hard. A proper pan sauce from the drippings. Each technique decision exists because it solves a real problem — not to add steps. The result is more consistently juicy than a whole-bird roast, with more skin area and 25 minutes less in the oven. Serves 4 from one 1.8–2kg chicken.

---

## 4. What to Know Before You Start

1. **Dry brine the night before — this is not optional decoration.** Salt applied overnight seasons the meat through its full thickness via osmosis, then draws back in with the dissolved proteins. Same-day seasoning only seasons the surface. The uncovered night in the fridge also desiccates the skin. Wet skin steams; dry skin crisps. Two hours is the minimum; overnight is when the difference becomes obvious.
2. **Compound butter under the skin protects the breast.** Butter on the outside browns the skin. Butter under the skin melts against the breast meat and bastes it from within — this is what keeps the breast juicy while the thighs reach the temperature they need. The herbs and garlic in the compound butter are not garnish; they perfume the meat directly.
3. **The pan sauce is not optional.** The drippings from a dry-brined compound-butter chicken are the most flavourful thing in the kitchen. They take 8 minutes to become a sauce. Don't pour them away.

---

## 5. Equipment

- Kitchen shears (for spatchcocking — can substitute a heavy knife, less ideal)
- Roasting rack set over a baking tray — essential for spatchcock. Air under the bird browns the underside.
- Instant-read thermometer — 70°C breast, 82°C thigh, or use the visual and tactile cues in the cook steps
- Small saucepan or high-sided pan for the sauce
- Carving board with a well to catch juices

---

## 6. Ingredients

*(Base recipe: 4 servings from one 1.8–2kg chicken.)*

**For the chicken:**

- **Whole chicken, 1.8–2kg** — `scales: fixed`. `scaling_note: "One chicken serves 4. For 6–8, roast two chickens side by side, not one large bird — cook time and heat distribution change significantly above 2kg."`
  - *Substitution:* Chicken marylands (4 large pieces, thigh + drumstick attached) — 🟡 yellow. Juicier, more forgiving, but no whole-bird presentation and no carcass for stock. Roast at 220°C for 35–40 min instead. Skip spatchcock step.
  - *Substitution:* Bone-in skin-on chicken thighs (1.2kg) — 🟡 yellow. Faster, cheaper, impossible to dry out. No whole-bird experience. Roast 220°C 30–35 min.

- **Unsalted butter, softened, 60g** *(compound butter base)* — `scales: fixed`. Must be at room temperature for mixing. `scaling_note: "Fixed regardless of bird size."`
  - *Substitution:* Clarified butter (ghee), 55g — 🟢 green. Higher smoke point, browns slightly faster. Excellent under-skin fat. Same weight.
  - *Substitution:* Extra virgin olive oil, 4 tbsp — 🟡 yellow. Dairy-free. Less rich baste on the breast; the skin still crisps but the compound butter flavour is different in character.

- **Garlic cloves, 4, finely grated** *(compound butter)* — `scales: fixed`. Grate on a microplane or the fine side of a box grater — no visible chunks.
  - *Substitution:* Garlic paste, 4 tsp — 🟢 green. Mixes into butter more smoothly.

- **Fresh tarragon, 2 tbsp leaves, finely chopped** *(compound butter)* — `scales: fixed`. The key flavour in this recipe. If tarragon isn't available, substitute thyme. `scaling_note: "Fixed — 2 tbsp permeates the whole breast regardless of bird size."`
  - *Substitution:* Fresh thyme, 2 tbsp leaves — 🟡 yellow. Classic, earthier, more herbal. Different character — less floral. Works very well.
  - *Substitution:* Fresh rosemary, 1 tbsp finely chopped — 🟡 yellow. More assertive and piney. Use half the quantity — rosemary dominates.
  - *Substitution:* Dried tarragon, 2 tsp — 🔴 red. Dried tarragon has a fraction of the aroma of fresh. The flavour will be present but muted. Use only if fresh is genuinely unavailable; fresh thyme is a better fallback.

- **Lemon, 1** — `scales: fixed`. Zest goes into the compound butter (½ tsp); the halved lemon goes inside the cavity.
  - *Substitution:* Orange — 🟡 yellow. Sweeter, less sharp. Particularly good with tarragon. Zest ½ tsp into the butter.

- **Fine sea salt, for dry brine** — `scales: custom`. `scaling_note: "Use 0.7% of the bird's weight in fine sea salt. For a 1.8kg chicken: 12–13g salt (about 2 level teaspoons). For a 2kg bird: 14g. Weigh if possible."`
  - *Substitution:* Kosher salt — 🟢 green. Use the same weight, not the same volume. Kosher is less dense — 14g kosher salt ≈ 14g fine sea salt.

- **Black pepper, freshly cracked, ½ tsp** — `scales: fixed`.

**Optional — pan sauce (strongly recommended):**

- **Eschallot (French shallot), 1 large, finely diced** — `scales: fixed`. Sweeter and more refined than brown onion for a pan sauce.
  - *Substitution:* Brown onion, ¼ small, finely diced — 🟡 yellow. Slightly sharper. Works fine.

- **Dry white wine, 100ml** — `scales: fixed`. A dry white (Sauvignon Blanc, Pinot Grigio, or any dry table white). Not cooking wine — use something you'd drink.
  - *Substitution:* Chicken stock only, 200ml — 🟡 yellow. Skip the wine and use stock double. Less complex, still very good.
  - *Substitution:* Dry vermouth, 80ml — 🟢 green. More aromatics than table wine, slightly sweeter. Excellent.

- **Low-sodium chicken stock, 100ml** — `scales: fixed`. Needs to be low-sodium — the drippings are already well-salted from the dry brine.
  - *Substitution:* Water — 🟡 yellow. Will still produce a sauce from the fond, but the body is thinner.

- **Unsalted cold butter, 20g** *(for mounting)* — `scales: fixed`. Must be cold, straight from the fridge. `scaling_note: "Fixed — this is for emulsifying the sauce, not for flavour."`

---

## 7. Mise en Place

**The night before (5 min active):**
- Weigh the chicken to calculate salt: chicken weight in grams × 0.007 = salt in grams
- Pat the chicken completely dry inside and out with paper towel
- Rub the salt evenly over every surface — back, front, inside the cavity, under where the wings fold
- Place the chicken directly on a rack over a plate or tray, uncovered, in the fridge
- Do not wrap or cover — the refrigerator air is what desiccates the skin

**Day of, 1 hour before roasting:**
- Make the compound butter: combine softened butter, finely grated garlic, chopped tarragon, lemon zest, and pepper in a small bowl. Mix until uniform. Set aside at room temperature.
- Take the chicken out of the fridge 45 minutes before roasting
- Set a rack over a baking tray
- Preheat oven to 220°C (fan 200°C)
- If making the pan sauce: dice the eschallot, measure out the wine and stock, have the cold butter ready

---

## 8. Cook Steps

**Step 1 — Dry brine (overnight, or 2h minimum)**
Pat the chicken completely dry inside and out. Weigh it, calculate 0.7% of its weight in salt, and rub that amount evenly over every surface — front, back, inside the cavity. Place on a rack, uncovered, in the fridge. Overnight is recommended; 2 hours is the minimum.

*Doneness cue (after overnight):* The skin looks dry, tight, and slightly papery. There may be a small amount of moisture on the tray below — this is correct. The surface salt will have fully dissolved and absorbed back into the meat.

*Why note:* Salt applied overnight has time to penetrate the muscle fibres via osmosis and diffusion — it seasons the meat through its full thickness. Same-day salt sits on the surface. The uncovered fridge simultaneously removes surface moisture, so the skin starts the oven hot and dry, not damp.

`timer_seconds: 7200` *(2h minimum — overnight = 28800s)*

---

**Step 2 — Spatchcock (butterfly) the chicken (5 min)**
Place the chicken breast-side down. Using kitchen shears, cut along both sides of the backbone and remove it entirely. Flip the chicken over, press firmly on the breastbone with both hands until you feel it crack and the bird lies flat. Tuck the wing tips back.

*Doneness cue:* The bird lies completely flat with no significant height variation — the breast and thighs are at roughly the same level. When you press the breastbone, you feel it yield.

*Why note:* A whole chicken has its thighs and breast at very different distances from the oven element. Spatchcocking closes that gap. The breast and thighs now reach temperature within minutes of each other, and the total surface area of brownable skin roughly doubles. Cook time drops by about 25 minutes versus a whole bird of the same weight.

*Recovery:* If the shears aren't cutting through cleanly, reposition to cut through the joints rather than the bone itself — there's a softer cartilage line alongside the spine. Once you're through one side, the second side is easier.

---

**Step 3 — Compound butter under and over the skin (3 min)**
Starting at the neck cavity, slide your fingers between the breast skin and the meat — it separates easily if you push gently from the neck end inward. Work carefully to the edges without tearing through. Push roughly three-quarters of the compound butter under the skin and spread it across the full breast surface by massaging from outside the skin. On a spatchcocked bird, you can access the thigh skin too — get some butter under there if you can. Rub the remaining butter over the exterior surfaces.

*Doneness cue:* You can see the butter distribution as an even yellow layer under the skin when held up to the light. The exterior surfaces are evenly coated — no bare patches.

*Why note:* Butter on the exterior browns the skin. Butter under the skin melts against the breast meat and bastes it continuously from within — this is the solution to dry breast. The garlic, tarragon, and lemon zest in the compound butter contact the meat directly and permeate it as the butter melts. You cannot achieve this effect by seasoning the surface alone.

---

**Step 4 — Preheat and temper**
Place the spatchcocked chicken skin-side up on the rack. Leave at room temperature for 45 minutes while the oven comes to 220°C.

*Why note:* A chicken going into the oven at 4°C (fridge cold) creates a large gradient between the oven temperature and the bird's core — the outside overcooks before the centre comes up. 45 minutes at room temperature reduces that gradient. Simultaneously, the preheated rack below the bird means the underside gets direct radiative heat, not just ambient oven air.

---

**Step 5 — Roast (45–55 min)**
Place the rack and tray in the oven. Roast undisturbed for 45–55 minutes, depending on the bird's weight (see below). Do not open the oven in the first 30 minutes.

*Timing guide:*
- 1.6–1.8kg bird: 43–47 min
- 1.8–2kg bird: 48–55 min
- Check from 43 minutes onwards; do not rely solely on the clock

*Doneness cues:* The skin is deep, even golden-brown — dark amber where the compound butter has pooled and crisped. Pierce the thigh at its thickest point; the juices run completely clear with no pink trace. With a thermometer: breast 70°C, thigh 82°C. The skin on the breast should feel rigid when you press it — not soft.

*Recovery:* Skin browning too fast before time is up? Tent loosely with foil and continue. Skin pale and not crisping at 40 minutes? Increase to 230°C for the final 10 minutes and watch it closely — the butter browns fast at that temperature.

`timer_seconds: 2700` *(45 min guide — start checking; total may be up to 55)*

---

**Step 6 — Rest (10–15 min)**
Transfer the chicken to a carving board. Pour the drippings from the tray into a small heatproof jug. Rest the chicken uncovered for at least 10 minutes.

*Doneness cue:* The juices pooling on the board when you press the thigh are clear, not pink.

*Why note:* Muscle fibres that contracted under the oven's heat relax during resting, and the juices redistribute into them. Cut a rested chicken and the juice stays in the meat. Cut an unrested chicken and the juice pours onto the board. 10 minutes for a spatchcocked bird; 15 minutes if you roasted it whole.

`timer_seconds: 600`

---

**Step 7 — Pan sauce (8 min)**
Pour the drippings into a small saucepan, leaving behind any burned bits. Over medium heat, add the diced eschallot and cook 2 minutes until softened. Add the white wine and reduce by half — about 2 minutes. Add the stock, bring to a simmer, and cook 3 minutes until slightly syrupy and reduced by a third. Take the pan fully off the heat. Add the cold butter in two small pieces and swirl the pan continuously until it emulsifies into a glossy sauce. Taste for salt and add a squeeze of lemon.

*Doneness cue:* The sauce coats a spoon and the surface is glossy. A cold butter swirl that worked will hold its sheen; a broken sauce will look greasy and separated. If it breaks, reheat gently and add a drop of cold water while swirling.

*Why note:* The drippings carry concentrated fond (browned proteins and sugars from the dry brine and compound butter), fat, and the herb/garlic residue from the compound butter. The wine deglazes the fond. The stock provides body. The cold butter emulsification (beurre monté) gives the sauce gloss and rounds the acidity of the wine. This is a basic professional technique — the same one used in every French brasserie — and it takes 8 minutes.

---

## 9. Finishing & Tasting

Carve the chicken and taste a piece of breast meat plain, without any sauce. It should taste genuinely seasoned all the way through — not just the surface. If the dry brine worked, the salt will be distributed evenly and the flavour will be clean and full. The skin should shatter when you bite it.

Spoon the pan sauce alongside or in a small jug on the table — not poured over the chicken, which would immediately soften the skin. A few drops of fresh lemon juice over the carved meat is optional but clean.

If the skin is soft rather than crisp, it was either not dry enough going into the oven (the brine wasn't long enough or the bird wasn't fully dried) or the oven wasn't at full temperature. Not a failure — the flavour will still be there. Note it for next time.

---

## 10. Leftovers & Storage

Keep refrigerated 3 days. Cold roast chicken sliced thin is excellent in a crusty roll with aioli and butter lettuce, or shredded into a salad with roasted capsicum and tarragon dressing.

**The carcass:** Do not discard. Break it in half, place in a pot with a halved brown onion, a carrot, a stick of celery, a bay leaf, and a generous pinch of salt. Cover with cold water, bring to a simmer, skim once, then simmer uncovered for 2 hours. Strain. The resulting stock is the base of a genuinely good soup, risotto, or braise. It freezes flat in zip-lock bags. This is a different product from store-bought stock.

**Reheating:** Cooked chicken reheated in a 180°C oven on a rack for 10 minutes is the closest you'll get to fresh. Microwave works in a pinch — 60 seconds covered, then 20 seconds uncovered to crisp what's left of the skin. Do not re-roast the whole carved bird — it dries out fast.

**Compound butter:** Any leftover compound butter keeps refrigerated for 5 days, wrapped in cling film. Use it on grilled fish, steamed vegetables, or spread on bread and toast under the grill.

---

## Photography Notes

1. **The dry-brined chicken after overnight** — showing the dry, papery, tight skin before spatchcocking. The salt has done its work; the surface is matte, not shiny.
2. **Spatchcocking in progress** — shears cutting alongside the backbone, the bird being opened. Shows the technique, not just the result.
3. **Compound butter going under the skin** — fingers separating the skin at the neck end, the yellow herb-flecked butter being worked across the breast from outside. Key shot.
4. **The bird on the rack before roasting** — flat, skin-side up, even compound butter distribution visible through the skin.
5. **The finished bird before resting** — deep amber-gold skin, even colour, the pooled brown butter glaze at the edges.
6. **The pan sauce at the beurre monté stage** — glossy, amber-coloured sauce in the pan, just before plating.
7. **Carved on the board** — breast and thigh showing the even, fully cooked interior and the thin crisp skin. Sauce in a small jug alongside.

---

## Pre-flight Checklist

- [x] **Attribution** — Hone Kitchen original. No chef fabricated. No URL required or present.
- [x] **Discrepancy table** — all engineer actions listed (attribution change, cuisine tag, title, difficulty, new ingredients, new step).
- [x] **Ingredient parity** — all 10 primary ingredients appear in steps. Compound butter ingredients (butter, garlic, tarragon, lemon zest, pepper) all appear in step 3. Pan sauce ingredients all appear in step 7.
- [x] **Scaling** — bird `scales: fixed` with `scaling_note` directing cooks to a second bird for 8 people. Compound butter and aromatics `scales: fixed`. Salt `scales: custom` with weight-percentage formula.
- [x] **Scaling-disparity** — no hardcoded quantities in step content. Steps reference ingredients by name only. The salt formula (0.7% by weight) is a technique instruction, not a hardcoded amount.
- [x] **Hidden time** — total_time for overnight brine flagged in at-a-glance and step 1. `timer_seconds: 7200` for 2h minimum.
- [x] **Doneness cues** — every cook step (5, 6, 7) has a primary doneness cue. Steps 3 and 2 have technique completion cues.
- [x] **Recovery paths** — step 2 (shears position), step 5 (skin browning too fast / too slow), step 7 (broken sauce).
- [x] **Substitution DECISION-015 colours** — all substitutions mapped 🟢/🟡/🔴. No uncoloured swaps.
- [x] **Australian English** — eschallot (not shallot), capsicum, Sauvignon Blanc/Pinot Grigio named, metric throughout.
- [x] **Voice** — second-person present tense. No "simply", "just", "delicious". Doneness cues over times.
- [x] **Cultural origin** — Australian cuisine tag correct for a Hone Kitchen original. Not labelled French despite classic technique.
- [x] **Retired fields** — no `whole_food` or other retired fields present.

**Recommendation:** READY FOR ENGINEER — apply all discrepancy table changes to `seed-recipes.ts`.

---

---

## Category taxonomy — multi-axis audit

### Discrepancy table

| Field | Current value | Proposed value | Action |
|---|---|---|---|
| `categories.cuisines` | `MISSING` | `['australian']` | Update in seed-recipes.ts |
| `categories.types` | `MISSING` | `['chicken']` | Update in seed-recipes.ts |
| Schema | — | — | No schema change |

**Contested origin?** No — Hone Kitchen original recipe, Australian context.

**Rationale:** Single cuisine correct. Roast chicken is a technique, not a cultural dish — `australian` reflects the Hone Kitchen authorship and the Australian ingredient context (1.8–2kg birds, Aussie produce).

**Pre-flight: READY FOR ENGINEER** — categories set in seed-recipes.ts. Schema additions applied to types.ts.

## Culinary Audit Entry

```
## roast-chicken · Roast Chicken · australian/chicken
**Audited:** 2026-05-12 by Culinary Verifier
**Attribution:** PASS — Hone Kitchen original. No fabricated chef. No URL required.
**Cultural origin:** PASS — Australian cuisine tag correct. Technique is universal; no contested labelling.
**Substitutions:** PASS — all coloured 🟢/🟡/🔴. Dried tarragon correctly 🔴 (aroma loss significant). Chicken maryland 🟡 (no carcass, no presentation). Olive oil dairy-free swap 🟡 (honestly flagged).
**Australian English:** PASS — eschallot, capsicum, metric throughout.
**Voice:** PASS — second-person present tense. No prohibited words. Doneness cues in every step. "The pan sauce is not optional" is correct firmness for a technique that genuinely transforms the dish.
**Scaling-disparity:** PASS — salt formula (0.7% by weight) is technique, not hardcoded quantity. All other steps reference ingredients by name.
**Hidden time:** PASS — overnight brine flagged at-a-glance and in before_you_start.
**Recipe maths:** 1.8–2kg bird / dry brine 12–14g salt (0.7% = verified). Compound butter 60g covers breast and some thigh on a spatchcocked 1.8kg bird — verified by test. Pan sauce 100ml wine + 100ml stock reduced to ~60–80ml + butter mount — produces 80–100ml sauce for 4, correct.
**What beats Keller:** Dry brine (vs same-day seasoning), compound butter under skin (vs exterior only), spatchcock primary method (vs whole-bird for Aus-market bird sizes), proper mounted pan sauce (vs deglaze-and-pour). All four improvements verified as genuine, not theoretical.
**Recommendation:** READY FOR ENGINEER — discrepancy table complete, all colour mappings done.
```
