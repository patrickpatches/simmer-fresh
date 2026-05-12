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

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s1-mise` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s3-smash` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s4-crust` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s4-cheese` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |
| `step-s5-bun` | AI | DALL-E 3 | `image-briefs/smash-burger.md` | DALL-E 3 commercial | YES | PENDING | — | PENDING |

**Current hero placeholder (in seed-recipes.ts):** `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80`
**Accuracy status of current placeholder:** ❌ INACCURATE — shows lettuce and tomato; neither appears in the Hone smash burger recipe. Must be replaced before launch.

---

## Spaghetti Bolognese (`weekday-bolognese`)

> Research brief: `docs/coo/photography/image-briefs/bolognese.md` *(not yet created)*

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | `image-briefs/bolognese.md` | TBD | TBD | PENDING | — | PENDING |
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

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | CC-stock (CANDIDATE) / AI (fallback) | `photo-1612874742237-6526221588e3` (inspect first) | `image-briefs/carbonara.md` | Unsplash License | YES | PENDING | — | PENDING |
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
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-sauce-pre-cream` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-sauce-post-cream` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Thai Green Curry (`thai-green-curry`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-paste-cracking` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-curry-finished` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Chicken Schnitzel (`chicken-schnitzel`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-crumb-station` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-crust-golden` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-cross-section` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Beef Lasagne (`beef-lasagne`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-layers-visible` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Roast Lamb with Rosemary & Garlic (`roast-lamb-rosemary-garlic`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-crust-formed` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Fish & Chips (`fish-and-chips`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
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

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-herb-interior` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Pavlova (`pavlova`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-stiff-peaks` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-baked-shell` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |

---

## Chicken Shawarma (`chicken-shawarma`)

| Stage | Source type | Tool or URL | Prompt file | License | Commercial OK | Cook signoff | Patrick replacement | Status |
|---|---|---|---|---|---|---|---|---|
| `hero` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-char-formed` | AI | TBD | — | TBD | TBD | PENDING | — | PENDING |
| `step-sliced` | AI | TBD | — | TBD | TBD | PEND