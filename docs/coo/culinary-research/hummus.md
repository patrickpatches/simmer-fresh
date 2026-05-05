# Hummus from Scratch

## Source recipe
`id: hummus` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Reem Kassis / The Palestinian Table — `https://www.reemkassis.com/`  
**⚠️ Verification required:** URL points to site homepage, not a specific recipe. This is directionally correct attribution (Reem Kassis is a verified Palestinian food author) but doesn't satisfy the "specific link" standard of Golden Rule 1. Options: find the specific recipe page URL on her site, or reframe as "After Reem Kassis, *The Palestinian Table* (2017)" as a book citation with no URL.

---

## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **ATTRIBUTION — homepage URL, not specific recipe**
   Same class of issue as Bolognese. The attribution to Reem Kassis is correct and appropriate — she is a Palestinian author and this is the right cultural credit. But the URL must link to something verifiable. Recommend: change to a book citation: `{ chef: 'Reem Kassis', notes: 'After Reem Kassis, The Palestinian Table (Phaidon, 2017). Technique: dried chickpeas, tahini-first emulsion, bicarbonate of soda in cooking water.' }`

2. **ADVANCE PREP — 12-hour soak invisible at discovery**
   `time_min: 720` (12 hours) is shown at card level, which is honest — but the before_you_start section needs to make this explicit. A user selecting this recipe needs to know the chickpeas must be soaked the night before.

3. **Cultural labelling: PASS** — tagline "Palestinian hummus — dried chickpeas only". Categories: levantine. No Israeli label. This is done exactly right.

---

## 1. Hero
**Title:** Hummus from Scratch  
**Attribution:** After Reem Kassis, *The Palestinian Table* (Phaidon, 2017)  
**Cuisine tags:** `levantine`, `palestinian`  
**Type tags:** `vegetarian`  
**Base servings:** 6

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 14–16 hours (soak overnight + 2h cook + blending) |
| **Active time** | ~30 min |
| **Difficulty** | Easy (just requires patience and time) |
| **Leftover-friendly** | Yes — improves after resting, keeps 5 days |
| **Cuisine** | Levantine (Palestinian) |

---

## 3. Description
*(existing tagline: "Palestinian hummus — dried chickpeas only" — keep exactly as-is)*  
Add: "Hummus made from dried chickpeas is a different food from hummus made from tinned chickpeas — not a better version of the same thing, an actually different substance. The texture is silk where tinned is smooth, the flavour is deeper, and it holds the tahini emulsion without separating. It takes overnight. It's worth it."

---

## 4. What to Know Before You Start

1. **Soak the chickpeas the night before.** This is not optional — it's step one. Unsoaked dried chickpeas even after long cooking have a hard, grainy centre. 12 hours minimum, 24 is better. Discard the soak water.
2. **Cook until they crush between two fingers with almost no pressure.** This sounds extreme but it's correct. Under-cooked chickpeas produce grainy hummus no matter how long you blend. When in doubt, cook them longer.
3. **Blend tahini with the lemon first, before the chickpeas go in.** This creates the emulsion base that makes hummus silky rather than grainy. It will look broken and thick when you do it — this is correct.

---

## 5. Equipment

- Large bowl or pot for soaking (chickpeas double in size)
- Heavy pot for cooking
- Food processor (NOT a blender — blender produces a gluey texture)
- Microplane or fine grater for garlic
- Shallow bowl for serving

---

## 6. Ingredients
*(existing data is excellent — scaling notes only)*

**Scaling notes:**
- `Dried chickpeas, 250g, scales: linear` — correct. scaling_note: *"250g dried chickpeas yields about 600g cooked — enough for a generous 6-person share plate. Scale linearly for more people."*
- `Good tahini, 120ml, scales: linear` — correct. scaling_note: *"The brand of tahini matters. Taste it before using — it should be nutty and smooth, not bitter. Al Arz, Soom, or any Palestinian or Lebanese brand are consistently good. Supermarket-brand tahini often produces bitter hummus."*
- `Lemon juice, 60ml, scales: linear` — correct. scaling_note: *"Always fresh-squeezed. Bottled lemon juice tastes flat and slightly metallic in hummus."*
- `Garlic, 2 cloves, scales: fixed` — correct. scaling_note: *"Keep at 2 cloves regardless of batch size. Raw garlic intensifies as the hummus rests — more than 2 cloves can become overwhelming after 30 minutes."*
- `Ice-cold water, 60ml, scales: linear` — correct. scaling_note: *"The ice-cold water creates a thermal contrast with the hot chickpeas that makes the emulsion fluffier. Use genuinely ice-cold water — not just cold from the tap."*
- `Bicarbonate of soda, ½ tsp, scales: fixed` — correct. This is structural, not proportional.
- `Salt, 1 tsp, scales: fixed` — correct. Taste and adjust.
- `Olive oil, to serve, scales: fixed` — correct.

---

## 7. Mise en Place

