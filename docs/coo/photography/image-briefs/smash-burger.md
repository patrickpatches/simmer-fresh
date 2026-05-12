# Image Brief — Smash Burger

> Working document for the Photography Director.
> Contains: research notes, per-shot AI generation prompts, CC stock assessment, cook validation checklist.
> Ledger entries: `docs/coo/visual-assets-ledger.md` → `smash-burger` section.

---

## Research summary

### Recipe source
- **Chef:** Andy Cooks (source attribution in seed-recipes.ts)
- **Reference video:** https://www.youtube.com/watch?v=oa2g6gB_1BU
- **Andy's recipe page:** https://www.andy-cooks.com/blogs/recipes/smash-burger
- **Andy's OG recipe page:** https://www.andy-cooks.com/blogs/recipes/smash-burger

### Key technique facts (from seed-recipes.ts — these govern what the image must show)

1. **Meat:** 80/20 beef mince only. The fat is what creates the lacey, crisped edges. This is the visual signature of a smash burger — irregular, browned, slightly translucent fat at the edge of the patty. If the patty looks like a smooth disc, the image is wrong.
2. **No pre-seasoning:** Ball is formed without salt; salt goes on the outside right before cooking. The raw balls look rough and unsalted — not seasoned-brown.
3. **Smash:** Baking paper on top, flat spatula pressed hard. Patty reaches ~1cm thin. The paper is visible in the action shot.
4. **Crust:** 90 seconds undisturbed on screaming-hot cast iron. The underside must look deeply browned — Maillard, not just warm-grey — with lacey fat rendering at the edges. This is the KEY doneness cue.
5. **Flip once:** Single flip. Cheese goes on immediately. 45 more seconds.
6. **Cheese:** American cheese slice — processed, melts smooth and glossy. Not stringy (cheddar), not bubbly (mozzarella). A flat, even drape with translucent edges.
7. **Bun:** **Brioche** (not milk bun, not potato bun — Hone recipe specifies brioche).
8. **Patty: SINGLE.** One ~100g patty per burger, smashed thin (~1cm). Reverted to single patty 2026-05-12 for simplicity.
9. **Build (updated 2026-05-12):** Sauce on BOTTOM bun, pickles, diced white onion, single patty (cheese-side up), **shredded iceberg lettuce**, top bun. **No tomato.** No red onion.
10. **Serving:** Eat immediately. The hero must look urgent — slightly imperfect, steam possible, cheese still glossy.

### Hone build vs Andy's build — differences that affect the image

| Element | Hone recipe | Andy's recipe | Image must show |
|---|---|---|---|
| Bun | Brioche | Milk bun | Brioche — slightly domed top, golden-yellow egg-wash colour |
| Sauce | Mixed (mayo + ketchup + mustard) on bottom bun | Separate (mayo bottom, mustard top) | A cream-coloured sauce smear on the bottom bun interior |
| Onion | Diced white onion | Thinly sliced red onion | Small white diced cubes, not rings |
| Lettuce | Shredded iceberg | Shredded iceberg | Shredded iceberg lettuce on top of the patty — fine shreds, not a whole leaf |
| Tomato | None | None | **No tomato visible** |
| Patty count | One (~100g, smashed thin) | Two stacked | Single thin patty, ~1cm after smashing, lacey fat edges |
| Pickles | Dill pickle slices | Sweet and spicy pickles | Dill pickle rounds — dark green with visible ridges |

### Andy Cooks' visual style (informed by his recipe photography)
- Shoots at roughly 30-45° above the subject, not straight overhead and not eye-level
- Full-frame composition — the burger fills most of the frame
- Dark background / dark surface
- No excessive props — the food is the subject
- Natural-light feel; no harsh flash or studio lighting
- His hero image for this recipe: `https://www.andy-cooks.com/cdn/shop/articles/Andy_Cooks_-_Best_Smash_Burgers_at_Home.jpg` (3000×2000px, landscape) — reference for style, not for copying

### Kenji López-Alt technical notes (for prompt accuracy)
- Patty edges: "deeply browned and crispy" with rendered lacy fat
- Cook at 500-550°F on preheated cast iron / steel
- 60-90 seconds first side, until edges are deeply browned
- The patty **expands** slightly when smashed — the circumference is larger than the ball, and the edges are thinner than the centre
- Fat from 80/20 renders out and literally fries the bottom of the patty

### CC stock assessment (Unsplash free tier)
All 103 Unsplash results for "smash burger" were reviewed. **None accurately depict a smash burger.** All free-tier results show tall, thick, multi-layer burgers — the opposite of the thin, crispy-edged smash style. The current hero placeholder (`photo-1568901346375-23c9450c58cd` by amirali mirhashemian) shows lettuce and tomato, making it factually inaccurate for this recipe.

