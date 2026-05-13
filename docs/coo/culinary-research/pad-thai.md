# Pad Thai

## Source recipe
`id: pad-thai` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/watch?v=6Lb1PyJxVQM`  
**⚠️ Verification required:** Confirm URL is live and points to his pad thai video before ship.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **INGREDIENT DUPLICATION — RESOLVED ✅ (Chef recommendation accepted 2026-05-06)**

   **Decision:** Keep tofu as a listed ingredient (100g firm tofu, cubed). Remove tofu from the prawns substitution array. Add correct substitutions for prawns.
   
   **Why:** Authentic pad thai contains both prawns AND tofu together — the two proteins serve different textural roles (prawn: bouncy and sweet; tofu: soft and savoury). The current data model has a conceptual error: it treats tofu as a swap for prawns when in fact it's a co-ingredient. Replacing one with the other isn't how the dish is made.
   
   **Engineer actions:**
   - Keep `{ id: 'i10', name: 'Tofu, firm, cubed', amount: 100, unit: 'g', scales: 'linear' }` as a listed ingredient — no change needed
   - On the prawns ingredient, **remove** the tofu substitution entry
   - **Add** these substitutions to the prawns ingredient instead:
     - `{ ingredient: 'Extra firm tofu, increase to 200g', quality: 'good_swap', notes: 'Vegetarian version — remove prawns entirely and increase tofu to 200g. The dish reads as a vegetarian pad thai, not a compromise.' }`
     - `{ ingredient: 'Chicken thigh, thinly sliced', quality: 'great_swap', notes: 'Cooks in the same time as prawns. Use 180g. Slightly richer, less sweet than prawn. Slice thin so it cooks in 90 seconds at high heat.' }`
     - `{ ingredient: 'Squid, scored and sliced', quality: 'great_swap', notes: 'Traditional alternative. Needs the same high heat. Don't overcook — 60 seconds maximum.' }`
   - Update the description to make the prawn-and-tofu combination explicit: *"This is the traditional version — both prawns and tofu in the same pan."*

2. **Attribution verification:** Confirm YouTube URL before ship.

---

## 1. Hero
**Title:** Pad Thai  
**Attribution:** Andy Cooks (verify link before ship)  
**Cuisine tags:** `thai`  
**Type tags:** `pasta` (noodles)  
**Base servings:** 2

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 40 min (includes 20 min noodle soak) |
| **Active time** | 20 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Poor — best fresh |
| **Cuisine** | Thai |

---

## 3. Description
*(existing tagline: "The tamarind is non-negotiable" — keep.)*  
Add: "Pad Thai is built in about 90 seconds of high heat. Everything that matters happens before the wok goes on: the sauce balanced correctly, the noodles soaked (not boiled), the protein and eggs cooked in separate zones. Wok hei — the smoky char from maximum heat — is what separates the best from the serviceable."

---

## 4. What to Know Before You Start

1. **Soak the noodles in cold water before you start anything else.** They need 20 minutes. If you soak them in hot water or boil them, they'll be mush by the time they hit the wok.
2. **The sauce ratio is the dish.** Mix tamarind, fish sauce, and palm sugar before the wok goes on and taste it cold — sour leads, then salty, then a whisper of sweet. Adjust now, not mid-cook.
3. **Maximum heat, always.** Wok hei — the smokiness that makes restaurant pad thai different from home pad thai — only happens at temperatures your home wok can barely achieve. Preheat the wok 3 full minutes. The oil should smoke the moment it hits.

---

## 5. Equipment

- Wok (preferred) or the largest, heaviest pan you own
- Tongs or wok spatula
- Bowl for soaking noodles
- Small bowl for pre-mixed sauce

---

## 6. Ingredients
*(existing data is strong — scaling notes and tofu clarification)*

**Note on tofu:** Traditional version — both prawns (200g) AND tofu (100g) in the dish. Tofu is not a substitution for prawns; it's a co-ingredient. See audit flag for the substitution corrections the Engineer needs to make.

**Scaling notes:**
- `Flat rice noodles, 160g, scales: linear` — correct. scaling_note: *"For 4 serves, cook in two batches — don't double the noodles in one wok session. Overcrowding drops the temperature and the noodles steam and clump."*
- `Prawns, 200g, scales: linear` — correct.
- `Eggs, 2, scales: linear` — correct.
- `Tamarind paste, 3 tbsp, scales: fixed` — correct. scaling_note: *"The sauce quantity is about intensity, not volume. 3 tbsp makes a well-seasoned sauce for 2 serves — for 4 serves, use 4.5 tbsp, not 6 (the dilution from the extra noodles means less sauce per noodle is needed)."*
- `Fish sauce, 2 tbsp, scales: fixed` — correct. Same reasoning as tamarind.
- `Palm sugar, 1 tbsp, scales: fixed` — correct.
- `Bean sprouts, 80g, scales: linear` — correct.
- `Spring onions, 3, scales: linear` — correct.
- `Crushed peanuts, 40g, scales: linear` — correct.
- `Tofu, firm, cubed, 100g, scales: linear` — correct (if kept as a separate ingredient).

---

## 7. Mise en Place

- Soak noodles in cold water NOW before anything else — they need 20 minutes
- Mix tamarind, fish sauce, palm sugar in a small bowl — taste and adjust
- Peel and devein prawns, slice if large
- Press tofu dry with paper towel, cut into 1.5cm cubes
- Crack eggs into a small bowl
- Slice spring onions, separating white and green ends (white ends go into the wok early, green ends garnish)
- Measure and prepare all garnishes (peanuts, bean sprouts, lime wedges)
- Wok on maximum heat for the last 3 minutes of your mise — it needs to be ripping hot before the oil goes in

---

## 8. Cook Steps
*(existing steps are solid — adding doneness cues)*

**Step 1 — Soak noodles, mix sauce (20 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After 20 minutes, the noodles should be pliable and white — they should bend without breaking but not be cooked through. They'll still feel slightly firm in the centre. This is correct."

**Step 2 — High heat wok (3 min preheat)**  
*Existing content and why_note correct.*  
**Doneness cue:** "When a drop of water flicked into the wok skitters and evaporates in under a second — and the oil you add smokes immediately — it's ready."

**Step 3 — Protein, then egg (2 min)**  
*Existing content and why_note correct.*  
**Add:** "If including tofu: fry it first before the prawns, until lightly golden on the edges, then push aside. Tofu needs more time than prawns."  
**Doneness cue:** "Prawns: pink and curled but not fully tight — they'll continue cooking when the noodles go in. Eggs: mostly set but slightly wet in the centre — they finish in the noodle toss."

**Step 4 — Noodles and sauce (2 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The noodles should absorb the sauce and caramelise slightly — they'll go from white and translucent to slightly translucent-golden. They should look dry, not wet and saucy. The moment it looks slightly dry, it's done."  
**Recovery:** "If it looks too dry and the noodles are sticking: a splash of water (literally a tablespoon) loosens it immediately without making it soupy."

**Step 5 — Serve immediately**  
*Existing content correct.*  
**Add:** "The condiment table is traditional and functional — every diner adjusts their own bowl. Set out: fish sauce, palm sugar, dried chilli flakes, and extra lime. This isn't optional garnish — it's how pad thai is meant to be eaten."

---

## 9. Finishing & Tasting

Taste before plating: the noodles themselves should be well-seasoned — slightly sweet-sour-salty from the caramelised sauce. Adjust with a small splash of fish sauce if needed. The bean sprouts and spring onions go on at plating — their job is freshness and crunch against the hot noodles. Squeeze the lime generously over everything. The lime is not garnish; it's part of the dish.

---

## 10. Leftovers & Storage

Pad thai does not keep well. The noodles absorb remaining sauce and stick together as they cool, and the bean sprouts go limp. If you have leftovers, reheat in a hot pan with a splash of water — it will not be as good as fresh but it's acceptable. Don't microwave — the noodles go gluey.

---

## Photography Notes

1. The noodle soak — showing the dry noodles going into cold water, then at 20 minutes showing them pliable
2. The wok hei — showing the smoke coming off the oiled wok (the technical moment)
3. The egg zone — eggs scrambling separately from the protein in the wok
4. The noodle toss — tongs moving noodles in the wok with the sauce caramelising
5. Plated — the full presentation with bean sprouts, peanuts, spring onions, lime wedge, condiment bowls

---


---

---

## Category taxonomy — multi-axis audit

### Discrepancy table

| Field | Current value | Proposed value | Action |
|---|---|---|---|
| `categories.cuisines` | `MISSING` | `['thai']` | Update in seed-recipes.ts |
| `categories.types` | `MISSING` | `['pasta', 'seafood']` | Update in seed-recipes.ts |
| Schema | — | — | No schema change |

**Contested origin?** No — Thai dish, no contest.

**Rationale:** Dual type: `pasta` for the rice noodle base (the `pasta` TypeId covers noodles per types.ts); `seafood` for the prawn primary protein. Someone filtering by seafood should find Pad Thai.

**Pre-flight: READY FOR ENGINEER** — categories set in seed-recipes.ts. Schema additions applied to types.ts.

## DECISION-015 — Substitution colour mapping

### Discrepancy table

| Ingredient | Substitution | Old quality | New colour | step_override | Notes |
|---|---|---|---|---|---|
| Flat rice noodles | Rice vermicelli | `good_swap` | 🟡 | s1 | Technique change: soak 3 minutes only, not 20 |
| Flat rice noodles | Egg noodles (thin, fresh) | `good_swap` | 🟡 | s1 | Technique change: no soak, cook from fresh |
| Prawns | Pork belly, thinly sliced | `great_swap` | 🟡 | — | Richer, fattier — different but excellent |
| Prawns | Firm tofu only (vegan) | `good_swap` | 🟡 | s3 | Fry tofu first; technique note applies |
| Prawns | Squid, cleaned and sliced | `great_swap` | 🟡 | s3 | 60–90 seconds only — overcooking is the failure mode |
| Tamarind paste | Tamarind concentrate | `great_swap` | 🟡 | — | Quantity adjustment only; same outcome |
| Tamarind paste | Lime juice + rice vinegar | `compromise` | 🔴 | — | Approximates sourness but lacks tamarind's body and complexity |
| Fish sauce | Light soy sauce | `good_swap` | 🟡 | — | Vegan alternative; slightly less salty — quantity note applies |
| Palm sugar | Brown sugar / dark muscovado | `great_swap` | 🟡 | — | Nearly identical caramel result |
| Palm sugar | Coconut sugar | `great_swap` | 🟡 | — | Less sweet, more mineral — works well |
| Bean sprouts | Shredded cabbage | `good_swap` | 🟡 | — | Crunchier and holds better; serviceable swap |
| Spring onions | Chives, thinly sliced | `good_swap` | 🟡 | s4 | Add off heat only — wilt immediately in wok |
| Spring onions | Leek green tops, thinly sliced | `good_swap` | 🟡 | — | More robust; add 30 seconds before plating |
| Crushed peanuts | Cashews, toasted + chopped | `good_swap` | 🟡 | — | Creamier, milder — different but excellent |
| Crushed peanuts | Toasted sunflower seeds | `compromise` | 🔴 | — | Nut-free; similar crunch but less rich — noticeable change |

**Totals: 0🟢 / 13🟡 / 2🔴**

---

### Per-ingredient detail

**Flat rice noodles → Rice vermicelli** 🟡  
Thinner and more delicate. The dish is lighter, more delicate in texture — different but excellent. The critical change is soak time: vermicelli needs 3 minutes, not 20. Over-soaked vermicelli disintegrates in the wok.  
*step_override → s1:* "Rice vermicelli needs 3 minutes in cold water, not 20. Check at 2 minutes — they should be pliable but not fully softened. They'll finish cooking in the wok."

**Flat rice noodles → Egg noodles (thin, fresh)** 🟡  
Wheaten noodles with an eggy richness. No soaking needed — cook from fresh. The dish becomes richer and less distinctly Thai, but still excellent.  
*step_override → s1:* "Skip the soak entirely — egg noodles cook from fresh in the wok. Loosen them with your fingers before they go into the pan to prevent clumping. They'll need 60–90 seconds in the hot wok."

**Prawns → Pork belly, thinly sliced** 🟡  
Richer and fattier — a common Thai market variant. Cook in the wok the same way as prawns. Less sweet than prawn; the dish is more savoury and robust. Excellent.

**Prawns → Firm tofu only (vegan)** 🟡  
Removes all prawns and increases tofu to 200g. Works as a fully vegan version — not a compromise dish, just a different one. Tofu must be pressed dry and fried to golden edges before anything else goes into the wok.  
*step_override → s3:* "Fry the tofu in the hot wok first — before egg, before sauce. Press it dry first, cube it, and fry 2–3 minutes until golden on at least two sides. Push to the side, then proceed with the egg zone as normal."

**Prawns → Squid, cleaned and sliced** 🟡  
A traditional Thai market substitution — excellent quality. The timing is critical: squid turns rubbery at 90 seconds if the heat is even slightly insufficient. Maximum wok heat is non-negotiable here.  
*step_override → s3:* "Squid cooks in 60–90 seconds at maximum heat. Score the flesh before slicing — it curls attractively and cooks evenly. The moment it turns opaque, push it aside immediately. Overcooked squid is tough and chewy and cannot be recovered."

**Tamarind paste → Tamarind concentrate** 🟡  
More concentrated — use 2 tbsp concentrate + 1 tbsp water in place of 3 tbsp paste. Same outcome, same technique. Mix into the sauce at the same stage.

**Tamarind paste → Lime juice + rice vinegar** 🔴  
Approximates the sourness without tamarind's depth and body. The sauce is thinner and lacks the dark, complex undertone that makes pad thai distinctive. The dish is edible and still recognisable as pad thai — but it's a compromise, not a neutral swap.

**Fish sauce → Light soy sauce** 🟡  
Vegan alternative. Less funky and differently salty — use 1.5 tbsp, not 2. The dish loses the marine fermented depth of fish sauce but remains well-seasoned and good.

**Palm sugar → Brown sugar / dark muscovado** 🟡  
Nearly identical caramel-molasses result. Brown sugar dissolves faster. Dark muscovado is slightly more intense — both work without any technique change.

**Palm sugar → Coconut sugar** 🟡  
Less sweet, more mineral in character. Works at the same quantity. A slightly different flavour dimension — still excellent.

**Bean sprouts → Shredded cabbage** 🟡  
Crunchier and holds better over time than bean sprouts. A serviceable swap when sprouts aren't available. Doesn't wilt as dramatically — slightly more robust texture against the noodles.

**Spring onions → Chives, thinly sliced** 🟡  
Milder and more delicate. They cannot go into the hot wok — add off heat only. Works well as a fresh garnish element.  
*step_override → s4:* "Chives are too delicate for the wok — add them off heat, just before plating. Do not toss them in with the noodles or they'll disappear."

**Spring onions → Leek green tops, thinly sliced** 🟡  
More robust than spring onion. Add to the wok 30 seconds before plating to warm through — they can handle brief heat.

**Crushed peanuts → Cashews, toasted and roughly chopped** 🟡  
Creamier and milder than peanuts. A good substitute for those with peanut allergies (within the cashew category — check). Different richness but still excellent.

**Crushed peanuts → Toasted sunflower seeds** 🔴  
Nut-free. Similar crunch, but the richness of peanuts is noticeably absent. Toasted sunflower seeds work structurally — they add the textural element — but the flavour contribution is significantly thinner. A real compromise for nut-allergy requirements.

---

**Pre-flight: READY FOR ENGINEER**  
Attribution URL (Andy Cooks YouTube) must be verified live before ship. Engineer also to implement tofu substitution correction (separate tofu as co-ingredient; remove from prawns subs; add chicken/squid subs — see audit flags above). All substitution colours mapped.


## Culinary Audit Entry

```
## pad-thai · Pad Thai · thai/noodles
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Andy Cooks with specific YouTube URL. URL not yet verified live.
**Cultural origin:** PASS — Thai. No contested labelling.
**Substitutions:** PASS — tamarind correctly defended as non-negotiable (ketchup listed as substitute 'changes the dish entirely' — should be flagged 'compromise'). The current substitution text says "ketchup is not a substitute — it changes the dish entirely" in the prep field, which is honest.
**Australian English:** PASS — no issues.
**Data fix required:** (1) Tofu: keep as listed ingredient, remove from prawns substitutions, add correct vegetarian/protein substitutions (see audit flags above — RESOLVED). (2) Attribution URL verification pending.
**Recommendation:** FIX BEFORE SHIP — Engineer to implement substitution corrections + verify attribution URL.
```
