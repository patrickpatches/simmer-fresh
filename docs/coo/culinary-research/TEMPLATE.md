# Recipe Content Template — DECISION-009

> **How to use this file:**
> Copy this template, rename it to `<recipe-slug>.md` (e.g. `pasta-carbonara.md`), and fill every section.
> Leave a field blank rather than guessing — blank is honest. Made-up content is worse than missing content.
> When you're done, the Senior Engineer will move your content into `seed-recipes.ts`.

---

## Recipe: [Title]

**Slug:** `recipe-id` (must match the `id` field in seed-recipes.ts exactly)

---

### At a glance

| Field | Your answer |
|---|---|
| `total_time_minutes` | e.g. `35` — total elapsed time start to finish, including hands-off time |
| `active_time_minutes` | e.g. `20` — time the cook is actually doing something |
| `difficulty` | `beginner` / `intermediate` / `advanced` |

**Why the split matters:** 35 min total with 10 min active (a braise) feels very different to 35 min total with 35 min active (a stir-fry). Users make better decisions when they know both numbers.

---

### What to know before you start (`before_you_start`)

**Maximum 3 items.** Each is one sentence. These are the things a cook absolutely must know before they pick up a pan. Not cooking tips — structural warnings.

Good examples:
- "This dish scrambles above 70°C — read the whole recipe before you start."
- "The meat needs to marinate overnight. Start this the day before."
- "This is a two-person dish maximum in a home kitchen. Scaling up narrows your safety window."

Bad examples (too vague, or tips not warnings):
- "This dish requires attention."
- "Use fresh ingredients for best results."

```
1. 
2. 
3. 
```

*(Leave blank if there are no structural warnings. Don't manufacture warnings that don't exist.)*

---

### Equipment (`equipment`)

List any equipment beyond a standard knife, chopping board, and saucepan. If the recipe only needs standard gear, leave blank.

Good examples: `Large pot`, `Wide skillet (not non-stick)`, `Fine grater / Microplane`, `Mortar and pestle`, `Stand mixer`, `Wok`, `Cast-iron skillet`

```
- 
- 
- 
```

---

### Mise en place (`mise_en_place`)

These are the discrete prep tasks the cook completes **before heat goes on**. Write each task as an action — what to do, what the result looks like.

Rules:
- Each item is one task, completable in one go
- Write for someone with their fridge door open and hands free — clear and calm
- Include quantity/size/texture cues: "fine dice" not just "chop"
- 4–8 items is the right range. Fewer than 4: maybe not needed. More than 8: consider splitting some tasks.

Example items:
- "Grate 60g Pecorino Romano finely — Microplane preferred, not shredded. Set aside."
- "Separate 3 egg yolks + 1 whole egg into a bowl. Whisk with the cheese and cracked pepper until thick and pale."
- "Cut guanciale into 1cm cubes. Room temperature fat renders more evenly — don't use it straight from the fridge."
- "Put a large pot of water on to boil. Salt it generously — it should taste like the sea."

```
- 
- 
- 
- 
```

---

### Finishing & tasting (`finishing_note`)

One paragraph. Chef's voice — second-person, present-tense. Tell the cook:
- What to look for before they plate
- How to know when it's right
- The one adjustment that fixes the most common problem

Example:
> "The sauce should coat the back of a spoon and flow slowly when you tip the plate. If it's too thick, it seized — add a splash of warm pasta water and toss off heat again. Taste for nothing: the guanciale and Pecorino carry all the salt this dish needs. More pepper is almost always the right call."

*(Leave blank if there's nothing meaningful to say — don't pad.)*

```
[Your finishing note here]
```

---

### Leftovers & storage (`leftovers_note`)

Practical storage and reheating note. One paragraph. Include:
- How long it keeps (fridge/freezer)
- How to reheat without ruining it
- Any creative second-use ideas (optional but good)

Be honest. If the dish doesn't keep well, say so. "Carbonara doesn't store gracefully" is more useful than a tip that produces scrambled eggs.

Example:
> "Keeps three days in the fridge. Reheat in a dry pan on medium — not the microwave, which turns the pork fibrous. Add a splash of stock to loosen. The flavour actually deepens on day two."

```
[Your leftovers note here]
```

---

## Checklist before handing off

- [ ] All fields filled (or explicitly left blank with a note)
- [ ] `total_time_minutes` and `active_time_minutes` are both set
- [ ] `difficulty` is exactly one of: `beginner`, `intermediate`, `advanced`
- [ ] `before_you_start` has at most 3 items
- [ ] Australian English throughout (capsicum, coriander, spring onion, plain flour, caster sugar)
- [ ] Mise en place items read as actions, not ingredient names
- [ ] Finishing note is chef voice — not food-blog prose
- [ ] No "simply", no "just", no "delicious"
