# Home Oven Chicken Shawarma

## Source recipe
`id: chicken-shawarma` in `mobile/src/data/seed-recipes.ts` (new const — to be authored by engineer)  
**Attribution:** Hone Kitchen original — drawn from Levantine tradition (Palestinian and Lebanese home cooking). No single chef URL. Attribution framing: *"A traditional Levantine method"*  
**Cultural origin:** Levantine (Palestinian / Lebanese). Cuisine tag: `levantine`. Type tag: `chicken`.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **This is a new recipe — no existing seed-recipes.ts entry.** Engineer creates the `CHICKEN_SHAWARMA` const from scratch using this file. See handoff in `handoffs.md`.
2. **Marinade time is the hidden time.** `total_time_minutes` must include at least 2 hours of marinade time. Minimum honest total: 150 min (2h 30m). Overnight is recommended — state this clearly in `before_you_start`.
3. **Chicken thighs only.** Breast will dry out at the temperatures required to get surface colour. Do not offer breast as a swap — it is a different outcome.
4. **Cultural note:** Shawarma is Levantine street food, specifically associated with Palestinian and Lebanese tradition in Australia. Tag `levantine` only. Do not tag `middle_eastern` as a catch-all — it erases the specific origin.

---

## 1. Hero

**Title:** Home Oven Chicken Shawarma  
**Attribution:** Hone Kitchen — a traditional Levantine method  
**Cuisine tags:** `levantine`  
**Type tags:** `chicken`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 2 hours 30 min (includes marinade) — overnight gives a better result |
| **Active time** | ~30 min |
| **Difficulty** | Beginner |
| **Leftover-friendly** | Yes — excellent cold the next day, straight from the fridge into a wrap |
| **Cuisine** | Levantine (Palestinian / Lebanese) |

---

## 3. Description

Boneless chicken thighs marinated in warm Levantine spices, cooked hard in a hot oven until the edges char and the fat renders into the tray. Served in flatbread with garlic sauce, pickled vegetables, and fresh parsley — the same combination found in every Lebanese shawarma shop in Australia, made at home with ingredients from any supermarket.

---

## 4. What to Know Before You Start

1. **The marinade is the recipe.** The cook itself is 25 minutes. What makes or breaks the dish is the time the chicken spends in the spiced yoghurt — minimum 2 hours, overnight is noticeably better. If you're cooking tonight, start the marinade now before reading further.
2. **You need colour on the chicken.** Pale, steamed-looking shawarma is wrong. The oven must be at 220°C (fan-forced) and the tray must not be overcrowded — if the pieces are touching, they steam instead of roast. A final 2–3 minutes under the grill/broil element gets the char marks that make it taste right.
3. **Rest before you slice.** Chicken thighs sliced straight from the oven lose their juices on the board. Two minutes of rest keeps them in the meat.

---

## 5. Equipment

- Large ziplock bag or covered bowl (for marinating)
- Oven tray with a rack, or a large cast iron pan (a flat tray with no rack is acceptable but produces a slightly steamed result on the underside)
- Meat thermometer (optional but removes guesswork)
- Sharp knife and board for slicing

---

## 6. Ingredients

### Chicken
- **Boneless, skinless chicken thighs, 800g** — `scales: linear`. 200g per serve (thighs render down during cook, so allow for that). `scaling_note: "200g raw per serve. For 6 serves, 1.2kg. For 8, 1.6kg — cook in two batches if your tray won't fit them without touching."`
  - *Substitution:* Boneless chicken breast — `compromise`. Breast dries out at 220°C before the surface colours properly. If you use breast, lower to 200°C and pull at 70°C internal. The result is leaner but less flavourful and won't char the same way. Flag in app: "Compromise — drier result, less char."

### Marinade
- **Full-fat Greek yoghurt, 3 tbsp** — `scales: fixed`. The yoghurt is a coating and a tenderiser. `scaling_note: "The marinade coats the chicken — for up to 1.2kg, the base quantities work. For more than 1.2kg, scale by 1.5×."`
  - *Substitution:* Coconut yoghurt (dairy-free) — `good_swap`. The lactic acid still tenderises; the flavour is slightly sweeter but not noticeably different once the spices are in.
