# Launch Recipe — Portion Sizing & Scaling Units

> **Owner:** Culinary & Cultural Verifier
> **For:** Senior Engineer (schema / `scale.ts`) and Product Designer (servings selector UI)
> **Status:** Locked for v1.0 launch set, 2026-05-08
>
> This file defines the correct unit, default count, and scaling logic for each of the 15 v1.0 launch recipes. Do not use generic "serves X people" for all recipes — the unit is different for each dish, and the engineer's scaling math must respect the constraints listed here.
>
> A ⚠️ prefix marks where naive multiplication will produce a wrong or dangerous result. These must surface a `scaling_note` in the UI when the user adjusts serving count.

---

## What the fields mean

| Field | Meaning |
|---|---|
| `serving_unit` | The string shown in the UI servings selector (e.g. "burger", "serve", "piece") |
| `base_servings` | The default count when the recipe is first opened |
| `min_servings` | Lowest value the selector should allow |
| `max_servings` | Highest value before a warning appears ("consider making two batches") |
| `make_extra_note` | What "make extra for tomorrow" actually means for this dish — shown when user goes above base |

---

## The 15 launch recipes

---

### 1 · SMASH_BURGER · Smash Burger

```
serving_unit:   "burger"
base_servings:  4
min_servings:   1
max_servings:   8
```

**Scaling logic:**
- Beef patty (120g each): `linear`. 1 patty per burger, always.
- Brioche bun: `linear`. 1 per burger.
- Smash sauce: `custom`. ⚠️ Base recipe makes enough sauce for 6 burgers. For 1–6 burgers, do not scale the sauce. For 7–8 burgers, make 1.5× sauce. `scaling_note: "Sauce makes enough for up to 6 burgers — don't halve it for smaller batches."`
- American cheese (2 slices per burger): `linear`.
- Pickles, onion, lettuce: `linear`.

**Make extra note:** Smash burgers don't reheat — the crust goes soft. Make only what you'll eat immediately. If cooking for more than 4, work in batches: fry 2 patties at a time so the griddle stays screaming hot.

**UI note:** When user goes above 8, show: "For more than 8 burgers, consider working in two sessions — the griddle needs to stay very hot."

---

### 2 · PASTA_CARBONARA · Pasta Carbonara

```
serving_unit:   "serve"
base_servings:  4
min_servings:   1
max_servings:   6
```

**Scaling logic:**
- Pasta (100g per person): `linear`. Strictly 100g dry pasta per serve.
- Eggs: `custom`. ⚠️ Carbonara uses 1 whole egg plus 1 extra yolk per 100g of pasta — not per person as a round number. `scaling_note: "Use 1 whole egg and 1 extra yolk per 100g of pasta — not a round number per person."`
- Guanciale (~80g per serve): `linear`.
- Pecorino Romano: `linear`.
- Black pepper: `custom`. ⚠️ Pepper is ground in quantity and most ends up in the pan, not the dish. Don't double it for double serves. `scaling_note: "Use the same amount of black pepper regardless of serve count — it's ground to taste, not weighed per person."`

**Make extra note:** Carbonara does not store. The emulsion breaks within 30 minutes and the eggs scramble on reheating. Make only what will be eaten immediately — there is no "tomorrow's carbonara."

**UI note:** Cap at 6 serves with a note: "For more than 6 serves, make two separate batches — carbonara's emulsion is fragile at high volumes."

---

### 3 · WEEKDAY_BOLOGNESE · The Weekday Bolognese

```
serving_unit:   "serve"
base_servings:  6
min_servings:   2
max_servings:   12
```

**Why 6, not 4:** Bolognese is a batch cook. A 4-serve bolognese uses a full 500g of mince and one tin of tomatoes — the minimum sensible batch. Making 6 uses the same base and produces useful leftovers. Default 6 is the honest culinary answer.