**Recommendation:** AI generation for all 6 images. Do not use CC stock for this recipe.

---

## AI generation prompts

**Tool recommendation:** DALL-E 3 (via ChatGPT Plus) for a first pass. Iterate on the same tool for consistency across all 6 images. If DALL-E 3 results look waxy or generic after 3 attempts, switch to Midjourney V6 with `--style raw`.

**Surface consistency across all 6 images:** Raw dark timber board OR matte black slate. Pick one at the start and use it throughout all 6 shots for this recipe — mixing surfaces across shots destroys coherence.

**Lighting consistency:** Soft directional natural light from the left. No harsh shadows. No harsh specular flash. Warm-leaning white balance (food looks better slightly warm).

---

### Image 1 — Mise en place (`step-s1-mise`)

**What it must show:** All ingredients prepped and arranged before cooking starts. Two rough beef balls centre-frame (one per burger), everything else arranged around them. Establishes the scope of the recipe and validates the ingredient list against the recipe.

**Accuracy requirements:**
- Two rough spheres of beef mince (~100g each — one per burger)
- Two brioche bun halves, cut-side up — round, slightly domed, golden-yellow colour
- Two American cheese slices, slightly fanned
- One small bowl with finely diced white onion (fine dice, ~3-4mm)
- 4 dill pickle rounds (ridged, dark green)
- A small pile of shredded iceberg lettuce (fine shreds, pale green-white)
- Three small prep bowls: one with mayo (cream white), one with red ketchup, one with yellow mustard
- One small square of baking paper
- No tomato. No sesame seeds on top of bun.

**DALL-E 3 prompt:**
```
Food photography, overhead shot, mise en place for a smash burger on a raw dark timber board. Two rough spheres of 80/20 beef mince in the centre (one per burger, roughly 100g each — larger than a golf ball, slightly rough surface). Surrounding them: two brioche bun halves cut-side up (golden-yellow, slightly domed top), two American cheese slices fanned open, a small bowl of finely diced white onion, four dill pickle rounds, a small loose pile of shredded iceberg lettuce (fine pale-green shreds), three small ceramic bowls containing mayonnaise, tomato ketchup, and yellow mustard respectively, and a small square of baking paper. No tomato, no sesame seeds. Soft natural side light from the left, warm white balance, no flash. NYT Cooking style food photography, honest and readable, not styled or decorated. Shot from directly overhead, 2:3 portrait format.
```

**Accuracy validation checklist for cook:**
- [ ] Two beef balls present (one per burger, ~100g each — single patty)
- [ ] Brioche bun visible (not milk bun, not sesame seed bun)
- [ ] Shredded iceberg lettuce visible, no tomato
- [ ] Diced white onion (not sliced red onion)
- [ ] Dill pickles (dark green, not bread-and-butter style)
- [ ] Three separate condiment bowls visible

---

### Image 2 — The smash action (`step-s3-smash`)

**What it must show:** The defining technique of the recipe. A beef ball being pressed flat against screaming-hot cast iron, baking paper visible between spatula and meat, steam rising, patty spreading to ~1cm.

**Why this shot matters:** This step is what separates a smash burger from any other burger. It must be shown. The "hold for 10 full seconds" instruction is visceral and unusual — the image should convey the aggression and heat.

**Accuracy requirements:**
- Cast iron pan (black, heavily seasoned, or carbon steel pan) — not non-stick, not stainless
- Baking paper square visible between the spatula/press and the beef
- Beef spreading outward under pressure — it should look wider than a normal patty, thin, with irregular edges starting to form
- Steam or smoke haze from screaming-hot pan
- NOT a already-flat patty sitting in a pan — it must look like active pressing

**DALL-E 3 prompt:**
```
Food photography, 30-degree angle above subject. A beef mince ball being aggressively smashed flat in a screaming-hot cast iron skillet. A square of white baking paper is visible between the metal spatula and the beef. The beef is mid-smash: flattened to about 1cm thin, spreading outward with irregular edges, wisps of steam rising from the pan. Cast iron surface is dark, well-seasoned. Dark background. The action is the subject — convey heat and urgency. Soft natural side light from the left. No cheese, no bun in frame. Shot at 30-degree angle, landscape format, DSLR food photography quality, not AI-looking.
```

**Iteration note:** This is the hardest shot to get right from AI. Key failure modes to reject:
- Patty looks like a finished burger (too thick, too neat)
- No baking paper visible
- Pan is non-stick or has the wrong surface
- Looks static (no sense of pressing force or heat)
- Spatula is wrong shape (must be flat, not slotted)

