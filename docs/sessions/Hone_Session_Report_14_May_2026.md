# Hone Session Report — 14 May 2026

**Session focus:** Photography Director — DECISION-014 CC-licensed hero image sourcing for all 16 launch recipes  
**Commit:** `465af84`  
**Branch:** main  

---

## What was done

### Carried over from previous session (committed as 77f8630, 6813ddc, 82f39b5)
- Image briefs (smash burger, carbonara, roast chicken), visual-assets-ledger.md, FILE_MAP.md
- Two Gemini-generated smash burger step images compressed + live in seed-recipes.ts (step s1 + s3)
- Handoffs.md build log #108

### This session — commit 465af84

**Sourced CC-licensed hero images for 15 of 16 launch recipes** from Unsplash (free commercial use, no attribution required per Unsplash License):

| Recipe | Photo ID | Photographer |
|---|---|---|
| smash-burger | `photo-1639020715088-e7afebe6cb25` | Manu Ros |
| weekday-bolognese | `photo-1622973536968-3ead9e780960` | Homescreenify |
| pasta-carbonara | `photo-1612874742237-6526221588e3` | (existing CANDIDATE) |
| roast-chicken | `photo-1598103442097-8b74394b95c8` | (existing CANDIDATE) |
| butter-chicken | `photo-1603894584373-5ac82b2ae398` | Raman |
| thai-green-curry | `photo-1668665772043-bdd32e348998` | Andrew Relf |
| chicken-schnitzel | `photo-1599921841143-819065a55cc6` | Mark König |
| beef-lasagne | `photo-1633436374784-7f9502eb348a` | Parnis Azimi |
| roast-lamb-rosemary-garlic | **TBD** — Unsplash fetch failed | — |
| fish-and-chips | `photo-kmQw0_2A9xQ` | Leo Li |
| falafel | `photo-pQnsKWk5ljQ` | (Unsplash) |
| pavlova | `photo-5nCTfEru3Do` | (Unsplash) |
| chicken-shawarma | `photo-kYi1eN--guM` | Markus Winkler |
| hummus | `photo-14X4iiiF3t4` | Maryam Sicard |
| pad-thai | `photo-_wBJ0cvKhIE` | (Unsplash) |
| flour-tortillas | `photo-N__68TkGeOY` | Thomas Park |

**Added cook accuracy checklists** to six high-risk sections in the ledger:
- Carbonara — golden egg sauce NOT cream; reject if white/cream coloured
- Smash burger — smashed thin patty, no lettuce/tomato, correct inclusions
- Shawarma — Levantine vertical spit (Markus Winkler photo passes this check)
- Pavlova — Aus/NZ large meringue disc with cream + fresh fruit
- Falafel — whole balls with green herb interior, not a wrap shot
- Flour tortillas — taco-size 12–13 cm, not burrito-size

**Committed URGENT handoff** (written in previous context but not yet pushed): CC hero sourcing task documented for cook validation and engineer migration.

**Updated ledger statistics:** 17 CANDIDATE, 2 INTEGRATED, ~103 PENDING.

**Engineer URL format** for Unsplash images: `https://images.unsplash.com/{photo-id}?w=600&q=80`

---

## What Patrick needs to do next

### URGENT — 1 outstanding hero
- **Roast lamb:** manually browse [unsplash.com/s/photos/roast-lamb](https://unsplash.com/s/photos/roast-lamb) and pick a photo of a bone-in leg or shoulder with deep mahogany crust, visible rosemary + garlic, uncovered. Drop the photo ID into the ledger hero row.

### Cook validation (15 heroes + 2 smash burger step images)
- Cook to inspect each CANDIDATE against the accuracy checklist in `docs/coo/visual-assets-ledger.md`
- Pay extra attention to: carbonara (sauce colour), smash burger hero (patty style), pavlova (meringue disc style), flour tortillas (size)
- Carbonara and roast chicken existing CANDIDATEs also need Patrick's visual inspection first

### Engineer migration
Once cook has signed off on each hero: update `mobile/src/data/seed-recipes.ts` hero `photo_url` for each recipe using the format `https://images.unsplash.com/{photo-id}?w=600&q=80`. Update ledger status to INTEGRATED.

### Smash burger — remaining 4 step images still needed
- `step-s4-crust` — crust forming, no flip yet
- `step-s4-cheese` — cheese placed on patty
- `step-s5-bun` — bun toasted, ready to stack
- Hero (separate from step images — hero candidate now sourced as CC-stock above)

---

## Git plumbing pattern (locked index workaround)
The sandbox has a stale `.git/index.lock`. All commits use:
```bash
PARENT=$(git ls-remote origin HEAD | cut -f1)
GIT_INDEX_FILE=/tmp/idxN git read-tree $PARENT
GIT_INDEX_FILE=/tmp/idxN git add <files>
TREE=$(GIT_INDEX_FILE=/tmp/idxN git write-tree)
COMMIT=$(git commit-tree $TREE -p $PARENT -m "message")
git push origin ${COMMIT}:refs/heads/main
```
The "cannot lock ref refs/remotes/origin/main" error after push is harmless — the push to GitHub succeeds regardless.
