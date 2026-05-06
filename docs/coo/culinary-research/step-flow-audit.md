# Chef's Step-Flow Audit — All Recipes

**Completed:** 2026-05-06  
**Scope:** All 39 recipes in `mobile/src/data/seed-recipes.ts`  
**Method:** Direct line-by-line read of every recipe's `steps[]` array, cross-referenced against `ingredients[]` and `prep` fields. Applied a chef's standard: does a user with no prior knowledge of this dish have everything they need, in the right order, without being ambushed by missing steps or hidden prep time?

---

## Summary — Issues Found

| # | Recipe | Issue | Severity | Type |
|---|---|---|---|---|
| 1 | chicken-adobo | "Serve over rice" but rice never prepared in recipe | HIGH | Missing step |
| 2 | roast-chicken | time_min: 90 hides overnight dry brine | HIGH | Timing (already flagged Batch 2) |
| 3 | sourdough-loaf | "Rest 1 hour before cutting" buried in why_note only | HIGH | Missing step |
| 4 | ramen | Chashu pork listed as ingredient, no prep step | HIGH | Missing step |
| 5 | beef-rendang | Kerisik making (toast + pound) is a real cooking step, exists only as ingredient prep field | HIGH | Missing step |
| 6 | curry-laksa | Tofu listed as "pan-fried until golden" but no cook step fries it | HIGH | Missing step |
| 7 | butter-chicken | time_min: 90 hides 4-hour minimum marinade | HIGH | Timing (already flagged Batch 2) |
| 8 | saag-paneer | video_url is channel homepage, not a recipe video — Golden Rule 1 violation | HIGH | Attribution |
| 9 | barramundi | time_min: 20 hides mandatory 30-min skin-drying step | HIGH | Timing |
| 10 | pavlova | time_min: 150 understates actual time (~3h 10–40 min) | HIGH | Timing |
| 11 | musakhan | Pine nuts listed as "toasted" in ingredients but no step toasts them | MEDIUM | Missing step |
| 12 | kafta | s5 references "sumac onions" never made; no sliced onion in serving ingredients | MEDIUM | Missing step + missing ingredient |
| 13 | pad-thai | Steps say "add protein" without differentiating tofu-first timing (tofu needs more time than prawns) | MEDIUM | Step content |
| 14 | nasi-lemak | Dried chillies need 20-min pre-soak before s1 starts; no step or timing alert | MEDIUM | Advance prep |
| 15 | beef-rendang | Dried chillies need 20-min pre-soak before s1 starts; no step or timing alert | MEDIUM | Advance prep |
| 16 | curry-laksa | Prawn stock volume used in s4 unclear; instruction is buried in why_note of s1 | MEDIUM | Step content |
| 17 | saag-paneer | "Serve with basmati rice or naan" but neither appears in ingredients and no step prepares them | MEDIUM | Missing step |
| 18 | chicken-katsu | Rice (i19) has no cook step; s5 says "fan over steamed rice" | MEDIUM | Missing step |
| 19 | barramundi | Asparagus (i9) has prep note "Blanched 2 minutes" but no step covers blanching | MEDIUM | Missing step |
| 20 | pavlova | Room-temperature egg white requirement (i1) not addressed in s1 | MEDIUM | Advance prep |
| 21 | thai-green-curry | "vegetables" named generically in s4 — Thai eggplant not named | LOW | Step content |
| 22 | braised-short-ribs | s2 (sear all sides, 15–20 min) missing timer_seconds | LOW | Missing timer |
| 23 | nasi-lemak | Belacan listed as "toasted" in ingredient prep but no step toasts it | LOW | Missing step |
| 24 | curry-laksa | Rice vermicelli soak and bean sprout blanch are in ingredient prep only, not in steps | LOW | Advance prep |
| 25 | char-kway-teow | Noodle room-temp requirement only in ingredient prep; not flagged before the 4-min cook | LOW | Advance prep |
| 26 | char-kway-teow | Sauce ingredients (soy, kecap manis, fish sauce, white pepper) not flagged for pre-mixing | LOW | Advance prep |
| 27 | chicken-katsu | Cabbage dressing (rice wine vinegar) in ingredient prep only, no step | LOW | Missing step |
| 28 | flour-tortillas | Rolling (s7) and pan-heating (s8) could be concurrent but not flagged | LOW | Efficiency |

