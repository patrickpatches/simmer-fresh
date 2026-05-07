# Pasta Carbonara

## Source recipe
`id: pasta-carbonara` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Gordon Ramsay — `https://www.youtube.com/watch?v=5t7JLjr1FxQ`  
**⚠️ Verification required:** Link must be confirmed live and pointing to Ramsay's carbonara video before ship.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags for Engineer

1. **CULINARY ERROR — whole egg scaling**
   `{ id: 'i4', name: 'Whole egg', amount: 1, unit: '', scales: 'fixed' }`
   Must be `scales: 'linear'` with scaling_note. At 4 servings the app currently produces 6 yolks + 1 egg — wrong. Correct ratio is 3 yolks + 1 whole egg per 2 serves (1.5 yolks : 0.5 whole egg per person).
   **Fix:** `scales: 'linear'`, `scaling_note: "Scale with the servings — the ratio of 3 yolks to 1 whole egg per 2 serves is what gives the sauce richness without turning rubbery."`

2. **Attribution verification:** Confirm YouTube URL is live and correct before ship. Log in culinary-audit.md.

---

## 1. Hero
**Title:** Pasta Carbonara  
**Attribution:** Gordon Ramsay (verify link before ship)  
**Cuisine tags:** `italian`  
**Type tags:** `pasta`  
**Base servings:** 2

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 25 min |
| **Active time** | 25 min (no idle — all active) |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | No — carbonara does not reheat |
| **Cuisine** | Italian (Roman) |

---

## 3. Description
*(already exists — no change needed)*
Keep the tagline: "The Roman original — no cream, ever."

---

## 4. What to Know Before You Start

1. **Make the egg sauce before anything goes on the stove.** Once the guanciale fat is in the pan and the pasta is draining, you have about 60 seconds to work. Mix the eggs and cheese now, while everything is cold and calm.
2. **Off heat means off heat.** The pan comes fully off the burner before the egg mixture touches the pasta. The residual heat in the pan and pasta — around 65°C — is exactly enough. The stove being on is not.
3. **The pasta water is your safety net.** Keep a full mug of it next to the stove. If the sauce tightens or starts to look scrambled, a splash of water and fast tossing fixes it. Have it ready.

---

## 5. Equipment

- Large pot (for pasta)
- Heavy-based frying pan or skillet — NOT non-stick (you need the fond from the guanciale)
- Whisk or fork
- Tongs or pasta fork
- Mug (for pasta water reserve)

---

## 6. Ingredients
*(existing data is correct except whole egg scaling — see engineer audit flag above)*

**Scaling notes to add to existing ingredients:**

- `Egg yolks, 3, scales: linear` — correct as-is. At 4 serves: 6 yolks.
- `Whole egg, 1, scales: CHANGE TO linear` — see audit flag. At 4 serves: 2 whole eggs.
- `Pecorino Romano, 60g, scales: linear` — correct. scaling_note: *"Scale linearly, but taste as you go — some Pecorino brands are saltier than others."*
- `Black pepper, 1 tsp, scales: fixed` — correct. scaling_note: *"Keep at 1 tsp regardless of batch size. Carbonara's pepper heat should be a background note, not a feature."*
- `Salt for pasta water, 1 tbsp, scales: fixed` — correct. scaling_note: *"Don't double the salt for more water — season the water to taste. It should taste like mild seawater."*
- `Guanciale, 100g, scales: linear` — correct. scaling_note: *"For 4+ serves, work in two batches if your pan is smaller than 30cm — crowding drops the temperature and the fat steams instead of renders."*

---

## 7. Mise en Place

- Measure and crack eggs into a bowl (separate yolks if you haven't)
- Grate pecorino finely — microplane if you have it, smallest grater holes if not
- Whisk eggs, pecorino, and cracked pepper into a thick paste now, before anything goes on heat
- Cut guanciale into 1cm cubes or lardons
- Bring pasta water to the boil
- Set a mug next to the stove ready to catch pasta water before draining

---

## 8. Cook Steps
*(existing steps are correct and well-written — no changes to content, only structural additions)*

**Step 1 — Mix the sauce off-heat** *(existing)*  
No changes needed. why_note is correct and clear.  
**Add doneness cue:** "The paste should be thick enough that it doesn't run when you tilt the bowl."

**Step 2 — Render the guanciale** *(existing)*  
No changes needed. 8-minute timer is realistic.  
**Add doneness cue:** "The cubes should be golden and crisp on the outside with some give in the centre — not completely hard all the way through. The fat in the pan will be clear and golden."

**Step 3 — Cook pasta in well-salted water** *(existing)*  
No changes. "Tastes like the sea" is the right cue.  
**Add lookahead:** "Get the mug ready — you need to catch the pasta water before you even think about draining."

**Step 4 — Combine off heat** *(existing)*  
This is the most important step. The existing content is correct.  
**Add recovery:** "If it goes too thick and grainy — add pasta water a splash at a time and toss fast. If it goes scrambled (eggs seized) — the pan was still on heat, or you added the egg mixture when the pasta was too hot. You can partially recover by adding cold pasta water and tossing vigorously, but it won't be silk. Better next time: pan fully off heat, wait 15 seconds before adding the egg."

**Step 5 — Serve immediately** *(existing)*  
Add: "Warm the bowls first if you can — carbonara tightens fast in a cold bowl."

---

## 9. Finishing & Tasting

Taste before plating. The sauce should be savoury, peppery, and rich without being heavy. If it tastes flat, it needs more Pecorino — the cheese is both seasoning and sauce. If it's too thick, a splash more pasta water. If it's too thin, 20 seconds of tossing over very low heat (carefully — you're right at the egg-scramble threshold). Plate into warm bowls, top with more grated Pecorino and a fresh crack of pepper. That's it.

---

## 10. Leftovers & Storage

Carbonara does not keep. The egg sauce continues to cook in the residual heat as it cools, and reheating it curdled the eggs further. Make only what you'll eat. If you have leftover guanciale and egg mixture, refrigerate them separately (up to 2 days) and make a fresh batch.

**Exception:** The cooked guanciale keeps well in the fridge. Day-2 guanciale tossed through fresh pasta with olive oil and pepper is excellent.

---

## Photography Notes

1. The egg mixture in the bowl before adding to pasta — showing the thick, glossy paste with visible pepper
2. The guanciale rendering in the pan — showing the golden fat pooling around golden-edged cubes
3. The combine step — tongs mid-toss, sauce forming around the strands
4. The final plated dish — tight frame, grated Pecorino, cracked pepper, visible sauce coating
5. The cross-section pull — fork lifting a nest of pasta showing the sauce clinging (not pooling)

---

## Culinary Audit Entry

```
## pasta-carbonara · Pasta Carbonara · italian/pasta
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** CONDITIONAL — Gordon Ramsay attributed with specific YouTube URL. URL not yet verified live. Flag for verification before ship.
**Cultural origin:** PASS — Italian (Roman). No contested labelling issues.
**Substitutions:** PASS — quality flags are honest. Bacon correctly flagged 'compromise', whole egg swap correctly flagged 'compromise'.
**Australian English:** PASS — no issues found.
**Voice:** PASS — second person, present tense, doneness cues used. Step 4 title ("Combine off heat — this is the critical step") is slightly food-blog emphatic but acceptable given the importance of the step.
**Data fix required:** whole egg ingredient must change from scales: 'fixed' to scales: 'linear'. Engineer task.
**Recommendation:** FIX BEFORE SHIP (data fix + attribution verification). Content is strong.
```
