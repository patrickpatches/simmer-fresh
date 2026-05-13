# The Weekday Bolognese

## Source recipe
`id: bolognese` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Andy Cooks — `https://www.youtube.com/@andy_cooks` (channel URL — see audit flag)

---

---

## Category taxonomy — multi-axis audit

### Discrepancy table

| Field | Current value | Proposed value | Action |
|---|---|---|---|
| `categories.cuisines` | `MISSING` | `['italian']` | Update in seed-recipes.ts |
| `categories.types` | `MISSING` | `['pasta', 'beef']` | Update in seed-recipes.ts |
| Schema | — | — | No schema change |

**Contested origin?** No — Bolognese ragù is from Bologna, Italy. The "weekday" framing is Hone Kitchen's, the dish is Italian.

**Rationale:** Dual type: `pasta` and `beef`. Both are independently true — Bolognese is a beef-based pasta dish. Someone filtering by beef should find it.

**Pre-flight: READY FOR ENGINEER** — categories set in seed-recipes.ts. Schema additions applied to types.ts.

## DECISION-015: Substitution Colour Mapping

`seed-recipes.ts const: WEEKDAY_BOLOGNESE`

| Ingredient | Substitution | Old quality | New colour | step_override | Notes |
|---|---|---|---|---|---|
| Brown onion | Shallots, finely diced | `great_swap` | 🟡 yellow | No | Sweeter, more delicate base; excellent but noticeably different character |
| Brown onion | Leek (white/pale green part) | `good_swap` | 🟡 yellow | No | Softer when cooked; mild allium note; works well in a weeknight ragù |
| Celery | Parsnip, finely diced | `great_swap` | 🟡 yellow | No | Sweeter, less vegetal than celery; excellent in a slow ragù |
| Carrot | Fennel bulb, finely diced | `great_swap` | 🟡 yellow | No | Anise note changes the soffritto character; excellent with the pork component |
| Carrot | Celeriac, finely diced | `good_swap` | 🟡 yellow | No | Earthy, less sweet; works well |
| Garlic cloves | Garlic paste (1 tsp per clove) | `good_swap` | 🟢 green | No | Same result; convenient; no perceptible difference in finished dish |
| Beef+pork mince | Veal mince | `great_swap` | 🟡 yellow | No | Closer to canonical ragù alla Bolognese; slightly more delicate texture |
| Beef+pork mince | All beef mince (80/20), no pork | `compromise` | 🟡 yellow | No | Heavier and gamier than the mixed version; still makes good bolognese; upgrade from 'compromise' |
| Pancetta | Italian sausage mince (casings removed) | `great_swap` | 🟡 yellow | No | Adds fennel and seasoning to the base; different but excellent |
| Whole milk | Full-fat oat milk or coconut milk | `good_swap` | 🟡 yellow | No | Dairy-free; oat milk is closest in fat content; minor texture difference in the ragù |
| Dry red wine | Dry white wine | `good_swap` | 🟡 yellow | No | Lighter, less tannic result; the sauce is brighter; works well |
| Dry red wine | Extra beef stock + red wine vinegar | `compromise` | 🔴 red | No | Vinegar approximates acidity but not the complexity of wine; the ragù is noticeably flatter and thinner |
| Tinned whole peeled tomatoes | Tinned chopped tomatoes | `perfect_swap` | 🟢 green | No | Functionally identical; same tomato, just pre-cut |
| Tinned whole peeled tomatoes | Tomato passata | `great_swap` | 🟡 yellow | No | Smoother texture; slightly less depth; works well |
| Tinned whole peeled tomatoes | Fresh ripe tomatoes (4 large) | `great_swap` | 🟡 yellow | **Yes — sauce step** | Must cook down 25–30 min before adding liquid; more variable result depending on ripeness |
| Beef stock | Chicken stock | `good_swap` | 🟡 yellow | No | Lighter and less savoury; the ragù loses some depth but is still good |
| Pappardelle | Rigatoni | `great_swap` | 🟡 yellow | No | Tubes catch the ragù differently than wide ribbons; excellent alternative |
| Pappardelle | Spaghetti or linguine | `good_swap` | 🟡 yellow | No | Thin pasta doesn't hold a heavy ragù as well as wide or ridged pasta |
| Parmigiano Reggiano | Grana Padano, grated | `great_swap` | 🟡 yellow | No | Milder and younger than Parmigiano; very close; most households use it interchangeably |
| Parmigiano Reggiano | Pecorino Romano, grated | `good_swap` | 🟡 yellow | No | Sharper and saltier; noticeably different — reduce finishing salt |

