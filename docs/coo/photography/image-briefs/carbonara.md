# Image Brief — Pasta Carbonara (`pasta-carbonara`)

> Status: Prompts written — images not yet generated
> Cook's photography notes: `docs/coo/culinary-research/carbonara.md` § Photography Notes
> Recipe data: `mobile/src/data/seed-recipes.ts` → `PASTA_CARBONARA`
> Attribution: Gordon Ramsay (YouTube link to be verified before ship)
> Ledger: `docs/coo/visual-assets-ledger.md` → Spaghetti Carbonara section

---

## Research summary

### Recipe facts (from seed-recipes.ts)

**Ingredients:** Spaghetti 160g · Guanciale (or pancetta) 100g · Egg yolks ×3 · Whole egg ×1 · Pecorino Romano finely grated 60g · Black pepper 1 tsp · Salt for pasta water 1 tbsp

**Steps requiring images:**
- s1 — Mix egg/Pecorino/pepper paste in bowl (off heat, before cooking starts)
- s2 — Render guanciale cubes in cold, dry pan
- s4 — Combine off heat (THE critical step — tongs, tossing, sauce forming)
- hero — Final plated dish

### The one rule that governs everything: no cream

Carbonara sauce is made from egg yolks + whole egg + Pecorino Romano. The finished sauce is **pale golden-yellow and silky**. It is not white. It is not cream-coloured. It does not pool. It clings to every strand.

Every single incorrect photo of "carbonara" on the internet shows a white, cream-based sauce. This is the American/UK bastardisation. Any image with a white or opaque sauce is automatically rejected — it contradicts the recipe's own tagline ("The Roman original — no cream, ever").

### Sauce colour reference

The correct visual: imagine the colour of a hollandaise, but thinner and silkier. Deep golden-amber where the sauce catches the guanciale fat. Pale gold where it coats the pasta directly. Always translucent enough that you can see the pasta strands through it.

### Guanciale appearance

Guanciale is cured pig cheek — fattier and softer than pancetta, with a higher fat-to-meat ratio. In this recipe it's cut into 1cm cubes or lardons and started in a cold, dry pan. The result: golden-brown and slightly crisp on the outside, soft in the centre, sitting in a pool of clear golden rendered fat. It is **not** bacon strips. It is **not** uniformly browned all the way through.

### Gordon Ramsay's visual style (reference only — do not copy)

Ramsay's carbonara photos typically use: tight crop, dramatic side lighting, grated cheese falling mid-air, rustic white bowl or wide pasta bowl. He frequently shows cross-section forkfuls. His is an overtly styled approach — ours should be honest and slightly less theatrical. We want his subject knowledge, not his Instagram drama.

### Existing hero URL assessment

Current hero in seed-recipes.ts: `https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80`

**Assessment:** This Unsplash image shows a reasonably authentic-looking carbonara in a white bowl with visible pasta strands, guanciale, and grated cheese. The sauce reads as golden-tinged rather than white. However, it may show peas or pancetta strips rather than guanciale cubes — needs direct visual inspection before approving. **Status: CANDIDATE for hero if it passes cook accuracy check. AI fallback if rejected.**

Patrick: view this URL in a browser and check against the cook's validation checklist (bottom of this brief) before deciding whether to generate a replacement.

### Surface and lighting for carbonara

Unlike the Smash Burger (matte black slate, maximum dark drama), carbonara is a pale-toned dish — the sauce is golden, the cheese is white, the pasta is straw-coloured. On pure black slate it can read as lost. The right approach:

**Surface:** Dark aged timber (warm brown-black tones) or a slightly lighter dark stone. The wood grain gives warmth that complements the egg-gold tones.
**Bowl:** White or off-white ceramic pasta bowl, wide-rimmed (European bistro style).
**Light:** Soft directional natural light from the left. The gloss of the sauce needs to catch the light — this is what makes it look silky rather than matte.

This combination still integrates with the #111111 app background (dark timber reads dark, white bowl creates focus) while giving the dish the light it needs to show the sauce correctly.

---

## CC stock assessment

Carbonara is one of the most photographed Italian dishes. The challenge: the overwhelming majority of "carbonara" stock photos show cream-based sauce (white, opaque). Filtering to authentic Roman carbonara (no cream, pale-golden sauce) is extremely difficult via keyword search.

**Unsplash:** Searched for "carbonara pasta" — most results show obvious cream sauce or clearly wrong dishes. Ruled out for stage shots. The existing hero URL (`photo-1612874742237-6526221588e3`) is the one potential exception — Patrick must inspect directly.