**Scaling logic:**
- Beef mince: `linear`. 500g for 6, 1kg for 12.
- Soffritto (carrot, celery, onion): `custom`. ⚠️ The soffritto doesn't need to double when you double the mince. `scaling_note: "For double the mince, increase the soffritto by 1.5× not 2× — it's flavour base, not the primary ingredient."`
- Tinned tomatoes: `custom`. ⚠️ Comes in whole tins (400g). 1 tin serves 4–6; 2 tins serves 8–12. Don't ask the user to measure 600g of tinned tomatoes. `scaling_note: "Use 1 tin (400g) for up to 6 serves; 2 tins for up to 12."`
- Red wine: `linear` for the pour; evaporation is the goal, not volume.
- Pasta: `linear` at 100g per serve.

**Make extra note:** This is the recipe to batch cook. Double the mince, use the same pot, freeze in 2-serve portions for up to 3 months. The sauce improves on day 2.

---

### 4 · BUTTER_CHICKEN · Butter Chicken from Scratch

```
serving_unit:   "serve"
base_servings:  4
min_servings:   2
max_servings:   8
```

**Scaling logic:**
- Chicken thighs: `linear`. 150g per person, scaled by weight.
- Marinade (yoghurt, spices, lemon): `custom`. ⚠️ Marinade is a coating, not a sauce. For up to 800g of chicken, the base recipe produces enough marinade. For 1.2kg+, increase by 1.5× not 2×. `scaling_note: "Marinade coats the chicken — for more than 800g, increase by 1.5× rather than doubling."`
- Sauce (tomatoes, cream, butter, spices): `linear`. The sauce scales cleanly.
- Rice: `linear` at 75g dry rice per serve.

**Make extra note:** Butter chicken freezes well (sauce only — the chicken gets overcooked on reheating from frozen). Make a double sauce batch and freeze half before adding the chicken. Reheat sauce from frozen, add freshly cooked chicken.

**UI note:** For 6+ serves, show: "For larger batches, marinate the chicken in two bowls so every piece is evenly coated."

---

### 5 · THAI_GREEN_CURRY · Thai Green Curry

```
serving_unit:   "serve"
base_servings:  4
min_servings:   2
max_servings:   8
```

**Scaling logic:**
- Chicken or protein: `linear`.
- Green curry paste: `custom`. ⚠️ Paste comes in jars. 1 jar (approximately 100–120g of fresh paste) serves 4. For 6, use the same jar plus 2 tablespoons. For 8, use 1.5 jars. Don't tell the user to measure 75g of paste for 3 serves. `scaling_note: "1 jar of paste serves 4. For 2 serves, use half a jar — store the rest in the fridge for up to 2 weeks."`
- Coconut milk: `custom`. ⚠️ Comes in 400ml tins. 1 tin serves 4. For 2, use half a tin. For 6, use 1.5 tins (open a second tin and refrigerate the remainder). `scaling_note: "1 tin of coconut milk (400ml) serves 4. Opened tins keep in the fridge for 3 days."`
- Thai eggplant, bamboo shoots: `linear`.
- Fish sauce, lime, palm sugar: `linear` to taste.

**Make extra note:** Thai green curry keeps 2 days in the fridge and reheats well gently over low heat. Avoid boiling on reheat — coconut milk splits at a rolling boil.

---

### 6 · CHICKEN_SCHNITZEL · Chicken Schnitzel

```
serving_unit:   "schnitzel"
base_servings:  4
min_servings:   1
max_servings:   8
```

**Why "schnitzel" not "serve":** Each schnitzel is made from one chicken breast. The user thinks in schnitzels, not in portions. "4 schnitzels" is immediately clear; "4 serves" is ambiguous (does that mean one schnitzel each, or is one schnitzel shared?).