Regenerate until these are all correct before sending to cook.

---

### Image 3 — Pre-flip crust (KEY DONENESS CUE) (`step-s4-crust`)

**What it must show:** The underside of the patty, revealed either via the first flip or by lifting an edge in a pan. This is the most important educational image in the entire recipe — it shows the user exactly what "done" looks like before they flip.

**Accuracy requirements (this is what the recipe is built on):**
- Deep brown (Maillard brown, not grey, not charcoal-black) — the colour of strong caramel or dark honey
- Irregular, lacey edges where fat has rendered and crisped — this looks almost like browned lace at the very perimeter of the patty
- The centre of the patty underside is uniformly dark brown
- The top surface (facing up, pre-flip) may look slightly grey/pink — that's correct, it hasn't been cooked yet
- Pan visible around it — cast iron, dry (the fat has rendered in)
- NO cheese on this image — cheese goes on after the flip

**DALL-E 3 prompt:**
```
Food photography, close overhead shot. A thin smash burger patty in a cast iron pan, photographed just before being flipped to show its underside. The cooked underside is facing up: deep caramel-brown colour, uniform Maillard crust, with irregular lacey fat-rendered edges at the perimeter of the patty — the rendered fat has crisped into delicate browned lace. The top surface (uncooked side, facing the camera in the pan) is slightly grey-pink. No cheese. No bun. Cast iron pan surface visible around the patty, dark and dry. This is a doneness-cue photograph — the visual message is "this is what it looks like when it's ready to flip." Overhead shot, soft natural side light, food-education quality. Warm white balance, high detail.
```

