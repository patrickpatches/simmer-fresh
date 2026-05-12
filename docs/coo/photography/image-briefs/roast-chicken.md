# Image Brief — Perfect Roast Chicken (`roast-chicken`)

> Status: Prompts written — images not yet generated
> Cook's photography notes: `docs/coo/culinary-research/roast-chicken.md` § Photography Notes
> Recipe data: `mobile/src/data/seed-recipes.ts` → `ROAST_CHICKEN`
> Attribution: Thomas Keller (*Bouchon*, Artisan 2004) — ⚠️ discrepancy: cook's research file says "Hone Kitchen" but seed data says Thomas Keller. COO to confirm and align before ship.
> Ledger: `docs/coo/visual-assets-ledger.md` → Roast Chicken section

---

## Research summary

### Recipe facts (from seed-recipes.ts)

**Ingredients:** Whole chicken 1.8kg · Unsalted butter 60g softened · Garlic cloves ×4 · Fresh thyme 6 sprigs · Lemon ×1 · Flaky salt 1 tbsp · Black pepper 1 tsp

**Steps:**
- s1 — Dry brine overnight (overnight uncovered in fridge)
- s2 — Bring to room temp + preheat (45 min)
- s3 — Butter under and over the skin
- s4 — Roast high then reduce (15 min at 230°C → 50–60 min at 190°C)
- s5 — Rest (15 min)

### The visual arc

A roast chicken is one of the most iconic food subjects — but also one of the most poorly photographed. The failure mode is a pale, shiny, wet-looking bird that suggests undercooking. The Hone recipe produces a **deep mahogany-golden skin** with clearly crisp texture. That colour and texture are the primary visual deliverable.

Thomas Keller's original roast chicken is legendary for its simplicity: no vegetables in the pan, no sauce poured over, no garnish. Just the bird, deeply bronzed, on a board. That is the visual reference for the hero.

### Key visual accuracy mandates

- **Skin colour:** Deep golden-brown — not pale gold, not mahogany-black, not shiny/wet. The cook's doneness cue is "even, deep golden-brown." If it looks like a rotisserie chicken from a service station (orange, shiny, greasy), that's wrong.
- **Skin texture:** Should look crisp and slightly puckered in places from the high-heat blister — not smooth and lacquered.
- **Butter under skin:** When photographing step s3, the butter should be visibly pushed under the skin — you can see the lump of butter through the translucent skin of the breast.
- **The bird is NOT trussed** — no string tied around the legs in this recipe. The legs are left open.
- **No vegetables in the pan** — Thomas Keller's method is the bare bird. No carrots, onions, or celery underneath. Just the chicken on a rack.
- **No sauce poured over** — the hero is the bird itself. Pan drippings are used as a simple jus, not a gravy.

### Attribution discrepancy flag

The culinary research file (`roast-chicken.md`) was written assuming "Hone Kitchen" as the source. The seed data (`seed-recipes.ts`) attributes Thomas Keller, *Bouchon*. This is a COO/culinary question to resolve — it doesn't change the photography, but the image brief notes it for the record.

### Existing hero URL assessment

Current hero in seed-recipes.ts: `https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=600&q=80`

**Assessment:** This Unsplash image is a known roast chicken photo. It has a reasonable chance of showing a properly golden whole chicken. However, it may show trussed legs, vegetables, a sauce, or a pale colour. Patrick must view directly and check against the validation checklist. **Status: CANDIDATE — inspect before deciding whether to generate.**

### Surface and lighting for roast chicken

The roast chicken hero is a high-contrast, warm-toned shot. It suits dark surfaces well.

**Surface:** Matte black slate or dark aged timber — both work. The golden skin pops dramatically against dark surfaces.
**Board:** A plain dark timber carving board if showing carved meat.
**Light:** Broad, even natural side light. The skin texture needs diffuse light to show the crispness without creating harsh reflections that make it look wet or lacquered.

---

## CC stock assessment

Roast chicken is extremely well-covered on Unsplash. The challenge: most stock roast chicken photos show trussed birds, sauced/glazed skins, or pale underdone colour. Filtering for specifically deep-golden, untrussed, Thomas Keller-style is difficult.

