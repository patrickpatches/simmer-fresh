# Visual Assets Ledger

> Master log of every image in the Hone launch library.
> Per DECISION-014 (10 May 2026): AI-generated and CC-licensed stock images are permitted as temporary placeholders until Patrick's real photography replaces them recipe by recipe post-launch.
> **This ledger is the single source of truth for image provenance, licensing, and cook accuracy status.**

---

## How to use this ledger

- **Photography Director** adds a row when an image candidate is identified or generated.
- **Cook (Culinary & Cultural Verifier)** fills in the "Cook accuracy signoff" column with date and notes, or rejects with specific reason.
- **Engineer** reads this ledger to know which images are cleared for integration into `seed-recipes.ts` via `photo_url` fields.
- **Patrick** fills in "Patrick replacement date" once he has shot and approved a real photo replacing an AI/stock placeholder.

**Status values:**
- `PENDING` — image not yet generated/sourced
- `CANDIDATE` — image exists, awaiting cook accuracy review
- `APPROVED` — cook has signed off accuracy
- `REJECTED` — cook rejected; reason noted; regenerate needed
- `INTEGRATED` — engineer has added to seed-recipes.ts
- `REPLACED` — Patrick's real photo has superseded this entry

---

## Column guide

| Column | Meaning |
|---|---|
| Recipe slug | The `id` field in seed-recipes.ts |
| Stage | `hero` / `step-[id]-[label]` matching the step id in seed-recipes.ts |
| Source type | `AI` / `CC-stock` / `Real-photo` |
| Tool or URL | AI: the tool used (DALL-E 3, Midjourney V6, Imagen 3, Flux). CC: the Unsplash/Pexels URL |
| Prompt file | Path to the working brief where the full prompt lives |
| Photographer / model | CC stock: photographer credit. AI: the model version used |
| License | `Unsplash License` / `Pexels License` / `DALL-E 3 commercial` / `Midjourney commercial` / `CC0` / etc. |
| Commercial OK | `YES` / `NO` / `CHECK` |
| Cook signoff | Date + initials OR `PENDING` OR `REJECTED: [reason]` |
| Patrick replacement | Date when Patrick's real photo was substituted, or blank |
| Status | See status values above |

---

## Smash Burger (`smash-burger`)

> Research brief: `docs/coo/photography/image-briefs/smash-burger.md`
> Recipe data source: `mobile/src/data/seed-recipes.ts` (SMASH_BURGER constant)
> Chef reference: Andy Cooks (source chef, video: youtube.com/watch?v=oa2g6gB_1BU)
> **Cook accuracy checklist for hero CANDIDATE:** (1) SMASHED thin patty — no pub-style thick burger. (2) No lettuce or tomato — neither appears in the Hone recipe. (3) Brioche bun, American cheese, pickles, caramelised onion are correct inclusions.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1639020715088-e7afebe6cb25` (Manu Ros, Unsplash) | — | Unsplash License | YES | REJECTED: red onion rings (recipe uses white onion, finely diced); yellow processed cheese no longer matches cheddar primary. 2026-05-14 COO | — | REJECTED |
| `hero` (replacement) | CC-stock | `photo-1678110707493-8d05425137ac` (Arvid Skywalker, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-s1-mise` | AI | Gemini (Patrick) | `image-briefs/smash-burger.md` | Gemini commercial | YES | PENDING | — | CANDIDATE |
| `step-s3-smash` | AI | Gemini (Patrick) | `image-briefs/smash-burger.md` | Gemini commercial | YES | PENDING | — | CANDIDATE |
| `step-s4-crust` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s4-cheese` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s5-bun` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |

**Current hero placeholder (in seed-recipes.ts):** `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80`
**Accuracy status of current placeholder:** ❌ INACCURATE — shows lettuce and tomato; neither appears in the Hone smash burger recipe. Must be replaced before launch.
**CANDIDATE `photo-1639020715088-e7afebe6cb25` REJECTED (2026-05-14):** red onion rings (recipe uses white onion, finely diced) + cheese is yellow processed American (no longer primary since cheddar swap).
**REPLACEMENT CANDIDATE `photo-1678110707493-8d05425137ac` (Arvid Skywalker):** cheeseburger on black plate on cooling rack — awaiting cook accuracy check: (1) thin smashed patty visible, (2) cheddar melt (not yellow American), (3) no red onion rings, (4) no lettuce/tomato. Cook must confirm before APPROVED.

---