**Recipes with no issues (clean):** smash-burger, pasta-carbonara, beef-stew, hummus, fattoush, prawn-tacos, sourdough-maintenance, risotto, fish-tacos, french-onion-soup, braised-short-ribs (except timer), beef-wellington, dal, scrambled-eggs, weekday-bolognese, aglio-e-olio, mujadara, sheet-pan-harissa-chicken, egg-fried-rice, lamb-shawarma, tom-yum.

---

## Recipe-by-Recipe Detail

### SMASH_BURGER ✅
Steps flow correctly. Tight, urgent, well-ordered. No issues.

---

### CHICKEN_ADOBO ⚠️ HIGH
**Issue — s4 "Serve over rice" — rice never prepared.**  
s4 content: "Serve immediately over steamed white rice." Rice is not in the ingredients list and no step cooks it. A user who doesn't own a separate rice cooker has no instruction.  
**Fix:** Either (a) add a parallel step for rice with its own timing (start rice at beginning of s2 — the braise takes 35 min, which is enough), or (b) add a "serve with" note explicitly labelling rice as a separately prepared side and pointing to the Egg Fried Rice or similar recipe for method.

---

### PASTA_CARBONARA ✅
Steps flow correctly. Emulsification technique is well-explained. No issues.

---

### BEEF_STEW ✅
Steps flow correctly. Long braise, timing is accurate. No issues.

---

### ROAST_CHICKEN ⚠️ HIGH (already flagged Batch 2)
**Issue — time_min: 90 hides overnight dry brine.**  
s1 is "Dry brine the day before" — a 24-hour commitment. Discovery screen shows 90 min.  
**Fix:** Update time_min to reflect total commitment with brine (1440 min / overnight), or split into prep_time_min and cook_time_min fields.

---

### MUSAKHAN ⚠️ MEDIUM
**Issue — pine nuts listed as "toasted" but no step toasts them.**  
Ingredient i9: `{ name: 'Pine nuts, toasted', amount: 60, unit: 'g' }`. s4 says "Scatter toasted pine nuts" but there is no instruction for toasting them.  
**Fix:** Add to s4: "Toast pine nuts in a dry pan 2–3 minutes over medium heat, tossing constantly, until golden. Watch them — they burn in 30 seconds past golden." Or add as a mise en place instruction in a step.

---

### KAFTA ⚠️ MEDIUM
**Issue — s5 references "sumac onions" that are never made.**  
s5 content: "Add thinly sliced raw onion tossed with sumac." There is no `onion` ingredient for serving, and no step makes this. The ingredient list has `i10: 'Sumac, for serving'` only.  
**Fix:** (a) Add `{ id: 'i11', name: 'White onion, thinly sliced', amount: 1, unit: 'small', scales: 'linear', prep: 'For serving — toss with sumac' }` as an ingredient, and update s5 to include the instruction: "Toss thinly sliced raw onion with sumac and set aside while kafta rests."

---

### HUMMUS ✅
Steps flow correctly. No issues.

---

### FATTOUSH ✅
Steps flow correctly. No issues.

---

### PRAWN_TACOS_PINEAPPLE ✅
Steps flow correctly. No issues.

---

### SOURDOUGH_MAINTENANCE ✅
Steps flow correctly. No issues.

---

### SOURDOUGH_LOAF ⚠️ HIGH
**Issue — "Rest 1 hour before cutting" is buried in a why_note only.**  
s5 why_note: "Rest 1 hour before cutting — the crumb continues cooking via carry-over heat." This is critical instruction. A user who cuts immediately will get a gummy, underbaked crumb. It must be a discrete step.  
**Fix:** Add s6: `{ id: 's6', title: 'Rest — do not cut yet', content: 'Transfer to a wire rack and leave uncovered for at least 1 hour before cutting. The interior continues cooking via residual heat and the crumb structure is still setting. A loaf cut at 20 minutes looks gummy and wet, even if the crust sounds hollow. This wait is part of the bake.', timer_seconds: 3600 }`.

---

### RISOTTO ✅
Steps flow correctly. No issues.

---

### FISH_TACOS ✅
Steps flow correctly. No issues.

---