**Decision:** Inspect existing hero URL (`photo-1598103442097-8b74394b95c8`) first. For stage shots (dry brine, butter under skin), CC stock is extremely unlikely to show these specific moments — AI generation for all stage shots.

---

## Images required — 4 total

| Ref | Stage ID | Subject | Priority |
|---|---|---|---|
| A | `hero` | Finished roast chicken — whole golden bird on board OR carved showing juices | MUST HAVE |
| B | `step-s1-dry-brined` | Raw chicken after overnight dry brine — dry, tight, papery skin | MUST HAVE (doneness cue) |
| C | `step-s3-butter-skin` | Butter being pushed under the breast skin — visible lump under skin | MUST HAVE (technique moment) |
| D | `step-s4-golden` | Just-out-of-oven whole chicken — deep golden-brown skin, in or beside the roasting pan | MUST HAVE (KEY doneness cue) |

---

## DALL-E 3 Prompts

> Paste each prompt directly into ChatGPT (DALL-E 3). Generate 2–3 variants per prompt. Save as `roast-chicken_[stage]_v[N].jpg`.

---

### Image A — Hero (`roast-chicken_hero_v1.jpg`)

```
Food photography, 30-degree angle shot. A whole perfectly roasted chicken resting on a dark aged timber carving board. The skin is deep golden-brown — almost mahogany in the thigh area, rich amber-gold across the breast. The skin surface is slightly puckered and crisp-looking in texture, not smooth or lacquered. The legs are open (not trussed with string). No vegetables surrounding the bird. No sauce poured over. Fresh thyme sprigs tucked against the side. A carving knife rests just out of focus at the edge of the board. A small amount of clear golden jus has pooled at the base of the bird on the board. The board is dark aged timber. Dark dramatic background. Soft broad directional light from the left, slightly diffuse (so the skin reads as crisp, not shiny-wet). 3:2 landscape format. NYT Cooking style — honest, technically accurate, no Instagram styling.
```

**What to reject:**
- Pale gold or yellow skin → reject (must be deep golden-brown)
- Shiny, wet-looking, or lacquered skin → reject (should look crisp, not sauced)
- Trussed legs (tied with string) → reject
- Vegetables, carrots, or onions in the shot → reject
- Sauce or gravy poured over the bird → reject
- Overcooked/burned dark brown-black skin → reject

---

### Image B — Dry-brined raw chicken (`roast-chicken_step-s1-dry-brined_v1.jpg`)

**Doneness cue:** "After overnight, the skin should look tight and dry — slightly papery to the touch." — Cook's research file

```
Food photography, overhead shot. A raw whole chicken (approximately 1.8kg) on a wire rack set inside a roasting pan. The chicken is ready to go into the fridge after dry brining — the skin is visibly dry and tight, slightly papery looking, with a slightly dusted appearance from the salt. The skin is not wet or glistening. The bird is untrussed (legs open). Small visible salt crystals may be on the surface of the breast and thighs. There is no moisture pooling around the base of the bird on the rack — the salt has been absorbed. The rack and pan are stainless steel or dark-coated. Dark surface beneath. Soft overhead natural light. No garnish, no vegetables, no herbs yet — this is the plain dry-brined bird. 4:5 portrait format or 3:2 landscape. NYT Cooking style.
```

**What to reject:**
- Wet or glistening skin (should look dry and papery) → reject
- Cooked chicken (this is raw — pink/pale uncooked meat visible where skin gaps) → reject
- Trussed legs → reject
- Herbs or vegetables visible → reject

---

### Image C — Butter under skin (`roast-chicken_step-s3-butter-skin_v1.jpg`)

**Why this matters:** The cook calls this "the single most important technique distinction" — butter under the skin, not just on top. The visual must show the technique clearly.

```
Food photography, 30-degree angle shot. A close-up of a raw whole chicken breast being prepared. A hand (forearm and fingers visible) has separated the breast skin from the meat and is mid-motion pushing a knob of softened butter under it. Through the slightly translucent skin of the breast you can clearly see the shape of the butter lump being moved toward the centre. The butter outside the skin — the other half — is already rubbed over the surface, giving the breast a slightly shiny, buttery look. Fresh thyme leaves are visible on the board. Small garlic pieces are nearby. The raw breast meat shows pink through the partially separated skin. Dark aged timber board. Soft side light showing the butter's translucency through the skin clearly. Close crop — the frame is mostly the breast and the hand. NYT Cooking style.
```

