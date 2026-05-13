# Chicken Schnitzel

---

## Category taxonomy — multi-axis audit

### Discrepancy table

| Field | Current value | Proposed value | Action |
|---|---|---|---|
| `categories.cuisines` | `['australian']` | `['australian', 'german']` | Update in seed-recipes.ts |
| `categories.types` | `['chicken']` | `['chicken'] — no change` | No change |
| Schema | — | Add `german` to CuisineId enum — DONE in types.ts | Schema updated — engineer to redeploy |

**Contested origin?** Mild — schnitzel is properly Austrian in origin (Wiener Schnitzel) but has spread across the German-speaking world and become deeply embedded in Australian pub culture. Using `german` as the broader Germanic label is more recognisable to Australian users than `austrian`.

**Rationale:** Both cuisines are genuinely true: the technique and name come from Germanic-speaking Europe; the pub schnitzel culture is distinctively Australian. Multi-category is correct here. Using `german` over `austrian` because it is more commonly understood in the Australian market — the cultural lineage is accurately described in the recipe description.

**Pre-flight: READY FOR ENGINEER** — categories set in seed-recipes.ts. Schema additions applied to types.ts.

## DECISION-015: Substitution Colour Mapping

| Ingredient | Substitution | Old quality | New colour | step_override | Notes |
|---|---|---|---|---|---|
| Chicken breast | Chicken thigh fillets (boneless) | `great_swap` | 🟡 yellow | No | Juicier, more forgiving; irregular shape makes even pounding harder — some thickness variation is unavoidable |
| Chicken breast | Veal escalope | `perfect_swap` | 🟢 green | **Yes — s2** | The original Wiener Schnitzel; same technique; cooks faster |
| Chicken breast | Pork loin steak (pounded thin) | `great_swap` | 🟡 yellow | No | Different protein; same technique; slightly different flavour and texture |
| Brine (fine sea salt) | Sea salt flakes | `perfect_swap` | 🟢 green | No | Same by weight; do not substitute by volume |
| Brine step | Skip entirely | `compromise` | 🔴 red | No | Chicken will be surface-seasoned only; more prone to dryness; different quality result |
| Plain flour | Gluten-free plain flour blend | `good_swap` | 🟡 yellow | No | Slightly different crust texture; crumbs bond slightly less firmly; still works |
| Panko | Fresh white breadcrumbs (day-old sourdough, blitzed) | `great_swap` | 🟡 yellow | No | Coarser, more rustic; excellent result with a different crust character |
| Panko | Dry supermarket breadcrumbs | `good_swap` | 🟡 yellow | No | Tighter, denser crust; the schnitzel works but loses the airiness panko provides |
| Parmigiano Reggiano (in crust) | Pecorino | `great_swap` | 🟡 yellow | No | Sharper, saltier; watch for faster browning in the pan |
| Parmigiano Reggiano (in crust) | Omit | `good_swap` | 🟡 yellow | No | Less flavour complexity in the crust; technique unchanged |
| Lemon (to serve) | Omit | `good_swap` | 🟡 yellow | No | The acid transforms the richness — worth keeping, but the schnitzel is cooked without it |
| Neutral oil | Ghee or clarified butter | `great_swap` | 🟡 yellow | No | Higher smoke point, buttery flavour; reaches target colour slightly faster — watch closely |
| Neutral oil | Light olive oil | `good_swap` | 🟡 yellow | No | Lower smoke point; do not exceed 170°C or it starts to smoke acridly |

**Colour summary:** 2 🟢 · 10 🟡 · 1 🔴

### step_overrides authored

**Veal escalope → step s2 (fry):**
*step_override → s2:* "Veal is thinner and more tender than chicken — it cooks in 2 minutes per side at 175°C, not 3. The crust will reach deep golden colour before a chicken schnitzel would. Use that colour as your cue — remove as soon as both sides are even, deep gold. Do not wait for the same timing as chicken."

---


## 1 · Hero