**Scaling logic:**
- Chicken breast (1 per schnitzel): `linear`. 1 breast per schnitzel, pounded to even 1cm thickness.
- Eggs (for egg wash): `custom`. ⚠️ 2 eggs is enough for 4–6 schnitzels. For 8, use 3 eggs. Don't tell the user to use 0.5 eggs. `scaling_note: "2 eggs is enough egg wash for up to 6 schnitzels. Use 3 eggs for 8."`
- Breadcrumbs: `custom`. ⚠️ Crumbing uses more breadcrumbs than you'd think because they accumulate and clump. For 4 schnitzels, 150g is right. For 8, 250g — not 300g. `scaling_note: "Breadcrumbs accumulate as you work — for 8 schnitzels, 250g is enough, not double the 4-serve quantity."`
- Oil (for frying): `fixed`. The pan needs a fixed depth of oil regardless of how many schnitzels you're cooking. `scaling_note: "Oil depth doesn't change with serve count — keep it at about 1cm in the pan regardless."`
- Lemon, salt: `linear`.

**Make extra note:** Schnitzel reheats better than most fried food. Lay on a wire rack in a 200°C oven for 8 minutes — it comes back crispy. Leftover schnitzel in a sandwich the next day is an institution.

---

### 7 · BEEF_LASAGNE · Beef Lasagne

```
serving_unit:   "serve"
base_servings:  8
min_servings:   4
max_servings:   8
```

**Why 8, not 4:** Lasagne is a tray dish. One baking dish (30×20cm) makes 8 serves — that is the minimum sensible batch. Making "4 serves of lasagne" means making the same dish and eating the rest tomorrow, which is the correct approach. A "4-serve lasagne" that's genuinely smaller is a different dish in a different vessel.

**Critical constraint:** ⚠️ This recipe makes one baking dish. For more than 8 people, make a second baking dish — do not attempt to scale a single lasagne. `scaling_note: "This recipe makes one 30×20cm baking dish. For more than 8 serves, make two dishes — don't scale a single lasagne."`

**Scaling logic:**
- Bolognese (meat sauce): `linear` up to 8 serves. For a second tray, double all bolognese quantities.
- Béchamel: `custom`. Scales with the tray, not with the portion count. If making one tray, use one batch of béchamel regardless of whether you're cutting 6 or 8 pieces. `scaling_note: "One batch of béchamel is enough for one full tray — don't scale it down if you're eating fewer pieces."`
- Pasta sheets: `fixed` per tray. The layers are determined by the tray dimensions, not by serving count. `scaling_note: "Pasta sheets are determined by the tray size, not the number of people — one tray, one set of sheets."`
- Parmesan: `linear` across the top.

**Make extra note:** Lasagne is one of the few dishes that is genuinely better on day 2 — the layers set overnight and the flavour deepens. Make a full tray, eat half tonight, refrigerate the rest for tomorrow. Freezes in portions for up to 2 months.

---

### 8 · ROAST_CHICKEN · Perfect Roast Chicken

```
serving_unit:   "chicken"
base_servings:  1
min_servings:   1
max_servings:   2
```

**Why "chicken" not "serve":** A roast chicken is a whole bird, not a scalable formula. The user decides how many chickens to roast, not how many "serves" of chicken to produce. Scaling from 1 chicken to 2 chickens means buying another bird and fitting both in the oven — not adjusting a recipe.

**Critical constraints:**
- Aromatics (lemon, thyme, garlic in cavity): `fixed` per chicken. One lemon, one head of garlic halved, 4 sprigs — for each bird, regardless of size.
- Olive oil, salt (for the skin): `custom`. ⚠️ Scales with the surface area of the bird, not linearly. A 2kg chicken needs roughly the same rub as a 1.4kg chicken — the surface area doesn't double. `scaling_note: "The rub quantity here is for a 1.4–2kg chicken. Don't adjust for a larger bird — use the same amount."`
- Roasting vegetables (if served alongside): `linear` per bird.

**Cook time scaling:** ⚠️ Cook time is by weight, not by serve count. 20 minutes per 500g at 200°C, plus 20 minutes. This must appear as a note in the step that names the timer, not just in the mise en place. `scaling_note: "Cook time: 20 min per 500g at 200°C, plus 20 min. Weigh the bird and calculate before it goes in."`

**Make extra note:** A second roast chicken means buying a second bird — not adjusting this recipe. If your oven can fit two side by side with air circulation, roast both at once; add 10–15 minutes to the cook time. Leftover roast chicken makes the next day's stock.