## Spaghetti Bolognese (`weekday-bolognese`)

> Research brief: `docs/coo/photography/image-briefs/bolognese.md` *(not yet created)*

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1622973536968-3ead9e780960` (Homescreenify, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-soffritto` | AI | TBD | `image-briefs/bolognese.md` | TBD | TBD | PENDING | — | PENDING |
| `step-mince-browned` | AI | TBD | `image-briefs/bolognese.md` | TBD | TBD | PENDING | — | PENDING |
| `step-sauce-reduced` | AI | TBD | `image-briefs/bolognese.md` | TBD | TBD | PENDING | — | PENDING |
| `step-pasta-tossed` | AI | TBD | `image-briefs/bolognese.md` | TBD | TBD | PENDING | — | PENDING |

---

## Spaghetti Carbonara (`pasta-carbonara`)

> Research brief: `docs/coo/photography/image-briefs/carbonara.md`
> Recipe data source: `mobile/src/data/seed-recipes.ts` (PASTA_CARBONARA constant)
> Chef reference: Gordon Ramsay (source chef, video: youtube.com/watch?v=5t7JLjr1FxQ — verify live before ship)
> **Note:** Existing hero URL `photo-1612874742237-6526221588e3` is a CANDIDATE — Patrick must visually inspect against cook checklist before confirming or replacing. 4 images total (hero + 3 stage shots).
> **Cook accuracy checklist for hero CANDIDATE:** (1) Sauce must be GOLDEN-yellow from egg yolks — NOT white or cream-coloured. (2) Spaghetti (not rigatoni or penne). (3) Guanciale or pancetta — no bacon rashers. (4) No cream visible. Reject immediately if sauce looks white/cream.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1612874742237-6526221588e3` (Unsplash) | `image-briefs/carbonara.md` | Unsplash License | YES | ✅ APPROVED 2026-05-14 COO — golden egg-yolk sauce (not cream-coloured), spaghetti correct, pancetta/guanciale visible, no cream | — | APPROVED |
| `step-s1-egg-paste` | AI | DALL-E 3 | `image-briefs/carbonara.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s2-guanciale` | AI | DALL-E 3 | `image-briefs/carbonara.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s4-combine` | AI | DALL-E 3 | `image-briefs/carbonara.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |

---

## Roast Chicken (`roast-chicken`)