**Colour summary:** 2 🟢 · 17 🟡 · 1 🔴

### step_overrides authored

**Fresh ripe tomatoes → sauce step:**
*step_override → sauce step:* "Add the tomatoes at the start of the sauce, before the wine. Cook over medium heat for 25–30 minutes, stirring regularly, until they have fully broken down and the liquid has evaporated — the mixture should look jammy and concentrated. Only then add the wine and stock. If you skip this step, the ragù will be watery and won't develop the same depth."

---


## Chef's expansion notes (DECISION-009 full template additions)

### Audit flags

1. **ATTRIBUTION ISSUE — channel URL, not recipe video**
   `video_url: 'https://www.youtube.com/@andy_cooks'` points to Andy's channel homepage, not a specific bolognese video. This fails Golden Rule 1. Options:
   - Find the specific Andy Cooks bolognese/ragù video and update the URL, OR
   - Change `source.chef` to `'Hone Kitchen'` and move Andy's name to `source.notes` as "technique inspired by Andy Cooks"
   The current state is not shippable as-is under our attribution rules.

2. **GARLIC TIMING — unconventional, needs why_note**
   Garlic currently goes in at step 4 with the wine and tomatoes, not in the soffritto. Step 4 has no why_note. Either:
   - Add why_note: *"Adding garlic with the wine — not in the soffritto — prevents it from burning during the high-heat mince browning. The wine's steam protects it. The flavour is cleaner and less sharp than soffritto-stage garlic."* OR
   - Move garlic to step 1 (simpler, more conventional)
   Recommend keeping it where it is (the technique is sound) and adding the why_note.

---

## 1. Hero
**Title:** The Weekday Bolognese  
**Attribution:** Hone Kitchen, technique after Andy Cooks (pending attribution decision above)  
**Cuisine tags:** `italian`  
**Type tags:** `beef`, `pasta`  
**Base servings:** 4

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 75 min |
| **Active time** | 25 min (soffritto + browning + setting the simmer) |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — ragù improves overnight |
| **Cuisine** | Italian (Emilian) |

---

## 3. Description
*(existing — keep as-is)*
"Short version of the real thing. The soffritto and the milk-first step do the work 3 hours of simmering usually gets credit for."

---

## 4. What to Know Before You Start

1. **The soffritto is 30% of the final flavour.** Twelve to fifteen minutes over medium heat, no shortcuts. If you rush it on high heat it browns — that's a different, less sweet, less complex base. You want the vegetables to dissolve into sweetness, not colour.
2. **Milk goes in before wine and tomatoes — every time.** It tenderises the meat proteins before the acid can tighten them. Adding it after the wine doesn't undo what the acid already did. This is the step that separates weekday ragù from the full Sunday version.
3. **A bare simmer, not a bubble.** One small bubble every couple of seconds. A rolling simmer makes the meat tough and stringy in 45 minutes. You're making collagen convert to gelatin — that only happens gently.

---

## 5. Equipment

- Heavy-based wide pan or Dutch oven (wider = more evaporation surface, more flavour concentration)
- Wooden spoon or silicone spatula
- Large pot for pasta
- Fine grater or microplane for Parmigiano

---

## 6. Ingredients
*(existing data is strong — scaling notes to add)*

**Scaling notes:**
- `Onion, carrot, celery (soffritto), scales: linear` — correct. scaling_note on each: *"Keep the 1:1:1 ratio — soffritto is a balance, not a recipe."*
- `Garlic, 3 cloves, scales: fixed, cap: 6` — correct. scaling_note: *"Don't exceed 6 cloves regardless of batch size — garlic overwhelms ragù at high quantities."*
- `Beef mince + pork mince, scales: linear` — correct.
- `Milk, 200ml, scales: linear` — correct. scaling_note: *"Scale proportionally — the milk quantity is about tenderising, which depends on meat mass."*
- `Dry red wine, 200ml, scales: linear` — correct.
- `Tinned whole tomatoes, 400g, scales: linear` — debatable. Traditional Bolognese uses very little tomato — it's a meat sauce with tomato, not a tomato sauce with meat. For 2× the recipe, consider `scales: 'custom'`, scaling_note: *"Scale the tomatoes, but the dish should still taste of meat, not tomato. If it tastes more like a tomato sauce, you've used too much."*
- `Beef stock, 300ml, scales: linear` — correct.
- `Bay leaves, 2, scales: fixed, cap: 3` — correct.
- `Pappardelle, 400g, scales: linear` — correct.
- `Parmigiano, 60g, scales: linear` — correct.

---

## 7. Mise en Place