**Title:** Chicken Schnitzel
**Attribution:** Traditional Australian pub schnitzel — the chicken breast form evolved from the Austrian Wiener Schnitzel tradition, which crossed into the Australian pub canon from the mid-20th century onwards. The key technique (pound thin, bread, shallow-fry) is identical to the original; veal was displaced by the more accessible chicken breast.
**Chef video URL:** none — frame as "Traditional Australian pub schnitzel" until a verifiable chef link is confirmed before launch.
**Cuisine tags:** `australian`
**Type tags:** `chicken`
**Base servings:** 4

---

## 2 · At a Glance

| Field | Value |
|---|---|
| Total time | 35 minutes |
| Active time | 25 minutes |
| Difficulty | Beginner |
| Leftover-friendly | Yes — reheats on a rack in a hot oven |
| Cuisine | Australian |

`total_time_minutes: 35`
`active_time_minutes: 25`
`difficulty: "beginner"`

---

## 3 · Description

The Austrian Wiener Schnitzel crossed into Australian pub culture with a chicken breast in place of veal — leaner, more available, and just as satisfying when the crust is right. Get the oil temperature and the pounding correct and everything else follows.

---

## 4 · What to Know Before You Start

1. **Pound it even.** An unevenly thick breast means one end is dry and rubbery before the other end is cooked. The mallet is not optional — 1–1.5 cm throughout, consistent thickness.
2. **Shake off the flour before the egg. Let the egg drip before the panko.** Excess at each stage creates heavy, doughy patches. The crust should be a thin, even shell, not a shaggy coat.
3. **Oil temperature is the signal, not the clock.** 175°C before the first schnitzel goes in. Too cold and the crumbs absorb oil and go greasy. Too hot and the outside burns before the chicken cooks through.

---

## 5 · Equipment

- Meat mallet or heavy rolling pin (for pounding)
- Cling film or a zip-lock bag (to contain splatter)
- Three shallow dishes or trays (breading station: flour / egg / panko)
- Large heavy-based frying pan — cast iron is ideal; wide stainless steel works; avoid non-stick at this temperature
- Instant-read cooking thermometer
- Wire rack set over a baking tray (rack keeps the base crisp; paper towel traps steam)
- Tongs

---

## 6 · Ingredients

**Chicken breast fillets** — 4 large (approx. 200 g each)
`scales: "linear"`
`scaling_note: "One breast per person. For 6–8, work in batches — don't crowd the pan or the oil temperature drops and the crust goes soggy."`
Substitutions:
- Chicken thigh fillets (butterflied flat): `great_swap` — juicier, more forgiving if oil temp dips. Irregular shape makes it harder to pound perfectly even but still works well.
- Veal schnitzels (100–150 g each, tenderised): `perfect_swap` — the original Wiener Schnitzel form. Firmer texture, milder flavour, faster cook time (2 min per side). Ask a butcher.

**Panko breadcrumbs** — 150 g
`scales: "linear"`
Prep: Japanese-style panko gives a lighter, flakier crust than standard breadcrumbs — this matters.
Substitutions:
- Homemade breadcrumbs from stale white bread (grated on a box grater, dried in a warm oven): `good_swap` — coarser, slightly denser crust. Still very good.
- Fine dried breadcrumbs: `compromise` — tighter, less airy crust. The schnitzel works but it's a step down in texture.

**Plain flour** — 75 g
`scales: "linear"`
Substitutions:
- Cornflour: `good_swap` — slightly crisper, thinner coating; stays crispier longer.
- Rice flour: `good_swap` — same result as cornflour; gluten-free option.

**Eggs** — 2 large
`scales: "linear"`
`scaling_note: "Roughly 1 egg per 2 schnitzels — 3 eggs for 6 portions."`
Prep: Beat until yolk and white are fully combined. Streaky egg wash leaves bare patches in the crust.