### THAI_GREEN_CURRY ⚠️ LOW
**Issue — "vegetables" named generically in s4.**  
s4 content: "Add remaining coconut milk... fish sauce, sugar, vegetables." The primary vegetable ingredient is Thai eggplant (i4) — unnamed in the step. Minor clarity issue.  
**Fix:** Change "vegetables" to "Thai eggplant (and any additional vegetables)" so the user knows what they're putting in and when.

---

### FRENCH_ONION_SOUP ✅
Steps flow correctly. No issues.

---

### PAD_THAI ⚠️ MEDIUM
**Issue — steps don't differentiate tofu-first requirement.**  
Following Patrick's decision and the chef recommendation (tofu is a co-ingredient alongside prawns), s3 must specify: fry tofu first (longer cook time), then add prawns. Current s3 says "Add protein to the wok edge" without differentiation.  
**Fix:** Update s3 to: "If using tofu: fry the tofu cubes first, 2–3 minutes until lightly golden at the edges, then push to the side. Add prawns and cook until just pink — about 60–90 seconds. The tofu needs more time than the prawns; adding them together overcooked the prawn by the time tofu is done."  
Note: This is linked to the substitution data fix already documented in `pad-thai.md`.

---

### BRAISED_SHORT_RIBS ⚠️ LOW
**Issue — s2 (sear all sides) missing timer_seconds.**  
Searing 1.2kg of short ribs in batches on all sides takes 15–20 minutes. Every other step in this recipe has a timer. This step is the longest of the prep steps.  
**Fix:** Add `timer_seconds: 1200` to s2 (20 minutes is realistic for this volume of meat in batches).

---

### RAMEN ⚠️ HIGH
**Issue — chashu pork listed as an ingredient with no prep step.**  
i7: `'Chashu pork belly (or roasted pork)'` listed as 100g. s5 adds "pork" as a topping. Chashu is a 2-hour preparation (marinate, tie, braise in soy/mirin/sake, rest, slice). There is no step in this recipe that makes it.  
**Fix options (in order of preference):**  
(a) Replace ingredient with `'Roasted pork shoulder, sliced (or store-bought char siu)'` — a no-prep option with a note that links to the smash-technique;  
(b) Add a note in i7 prep field: "Make chashu ahead — see [standalone recipe]. Or substitute with store-bought char siu from a Chinese BBQ shop.";  
(c) Add s0: "Make the chashu (day before, if possible)" with a link to the method, clearly labelled as make-ahead.  
Option (b) is the minimum fix; option (c) is the correct one.

---

### BEEF_WELLINGTON ✅
Steps flow correctly. Advance prep (resting, searing, building the Wellington) well-documented. No issues.

---

### DAL ✅
Steps flow correctly. No issues.

---

### SCRAMBLED_EGGS ✅
Steps flow correctly. No issues.

---

### WEEKDAY_BOLOGNESE ✅
Steps flow correctly. No issues. (Attribution issue already flagged Batch 2.)

---

### AGLIO_E_OLIO ✅
Steps flow correctly. No issues.

---

### MUJADARA ✅
Steps flow correctly. No issues.

---

### SHEET_PAN_HARISSA_CHICKEN ✅
Steps flow correctly. No issues.

---

### EGG_FRIED_RICE ✅
Steps flow correctly. No issues.

---

### LAMB_SHAWARMA ✅
Steps flow correctly. (time_min issue already flagged Batch 2. Description issue already flagged.)

---

### NASI_LEMAK ⚠️ MEDIUM + LOW
**Issue 1 — MEDIUM — Dried chillies need 20-min pre-soak; not flagged before s1.**  
s1 says "Blend soaked dried chillies, red onion, garlic, and toasted belacan." The soaking (20 minutes in boiling water) must happen before Step 1 can begin. No step or timing note alerts the user.  
**Fix:** Add before s1 (or as an opening note): "Start here: Put dried chillies in a heatproof bowl and cover with boiling water. They need 20 minutes to soften. Start the soak before any other prep." Alternatively, restructure s1 to open with this.

**Issue 2 — LOW — Belacan listed as "toasted" in ingredient but no step toasts it.**  
Ingredient prep says "Toasted" but no step toasts the belacan. A user who doesn't know this ingredient won't know to do this.  
**Fix:** Add to s1 content: "First, toast the belacan: place on a piece of foil and toast under the grill or in a dry pan for 1–2 minutes per side until fragrant. It will smell very strong — this is correct."

