# Flour Tortillas

## Source recipe
`id: flour-tortillas` in `mobile/src/data/seed-recipes.ts`  
**Attribution:** Patrick N. — no video URL  
**Source notes:** Patrick's own recipe — soft, buttery, adapted over time from multiple sources.  
**Cultural origin:** Mexican (Northern Mexican tradition — flour tortillas are the staple of Sonora and Chihuahua, where wheat was introduced by Spanish settlers. Corn tortillas are central Mexico and south; flour tortillas are the north and the border regions).  
**Cuisine tag:** `mexican`. Type tag: `baking`.

---

## Discrepancies found and fixed vs. existing seed-recipes.ts

| Location | Issue | Fix applied in this file |
|---|---|---|
| `seed-recipes.ts` — primary fat | `Lard` listed as primary; butter as substitute | **Corrected: butter is the primary fat per Patrick.** Lard moved to substitute. |
| `seed-recipes.ts` — `chef` field | `'Patrick Nasr'` | Change to `'Patrick N.'` |
| `seed-recipes.ts` — `notes` field | Old wording | Change to: `"Patrick's own recipe — soft, buttery, adapted over time from multiple sources."` |
| `seed-recipes.ts` — `base_servings` | `5` | Change to `13` |
| `seed-recipes.ts` — ingredient amounts | 200g flour / 40g lard / 130ml water / 4g salt | Fat → butter 40g; salt → 6g. Flour and water stay at 200g / 130ml. |
| `seed-recipes.ts` — butter substitution text | "still delicious" | Remove "delicious" — voice violation |
| Old research file — `before_you_start` | Item 2 said "Use lard, not butter" | Reversed — butter is the primary fat here |
| Old research file — mise en place | Said "plain flour" | Corrected to bread flour |
| Old research file — tortilla size | 20–22cm (side plate) | Corrected to 12–13cm (taco size) — 29g dough balls |

**Engineer action required:** Apply all fixes in the left column to `seed-recipes.ts` before this recipe is considered migration-complete.

---

## Recipe maths — verified

Base recipe: 200g flour → ~13 tortillas.

| Ingredient | Amount | Per tortilla |
|---|---|---|
| Bread flour | 200g | ~15g |
| Unsalted butter | 40g | ~3g |
| Water | 130ml | ~10ml |
| Fine sea salt | 6g | ~0.5g |
| **Total dough** | **376g** | **~29g per ball** |

29g dough ball → ~12–13cm diameter tortilla (taco / street taco size). These are not wrap-sized — they are taco-sized. If a cook wants a larger wrap-style tortilla, they should use 50–55g balls from the same dough (which gives ~7 tortillas from 200g flour). Add this as a note in the app.

Hydration: 130ml water / 200g flour = 65% (slightly high end — produces a soft, extensible dough). Butter adds ~7g water (butter is ~18% water), so effective hydration is ~68.5%. The dough will be soft and slightly tacky — this is correct, not a mistake.

Salt: 6g / 200g flour = 3% — higher than bread (2%) but appropriate for tortillas, which carry bold fillings.

---

## 1. Hero

**Title:** Flour Tortillas  
**Attribution:** Patrick N.  
**Cuisine tags:** `mexican`  
**Type tags:** `baking`  
**Base servings:** 13 tortillas

---

## 2. At a Glance

| | |
|---|---|
| **Total time** | 90 min (15 min active + 45–60 min rest + 20 min rolling and cooking) |
| **Active time** | 35 min |
| **Difficulty** | Intermediate |
| **Leftover-friendly** | Yes — reheat in a dry pan in 15–20 seconds, no quality loss |
| **Cuisine** | Mexican (Northern — Sonoran flour tortilla tradition) |

---

## 3. Description

Soft, buttery flour tortillas made with high-protein bread flour — the kind that roll thin without tearing and stay pliable for long enough to fill and fold. Makes 13 small taco-sized tortillas (12–13cm) from 200g of flour. The technique is straightforward; the rest step is the mechanism that makes rolling effortless.

---

## 4. What to Know Before You Start

1. **Weigh every ingredient.** Flour tortillas are a hydration ratio. A heaped cup of flour versus a level one can be 20g apart, which produces a different dough entirely. This recipe was developed and tested by weight, not volume.
2. **Use softened butter, not melted.** Softened butter rubs into the flour and coats the proteins — that coating is what makes the tortilla pliable and rich rather than bready. Me