*(Night before)*
- Rinse dried chickpeas and pick out any shrivelled ones or small stones
- Cover with at least 3× their volume of cold water — they will double in size
- Leave at room temperature 12–24 hours

*(Day of)*
- Drain and rinse the soaked chickpeas
- Fill the pot with fresh cold water, add bicarbonate of soda
- Squeeze lemon juice and measure tahini before the chickpeas finish cooking — you want to start the food processor while the chickpeas are still hot
- Peel and measure garlic cloves
- Fill a small bowl with ice water and measure 60ml ice-cold liquid just before blending

---

## 8. Cook Steps
*(existing steps are strong and technically correct)*

**Step 1 — Soak overnight**  
*Existing content and why_note correct.*  
**Doneness cue:** "After 12 hours, the chickpeas will have roughly doubled in size and the water will be slightly discoloured (yellowish-beige). Discard the soak water — it contains the oligosaccharides that cause bloating."

**Step 2 — Cook very soft with bicarbonate (1.5–2 hours)**  
*Existing content and why_note correct.*  
**Doneness cue:** "Take one chickpea out and crush it between your thumb and index finger — it should crush completely with almost no pressure, leaving a smooth paste. No resistance, no granular texture. If there's any graininess, cook longer."  
**Note:** "The bicarbonate makes the water foam significantly during cooking — this is normal. Skim it off in the first 10 minutes."

**Step 3 — Blend tahini and lemon first (1 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "The tahini mixture will seize and go very thick and pale when the lemon hits it — it looks like it's broken. This is correct. Keep processing — after 30 more seconds it should be a thick, uniformly pale paste."

**Step 4 — Add chickpeas and blend (4–5 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After 4–5 minutes of continuous blending: the hummus should fall off a spoon in a thick, smooth ribbon with no visible grain. It should look like smooth, warm silk — not rough or textured."  
**Recovery:** "If it's still slightly grainy at 5 minutes, add 2 more tablespoons of ice-cold water and blend 2 more minutes. The problem is almost always that the chickpeas were slightly undercooked — next time, cook them longer."

**Step 5 — Rest and serve warm (30 min)**  
*Existing content and why_note correct.*  
**Doneness cue:** "After 30 minutes: taste the hummus. The garlic should have softened from sharp to mellow. The lemon should be integrated, not obviously acidic. The tahini flavour should come through cleanly."

---

## 9. Finishing & Tasting

Before serving, taste the hummus and adjust: salt, lemon, or water for consistency. The right texture is thick enough to hold a well in the centre when spread in a bowl — it should not run or be liquid. The flavour should be deeply savoury from the chickpeas, bright from the lemon, nutty from the tahini, with a quiet background note of garlic. Spread in a shallow bowl using the back of a spoon in one fluid circular motion — this creates the well that catches the olive oil. Fill the well with extra virgin olive oil, scatter a few whole cooked chickpeas, dust with paprika or sumac. Serve with warm flatbread.

---

## 10. Leftovers & Storage

Hummus keeps 5 days refrigerated in an airtight container. It improves for the first 24 hours as the flavours integrate. It firms up when cold — take it out 20 minutes before serving, or reheat very gently in a pan over low heat with a splash of water. Don't microwave — it goes grainy. Drizzle fresh olive oil each time you serve.

---

## Photography Notes

1. The soaked chickpeas — after 12 hours, showing them plump and doubled in size
2. The cooking pot — chickpeas simmering with foam at the edges (the bicarbonate foam)
3. The tahini seizure — the thick, pale tahini paste in the food processor after lemon is added
4. The blend — the smooth, silk hummus in the processor at 4 minutes
5. The serve — the shallow bowl, smooth surface, the well being created by a spoon
6. The finished plate — olive oil pooling in the well, whole chickpeas, paprika or sumac

---

## Culinary Audit Entry

```
## hummus · Hummus from Scratch · levantine/palestinian/vegetarian
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** PARTIAL PASS — Reem Kassis correctly identified as the cultural source. Palestinian author, appropriate credit. URL points to homepage only — must be updated to a specific recipe page or converted to a book citation before ship.
**Cultural origin:** PASS — tagline "Palestinian hummus". categories: levantine. No Israeli label. This is done right.
**Substitutions:** PASS — tinned chickpeas correctly flagged 'compromise' with honest explanation (grainier, less silky). No false claims.
**Whole-food claim:** PASS — dried chickpeas, tahini, lemon, garlic, olive oil, bicarbonate of soda. All whole food.
**Australian English:** PASS — 'bicarbonate of soda' correct (not baking soda), no issues.
**Voice:** PASS — the step note on tinned chickpeas ("they do not make good hummus") is exactly the right tone: honest, direct, not apologetic.
**Data fix required:** Attribution URL to be updated (homepage → specific page or book citation).
**Recommendation:** FIX BEFORE SHIP — attribution fix only. Content is excellent.
```