---

### BEEF_RENDANG ⚠️ HIGH + MEDIUM
**Issue 1 — HIGH — Kerisik making is a real cooking step, not just ingredient prep.**  
i3 prep: "Toast desiccated coconut in a dry pan until deep golden, then pound in mortar — releases coconut oil and gives the rendang its distinctive nutty paste." This is a 10–15 minute active process that requires hot pan, constant stirring to avoid burning, and physical pounding. It exists only as an ingredient prep note. s5 simply says "stir in the kerisik" with no prior step making it.  
**Fix:** Add a dedicated step between s4 and s5: "Make the kerisik: In a dry pan over medium heat, toast the desiccated coconut, stirring constantly, for 8–10 minutes until deep golden — not brown, not pale. It goes from pale to burnt very fast in the last two minutes. Transfer to a mortar and pound until oily and paste-like — the coconut oil will release and the texture will go from dry to clumping. This is the kerisik." (Or can be done concurrently during the 2-hour braise — add a note to s4 that kerisik can be made during this window.)

**Issue 2 — MEDIUM — Dried chillies need 20-min pre-soak; not flagged before s1.**  
i6 prep: "Soaked in boiling water 20 min, drained — for paste." s1 immediately uses the soaked chillies. No step or timing note tells the user to start the soak.  
**Fix:** Same as Nasi Lemak — add an opening instruction before s1.

---

### CURRY_LAKSA ⚠️ HIGH + MEDIUM + LOW
**Issue 1 — HIGH — Tofu is listed as "pan-fried" but no step fries it.**  
i2 prep: "Cut into cubes, pan-fried until golden — adds protein and soaks up broth." s5 says "Add the tofu cubes and simmer 3 minutes." No step pan-fries the tofu. A user following the steps would add raw tofu cubes directly to the broth — they'd be pale and soft, not golden.  
**Fix:** Add a step between s3 and s4 (or as part of s3): "Pan-fry the tofu: In a separate pan, heat a splash of oil on high. Fry tofu cubes until golden and slightly crisp on the outside — about 3 minutes per side. Set aside. Golden tofu soaks up the laksa broth without dissolving; raw tofu breaks down into the sauce."

**Issue 2 — MEDIUM — Prawn stock volume used in s4 is unclear.**  
s1 makes stock by simmering prawn shells in 800ml water for 15 minutes, but doesn't state the final volume. s4 says "Add chicken stock and prawn stock to the fried paste" without specifying amounts. The clarification ("use it instead of 200ml of the chicken stock") is in the s1 why_note only — users don't read why_notes mid-cook.  
**Fix:** Move the clarification into s4 step content: "Add 400ml chicken stock and all the prawn stock. Bring to a boil." And update s1 to say: "Simmer 15 minutes. Strain and reserve — you'll use all of it in place of 200ml of the chicken stock."

**Issue 3 — LOW — Noodle soak and bean sprout blanch in ingredient prep only.**  
i3 (rice vermicelli) prep: "Soaked in boiling water 5 min, drained." i19 (bean sprouts) prep: "Blanched 30 seconds in boiling water." Neither appears in the steps.  
**Fix:** Add to s6 or as a separate mise en place step: noodle soak timing and bean sprout blanching instruction.

---

### CHAR_KWAY_TEOW ⚠️ LOW
**Issue 1 — LOW — Noodle room-temp requirement not in steps.**  
i1 prep: "If refrigerated, bring to room temp — cold noodles kill wok heat." s1 says "Have all your ingredients prepped" but doesn't specifically call out the noodle-temp issue. A user pulling cold noodles from the fridge 1 minute before cooking kills wok hei.  
**Fix:** Add to s1 before "Once you start": "Important: if your rice noodles have been refrigerated, take them out at least 30 minutes before cooking. Cold noodles drop the wok temperature the moment they hit and you won't recover wok hei."

**Issue 2 — LOW — Sauce ingredients should be pre-mixed.**  
s3 says "Add soy sauce, kecap manis, fish sauce, and white pepper, tossing constantly" in the middle of a 4-minute cook. With one hand tossing and a wok at 200°C, pouring from three separate bottles is impractical.  
**Fix:** Add to s1 before lighting the wok: "Mix soy sauce, kecap manis, fish sauce, and white pepper in a small bowl now. You won't have time to measure during the cook."