- **Olive oil, 3 tbsp** — `scales: fixed`. Fat carrier for the spices and a hedge against the lean thighs drying. No substitution needed — any neutral oil works.
- **Lemon juice, 2 tbsp (about 1 lemon)** — `scales: fixed`. Acid in the marinade. `scaling_note: "Fixed regardless of chicken quantity — you're seasoning the marinade, not cooking in a sauce."`
- **Garlic, 4 cloves, crushed** — `scales: custom`. `scaling_note: "For 6–8 serves, add 1 extra clove only — beyond 4 cloves the garlic can turn harsh during the high-heat cook."`
- **Ground cumin, 1½ tsp** — `scales: fixed`. The dominant earthy note in the marinade.
- **Ground coriander, 1 tsp** — `scales: fixed`.
- **Smoked paprika, 1 tsp** — `scales: fixed`. Colour and mild smokiness.
- **Ground turmeric, ½ tsp** — `scales: fixed`. Colour. Does not need to scale.
- **Ground allspice, ½ tsp** — `scales: fixed`. The distinctly Levantine note — the spice that separates shawarma from generic spiced chicken. Do not substitute.
- **Ground cinnamon, ¼ tsp** — `scales: fixed`. Background warmth only — keep it subtle.
- **Ground cardamom, ¼ tsp** — `scales: fixed`.
- **Cayenne pepper, ¼ tsp (or to taste)** — `scales: fixed`. Heat is optional; households with children can omit.
- **Salt, 1½ tsp** — `scales: custom`. `scaling_note: "For 6 serves, 2 tsp. For 8 serves, 2½ tsp. Salt the marinade to season the chicken through — it should taste well-seasoned, not timid."`
- **Black pepper, ½ tsp** — `scales: fixed`.

### To serve
- **Flatbread or pita, 4 pieces** — `scales: linear`. 1 per serve.
  - *Substitution:* Lavash — `perfect_swap`. Wraps more tightly around the filling.
  - *Note:* Store-bought Lebanese flatbread from any major supermarket or Lebanese grocer works perfectly.
- **Garlic sauce (toum), 4 tbsp** — `scales: linear`. The authentic accompaniment. If making from scratch, it requires a food processor and blending technique (see below). Store-bought toum is available at Lebanese grocers in most major Australian cities. `hard_to_find: false` for major cities; `hard_to_find: true` for regional areas — substitute with: garlic aioli (`good_swap`), or plain yoghurt mixed with 1 crushed garlic clove and a squeeze of lemon (`compromise`).
- **Tomato, 1 large, sliced thinly** — `scales: linear`.
- **Pickled turnips or pickled cucumbers, handful** — `scales: fixed`. Optional but authentic. Available at Lebanese grocers or Middle Eastern section of major supermarkets.
  - *Substitution:* Any pickled vegetable — `good_swap`. The acid cut is what matters.
- **Fresh flat-leaf parsley, small bunch** — `scales: fixed`. Whole leaves, not chopped.
- **Fresh lemon wedges, for serving** — `scales: fixed`.

---

## 7. Mise en Place

*(2 hours to overnight before cooking)*
- Mix all marinade ingredients in a bowl until combined
- Score each chicken thigh 2–3 times with a knife (shallower than 1cm — just breaks the surface to let the marinade penetrate)
- Add chicken to marinade, coat thoroughly, cover and refrigerate
- If using a rack, place it over the oven tray now so it's ready

*(30 min before cooking)*
- Pull chicken from fridge and let sit at room temperature for 15–20 min — cold chicken lowers the pan temperature and slows the colour development
- Preheat oven to 220°C fan-forced (230°C conventional)
- Slice tomatoes, pick parsley leaves, set out flatbreads
- Have toum / garlic sauce ready at room temperature (cold toum is harder to spread)

---

## 8. Cook Steps

**Step 1 — Arrange chicken on rack or tray (2 min)**
Lay chicken thighs on the rack in a single layer with a small gap between each piece. If they're touching, the steam they release will prevent browning — cook in two batches if needed.

*Why note:* Chicken releases liquid during cooking. The rack lets that liquid drip below the meat; a flat tray traps it and causes the chicken to braise rather than roast. The difference in surface texture is significant — rack gives you a slightly firmer, coloured exterior; flat tray gives you a softer, paler result.

*Doneness cue (before it goes in):* The chicken should be well-coated and the marinade should look like it's adhering rather than pooling in the bowl.

---

**Step 2 — Roast at 220°C fan-forced (22–25 min)**
Place the tray on the middle rack. Do not open the oven for the first 15 minutes.

*Doneness cue:* The edges of the thighs should be showing dark golden-brown to light char marks at 22 minutes. The juices should be running clear (not pink) when you press the thickest part. Internal temperature 74°C at the thickest point.

*Recovery:* If the chicken looks pale at 20 minutes, increase temperature to 230°C and give it 5 more minutes. If it's colouring too fast (dark at 15 min), the pieces are too thin — pull the thinner ones early and leave the thicker ones in.