---

### 9 · ROAST_LAMB · Roast Lamb with Rosemary & Garlic

```
serving_unit:   "serve"
base_servings:  6
min_servings:   4
max_servings:   8
```

**Why "serve" not "shoulder":** Unlike roast chicken (where you buy another bird), roast lamb shoulders come in a range of sizes from the butcher (1.5kg to 2.5kg+). The user adjusts serve count; the scaling_note tells them what weight to buy.

**Critical constraints:**
- Lamb shoulder: `custom`. ⚠️ The cut is bought to weight, not scaled by recipe. `scaling_note: "For 4 serves: ask for a 1.2–1.5kg bone-in shoulder. For 6: 1.8–2.2kg. For 8: 2.5kg or two smaller shoulders. Tell your butcher the number of people."`
- Rosemary, garlic (for studding): `custom`. ⚠️ Garlic and rosemary stud the meat at roughly 1 clove per 300g — don't double the garlic just because you're doubling serves. `scaling_note: "Use 1 clove of garlic per 300g of lamb for studding — don't scale this linearly with people."`
- Spice rub (cumin, coriander, olive oil): `custom`. Rub covers surface area, not serving count. A 2.5kg shoulder has more surface than a 1.5kg shoulder, but not proportionally. `scaling_note: "For a larger shoulder, increase the rub by 1.3× not 2×. You're coating a surface, not scaling a sauce."`

**Cook time scaling:** ⚠️ Slow-roasted shoulder: 3.5–4 hours at 160°C for up to 2kg. For 2.5kg+, add 30–45 minutes. Always rest for 20 minutes before carving, regardless of size.

**Make extra note:** Cold roast lamb is as good as hot — perhaps better in a flatbread with hummus the next day. If you're feeding 4, roast a 6-serve shoulder deliberately and eat the rest cold. Don't scale down to a smaller cut.

---

### 10 · FISH_AND_CHIPS · Fish & Chips

```
serving_unit:   "serve"
base_servings:  4
min_servings:   2
max_servings:   6
```

**Scaling logic:**
- Fish (barramundi, whiting, or flathead): `linear`. 1 piece of fish per serve, roughly 150–180g per piece.
- Batter: `custom`. ⚠️ Batter is made in a single batch regardless of serve count. The base recipe makes enough batter for 4–6 pieces. For 2 pieces, make the same batch and discard the excess. `scaling_note: "Make the same batter quantity for 2–6 pieces — the batch doesn't halve well. Discard unused batter after frying."`
- Oil (for frying): `fixed`. The pot needs a fixed depth regardless of how many pieces you're frying. A Dutch oven needs at least 6cm of oil to fry properly — this doesn't change with serve count. `scaling_note: "Oil depth is fixed at 6–8cm regardless of how many pieces you're frying — don't scale down the oil for smaller batches."`
- Potatoes (for chips): `linear`. Roughly 2 medium potatoes per serve.

**Critical constraint — frying in batches:** ⚠️ Do not fry more than 3–4 pieces at once. Crowding drops the oil temperature and the batter absorbs oil instead of crisping. For 6 serves, this means two frying sessions. `scaling_note: "Fry in batches of 3–4 pieces maximum regardless of total serve count — crowding ruins the batter."`

**Make extra note:** Battered fish does not store or reheat. Make only what will be eaten immediately. Chips can be held 10–15 minutes in a 150°C oven on a wire rack, but the fish goes soft within 5 minutes of coming out of the oil.

---

### 11 · PAVLOVA · Australian Pavlova

```
serving_unit:   "serve"
base_servings:  10
min_servings:   8
max_servings:   12
```

**Why "serve" not "pavlova":** A pavlova is always made as one disc. The "serves" refers to how many slices you cut. The base recipe makes one pavlova that comfortably serves 8–12 depending on what else is on the table.