**Decision:** AI generation for all stage shots (s1, s2, s4). Hero: inspect existing URL first; if approved, keep; if rejected, generate.

---

## Images required — 4 total

| Ref | Stage ID | Subject | Priority |
|---|---|---|---|
| A | `hero` | Plated spaghetti carbonara, cross-section fork pull | MUST HAVE |
| B | `step-s1-egg-paste` | Egg yolk/whole egg/Pecorino paste in bowl | MUST HAVE (key doneness cue) |
| C | `step-s2-guanciale` | Guanciale mid-render in pan, golden fat pooling | MUST HAVE (key doneness cue) |
| D | `step-s4-combine` | Tongs mid-toss, sauce forming around spaghetti strands | MUST HAVE |

---

## DALL-E 3 Prompts

> Paste each prompt directly into ChatGPT (DALL-E 3). Generate 2–3 variants per prompt. Save as `pasta-carbonara_[stage]_v[N].jpg`.

---

### Image A — Hero (`pasta-carbonara_hero_v1.jpg`)

```
Food photography, 30-degree angle shot looking slightly down into the bowl. A wide white ceramic pasta bowl containing spaghetti carbonara. The pasta is twirled loosely in the bowl — not perfectly centred, slightly offset. The sauce is pale golden-yellow and silky, visibly coating every strand of spaghetti — not pooled at the bottom, not white, not cream. Small pieces of golden-brown guanciale (1cm cubes, not bacon strips) are nestled through the pasta. Finely grated Pecorino Romano is dusted across the top like fine snow — not large shavings, not a mound. Fresh cracked black pepper is clearly visible. A fork has lifted a small nest of pasta to the right, showing the sauce clinging to the strands as they fall. The bowl sits on a dark aged timber board. Soft natural side light from the left creates a gloss on the sauce surface. Dark background. 3:2 landscape format. No cream visible. No peas. No mushrooms. No ham. No parsley garnish. NYT Cooking style — honest, well-lit, technically accurate.
```

**What to reject and regenerate:**
- White or cream-coloured sauce → reject immediately, this is the American version
- Peas, mushrooms, ham, or parsley visible → reject
- Sauce pooled at the bottom of the bowl (not coating strands) → reject
- Fettuccine, tagliatelle, or wide pasta → reject (must be spaghetti)
- Large cheese shavings instead of fine grated dusting → reject
- Guanciale shown as bacon strips instead of cubes → reject

---

### Image B — Egg paste (`pasta-carbonara_step-s1-egg-paste_v1.jpg`)

**Doneness cue:** "The paste should be thick enough that it doesn't run when you tilt the bowl." — Culinary Verifier

```
Food photography, overhead shot. A small white ceramic bowl containing the carbonara egg mixture — 3 raw egg yolks and 1 whole egg already whisked with finely grated Pecorino Romano into a thick, glossy paste. The paste is deep golden-amber in colour, visibly thick and not runny. Finely cracked black pepper is distributed through the paste. A small whisk or fork rests at the edge of the bowl. The paste surface is slightly glossy and catches the light. Next to the bowl (in frame, out of focus): a small mound of extra grated Pecorino on the board, and a small pile of cracked pepper. Dark aged timber surface. Soft directional light from the left. Overhead 90-degree angle, centred composition, generous negative space around the bowl. No pasta visible. No heat — this is before any cooking starts. NYT Cooking style, technically accurate.
```

**What to reject:**
- Paste that looks runny or thin (should be thick and glossy) → reject
- Pale yellow paste (should be deep amber-gold from the yolks) → reject
- Cream or milk visible in the shot → reject
- Pasta water visible (this step is before cooking)

---

### Image C — Guanciale rendering (`pasta-carbonara_step-s2-guanciale_v1.jpg`)

**Doneness cue:** "Golden and crisp on the outside with some give in the centre — the fat in the pan will be clear and golden." — Culinary Verifier

```
Food photography, 30-degree angle shot. A heavy stainless steel or cast iron frying pan on a gas burner (flame visible at medium-low). Inside the pan: approximately 15–20 cubes of guanciale (1cm cubes of cured pork, not bacon strips — paler meat than bacon with distinct fat marbling visible). The cubes are mid-render: golden-brown and slightly crisp on two sides, still soft-looking in the centre. Clear golden rendered fat pools around the base of the cubes — approximately 2 tablespoons of fat visible. The pan surface shows light fond (brown residue) where the fat has hit the hot surface. A wooden spoon or spatula rests at the edge. No added oil in the pan. Dark surface, natural side light from the left, slight steam suggestion. The guanciale should look golden, not burned — caramel-brown, not dark brown or black. NYT Cooking style.
```

