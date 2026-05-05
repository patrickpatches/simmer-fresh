# Pad Thai

## Source recipe
`id: pad-thai` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/watch?v=6Lb1PyJxVQM`  
**⚠️ Verification required:** Confirm URL is live and points to his pad thai video before ship.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **INGREDIENT DUPLICATION — tofu appears twice**
   `{ id: 'i2', name: 'Prawns, sliced', amount: 200g }` has a substitution "Firm tofu only (no meat)" — vegan option.
   AND separately: `{ id: 'i10', name: 'Tofu, firm, cubed', amount: 100g, scales: linear }` is listed as its own ingredient.
   
   This means: the standard prawn version also calls for 100g tofu alongside the prawns. This is confusing — is this a prawn-and-tofu pad thai? If yes, it's an unusual choice that needs explaining in the description. If no, the 100g tofu ingredient should be removed and tofu should exist only as a substitution for prawns.
   
   **Culinary assessment:** Traditional pad thai often includes both meat and tofu, so prawn + tofu is legitimate. But it should be clearly called out in the description, not buried as an unexplained ingredient at the end of the list.
   
   **Recommendation:** Update description to make the prawn-and-tofu version explicit, OR move tofu to a prep note on the prawn ingredient ("traditionally served with both prawns and tofu"). Engineer to implement whichever Patrick decides.

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

**Note on tofu:** See audit flag above. Until Patrick decides, write expansion notes as if both prawns and tofu are in the dish (the traditional version).

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

## Culinary Audit Entry

```
## pad-thai · Pad Thai · thai/noodles
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Andy Cooks with specific YouTube URL. URL not yet verified live.
**Cultural origin:** PASS — Thai. No contested labelling.
**Substitutions:** PASS — tamarind correctly defended as non-negotiable (ketchup listed as substitute 'changes the dish entirely' — should be flagged 'compromise'). The current substitution text says "ketchup is not a substitute — it changes the dish entirely" in the prep field, which is honest.
**Whole-food claim:** PASS — all whole ingredients.
**Australian English:** PASS — no issues.
**Data fix required:** (1) Tofu duplication — Patrick to decide: keep tofu as a separate ingredient (prawn-and-tofu version) or move to substitution-only. (2) Attribution URL verification pending.
**Recommendation:** FIX BEFORE SHIP — tofu duplication decision needed + attribution verification.
```