**Critical constraint — do not scale down:** ⚠️ Meringue chemistry does not scale down well. If you need less, do not halve this recipe — make the full pavlova and serve fewer slices, or make individual meringue nests (6 egg whites → 6–8 individual nests). `scaling_note: "Do not halve this recipe — meringue chemistry is unforgiving at small volumes. For fewer people, make individual nests using the same quantity."`

**Scaling logic:**
- Egg whites: `fixed` for one pavlova. 6 egg whites. For a second pavlova (serving 20+), double all quantities and use a second tray.
- Caster sugar: `fixed`. 300g. The ratio is 50g caster sugar per egg white — this does not change. `scaling_note: "Caster sugar ratio is 50g per egg white — this is chemistry, not taste. Don't adjust it."`
- Cornflour, white wine vinegar: `fixed`. These stabilise the meringue; amounts are not serving-dependent.
- Cream (for topping): `custom`. ⚠️ The base recipe calls for 600ml of cream for topping — this is the only component that can sensibly scale down. For 8 serves, 400ml is enough. `scaling_note: "For 8 serves, 400ml of cream is enough for the topping. Scale up or down at 50ml per serve."`
- Toppings (passionfruit, strawberries, kiwi): `linear`.

**Make extra note:** Meringue base keeps 2 days unfilled in an airtight container at room temperature. Do not refrigerate the bare meringue — the humidity collapses it. Top with cream and fruit on the day of serving only.