**Neutral oil (sunflower, rice bran, or vegetable)** — 500 ml
`scales: "fixed"`
`scaling_note: "Always fill the pan to 3–4 cm depth regardless of serving count. The depth is what matters, not the total volume — use more or less oil depending on pan size, not number of schnitzels."`
Substitutions:
- Lard or tallow: `great_swap` — higher smoke point, crispier crust, more flavour. Traditional in Central European cooking. Ask a butcher.

**Salt and white pepper** — 1 tsp salt, ½ tsp white pepper
`scales: "fixed"`
Prep: Season the chicken directly, not the flour. Seasoned flour over-salts the crust rather than the meat.
Substitutions:
- Black pepper instead of white: `perfect_swap` — visible black flecks in the crust, no flavour difference.

**Lemon** — 2 (quartered, to serve)
`scales: "linear"`
Prep: The acid cuts the richness — don't treat this as garnish.

---

*Optional: Pub-style gravy*

**Brown onion** — 1 large, thinly sliced — `scales: "fixed"`
**Beef or chicken stock** — 500 ml — `scales: "fixed"`
**Plain flour** — 1 tbsp — `scales: "fixed"`
**Unsalted butter** — 20 g — `scales: "fixed"`
`scaling_note: "Gravy scales with the pan, not the number of schnitzels. One batch of gravy serves 4–6 comfortably — it doesn't need doubling unless you want a lot of it."`

---

## 7 · Mise en Place

*(Do all of this before turning on the heat.)*

- Place each chicken breast between two sheets of cling film. Pound with the flat face of a mallet starting at the centre, working outwards — 1–1.5 cm throughout. This takes about 60 seconds of deliberate pounding per breast; don't rush it.
- Pat breasts dry with paper towel. Season directly on both sides with salt and white pepper.
- Set up the breading station in order: **Dish 1** plain flour spread flat / **Dish 2** the beaten eggs / **Dish 3** panko spread flat.
- Set a wire rack over a baking tray next to the hob.
- Pour oil into the pan to 3–4 cm depth. Do not heat yet.
- If making gravy: slice onion, measure stock, have flour and butter ready alongside the hob.

---

## 8 · Cook Steps

### Step 1 — Bread the schnitzels

Lay the breast in the flour and press lightly on both sides. Lift it, hold vertically, give a sharp shake to lose the excess. Lower into the egg, turn once, lift and hold over the bowl for 3 seconds until the drip slows. Lower into the panko, press firmly on both sides and the edges. The pressure adheres the crumbs — you're not just coating, you're bonding.

**Doneness cue:** The coating should look uniform and matte — no shiny egg patches showing through.

**Why note:** Each stage has a job. Flour dries the surface so egg clings. Egg makes the surface tacky so breadcrumbs bond. Too much flour = doughy patches. Too much egg = a soggy inner layer. Too little pressure on the panko = crumbs that fall off in the oil and burn.

**Recovery:** If you see a bare patch, re-dip that area in egg and re-press in the panko before frying.

`photo_url: null`
*(Photography target: three-stage breading station showing the sequence; close-up of schnitzel pressed into panko)*

---

### Step 2 — Fry to golden

Heat the oil over medium-high heat until the thermometer reads 175°C. No thermometer? Drop a pinch of panko in — it should sizzle immediately and turn golden in about 30 seconds, not brown instantly. Lower a schnitzel away from you into the oil. Fry undisturbed for 3 minutes. Lift one edge with tongs to check — when it's deep golden and releases cleanly, flip. Fry a further 2–3 minutes.

**Doneness cue:** Deep, even golden-brown on both sides. Press the centre with a finger (carefully) — raw chicken is soft; cooked chicken is noticeably firmer. If you're unsure, cut into the thickest part — completely white with no pink trace.

**Why note:** 175°C is calibrated so the crust sets in roughly the same time it takes a 1.5 cm breast to cook through. At 160°C the crust absorbs oil before it sets. At 190°C the crumbs burn before the chicken is done. Shallow-frying is more forgiving than deep-frying precisely because the oil surface area is smaller and temperature recovery after adding cold protein is faster.