**What to reject:**
- Bacon strips (flat, uniformly thin) instead of cubes → reject
- Dark brown or burned-looking cubes → reject (should be golden)
- A non-stick pan → reject (recipe specifies no non-stick)
- White/cloudy rendered fat → reject (should be clear golden)
- Cream, eggs, or pasta visible in the shot

---

### Image D — Combine off heat (`pasta-carbonara_step-s4-combine_v1.jpg`)

**Why this is the most important stage shot:** This step is what makes carbonara hard. The visual must show: pasta being tossed, the sauce forming mid-motion, the pan clearly off any heat source. This is the doneness moment the user most needs to see.

```
Food photography, 30-degree angle shot. A stainless steel or cast iron frying pan on a dark timber board beside the stove — clearly OFF the burner (the burner is off or the pan has been moved). Inside the pan: spaghetti strands being actively tossed with tongs. The tongs are mid-motion, lifting a loose nest of spaghetti. A pale golden-amber sauce is visibly forming — the strands closest to the centre of the toss are coated with glossy golden sauce, the strands at the edges are still picking up the sauce. Small golden-brown guanciale cubes are distributed through the pasta, visible between strands. A slight steam rising from the pasta (the residual heat). A mug of starchy pasta water sits just to the right of the pan, within easy reach. The sauce should look glossy and silky — not scrambled, not pooled, not cream-coloured. Soft natural side light from the left. NYT Cooking style — honest, mid-action, technically accurate.
```

**What to reject:**
- Pan on a visible flame/hot burner → reject (the whole point is OFF heat)
- White or cream sauce → reject
- Scrambled-looking egg texture → reject
- Sauce pooled at the bottom instead of coating strands → reject
- No tongs / no active motion → reject (this is an action shot)

---

## Cook validation checklist

Patrick sends images to the Culinary Verifier. She runs this checklist before signing off.

### Hero (Image A)
- [ ] Sauce is pale golden-yellow, NOT white or cream-coloured
- [ ] Sauce coats the strands — visible on individual spaghetti, not pooled at base
- [ ] Guanciale cubes visible (not bacon strips)
- [ ] Cheese is finely grated dust, not large shavings
- [ ] Cracked black pepper clearly visible
- [ ] No peas, mushrooms, ham, or parsley
- [ ] Pasta is spaghetti (not fettuccine, tagliatelle, or wide pasta)

### Egg paste (Image B)
- [ ] Paste is thick and glossy — should not run if the bowl were tilted
- [ ] Deep amber-gold colour from the egg yolks (not pale yellow or white)
- [ ] Cracked black pepper visible in the paste
- [ ] No cream or milk in the bowl
- [ ] No pasta, guanciale, or heat visible

### Guanciale (Image C)
- [ ] Cubes (1cm), not bacon strips
- [ ] Golden-caramel colour, not dark brown or burned
- [ ] Clear golden rendered fat visible in the pan
- [ ] No other ingredients added yet (no pasta, no eggs)
- [ ] Pan is heavy-based (not clearly non-stick)

### Combine step (Image D)
- [ ] Pan is clearly off heat (not on a visible flame)
- [ ] Sauce is forming — golden, silky, coating the strands
- [ ] Tongs visible, mid-toss action
- [ ] Guanciale cubes visible through the pasta
- [ ] Pasta water mug visible nearby (or at least implied)
- [ ] No scrambled/curdled appearance

---

## Generation workflow

1. Open ChatGPT (ChatGPT Plus account, DALL-E 3 enabled)
2. For each prompt above: paste the full text → generate → inspect against rejection criteria
3. If rejected: note the specific failure (e.g. "sauce came out white") and retry with the failure added as an explicit negative: "The sauce must NOT be white or cream-coloured — it must be pale golden-amber."
4. Save each accepted image as `pasta-carbonara_[stage]_v1.jpg` (increment version on iteration)
5. When you have at least 1 candidate per stage: send all to Culinary Verifier with this brief for accuracy validation
6. Update visual-assets-ledger.md: PENDING → CANDIDATE (once generated) → APPROVED or REJECTED (once cook validates)

---

## Status tracker

| Image | Prompt written | Generated | Cook reviewed | Outcome | Ledger updated |
|---|---|---|---|---|---|
| hero | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s1-egg-paste | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s2-guanciale | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s4-combine | ✅ | ⏳ | ⏳ | — | ⏳ |

*Brief written by Photography Director · 2026-05-11*