**What to reject:**
- Butter only on the outside of the skin (the whole point is UNDER the skin) → reject
- Butter lump not visible through the skin → reject
- Cooked chicken → reject (this is raw preparation)
- No hand visible — must show the technique, not just the ingredient

---

### Image D — Golden out of oven (`roast-chicken_step-s4-golden_v1.jpg`)

**Doneness cue:** "The skin should be an even, deep golden-brown — not pale golden." — Cook's research file
**This is the most important stage shot.** The colour of the skin is the cue that tells the user when it's done.

```
Food photography, 30-degree angle shot. A whole roasted chicken just removed from the oven, still in its roasting pan (dark roasting pan or cast iron). The skin is deep golden-brown — rich caramel-amber across the breast, deeper mahogany-gold on the thighs and legs. The skin surface has visible texture: slightly puckered and crisped in places, particularly around the thigh and leg joints. A small pool of clear golden pan drippings is visible around the base of the bird in the roasting pan. Steam is rising faintly from the bird. The bird is untrussed. Fresh thyme sprigs are visible around the bird. The roasting pan is on a dark timber trivet or board (just pulled from the oven). Dark dramatic background. Soft directional light from the left. 3:2 landscape. NYT Cooking style — the skin colour is the hero of this image, everything else is secondary.
```

**What to reject:**
- Pale golden or yellow skin → reject (the doneness cue is DEEP golden-brown — pale skin reads as underdone)
- Burned/blackened skin → reject
- Wet or saucy-looking pan → reject (should be clear golden drippings, minimal)
- Trussed legs → reject
- No visible pan drippings (they're part of the payoff)

---

## Cook validation checklist

Patrick sends images to the Culinary Verifier. She runs this checklist before signing off.

### Hero (Image A)
- [ ] Skin colour is deep golden-brown (not pale gold, not burned black)
- [ ] Skin texture looks crisp, slightly puckered — not smooth or lacquered
- [ ] Legs are open (not trussed with string)
- [ ] No vegetables, sauce, or garnish that doesn't belong
- [ ] If carved: breast meat shows cooked-through white/pale colour (not pink)

### Dry-brined raw chicken (Image B)
- [ ] Skin looks dry and slightly papery — NOT wet or glistening
- [ ] No visible cooking — this is raw (pale uncooked skin)
- [ ] No herbs or vegetables already on the bird
- [ ] Legs open, no trussing string

### Butter under skin (Image C)
- [ ] Butter lump visibly pushing through/under the breast skin
- [ ] A hand is clearly performing the technique (not just the ingredient sitting there)
- [ ] Raw chicken (pink under the skin where visible)
- [ ] Butter visible on outside of skin too (or being applied)

### Golden out of oven (Image D)
- [ ] Skin is clearly deep golden-brown — the most important check
- [ ] Steam rising faintly (fresh out of the oven)
- [ ] Clear golden pan drippings visible in the pan
- [ ] No sauce poured over
- [ ] Legs open, no trussing string

---

## Generation workflow

1. Open ChatGPT (DALL-E 3 via ChatGPT Plus)
2. For each prompt: paste → generate → inspect against rejection criteria
3. If rejected: add the failure as explicit exclusion text and retry
4. Save as `roast-chicken_[stage]_v1.jpg` (increment version on iteration)
5. Send all candidates to Culinary Verifier with this brief
6. Update visual-assets-ledger.md: PENDING → CANDIDATE → APPROVED or REJECTED

---

## Status tracker

| Image | Prompt written | Generated | Cook reviewed | Outcome | Ledger updated |
|---|---|---|---|---|---|
| hero | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s1-dry-brined | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s3-butter-skin | ✅ | ⏳ | ⏳ | — | ⏳ |
| step-s4-golden | ✅ | ⏳ | ⏳ | — | ⏳ |

*Brief written by Photography Director · 2026-05-11*