**UI note:** Minimum serves is 8 (the meringue doesn't change). Show a note at 8 serves: "One pavlova serves 8–12 depending on occasion — this recipe always makes one full disc."

---

### 12 · HUMMUS · Hummus from Scratch

```
serving_unit:   "cup"
base_servings:  2
min_servings:   1
max_servings:   4
```

**Why "cup" not "serve":** Hummus is made in a batch and measured in volume, not in portions per person. "2 cups of hummus" is concrete and accurate — it's what comes out of the blender. "Serves 6" as a dip is true but depends entirely on context (is it a starter? a spread? are there other dips?). "Cup" keeps the user focused on what they're making, not on a fictional serve count.

**What 2 cups means:** 2 cups (500ml) of hummus is the base recipe. This is a generous starter for 4–6 people as a dip with bread, or a generous spread for 4 wraps, or a week's worth of lunchbox hummus for one person.

**Scaling logic:**
- Dried chickpeas (200g → ~2 cups hummus): `linear`. Double to 400g chickpeas → ~4 cups hummus.
- Tahini: `custom`. ⚠️ Tahini has a strongly assertive flavour. Don't double it linearly when doubling chickpeas. `scaling_note: "For double the chickpeas, use 1.5× the tahini — doubling it makes the hummus bitter and heavy."`
- Garlic: `custom`. Same principle — assertive. 1 clove for 2 cups; 1.5 cloves for 4 cups. `scaling_note: "Garlic doesn't double linearly. For 4 cups, use 1 large clove not 2 — or add to taste."`
- Lemon juice: `custom`. `scaling_note: "For double the batch, use 1.5× lemon juice not 2×. Add the last squeeze to taste."`
- Ice water: `custom`. Added to texture, not to formula — always added gradually. `scaling_note: "Add cold water 1 tablespoon at a time until you reach the texture you want, regardless of batch size."`
- Olive oil (for drizzle): `linear`.

**Make extra note:** Hummus keeps 5 days refrigerated in an airtight container. Always bring to room temperature before serving — cold hummus is stiff and flat in flavour. A double batch takes almost no additional effort and the second cup keeps the week.

---

### 13 · CHICKEN_SHAWARMA · Home Oven Chicken Shawarma

**Confirmed 2026-05-08: chicken shawarma ships in v1.0. `LAMB_SHAWARMA` stays in the seed file flagged `not_yet_shipping` and is a candidate for v1.2. A new `CHICKEN_SHAWARMA` recipe const needs to be authored — see engineer handoff in `handoffs.md`.**

```
serving_unit:   "serve"
base_servings:  4
min_servings:   2
max_servings:   8
```

**Scaling logic:**
- Boneless chicken thighs: `linear`. ~200g per serve (thighs render down during cook).
- Shawarma marinade (spices, garlic, lemon, yoghurt, olive oil): `custom`. ⚠️ Marinade is a coating. Base recipe covers ~800g of chicken. Above 1.2kg, scale by 1.5× not 2×. `scaling_note: "Marinade coats the chicken — for more than 800g, increase by 1.5×. Doubling it wastes marinade and dilutes the spice concentration per piece."`
- Flatbreads: `linear`. 1 per serve.
- Garlic sauce / toum, pickles, tomato (for serving): `linear`.

**Make extra note:** Cold shawarma shredded into a wrap with pickles and tahini is excellent the next day. Chicken keeps well for 3 days refrigerated. The marinade can be applied up to 24 hours in advance — the spice penetration only improves overnight.

---

### 14 · PAD_THAI · Pad Thai

```
serving_unit:   "serve"
base_servings:  2
min_servings:   1
max_servings:   4
```

**Why 2, not 4:** Pad Thai is a wok dish with a hard capacity constraint. You cannot make pad Thai for 4 people in a single wok session without destroying the dish — the temperature drops, the noodles steam instead of fry, and you lose the characteristic texture and breath of the wok (wok hei). The honest answer is 2 serves maximum per wok session. If you want 4, do two sessions.

**Critical constraint — batch cooking:** ⚠️ 2 serves maximum per wok session. For 4 serves, do two wok sessions back-to-back. `scaling_note: "Pad Thai must be cooked in batches of 2 serves maximum. For 4 people: complete one batch, hold it briefly in a warm oven (60°C), cook the second batch, and serve together. Each session takes 8 minutes."`

**Scaling logic:**
- Rice noodles: `linear`. 100g dry per serve.
- Protein (prawns or chicken): `linear`.
- Eggs: `linear`. 1 egg per serve.
- Pad Thai sauce (tamarind, fish sauce, palm sugar): `linear` up to 4 serves. `scaling_note: "The sauce scales linearly. Mix the full quantity before you start — you won't have time to measure while the wok is hot."`
- Bean sprouts, spring onion, peanuts: `linear`.
- Oil: `fixed` per batch. A screaming-hot wok needs the same amount of oil whether you're cooking 1 or 2 serves. `scaling_note: "Oil quantity is per wok session, not per serve. Use the same amount for 1 or 2 serves."`

**Make extra note:** Pad Thai does not reheat well — noodles go gummy and the texture is lost. Make only what will be eaten immediately. If cooking for 4, the two-session approach (8 minutes × 2, one person eats first while you cook the second) is genuinely the correct way to serve pad Thai for a group.

---

### 15 · FALAFEL · Falafel

```
serving_unit:   "piece"
base_servings:  24
min_servings:   12
max_servings:   48
```

**Why "piece" not "serve":** Falafel is made and eaten by the piece — a serving of falafel is 4–6 pieces as a starter or 6–8 pieces as a main with salad and hummus. The user should know how many pieces they're making, not how many "serves" (which is ambiguous). A base batch of 24 pieces feeds 4 people generously as a main with accompaniments.

**Critical constraint — dried chickpeas only:** ⚠️ Tinned chickpeas will not work for falafel. The falafel will fall apart in the oil because tinned chickpeas have absorbed too much water during canning. This is not a compromise — it is a structural failure. The chickpeas must be soaked overnight from dried. `scaling_note: "Falafel requires dried chickpeas soaked overnight. Tinned chickpeas have too much moisture and the falafel falls apart in the oil — not a swap, a structural failure."`

**Scaling logic:**
- Dried chickpeas (200g → ~24 pieces): `linear`. 200g = 24 pieces. 400g = 48 pieces.
- Baking powder: `custom`. ⚠️ Baking powder does not scale linearly. Over-leavening causes falafel to crack and fall apart in the oil. `scaling_note: "For 200g chickpeas: 1 tsp baking powder. For 400g: 1.5 tsp — not 2 tsp. Over-leavening causes falafel to crack."`
- Herbs (parsley, coriander): `linear`.
- Spices (cumin, coriander, cayenne): `linear`.
- Garlic, onion: `custom`. ⚠️ These are pungent at high volume. For a double batch, increase by 1.5× not 2×. `scaling_note: "For a double batch, use 1.5× the garlic and onion — their flavour is assertive and doesn't need to double."`
- Oil (for frying): `fixed`. A pot needs a minimum depth of oil regardless of batch size. `scaling_note: "Oil depth is fixed — you need at least 8cm of oil in the pot regardless of batch size. Don't skimp on oil for a smaller batch."`

**Make extra note:** Uncooked falafel mixture keeps 1 day refrigerated. Cooked falafel freezes well for 1 month — reheat from frozen in a 200°C oven for 8 minutes (not the microwave, which makes them dense). A batch of 48 falafel takes almost no more effort than 24 — make a double batch and freeze half.

---

### 16 · FLOUR_TORTILLAS · Flour Tortillas

**Added per DECISION-013, 2026-05-08.**

```
serving_unit:   "tortilla"
base_servings:  13
min_servings:   6
max_servings:   26
```

Base recipe (200g flour) yields ~13 taco-sized tortillas (~12–13cm). Each ball is ~29g of dough. For larger wrap-size tortillas (20cm), use 50–55g balls — same dough, ~7 tortillas per batch.

**Scaling logic:**
- Bread flour, 200g: `scales: linear`. `scaling_note: "Each tortilla needs ~15g of flour. To scale: multiply 200g by (desired tortillas ÷ 13). Scale all other ingredients by the same factor."`
- Unsalted butter, 40g: `scales: linear`. `scaling_note: "Scale linearly. Butter must be softened (room temperature), not melted — melted butter doesn't coat the flour evenly. Lard is the traditional substitute and produces a slightly flakier result at the same weight."`
- Water, 130ml: `scales: linear`. `scaling_note: "The hydration ratio is fixed. Do not adjust water to compensate for sticky dough — stickiness resolves with kneading."`
- Fine sea salt, 6g: `scales: linear`.

**Make extra note:** "+N tortillas — reheat in a dry pan in 15–20 seconds with no quality loss. Make a double batch (26 tortillas from 400g flour) if you are feeding a group or want leftovers across 2–3 days. Refrigerate in an airtight bag; freeze between layers of baking paper for up to 2 months."

**Designer note:** This recipe produces a countable item, not portions of a shared dish. The selector should show "13 tortillas" not "serves 13". The "make extra" toggle is appropriate and active — tortillas store and reheat without quality loss.

---

## Summary table — engineer quick reference

| Recipe const | `serving_unit` | `base_servings` | `min` | `max` | Key constraint |
|---|---|---|---|---|---|
| `SMASH_BURGER` | burger | 4 | 1 | 8 | Sauce fixed for ≤6 burgers |
| `PASTA_CARBONARA` | serve | 4 | 1 | 6 | Eggs by pasta weight (1+1/100g), not per serve |
| `WEEKDAY_BOLOGNESE` | serve | 6 | 2 | 12 | Tinned tomatoes are whole-tin discrete |
| `BUTTER_CHICKEN` | serve | 4 | 2 | 8 | Marinade coats to ~800g; scales 1.5× above that |
| `THAI_GREEN_CURRY` | serve | 4 | 2 | 8 | Paste and coconut milk are whole-jar/tin discrete |
| `CHICKEN_SCHNITZEL` | schnitzel | 4 | 1 | 8 | Egg wash fixed for ≤6; breadcrumbs accumulate |
| `BEEF_LASAGNE` | serve | 8 | 4 | 8 | One tray only; double means second tray |
| `ROAST_CHICKEN` | chicken | 1 | 1 | 2 | Cook time by weight (20 min/500g + 20 min) |
| `ROAST_LAMB` | serve | 6 | 4 | 8 | Cut size drives serves; ask butcher, not recipe |
| `FISH_AND_CHIPS` | serve | 4 | 2 | 6 | 