**Recovery:** Crust darkening too fast? Reduce heat and add a splash of cool oil to drop the temperature. Pale and oily after 3 minutes? Oil temperature has dropped — increase heat and wait 1 minute before checking again.

`timer_seconds: 360`
*(3 min each side — use as a guide, not the primary signal)*
`photo_url: null`
*(Photography target: schnitzel frying in pan, good colour developing on the submerged side visible at the edges)*

---

### Step 3 — Rest and drain

Transfer to the wire rack immediately — do not put on paper towel. Season with a pinch of flaky salt straight from the pan. Rest 2 minutes before plating.

**Doneness cue:** The crust should stay dry and rigid on the rack. If it sags or softens, the crumbs weren't pressed firmly enough — note for next time.

**Why note:** Wire rack lets steam escape from both surfaces. Paper towel traps steam against the base and turns the crust limp within 60 seconds. Salt out of the oil clings to the hot, slightly tacky crust — wait until after resting and it doesn't stick.

`photo_url: null`
*(Photography target: schnitzel on rack, just out of oil, steam rising, crust dry and golden)*

---

### Step 4 (optional) — Pub gravy

Pour off most of the oil, leaving about 1 tbsp in the pan. Over medium heat, cook the sliced onion until soft and golden-brown — 8 minutes. Add the flour and stir for 1 minute until it smells faintly nutty. Add stock in two additions, whisking between each to avoid lumps. Simmer 5 minutes until the gravy coats a spoon. Stir in the butter, taste, and season.

**Doneness cue:** Coats the back of a spoon; a line drawn through it holds for a moment before flowing closed.

**Why note:** The flour browns briefly in the fat before the liquid goes in — this is a quick roux. The nutty smell is the starch beginning to toast. Add liquid before this step and you get raw, floury gravy. The butter at the end (beurre monté) adds gloss and rounds out the flavour.

`photo_url: null`

---

## 9 · Finishing & Tasting

Plate the schnitzels on warmed plates. Two lemon quarters per person. Gravy alongside in a jug or in a pool beside the schnitzel — not poured over the top, which softens the crust.

Taste the schnitzel plain first. It should be savoury and lightly salty. Squeeze lemon over and taste again — the acid transforms it. If it still tastes flat, add a few flakes of salt directly onto the crust before serving.

The crust should shatter cleanly on a fork, not flex. If it flexes, the oil was too cool or the crumbs weren't pressed hard enough. Don't try to fix it at the table — note it for next time.

---

## 10 · Leftovers & Storage

**Storage:** Refrigerate on a rack (not stacked, not in a sealed container with no air) for up to 2 days.

**Reheating:** 180°C oven, on a wire rack, uncovered, 10–12 minutes. Do not microwave — the steam turns the crust to wet cardboard. Do not re-fry — crust goes dark before the centre is warm.

**Cold schnitzel:** Works well in a crusty roll with shredded iceberg, sliced tomato, and mayonnaise. The crust softens but the sandwich is still excellent. This is not a failure state.

**Freezing:** Freeze raw breaded schnitzels between sheets of baking paper. Cook from frozen in 160°C oil, 6–7 minutes per side. Do not freeze cooked schnitzels — the crust disintegrates on thawing.

---

## Audit Notes

**⚠️ Engineer fix — scaling violation in seed-recipes.ts:** The step 0 brine content reads "Dissolve the salt in 1 L of cold water." Change to: "Dissolve the salt in enough cold water to fully submerge the chicken." The original quantity does not scale and breaks the step at 6+ serves. This research file does not include the brine step — if seed-recipes.ts keeps a brine step 0, ensure the content matches the corrected language above.

**Australian English:** Plain flour ✓ · neutral oil ✓ · no US terminology ✓
**Cultural origin:** Australian pub tradition derived from Central European schnitzel — no contested labelling issues.
**Photography priority:** HIGHEST — first shoot weekend target.
Key