**Cook validation:** The colour of the crust is the critical accuracy gate. If the AI produces a patty that is:
- Grey-brown → reject (undercooked, steamed not seared)
- Black or charred → reject (overcooked, pan too hot or cooked too long)
- Even medium-tan without lacy edges → reject (correct Maillard needs the lace — without it the recipe's fat ratio instruction loses its visual justification)

---

### Image 4 — Cheese melt (`step-s4-cheese`)

**What it must show:** A single American cheese slice melting over a just-flipped smash patty in the pan. The cheese is mid-melt — drooping at the edges, becoming translucent, beginning to coat the surface.

**Accuracy requirements:**
- Single thin patty (~1cm), just flipped — brown crust now facing up
- One American cheese slice draped over the patty — flat, processed, square, pale yellow-orange colour
- Cheese is NOT solid (that's too early) and NOT fully pooled liquid (that's too far)
- The correct moment: cheese is drooping at the corners, translucent at edges, still holding some structure in the centre
- Pan visible — cast iron
- The cooked side is now the top (brown, crusted)

**DALL-E 3 prompt:**
```
Food photography, 30-degree angle. A single thin smash burger patty in a cast iron pan, just flipped — brown crust now facing up. One American cheese slice draped over the patty, mid-melt: corners drooping toward the pan, edges translucent and glossy, centre still holding its square shape. Pale yellow-orange processed cheese colour. Cast iron surface visible. Dark background, soft natural side light. No bun, no lettuce. This is the cheese-melt doneness cue — the visual message is "the cheese is melting correctly and the burger is nearly done." Shot at 30-degree angle, landscape format.
```

---

### Image 5 — Toasted bun (`step-s5-bun`)

**What it must show:** A brioche bun half, cut-side down in the pan briefly, now lifted to show the toasted cut surface. The cut surface is golden-tan from the beef fat left in the pan.

**Accuracy requirements:**
- Brioche bun — round, slightly domed exterior, soft and pale on the outer crust
- Cut surface: golden-tan, toasted, slightly crisp at the edges, flavoured by beef fat (this looks slightly richer and more golden than plain dry-toasted bread)
- NOT scorched or dark brown (30-45 seconds is the instruction)
- Pan or dark board visible below it

**DALL-E 3 prompt:**
```
Food photography, close 30-degree angle. A brioche burger bun half, just removed from a cast iron pan after 30 seconds of toasting cut-side down in beef fat. The cut surface faces the camera: golden tan, evenly toasted, slightly crisp at the outer edge, richer in colour than plain dry toast due to the rendered beef fat. The exterior of the bun is soft, pale golden, slightly domed — brioche texture. Dark timber board surface below. Soft natural side light. Simple, honest food photography. No other elements in frame.
```

---

### Image 6 — Hero (assembled cross-section) (`hero`)

**What it must show:** The finished assembled burger, cut cleanly in half with a sharp knife, the two halves pulled slightly apart to reveal the interior layers. This is the recipe card image — it must be instantly recognisable as a smash burger and accurately represent the Hone build.

**Accuracy requirements — layers visible from bottom to top:**
1. Bottom brioche bun (toasted cut-side, sauce smear visible)
2. Cream-coloured mixed sauce (mayo/ketchup/mustard) — cream-coloured with slight orange tint from ketchup
3. Dill pickle rounds (dark green, 1-2 visible in the cross-section)
4. Diced white onion (small white cubes on top of pickles)
5. Single thin smash patty — deep brown Maillard crust, approximately 1cm thick, lacey fat edges
6. American cheese draped over the patty — even, glossy, flat melt
7. Shredded iceberg lettuce — fine pale green-white shreds, a small tight layer (not a mountain)
8. Top brioche bun (slightly domed, golden exterior)

**NO tomato. NO rings of red onion. Single patty only.**

**Hero composition:**
- Eye-level or very slightly above eye-level shot (different from all other Hone shots, justified because the cross-section layers can only be read at eye-level)
- Burger cut cleanly in half, both halves leaning slightly apart
- Placed on the dark timber board
- Cheese still glossy (the burger was just assembled and shot immediately)
- Steam faintly visible above the cut
- Generous negative space on one side (off-centred placement)

**DALL-E 3 prompt:**
```
Food photography, eye-level shot. A smash burger cut cleanly in half, the two halves leaning slightly apart to reveal the interior. Placed on a raw dark timber board with generous negative space to the right. Layers visible from bottom to top: toasted brioche bun base with a cream-coloured sauce smear, two dill pickle rounds (dark green), a thin scattered layer of finely diced white onion, a single thin smash patty (approximately 1cm thick) with a deep brown Maillard crust and lacey fat edges, one American cheese slice melted evenly and glossy over the patty, a thin compact layer of shredded iceberg lettuce (fine pale-green shreds — not overflowing), and a slightly domed brioche bun top (golden, egg-washed). No tomato. No red onion rings. The cheese is still glossy — this was just assembled. A faint suggestion of steam. Dark dramatic background. Soft directional natural light from the left. Shot at true eye-level, 3:2 landscape format, NYT Cooking style, honest and accurate, not styled for Instagram.
```

**Iteration note for the hero:** Common AI failures: patty too thick (should be ~1cm thin), lettuce overflowing dramatically (should be compact), red onion rings appearing (wrong — diced white onion only), tomato visible. Reject and re-prompt with the specific failure called out explicitly.

**Alt text (copy into seed-recipes.ts `photo_url` field once approved):**
`A smash burger cut in half on a dark timber board, layers visible: toasted brioche bun, cream sauce, dill pickles, diced white onion, thin smash patty with deep brown lacey crust, melted American cheese, and shredded iceberg lettuce.`

---

## Cook accuracy validation — what to send to the Culinary & Cultural Verifier

Once images are generated, share all 6 as a batch. Ask the cook to validate:

1. **Mise en place:** All ingredients present? Nothing that isn't in the Hone recipe visible?
2. **Smash action:** Baking paper visible? Pan type correct (cast iron, not non-stick)? Patty spreading at correct thickness?
3. **Pre-flip crust:** Colour correct (caramel brown, not grey, not black)? Lacey fat edges visible? If colour is wrong, note what colour it is so we know what prompt adjustment to make.
4. **Cheese melt:** Correct mid-melt state? American cheese appearance (flat, glossy, not stringy)?
5. **Toasted bun:** Brioche correctly identified? Cut surface correctly golden-tan, not pale or scorched?
6. **Hero:** Layers correct? No lettuce or tomato? Correct bun type? Sauce colour correct? Onion type correct (white diced, not red rings)?

**Rejection protocol:** If the cook rejects an image, she provides:
- Which image (by stage name)
- What is visually wrong (specific, not "it looks off")
- What the correct visual state should look like

The Photography Director then adjusts the prompt and regenerates. One iteration loop before escalating to Patrick.

---

## Generation workflow (step by step for Patrick)

1. Open ChatGPT with a Plus or Pro subscription (DALL-E 3 access required)
2. Start a new conversation
3. Paste the context header: *"I am generating food photos for a recipe app. These must be accurate to the recipe, not generic stock-photo style. I will give you prompts one at a time."*
4. Paste Prompt 1 (mise en place). Generate. If the result shows lettuce or tomato, regenerate with "No lettuce, no tomato" added.
5. Save the best result (right-click → save image, rename to `smash-burger_step-s1-mise_v1.jpg`)
6. Paste Prompt 2. Etc.
7. After all 6 are saved, send them to me (Photography Director) or directly to cook for accuracy review.
8. Do NOT update seed-recipes.ts until the cook has signed off.

**File naming convention for candidates:**
`[recipe-slug]_[stage]_v[iteration].jpg`
e.g. `sma