---

### BUTTER_CHICKEN ⚠️ HIGH (already flagged Batch 2)
**Issue — time_min: 90 hides 4-hour minimum marinade.**  
s1 `timer_seconds: 14400` (4 hours). time_min shows 90 on discovery screen.  
**Fix:** Update time_min to 330 (5.5 hours with minimum marinade time) or split into prep/cook fields.

---

### SAAG_PANEER ⚠️ HIGH + MEDIUM
**Issue 1 — HIGH — video_url is channel homepage, not recipe video.**  
`video_url: 'https://www.youtube.com/@JoshuaWeissman'` is the Joshua Weissman YouTube channel homepage. Golden Rule 1 requires a correct link to the specific video.  
**Fix:** Find the specific Joshua Weissman saag paneer or Indian cooking video URL, or change source.chef to `'Hone Kitchen'` and remove the video_url if no specific video can be identified.

**Issue 2 — MEDIUM — "Serve with basmati rice or naan" but neither is in ingredients or steps.**  
s5 ends: "Serve with basmati rice or naan." Neither appears in the ingredients list and no step cooks them.  
**Fix:** Same resolution as chicken-adobo — either add rice as an ingredient with a parallel cooking note, or explicitly label it as a separately prepared side.

---

### CHICKEN_KATSU ⚠️ MEDIUM + LOW
**Issue 1 — MEDIUM — Rice (i19) has no cook step.**  
i19: `{ name: 'Steamed Japanese short-grain rice, to serve', amount: 300, unit: 'g uncooked' }`. s5 says "fan them over steamed rice." No step cooks the rice. Japanese short-grain rice takes 18–20 minutes and should be started during the curry sauce (s1).  
**Fix:** Add a rice-cooking note to s1: "While the curry sauce simmers, cook the rice: rinse short-grain rice until water runs clear, combine with equal weight cold water, bring to boil, cover and reduce to lowest heat for 12 minutes. Rest 10 minutes covered."

**Issue 2 — LOW — Cabbage dressing not in steps.**  
i20: `{ name: 'Shredded cabbage, to serve', prep: 'The traditional accompaniment — dressed with a little rice wine vinegar' }`. No step dresses the cabbage.  
**Fix:** Add to s5 or as a mise en place note: "Dress shredded cabbage with 1 tsp rice wine vinegar and a pinch of salt. Set aside."

---

### TOM_YUM ✅
Steps flow correctly. Prawn stock step is well-integrated. Aromatic simmering and seasoning sequence is correct. No issues.

---

### BARRAMUNDI ⚠️ HIGH + MEDIUM
**Issue 1 — HIGH — time_min: 20 hides mandatory 30-min skin-drying step.**  
s1: "At least 30 minutes before cooking, lay the fillets skin-side up on a wire rack over a tray... Leave uncovered in the fridge." `timer_seconds: 1800`. This is not optional — it's described as "the difference between crispy and flabby." But time_min: 20 only reflects active cooking.  
**Fix:** Update time_min to 50 (30 min passive dry + 20 min active cook). Add a note on the discovery card: "Includes 30 min hands-off skin-drying step."