- Fine dice the onion, carrot, and celery — all same size so they cook evenly
- Mince or slice the garlic (goes in late — see step 4)
- Measure out the milk and wine in separate containers — they go in sequentially and you don't want to be measuring mid-cook
- Open the tinned tomatoes and crush by squeezing through your fist, or use scissors in the tin
- Have the stock measured and warm (cold stock drops the simmer temperature and adds time)
- Start the pasta water boiling about 30 minutes before the ragù finishes

---

## 8. Cook Steps
*(existing steps are strong — adding doneness cues and lookaheads)*

**Step 1 — Build the soffritto** (12–15 min)  
*Existing content correct.*  
`stage_note` already good: "Vegetables glossy and soft, no browning on the edges. You should smell sweetness, not Maillard."  
**Add lookahead:** "While this goes, prepare the mince — break it up in its packaging so it hits the hot pan loosely, not as a cold block."

**Step 2 — Brown the mince** (8–10 min)  
*Existing content correct.*  
`stage_note` already good: "Deep mahogany brown in patches."  
**Recovery note:** "If the mince releases a lot of water and starts to steam (grey, boiling rather than browning), increase the heat and cook it off. The water must evaporate before browning can happen."

**Step 3 — Milk first** (6–8 min)  
*Existing content correct.*  
`stage_note` already good: "Milk reduced to a thin glaze."  
No changes needed.

**Step 4 — Wine, then tomatoes & stock**  
*Existing content correct, but needs a why_note for the garlic timing.*  
**Add why_note:** *"Garlic goes in here — with the wine — not in the soffritto. The wine's moisture prevents it burning during what comes next. The flavour is subtler and cleaner than soffritto-stage garlic."*

**Step 5 — The long simmer** (45 min+)  
*Existing content correct.*  
`lookahead` already good: "In the last 15 min, put a big pot of heavily-salted water on for the pasta."  
**Add recovery:** "If the ragù is still thin at 45 minutes, remove the lid and let it reduce uncovered for 10–15 more minutes. If it's catching on the bottom, add a splash of water and reduce the heat."

**Step 6 — Marry with pasta**  
*Existing content is the best step in the recipe.*  
`stage_note` already perfect: "Each strand coated. No sauce pooling at the bottom of the bowl."  
No changes needed.

---

## 9. Finishing & Tasting

Before the pasta goes in, taste the ragù aggressively. It needs more salt than you think — the pasta and Parmigiano will dilute the seasoning. The flavour should be deep, meaty, slightly sweet from the carrot and the milk, with a clean red wine note behind it. If it tastes flat, salt. If it tastes thin, reduce another 5 minutes. If it tastes acidic, a pinch of sugar or a small knob of butter will round it out. Finish with Parmigiano stirred through off-heat — it emulsifies into the sauce rather than sitting on top.

---

## 10. Leftovers & Storage

**The ragù improves significantly overnight** as the collagen continues to set and the flavours integrate. Make a double batch and refrigerate or freeze the extra ragù (without pasta). Freezes perfectly for 3 months. Reheat gently with a splash of water to loosen.

*Already exists in leftover_mode — content is correct.*

---

## Photography Notes

1. The soffritto at 12 minutes — showing the translucent, glossy vegetables (not browned)
2. The mince browning — showing the mahogany fond on the pan bottom
3. The milk going in — white liquid hitting the browned mince, bubbling off
4. The final ragù before pasta — thick, glossy, fat visible at the edges
5. The marry step — pasta being tossed in the ragù with visible sauce coating
6. Plated: a nest of pappardelle with ragù and freshly grated Parmigiano

---

## Culinary Audit Entry

```
## bolognese · The Weekday Bolognese · italian/beef/pasta
**Audited:** 2026-05-05 by Culinary Verifier
**Attribution:** FAIL — source.chef: 'Andy Cooks' but video_url points to channel homepage, not a specific recipe video. Does not satisfy Golden Rule 1. Must be resolved before ship: either find the specific video URL or change attribution framing.
**Cultural origin:** PASS — Italian (Emilian ragù). No contested labelling.
**Substitutions:** PASS — quality flags honest. Veal noted as 'great_swap' correctly. Alcohol-free option flagged 'compromise' correctly.
**Australian English:** PASS — no issues.
**Voice:** PASS — second person, present tense, doneness cues used throughout. Stage notes are the best in the library.
**Data fix required:** Garlic step 4 needs a why_note explaining the timing. Attribution URL must be updated.
**Recommendation:** FIX BEFORE SHIP — attribution issue must be resolved. Content is excellent.
```