> Research brief: `docs/coo/photography/image-briefs/roast-chicken.md`
> Recipe data source: `mobile/src/data/seed-recipes.ts` (ROAST_CHICKEN constant)
> Chef reference: Thomas Keller, *Bouchon* (Artisan 2004) — ⚠️ attribution discrepancy: cook's research file says "Hone Kitchen", seed data says "Thomas Keller". COO to resolve.
> **Note:** Existing hero URL `photo-1598103442097-8b74394b95c8` is a CANDIDATE — Patrick must visually inspect against cook checklist (deep golden skin, untrussed, no sauce). 4 images total.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock (CANDIDATE) / AI (fallback) | `photo-1598103442097-8b74394b95c8` (inspect first) | `image-briefs/roast-chicken.md` | Unsplash License | YES | PENDING | — | PENDING |
| `step-s1-dry-brined` | AI | DALL-E 3 | `image-briefs/roast-chicken.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s3-butter-skin` | AI | DALL-E 3 | `image-briefs/roast-chicken.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s4-golden` | AI | DALL-E 3 | `image-briefs/roast-chicken.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |

---

## Butter Chicken (`butter-chicken`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1603894584373-5ac82b2ae398` (Raman, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-sauce-pre-cream` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-sauce-post-cream` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Thai Green Curry (`thai-green-curry`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1668665772043-bdd32e348998` (Andrew Relf, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-paste-cracking` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-curry-finished` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Chicken Schnitzel (`chicken-schnitzel`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1599921841143-819065a55cc6` (Mark König, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-crumb-station` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-crust-golden` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-cross-section` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Beef Lasagne (`beef-lasagne`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1633436374784-7f9502eb348a` (Parnis Azimi, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-layers-visible` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Roast Lamb with Rosemary & Garlic (`roast-lamb-rosemary-garlic`)

> **Cook accuracy checklist for hero CANDIDATE:** (1) Bone-in leg or shoulder — reject any chops or rack-of-lamb. (2) Deep mahogany crust — not pale or pink. (3) Visible rosemary sprigs and garlic. (4) Uncovered — no foil tent. Cook must confirm this is clearly a lamb leg/shoulder and not a generic roast.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-1625604087024-7fb428fc4626` (James Kern, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-crust-formed` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Fish & Chips (`fish-and-chips`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-kmQw0_2A9xQ` (Leo Li, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-batter-golden` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Pan-Fried Barramundi (`barramundi`)

> Note: build #101 swapped FALAFEL to shipping and BARRAMUNDI to not_yet_shipping. Confirm with COO/Engineer which recipe is currently in the 16 launch set before generating images.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-skin-down` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-crispy-skin-up` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Falafel (`falafel`)

> Note: build #101 flipped FALAFEL to `not_yet_shipping: false`. Confirm it is in the launch 16 with COO.
> **Cook accuracy checklist for hero CANDIDATE:** (1) Whole falafel balls, not a wrap or pita. (2) Green herb interior visible (parsley/coriander) — the signature of freshly fried falafel. (3) Golden-brown crust. Reject if it's a plated falafel wrap shot.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-pQnsKWk5ljQ` (Anton, Unsplash) | — | Unsplash License | YES | ✅ APPROVED 2026-05-14 COO — jade-green interior visible in halved falafel (hero of what good falafel looks like); golden-brown crust; ball shape; no pita wrap | — | APPROVED |
| `step-herb-interior` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Pavlova (`pavlova`)

> **Cook accuracy checklist for hero CANDIDATE:** (1) Australian/NZ style — large meringue disc, not individual meringue kisses. (2) Whipped cream topping with fresh fruit (strawberries, kiwi, passionfruit, blueberries). (3) Crisp white exterior. Reject French-style meringue or île flottante.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-5nCTfEru3Do` (Eugene Krasnaok, Unsplash) | — | Unsplash License | YES | ✅ APPROVED 2026-05-14 COO — white meringue, crisp ruffled exterior, whipped cream, fresh strawberries and blueberries. Individual-size rather than large disc noted; visual language is unmistakably pavlova | — | APPROVED |
| `step-stiff-peaks` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-baked-shell` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Chicken Shawarma (`chicken-shawarma`)

> **Cook accuracy checklist for hero CANDIDATE:** (1) Cooked/charred chicken — not raw or marinated. (2) Levantine presentation — plated sliced shawarma with pita and/or accompaniments, OR charred spit. (3) NOT a Greek gyro or Turkish doner. Replacement candidate `photo-1561620141-343a829938de` (Leslie del Moral) shows cooked plated shawarma with pita and lime — cook to confirm Levantine accuracy.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` (superseded) | CC-stock | `photo-kYi1eN--guM` (Markus Winkler, Unsplash) | — | Unsplash License | YES | ⚠️ CONDITIONAL 2026-05-14 COO — chicken is uncooked/marinated, not charred. Superseded by replacement candidate 2026-05-15 | — | REPLACED |
| `hero` (replacement) | CC-stock | `photo-1561620141-343a829938de` (Leslie del Moral, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-char-formed` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-sliced` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Hummus (`hummus`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-14X4iiiF3t4` (Maryam Sicard, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |

---

## Pad Thai (`pad-thai`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-_wBJ0cvKhIE` (Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-egg-ribbons` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Flour Tortillas (`flour-tortillas`)

> **Cook accuracy checklist for hero CANDIDATE:** (1) TACO-SIZE tortillas — 12–13 cm diameter. Reject burrito-size (25+ cm). (2) Char marks from comal/cast iron visible. (3) Stack or tacos presentation — not a wrap or quesadilla.

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock | `photo-N__68TkGeOY` (Thomas Park, Unsplash) | — | Unsplash License | YES | REJECTED: primary subject is a Lone Star Beer can (branded product); tortillas are props. Alcohol branding cannot appear in hero images. Need replacement: taco-size flour tortillas with char marks, stacked or as tacos, no branding. 2026-05-14 COO | — | REJECTED |
| `hero` (replacement) | CC-stock | `photo-1693193433392-da83457dff20` (Michael Kahn, Unsplash) | — | Unsplash License | YES | PENDING | — | CANDIDATE |
| `step-comal-char` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Ledger statistics

| Metric | Count |
|---|---|
| Total images required (est.) | ~120 |
| Images with APPROVED status | 3 (carbonara hero, falafel hero, pavlova hero) |
| Images with CANDIDATE status | 16 (13 hero CC-stock from 15 May batch + 2 smash burger step AI + replacement candidates for smash-burger, flour-tortillas, shawarma)