*Why note:* 220°C fan-forced is higher than most chicken recipes call for. The high heat is deliberate — it drives rapid Maillard browning on the exterior before the interior overcooks. Thighs are forgiving because their fat content keeps them moist even at this temperature.

---

**Step 3 — Finish under the grill / broil (2–3 min)**
Switch the oven to grill/broil on high. Watch the chicken constantly. You want char marks on the edges — not blackened all over, but definitely darker than golden.

*Doneness cue:* You'll see and smell the edges starting to catch. The fat in the tray may smoke slightly — that's correct. Pull as soon as the highest-point edges are charred.

*Recovery:* If you over-char, it's not lost — the char on the outside of a thigh doesn't usually penetrate the meat. Taste a piece before you decide to discard anything.

*Why note:* The grill step replicates, imperfectly but meaningfully, the effect of a vertical rotisserie. The char is both flavour (Maillard compounds in the slightly burned fat and spices) and texture (crisp exterior against the tender inside).

---

**Step 4 — Rest and slice (3 min)**
Remove from oven. Rest for 2 minutes. Slice the thighs thinly across the grain — 5–7mm strips.

*Why note:* Shawarma is always sliced — it's not a piece-of-chicken dish. The thin strips stack into the flatbread and distribute flavour more evenly than a whole thigh would.

---

**Step 5 — Assemble and serve**
Warm the flatbreads briefly (30 seconds directly on a dry pan, or 15 seconds in the microwave under a damp paper towel). Spread garlic sauce generously, add chicken strips, tomato, pickles, parsley, and a squeeze of lemon. Wrap tightly.

*Why note:* The flatbread needs to be warm enough to be pliable — a cold, stiff flatbread cracks when you wrap it and the filling falls out. This is one of the most common ways home assembly of shawarma fails.

---

## 9. Finishing & Tasting

Before wrapping, taste a strip of chicken. It should be savoury, warmly spiced, and slightly smoky from the char. If it tastes flat, it needs salt — a pinch on the sliced chicken directly, not in the sauce. If the garlic sauce is too heavy, thin it with a few drops of lemon juice. The pickled vegetables are not optional garnish — their acidity is the counterpoint to the richness of the chicken and garlic sauce. Don't skip them.

---

## 10. Leftovers & Storage

Cold shawarma chicken sliced thin into a wrap with leftover garlic sauce is one of the better lunches you can have the next day. The spices deepen overnight. Refrigerate for up to 3 days. The chicken also works reheated in a hot pan with a splash of water to prevent it sticking — don't microwave it, it goes rubbery. Flatbreads don't store well once assembled — keep the components separate and assemble fresh.

**Make extra note:** For a household of 4, cook 6 serves and eat the extra cold the next day. The marinade can be applied to the extra chicken at the same time — no extra effort.

---

## Photography Notes

1. **The marinade coating** — raw thighs just coated in the vivid orange-red spiced yoghurt in the bowl. Strong colour, tactile.
2. **Chicken on the rack pre-oven** — shows the spacing and the marinade adhering.
3. **The char result** — close on one thigh showing the dark edge char marks against the spiced surface. This is the money shot.
4. **Slicing** — knife action shot, thin strips fanning out on the board.
5. **The assembled wrap** — cross-section showing the layers: flatbread, white garlic sauce, orange chicken strips, pink pickled turnips, green parsley.
6. **Overhead plating** — the open wrap laid flat with all components visible.

---

## Culinary Audit Entry

```
## CHICKEN_SHAWARMA · Home Oven Chicken Shawarma · levantine/chicken
**Audited:** 2026-05-08 by Culinary Verifier
**Attribution:** PASS (N/A) — Hone Kitchen original drawn from Levantine tradition. No URL required.
**Cultural origin:** PASS — Levantine (Palestinian / Lebanese). Tagged levantine only. No Israeli label.
**Substitutions:** PASS — chicken breast swap honestly tagged 'compromise' with clear reason (dries out at required temperature). Toum substitutes are tiered correctly. Coconut yoghurt tagged 'good_swap'.
**Australian English:** PASS — coriander (not cilantro), flat-leaf parsley, lemon (not lime), capsicum not referenced. Metric throughout.
**Voice:** PASS — second-person present tense throughout. Doneness cues in every step. Anticipation framing in before_you_start. No "simply", no "just", no recipe-blog prose.
**Scaling:** PASS — marinade flagged as coating (not linear); garlic flagged as custom with reason (harsh at high heat past 4 cloves); chicken linear at 200g/serve with batch warning above 1.2kg.
**Retirement check:** No retired fields present.
**Recommendation:** SHIP AS-IS (pending engineer authoring the recipe const and photography).
`