**Issue 2 — MEDIUM — Asparagus not prepared in any step.**  
i9: `{ name: 'Asparagus, to serve', prep: 'Blanched 2 minutes' }`. No step blanches it. A user who doesn't notice the ingredient prep field would serve raw asparagus alongside the fish.  
**Fix:** Add a brief step or note: asparagus should be blanched in salted boiling water 2 minutes, drained, while the fish is cooking skin-side down (there's a 5–6 minute window where the fish is untouched — enough time to blanch).

---

### PAVLOVA ⚠️ HIGH + MEDIUM
**Issue 1 — HIGH — time_min: 150 understates actual time significantly.**  
Actual total: 30 min (egg white resting) + 3–5 min (setup) + 3 min (whipping to soft peaks) + 8 min (sugar addition) + 1 min (folding) + 80 min (baking) + 60–120 min (oven cooling) = minimum 3h 5min, realistically 3h 30–40min.  
**Fix:** Update time_min to 210 (3h 30min) as a realistic minimum, and add a note that oven cooling can extend to 4+ hours.

**Issue 2 — MEDIUM — Room-temperature egg white requirement not flagged in s1.**  
i1 prep: "Separated at least 30 minutes before — warm egg whites whip to greater volume than cold ones." s1 covers the oven setup and bowl prep but does not say "First: separate your egg whites and bring them to room temperature." A user jumping straight to s1 will have cold egg whites.  
**Fix:** Add as the very first line of s1: "First, separate your egg whites into a bowl and leave at room temperature for 30 minutes — cold egg whites won't whip to full volume. Do this before heating the oven."

---

### FLOUR_TORTILLAS ⚠️ LOW
**Issue — LOW — Rolling (s7) and pan-heating (s8) not flagged as concurrent.**  
s7 rolls all 5 balls, s8 heats the pan. The pan takes 2–3 minutes to come to temperature — this could be done during the roll rather than after. A user reading sequentially would roll everything cold, then heat the pan, then have properly heated noodles that have been sitting exposed for 3 minutes and starting to dry.  
**Fix (minor):** Add a note at the start of s7: "While you're rolling, you can put the pan on medium heat to come to temperature — you need it ready by the time the first ball is rolled out." Or restructure s7/s8 order.

---

## Engineer Actions (Step-Flow Fixes)

These are data or content fixes to `mobile/src/data/seed-recipes.ts`. Listed by priority.

### HIGH — Fix before ship

1. **sourdough-loaf** — Add s6 "Rest 1 hour before cutting" as a discrete step with timer_seconds: 3600
2. **ramen** — Either: (a) replace chashu pork ingredient with a no-prep protein, or (b) add a prep note linking to a make-ahead method, or (c) add a make-ahead step s0
3. **chicken-adobo** — Add rice as an ingredient with a parallel cooking step or explicit "serve with" note
4. **beef-rendang** — Add a kerisik-making step (toast and pound, ~10–15 min, best done during the 2-hour braise window)
5. **curry-laksa** — Add a tofu pan-frying step before s4
6. **barramundi** — Update time_min from 20 to 50; add asparagus blanching to steps
7. **pavlova** — Update time_min from 150 to 210 (minimum); add room-temp egg white instruction to start of s1
8. **saag-paneer** — Fix video_url (channel homepage → specific recipe video, or change source.chef to 'Hone Kitchen')
9. **butter-chicken** — Update time_min from 90 to 330 (already flagged)
10. **roast-chicken** — Update time_min to reflect overnight brine (already flagged)

### MEDIUM — Fix before ship

11. **kafta** — Add sliced white onion as a serving ingredient (i11); add sumac-onion prep instruction to s5
12. **musakhan** — Add pine nut toasting instruction to s4 (or as a mise en place note)
13. **pad-thai** — Update s3 to specify tofu-first then prawns; include timing differentiation
14. **nasi-lemak** — Add chilli pre-soak alert before s1; add belacan toasting to s1
15. **beef-rendang** — Add chilli pre-soak alert before s1
16. **curry-laksa** — Clarify prawn stock volume in s4 step content (move from why_note)
17. **saag-paneer** — Add rice/naan as a side ingredient with parallel cooking note
18. **chicken-katsu** — Add rice cooking note within s1 (start rice during curry simmer)
19. **pavlova** — Add room-temp egg white instruction to s1

### LOW — Improve before ship

20. **thai-green-curry** — Name "Thai eggplant" specifically in s4 instead of "vegetables"
21. **braised-short-ribs** — Add timer_seconds: 1200 to s2 (sear all sides)
22. **char-kway-teow** — Add noodle room-temp warning to s1; add sauce pre-mixing note
23. **curry-laksa** — Add noodle soak and bean sprout blanch to steps
24. **chicken-katsu** — Add cabbage dressing note to s5
25. **flour-tortillas** — Add concurrent pan-heating note to s7 or s8

---

## Recipes with No Step-Flow Issues

smash-burger, pasta-carbonara, beef-stew, hummus, fattoush, prawn-tacos, sourdough-maintenance, risotto, fish-tacos, french-onion-soup, beef-wellington, dal, scrambled-eggs, weekday-bolognese, aglio-e-olio, mujadara, sheet-pan-harissa-chicken, egg-fried-rice, lamb-shawarma, tom-yum

---

*Audit performed by Claude (Culinary & Cultural Verifier role) — 2026-05-06*
