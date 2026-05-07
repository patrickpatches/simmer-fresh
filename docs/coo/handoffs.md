# Handoffs

> The cross-chat baton-pass log. Every specialist reads this at session start and writes to it at session end.

## Format

Each handoff is a block. Newest at the top.

```
### HANDOFF → [Receiving specialist] · YYYY-MM-DD · [STATUS]
**From:** [Originating specialist]
**Subject:** One-line description
**Why:** Why this handoff exists
**What's done:** What the originating specialist completed
**What's needed:** What the receiving specialist should do
**Files touched:** Paths to anything they need to read
**Blocks:** What downstream work is blocked until this completes
```

Statuses: **OPEN** (waiting for receiver), **IN PROGRESS** (receiver started), **DONE** (receiver completed and confirmed).

When a handoff is DONE, leave it in the file for one week so it's auditable, then move it to `archive/handoffs-YYYY-MM.md` at the end of the month.

---

## Open handoffs

### HANDOFF → Senior Engineer · 2026-05-08 · OPEN (ATTR-FAIL — fix 16 broken attribution URLs in seed-recipes.ts)
**From:** Culinary & Cultural Verifier
**Subject:** 16 recipes have `video_url` values that violate Golden Rule 1 — fix before any recipe ships
**Why:** The full attribution audit (`docs/coo/culinary-audit.md`, 2026-05-08) found 16 of 45 seed recipes link to a channel homepage, site root, about page, or chef listing page — none of which point to a specific recipe. Under Golden Rule 1, every chef-attributed link must be live and point to the specific recipe, not a channel or site. None of these recipes can ship until the link is correct or the attribution is reframed as a book citation / "inspired by" with no URL.
**What's needed:**
For each recipe below, either:
(a) Find the specific YouTube `watch?v=` video or specific recipe page URL and update `video_url` in `seed-recipes.ts`, OR
(b) Change attribution to a book citation format — update `source.notes` to include the book title, and remove or null `video_url`. The `chef` field stays as-is.

| Recipe const | Chef | Current broken URL | Fix type |
|---|---|---|---|
| `CHICKEN_ADOBO` | Anthony Bourdain / No Reservations | `@AnthonyBourdainPartsUnknown` (channel + wrong show) | Find No Reservations Philippines clip or use book citation |
| `BEEF_STEW` | Jacques Pépin | `/c/HomeCookingwithJacquesPepin` (channel) | Find specific beef stew episode on that channel |
| `ROAST_CHICKEN` | Thomas Keller / Bouchon | `@ChefThomasKeller` (channel) | Find specific roast chicken video or use Bouchon book citation |
| `PRAWN_TACOS_PINEAPPLE` | Andy Cooks | `@andy_cooks` (channel) | Find specific prawn taco/pineapple video |
| `FRENCH_ONION_SOUP` | Anthony Bourdain / Les Halles | `@AnthonyBourdainPartsUnknown` (channel + wrong show) | Find Les Halles video or use *Les Halles Cookbook* citation |
| `SCRAMBLED_EGGS` | Gordon Ramsay | `@GordonRamsay` (channel) | The F Word scrambled eggs clip is widely available — find `watch?v=` |
| `WEEKDAY_BOLOGNESE` | Andy Cooks | `@andy_cooks` (channel) | Find specific bolognese video |
| `MUSAKHAN` | Reem Kassis / The Palestinian Table | `reemkassis.com/` (site root) | Find specific musakhan page or use *The Palestinian Table* book citation |
| `KAFTA` | Anissa Helou / Feast | `anissas.com/` (site root) | Find specific kafta page or use *Feast* book citation |
| `HUMMUS` | Reem Kassis / The Palestinian Table | `reemkassis.com/` (site root) | Find specific hummus page or use *The Palestinian Table* book citation |
| `FATTOUSH` | Anissa Helou / Lebanese Cuisine | `anissas.com/` (site root) | Find specific fattoush page or use *Lebanese Cuisine* book citation |
| `SOURDOUGH_MAINTENANCE` | Chad Robertson / Tartine Bakery | `tartinebakery.com/about` (about page) | Find specific video or use *Tartine Bread* book citation |
| `SOURDOUGH_LOAF` | Chad Robertson / Tartine Bakery | `tartinebakery.com/about` (about page) | Find specific video or use *Tartine Bread* book citation |
| `RISOTTO` | Marcella Hazan | `giulianohazan.com/` (site root — also Giuliano's site, not Marcella's) | Find specific mushroom risotto page or use *Essentials of Classic Italian Cooking* book citation |
| `RAMEN` | Ivan Orkin / Ivan Ramen | `ivanramen.com/` (site root) | Find specific recipe page or use *Ivan Ramen* book citation |
| `DAL` | Madhur Jaffrey | `thehappyfoodie.co.uk/chefs/madhur-jaffrey/` (chef listing page) | Find specific tarka dal page on Happy Foodie or use *Madhur Jaffrey's Curry Easy* book citation |

**Also flag for review:** `BEEF_LASAGNE` — the URL `https://www.nytimes.com/recipes/12869/marcella-hazans-bolognese-meat-sauce.html` is a specific page (PASS) but it links to a Bolognese sauce recipe, not a lasagne. The attribution notes should clarify: "Sauce adapted from Marcella Hazan's bolognese; assembled as lasagne — Hone Kitchen." Update `source.notes` accordingly.

**Files touched:** `mobile/src/data/seed-recipes.ts` — `source.video_url` and `source.notes` fields only. No step or ingredient changes.
**Full audit detail:** `docs/coo/culinary-audit.md` — per-recipe attribution notes with context on each failure.
**Blocks:** All 16 affected recipes from shipping. This is a brand-safety issue, not just a QA item.

---

### HANDOFF → COO · 2026-05-07 · DONE ✅ (Cook briefed in writing — engineer unblocked for 11-recipe migration)
**Closed by COO 2026-05-07.** Cook's brief at `docs/coo/specialists/culinary-verifier.md` now carries an explicit "RETIRED FIELDS — DO NOT USE" section at the top of "How you work," naming `whole_food_verified` and instructing zero use in any new research file. A session-end `grep -i "whole_food..."` check has been added to the cook's "At session end" ritual so any drift is caught before close. Patrick is sending the cook a paste-back to acknowledge directly. Engineer cleared to proceed with the 11-recipe migration.

### Original handoff (preserved for audit) → COO · 2026-05-07 · OPEN URGENT (brief the Cook — whole-food field is dead)
**From:** Patrick (via Senior Engineer)
**Subject:** The cook's research database had whole-food references throughout. Engineer cleaned them. Cook must be told to never use the term again.
**Why:** The `whole_food_verified` field was retired across the entire repo on 2026-05-07 (commits `21198e5` + `474f500`). When the engineer ran the cleanup, fifteen of the sixteen recipe research files in `docs/coo/culinary-research/` still had a "Whole-food claim:" or "Whole-food verified:" line in their audit sections — the cook had been adding it as a standard audit checkbox. The lines have been stripped, but if the cook keeps following the old pattern, the term will leak back in next time research lands. Patrick's words: he wants this fully addressed before the 11-recipe migration proceeds, so we don't ship an APK with the term re-introduced through a new research file.

**What's already done (Engineer):**
- Stripped 15 `Whole-food claim:` / `Whole-food verified:` lines from the cook's research files in `docs/coo/culinary-research/`. Smash-burger left intentionally as the retirement narrative.
- Verified `docs/coo/culinary-research/TEMPLATE.md` (the cook's template) is clean — no mention there.
- Verified `docs/coo/specialists/culinary-verifier.md` (the cook's brief) is clean — Patrick had already cleaned this earlier.
- Schema, seed data, SQLite column, prototypes, BUGS.md, command-centre.md, roadmap.md, handoffs.md — all stripped. Only the URGENT handoff and the smash-burger retirement narrative still mention it, both deliberately.

**What's needed (COO actions):**
1. **Brief the Cook explicitly:** the whole-food concept is retired. Don't add `whole_food_verified` to any new recipe data. Don't include a "Whole-food claim" or "Whole-food verified" line in the audit section of new research files.
2. **Update the cook's standing brief if needed.** The current `docs/coo/specialists/culinary-verifier.md` is clean — confirm no follow-up edits required, or add an explicit "do not use" note if you think the cook needs the reminder in writing.
3. **Confirm to Senior Engineer when done** so the 11-recipe migration can proceed without risk of re-introducing the term through new research files.
4. **Future-proof:** consider adding a one-line check to the cook's session-end checklist — `grep "whole_food" docs/coo/culinary-research/<new-file>.md` should return zero hits.

**Files referenced:**
- `docs/coo/culinary-research/*.md` (cleaned, except smash-burger.md retirement narrative)
- `docs/coo/specialists/culinary-verifier.md` (already clean)
- `docs/coo/culinary-research/TEMPLATE.md` (already clean)

**Blocks:**
- The 11-recipe DECISION-009 migration (separate handoff below) is paused until the COO confirms the Cook has been briefed. Patrick's call — he doesn't want the term to come back in a Cook update.

---

### HANDOFF → Senior Engineer · 2026-05-07 · OPEN URGENT (kill whole_food_verified + verify all recipes show Prep + Equipment)
**From:** Patrick (via COO)
**Subject:** Two related cleanups: remove the whole-food-verified concept from the entire repo, and verify every recipe actually renders the Prep and Equipment sections on-device
**Why:** The `whole_food_verified` field has caused recurring problems — it blocked SMASH_BURGER from rendering (6 May), the `.refine()` was removed, but the field remains in the schema and data. Patrick has decided to drop the concept entirely. Separately, Patrick is still seeing many recipes on-device with no Prep section and no Equipment list. Both need a definitive end.

**TASK 1 — Remove whole_food_verified from the entire repo, locally and on GitHub.**

Surfaces to clean (30 files referenced; engineer should grep to confirm):
- `mobile/src/data/types.ts` — remove the field from the Zod schema
- `mobile/src/data/seed-recipes.ts` — strip the field from every recipe object
- `mobile/db/schema.ts` — remove the SQLite column (write a migration if data exists)
- `mobile/db/seed.ts` and any seeder code — remove field references
- Any UI rendering the badge: `mobile/app/recipe/[id].tsx`, RecipeCard, recipe-detail-v2.html, recipe-card-v2.html, recipe-detail-v2.1.html prototypes
- Documentation: `BUGS.md`, `docs/coo/handoffs.md` (this file), `docs/coo/command-centre.md`, all session reports under `docs/sessions/` (these are historical — leave session-report mentions alone, they're the diary; only strip live reference docs)
- Cook's research files: `docs/coo/culinary-research/*.md` — strip the field from each (the COO has already removed the rule from CLAUDE.md and the cook brief)

Approach:
1. Grep to find every reference. Keep historical session reports as-is (they're the diary).
2. Remove the Zod field, the data field on every recipe, the SQLite column with a migration, the UI badges, and any tests.
3. Run `npx tsc --noEmit` to confirm nothing else references it.
4. Commit with a clear message and push to `main`.

**TASK 2 — Audit and complete the Prep + Equipment data on every recipe Patrick can browse.**

Patrick is finding recipes on-device with empty Prep and Equipment sections. The 11-recipe DECISION-009 migration handoff (also in this file, queued before this) covers 11 of those. After that lands, this task adds the verification layer:

1. Run a script or manual pass: for every recipe in `seed-recipes.ts`, check `equipment.length > 0` AND `mise_en_place.length > 0`. Output the list of recipes still empty.
2. For each empty recipe, check whether a research file exists in `docs/coo/culinary-research/<recipe-slug>.md`. If yes, migrate the data. If no, that recipe is on Cook's Batch 2 — list it back to the COO for Cook handoff.
3. The UI must NOT silently hide the section if the data is empty. Instead, when both fields are empty, the recipe should not yet be browsable — or render a clear "Recipe being upgraded" state. Pick the cleanest option, document the call.
4. Verify on-device that every recipe Patrick can open has both sections visible with real content.

**Validation gate before declaring done:**
- `npx tsc --noEmit` passes
- Brace + JSX balance check passes (per R-014 mitigation)
- `tail -c 200` of every modified large file shows clean end of file
- All recipes browsable show Prep + Equipment with content
- No grep hit for `whole_food_verified` anywhere except historical session reports
- Patrick validates on-device — and only Patrick closes the issue per CLAUDE.md

**Files touched:** Per grep — `mobile/src/data/types.ts`, `mobile/src/data/seed-recipes.ts`, `mobile/db/schema.ts`, `mobile/db/seed.ts`, multiple UI files in `mobile/app/`, multiple prototype HTML files, multiple culinary-research markdown files, BUGS.md, this handoffs file
**Cost:** ~1 session for both tasks combined
**Blocks:** Recipe quality on-device — currently Patrick sees empty sections even on supposedly-completed recipes

---

### HANDOFF → Senior Engineer · 2026-05-07 · OPEN (DECISION-009 — 11-recipe migration)
**From:** COO
**Subject:** Migrate 11 recipes that already have research files into seed-recipes.ts with full DECISION-009 fields
**Why:** Per the engineer's 7 May handover, the recipe audit found 6 recipes fully populated (Batch 1), **11 recipes that have research `.md` files in `docs/coo/culinary-research/` ready to migrate**, and 27 recipes still waiting on Cook's Batch 2 research. The 11-recipe migration is unblocked — research already exists, no Cook input needed.
**Recipe ↔ source file ↔ seed line map (verified 2026-05-07):**

| Seed const | Line | Recipe id | Research file |
|---|---|---|---|
| `SMASH_BURGER` | 42 | `smash-burger` | `culinary-research/smash-burger.md` |
| `PASTA_CARBONARA` | 253 | `pasta-carbonara` | `culinary-research/carbonara.md` |
| `ROAST_CHICKEN` | 432 | `roast-chicken` | `culinary-research/roast-chicken.md` |
| `HUMMUS` | 676 | `hummus` | `culinary-research/hummus.md` |
| `THAI_GREEN_CURRY` | 1150 | `thai-green-curry` | `culinary-research/green-curry.md` |
| `PAD_THAI` | 1320 | `pad-thai` | `culinary-research/pad-thai.md` |
| `WEEKDAY_BOLOGNESE` | 1775 | `weekday-bolognese` | `culinary-research/bolognese.md` |
| `LAMB_SHAWARMA` | 2178 | `lamb-shawarma` | `culinary-research/shawarma.md` |
| `BUTTER_CHICKEN` | 2709 | `butter-chicken` | `culinary-research/butter-chicken.md` |
| `BARRAMUNDI` | 3130 | `barramundi-lemon-butter` | `culinary-research/barramundi.md` |
| `PAVLOVA` | 3200 | `pavlova` | `culinary-research/pavlova.md` |

`FALAFEL` (line 4416) is the migration template — copy field shapes verbatim. Note `culinary-research` filenames don't always match recipe ids (e.g. `barramundi.md` → `barramundi-lemon-butter`, `green-curry.md` → `thai-green-curry`, `shawarma.md` → `lamb-shawarma`, `bolognese.md` → `weekday-bolognese`, `carbonara.md` → `pasta-carbonara`).

**Note:** the `whole_food_verified` field was retired 2026-05-07 — the concept caused recurring data drift. Don't add it. Schema, seed data, and DB column have all been removed; the migration is in `db/schema.ts` v7.
**What's needed:**
1. For each of the 11 recipes, read the corresponding `.md` source and migrate the new sections into `mobile/src/data/seed-recipes.ts`: `total_time_minutes`, `active_time_minutes`, `difficulty`, `equipment[]`, `before_you_start[]`, `mise_en_place[]`, `finishing_note`, `leftovers_note`. Existing fields (steps, ingredients, etc.) stay untouched.
2. After each recipe migration, validate the schema parses (`npx tsc --noEmit`) and visually verify last 5 lines (per R-014 mitigation).
3. After all 11, run a full `tsc --noEmit` on `seed-recipes.ts` and trigger a build.
4. **Don't combine with the step-flow audit fixes** (separate 6 May handoff, 10 HIGH-priority items). Keep this as its own commit and build for review.
**Cost:** Engineer estimates ~half a session.
**Files touched:** `mobile/src/data/seed-recipes.ts`
**Blocks:** Patrick seeing the full DECISION-008 sections on these 11 launch-priority recipes (currently they render with the same UI but with empty equipment/prep/finishing/leftovers — looks broken even though it's just missing data).

---

### HANDOFF → COO · 2026-05-07 · OPEN
**From:** Senior Engineer (Claude)
**Subject:** REGN-006 + REGN-007 fixed; build #93 dispatched on `4725618`; Cook Batch 2 + 11-recipe migration still open
**Why:** Patrick reported Equipment + Prep sections missing on most recipes (REGN-006), and Pantry STILL NEED chip state broken across three symptoms (REGN-007). Both have been root-caused, fixed in code, pushed to `main`, and a fresh APK build is in flight. There are tracked follow-ups the COO should be aware of and route correctly.

**What's done:**
- Diagnosed REGN-006 as a UI regression in `mobile/app/recipe/[id].tsx` — working tree had dropped 443 lines including the entire DECISION-008 UI block (At a glance / What to know / Equipment / Prep / Finishing & tasting / Leftovers & storage). Data was in the schema and SQLite; UI just wasn't rendering it. Restored from HEAD; re-applied the Pressable+View Android split on header buttons, title-card pill, Watch link, expand chip, and `MiseItem`. Renamed UI label "Mise en place" → "Prep" per Patrick — schema field `mise_en_place` unchanged.
- Diagnosed REGN-007 as a single architectural bug behind three symptoms: chip's `added` boolean lived in a local `Set<string>` on `RecipeMatchCard`. Inverted the state flow — chip state is now DERIVED from `shoppingNameSet` (a memoised normalised name set off the live `shoppingItems`). All mutations route through `addToShoppingList` / `removeFromShoppingList` on the parent. `useFocusEffect` re-fetches the shopping list on tab return so Shop-tab edits propagate. Toast holds the ingredient *name*, not chip state, so undo survives chip re-renders. All 5 chip paths Patrick called out are wired in code.
- Audited every recipe in `seed-recipes.ts`. Result: 6 fully populated (Batch 1), 11 have research files ready and need engineering migration, 27 have no research yet (Cook's Batch 2). Audit table is in BUGS.md and the session report.
- Pushed commit `4725618` to `origin/main`.
- Dispatched build #93 (`https://github.com/patrickpatches/hone/actions/runs/25489339565`) on Patrick's explicit go.
- Wrote session report `docs/sessions/Hone_Session_Report_07_May_2026_3.md`.
- Per CLAUDE.md, **no GitHub issues self-closed**. Patrick validates and closes.

**What's needed (COO actions):**
1. **Track build #93.** When it finishes and Patrick validates the on-device fixes for REGN-006 and REGN-007, close those tickets in BUGS.md and update the issue tracker.
2. **Open a new handoff to the Engineer for the 11-recipe DECISION-009 migration.** Source data is in `docs/coo/culinary-research/*.md` for: smash-burger, pasta-carbonara, weekday-bolognese, butter-chicken, thai-green-curry, pavlova, roast-chicken, barramundi-lemon-butter, lamb-shawarma, hummus, pad-thai. Estimate: half a session. Until that lands, those 11 recipes will render the screen exactly as before — no broken state, just fewer sections.
3. **Cook's Batch 2 (27 recipes)** still has no research and is blocked on the Cook authoring `docs/coo/culinary-research/<recipe-id>.md` files. The list is in BUGS.md REGN-006 audit table. Decide whether to escalate or spread across multiple cook sessions.
4. **Risk register entry needed.** The Edit tool truncated `pantry.tsx` and `recipe/[id].tsx` mid-write twice during this session — same class as REGN-003 (3 May). Caught both times by `npx tsc --noEmit` flagging JSX-not-closed errors at impossible-looking line numbers, then verified with `tail -c` showing the byte stream ending mid-attribute. Worth an `R-NNN` entry calling for "always run `tsc --noEmit` after any large file edit; verify the last line before assuming the write completed."

**Files touched:**
- `mobile/app/recipe/[id].tsx` — DECISION-008 sections restored, "Prep" rename, 5× Pressable+View splits.
- `mobile/app/(tabs)/pantry.tsx` — chip state architecture inverted, `useFocusEffect` added, `useRef` typing fixed (pre-existing TS error).
- `BUGS.md` — REGN-006 + REGN-007 entries with full root-cause notes and audit table.
- `docs/sessions/Hone_Session_Report_07_May_2026_3.md` — session report.
- This file — current handoff.

**Blocks:**
- Cook's Batch 2 authoring blocks the 27-recipe DECISION-009 migration to seed data.
- Engineering 11-recipe migration is unblocked — research files exist; just needs Engineer time.

---

### HANDOFF → Senior Engineer · 2026-05-06 · OPEN
**From:** Culinary Verifier (Claude)
**Subject:** Step-flow audit — 28 issues across 19 recipes in seed-recipes.ts
**Why:** Full chef's audit of every cook step in all 39 recipes in `mobile/src/data/seed-recipes.ts`. Cross-referenced steps against ingredients and prep fields. 28 issues found across 19 recipes: missing steps, hidden advance prep time, unreferenced ingredient prep, and one Golden Rule 1 violation.
**Full audit:** `docs/coo/culinary-research/step-flow-audit.md` — read before touching seed data.

**HIGH priority — fix before ship (10 issues):**

1. **sourdough-loaf** — Add s6 `{ id: 's6', title: 'Rest — do not cut yet', content: '...1 hour on wire rack...', timer_seconds: 3600 }`. The current why_note in s5 is the only place this appears. User who cuts early gets a gummy crumb.

2. **ramen** — Chashu pork (i7) is a 2-hour preparation with no step. Options in priority order: (a) add a make-ahead s0 with the chashu method; (b) add a prep note in i7 linking to an external method; (c) replace with `'Roasted pork shoulder, sliced (or store-bought char siu)'`. Minimum: option (b).

3. **chicken-adobo** — s4 says "Serve over steamed white rice" but rice is not an ingredient and no step cooks it. Add rice as an ingredient with a parallel cook note (start rice at s2 — the 35-min braise window is plenty of time).

4. **beef-rendang** — Kerisik (i3) requires toasting desiccated coconut and pounding it in a mortar (~10–15 min active). This exists only as ingredient prep. Add a kerisik-making step between s4 and s5 with a note that it can be done during the 2-hour braise window.

5. **curry-laksa** — Tofu (i2) is listed with prep "pan-fried until golden" but no step fries it. s5 just adds it to the broth. Add a tofu pan-frying step between s3 and s4.

6. **barramundi** — `time_min: 20` hides a mandatory 30-min skin-drying step (s1 timer_seconds: 1800). Update time_min to 50. Also: asparagus (i9) has prep "Blanched 2 minutes" but no step blanches it — add a note in s3 (5–6 min window while fish sears skin-side).

7. **pavlova** — `time_min: 150` understates actual time (minimum ~3h 10min). Update to 210. Also: add room-temp egg white instruction as the first line of s1.

8. **saag-paneer** — `video_url: 'https://www.youtube.com/@JoshuaWeissman'` is the channel homepage — Golden Rule 1 violation. Find the specific Joshua Weissman saag paneer video URL, or change `source.chef` to `'Hone Kitchen'` and remove the video_url.

9. **butter-chicken** — `time_min: 90` hides 4-hour minimum marinade. Update to 330. *(Already flagged Batch 2 — confirming still open.)*

10. **roast-chicken** — `time_min: 90` hides overnight dry brine. *(Already flagged Batch 2 — confirming still open.)*

**MEDIUM priority — fix before ship (9 issues):**

11. **kafta** — s5 references "sumac onions" (thinly sliced onion tossed with sumac) but: (a) no sliced onion exists in the ingredients, (b) no step makes this. Add `{ id: 'i11', name: 'White onion, thinly sliced, for serving', ... }` and add a prep instruction to s5.

12. **musakhan** — i9 `'Pine nuts, toasted'` — no step toasts them. Add to s4: "Toast pine nuts in a dry pan 2–3 min over medium heat, stirring constantly, until golden."

13. **pad-thai** — s3 says "Add protein to the wok edge" without differentiating tofu-first timing. Tofu takes 2–3 min longer than prawns. Update s3: fry tofu first until lightly golden, push aside, then add prawns. (Linked to the substitution data fix already documented in `pad-thai.md`.)

14. **nasi-lemak** — Dried chillies need a 20-min pre-soak before s1 can start; no step or timing note tells the user. Also: belacan is listed as "toasted" in ingredient prep but no step toasts it. Add both to an opening instruction or the start of s1.

15. **beef-rendang** — Same dried chilli soak issue as nasi-lemak. Add opening instruction: soak chillies in boiling water 20 min before starting s1.

16. **curry-laksa** — s4 says "Add chicken stock and prawn stock" but the volume of prawn stock to use is only in the s1 why_note. Move to s4 step content: "Add 400ml chicken stock and all the prawn stock."

17. **saag-paneer** — s5 "Serve with basmati rice or naan" — neither in ingredients, no cook step. Add rice as a side ingredient with a concurrent cooking note (start rice at the beginning of s3's 15–18 min masala build).

18. **chicken-katsu** — Rice (i19) has no cook step. Add a rice-cooking note within s1 (curry simmers 20 min — enough time to cook rice concurrently).

19. **pavlova** — Add room-temp egg white instruction as first line of s1 (already listed under HIGH item 7 above — same fix).

**LOW priority — improve before ship (9 issues):**

20. **thai-green-curry** — s4 uses generic "vegetables". Name "Thai eggplant" specifically.
21. **braised-short-ribs** — s2 (sear all sides, ~15–20 min) missing `timer_seconds`. Add `timer_seconds: 1200`.
22. **nasi-lemak** — Belacan toasting instruction missing from steps (see item 14).
23. **curry-laksa** — Rice vermicelli soak (i3) and bean sprout blanch (i19) are in ingredient prep only. Add timing to s6 or a mise en place note.
24. **char-kway-teow** — Noodle room-temp requirement (i1 prep) not flagged in steps. Add to s1: "If noodles were refrigerated, take them out 30 min before starting — cold noodles kill wok hei." Also: pre-mix soy sauce, kecap manis, fish sauce, and white pepper in a small bowl before starting the 4-min cook.
25. **chicken-katsu** — Cabbage dressing (i20 prep: "dressed with a little rice wine vinegar") not in any step. Add to s5.
26. **flour-tortillas** — s7 (rolling) and s8 (heating pan) should be flagged as concurrent. Add note to s7: start the pan during rolling.

**Files touched:** `mobile/src/data/seed-recipes.ts`  
**Reference:** `docs/coo/culinary-research/step-flow-audit.md` (full per-recipe detail with exact wording for each fix)  
**Blocks:** Launch quality — users will hit missing steps mid-cook.

---

### HANDOFF → Senior Engineer · 2026-05-05 · OPEN
**From:** Product Designer
**Subject:** Two design additions to `recipe/[id].tsx` — "A note" truncation + recipe card v2 redesign
**Why:** Patrick confirmed both items in the 05 May design session. Neither requires schema changes. Both can ship independently of each other and independently of the v2 section handoff already in this file.

---

**ITEM 1 — "A note" collapsible text block**

The field is `recipe.description`. Currently it renders in full, no truncation, inside a `bgDeep` rounded box with a bold "A note: " label prefix (line 454 of `recipe/[id].tsx`).

**What to change:**
- Clamp the text to **3 lines** by default (`numberOfLines={3}` on the inner `<Text>`).
- Below the clamped text, render a `<Pressable>` with label **"Read more"** in `tokens.primary` (rust), 12px, `fonts.sansBold`.
- When expanded, show full text and change the label to **"Show less"**.
- State: `const [noteExpanded, setNoteExpanded] = useState(false)` — local, no persistence.
- Only render the toggle if the text actually overflows 3 lines. Use `onTextLayout` to measure — if `nativeEvent.lines.length <= 3`, hide the Pressable entirely.
- The outer container and styling stay the same — no visual change to the box itself.

**Microcopy:** "Read more" / "Show less" — lowercase, no ellipsis on the label itself. The clamped text naturally trails off with the OS ellipsis (`ellipsizeMode="tail"`).

**Accessibility:** The Pressable needs `accessibilityLabel="Read full note"` when collapsed and `accessibilityLabel="Show less of note"` when expanded. `accessibilityRole="button"`.

**Files to touch:** `mobile/app/recipe/[id].tsx` only.

---

**ITEM 2 — Recipe card redesign for Kitchen list**

The v2 design language established in `docs/prototypes/recipe-detail-v2.html` needs to carry through to the browse cards on the Kitchen screen. Currently the cards use a simpler layout. The redesign should bring the card visual language into alignment without a full component rewrite — it's a style pass, not a structural change.

**Spec (see `docs/prototypes/recipe-card-v2.html` for the visual reference):**

Card surface: `tokens.surface` (`#FFFFFF`), `borderRadius: 14`, `border: 1px solid tokens.line` (`#D8E4D6`), subtle shadow `0 2px 8px rgba(0,0,0,0.06)`.

Layout (top to bottom):
1. **Hero image** — square crop, full card width, `borderTopLeftRadius: 14`, `borderTopRightRadius: 14`. "Photos soon" badge bottom-right if `hasStagePhotos === false` (existing logic — keep as-is).
2. **Source chip** — overlaid bottom-left of the image (on top of hero scrim). `👨‍🍳 [Chef name]` in `tokens.primary` on a rust-tint pill (`rgba(184,64,48,0.10)` bg, `rgba(184,64,48,0.18)` border). Only render if `recipe.source?.chef` is present.
3. **Card body** — padding `12px 14px 14px`.
   - Recipe title: `fonts.display` (Playfair Display), 17px, `tokens.ink`, `letterSpacing: -0.3`. Single line, truncate with ellipsis.
   - Tagline: `fonts.sans`, 12px, italic, `tokens.muted`. 2-line max, ellipsis.
   - **At-a-glance strip** — horizontal row, `marginTop: 8`, separated by a thin `tokens.line` divider above. Three data points only: total time (⏱ `total_time_minutes` min), difficulty (📊 beginner/intermediate/advanced), and cuisine (first cuisine category tag). Font: `fonts.sans`, 11px, `tokens.muted`. If `total_time_minutes` is absent (old seed recipes), omit the strip entirely — don't show dashes.

**What does NOT change:** card tap behaviour, favourite icon, match badge (pantry context), planned-recipe indicator. Those stay exactly as-is.

**Conditional rendering rule:** the at-a-glance strip is conditional — cards without that data look like slightly simplified current cards, not broken.

**Files to touch:** `mobile/src/components/RecipeCard.tsx` (or equivalent card component), `mobile/app/(tabs)/index.tsx` if card layout is inlined there.

**Prototype reference:** `docs/prototypes/recipe-card-v2.html`

---

**Blocks:** Kitchen browse experience polish. At-a-glance strip also reinforces DECISION-009 data (gives Patrick a visible reason that the template expansion matters — the data shows up on the card).

---

### HANDOFF → Senior Engineer · 2026-05-05 · OPEN (after Patrick flips repo private)
**From:** Patrick (via COO)
**Subject:** Rotate the GitHub PAT and update the embedded remote URL
**Why:** Per DECISION-010, the repo just went private. The GitHub PAT embedded in `.git/config` remote URL was visible during the public period. Standard hygiene: rotate the token, update the remote, verify push/pull still works.
**Pre-condition:** Patrick has flipped the repo to private on GitHub. Verify by visiting `github.com/patrickpatches/hone` in an incognito window — should show 404 or login prompt.
**What's needed:**
1. Patrick generates a new fine-grained PAT in GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens. Scopes: `repo` (read + write) + `workflow`. Expiry: ~365 days, enough to comfortably reach launch.
2. Engineer (or Patrick) updates the `.git/config` remote URL with the new token, replacing the old one. The format is `https://<username>:<token>@github.com/patrickpatches/hone.git`.
3. Engineer runs a test push (e.g., a tiny commit to `docs/` or a no-op trailing newline) to verify the new token works end-to-end.
4. Patrick revokes the old PAT in GitHub Settings (so even if it was scraped during the public window, it's now dead).
5. Update `CLAUDE.md` Part 3 with the new PAT expiry date if the previous date was hardcoded.
**Files touched:** `.git/config` (local only — never committed), `CLAUDE.md` if expiry date is hardcoded
**Cost:** ~10 minutes.
**Blocks:** Nothing — current PAT keeps working until revoked. But should be done within the next session for hygiene.

---

### HANDOFF → Senior Engineer · 2026-05-04 · DONE ✅ (2026-05-05 — all 6 sections implemented in recipe/[id].tsx)
**From:** Product Designer
**Subject:** Implement the 6 new recipe-detail sections from `docs/prototypes/recipe-detail-v2.html`
**Why:** Schema pass (8 new fields) lands first. This UI pass lands after. Don't start until schema is committed and Carbonara's seed data has been expanded by the Culinary Verifier — you need real data to QA the new sections.

**What's done (Designer):**
- `docs/prototypes/recipe-detail-v2.html` — full Carbonara prototype with all 8 sections, rationale, and this engineer handoff.

**What to implement (in `mobile/app/recipe/[id].tsx`):**

1. **At-a-glance row** — below recipe header, above servings selector. Fields: `total_time_minutes`, `active_time_minutes`, `difficulty`, first cuisine category, `leftover_mode !== 'none'`. Horizontal row of 5 icon+label pairs, separated by thin lines.

2. **What to know block** — from `before_you_start: string[]`. Left border `#5B8FD4` (not a new token — inline only). Conditionally rendered; omit entirely if array is empty.

3. **Equipment row** — from `equipment: string[]`. Horizontal `ScrollView` of pills. Conditionally rendered.

4. **Mise en place** — from `mise_en_place: string[]`. Tappable rows with circular checkboxes, progress counter. State: `useState<Set<number>>(new Set())`, **session-only** (no SQLite write). Left accent `#F2D896` (ochre, existing token). Conditionally rendered. **Expand pattern — threshold 4 (Designer decision, 2026-05-04):** show first 4 items; if array length > 4, render an ochre "Show N more prep tasks" chip below item 4 (N = total − 4). Tap reveals remaining items (150ms opacity fade). Chip disappears once expanded — no re-collapse. Progress counter counts all items including hidden ones. Threshold is 4 not 5: keeps "Start cooking" CTA above the fold on standard phones after scrolling ingredients and equipment.

5. **Finishing & tasting block** — from `finishing_note?: string`. Left border `#C4A882` (inline only). Conditionally rendered.

6. **Leftovers block** — from `leftovers_note?: string`. Dark low surface. Conditionally rendered.

**Critical rule — conditional rendering:** Every new section must render nothing (no blank card, no section gap) when its data field is absent or empty. The page must be backwards-compatible with unexpanded recipes.

**Do NOT change:** Ingredients, SubstitutionSheet, ServingsSelector, cook steps, hero, back/favourite/plan/share controls.

**Files to touch:** `mobile/app/recipe/[id].tsx` only. No new component files needed.

**Blocks:** Launch quality — every recipe page currently shows none of these sections.

---

### INCIDENT NOTE → COO · 2026-05-03 · RESOLVED (build #53 in progress)
**From:** Senior Engineer
**Subject:** Build failures #51 and #52 — root causes diagnosed and fixed
**Why this exists:** Patrick reported APK build failures after the session-2 push. Two separate bugs were responsible; both are now resolved.

**Root cause 1 — stale import (build #51)**
`IngredientSearchOverlay.tsx` was correctly deleted from GitHub in the prior session, but `pantry.tsx` was never updated on GitHub to match (the local v0.6.0 write was not pushed). GitHub was holding the old v0.5.x `pantry.tsx` which still imported the now-deleted file. Metro bundler failed: `Unable to resolve module IngredientSearchOverlay`. Fix: pushed the correct local v0.6.0 `pantry.tsx` to GitHub (commit `5a9a1db`).

**Root cause 2 — truncated file (build #52)**
The v0.6.0 `pantry.tsx` file was itself truncated at line 1218 mid-expression (`{undo`). The file write during the original Pantry v3 session was cut off before the undo toast was completed, and before any of the five subcomponent function definitions (`Pill`, `EmptyPantry`, `NoMatchesState`, `RecipeMatchCard`, `ChipAdd`). Metro bundler reported `SyntaxError: Unexpected token, expected "}" (1219:17)`. This is a variant of the REGN-002 class of issue (file write truncation, not null-byte corruption this time). Fix: completed the toast expression, restored both toast blocks, closed `KeyboardAvoidingView`, and restored all five subcomponents. Brace/paren balance verified at 0. Pushed as commit `7292f07`.

**Build #53 triggered at 2026-05-03T12:31:47Z — currently in progress.**

**Action needed from COO:**
- None right now. Wait for build #53 to complete, then hand off the APK to Patrick for smoke test.
- Once Patrick validates on-device, update the open Photography Director handoff (still waiting on his review).
- Consider adding a "verify file not truncated" step to the release checklist (last N lines of every large file should be inspected before push — `tail -5 pantry.tsx` takes 2 seconds).

---

### HANDOFF → Senior Engineer · 2026-05-05 · DONE ✅ (2026-05-05 — types.ts expanded, difficulty normalised, ADR-002 written)
**From:** Patrick (via COO)
**Subject:** Add 8 new fields to the Recipe Zod schema for the full recipe template
**Why:** DECISION-009 adopts a full 8-section recipe template across every recipe in the database. The cook authors content; you provide the schema fields; Designer designs the page; you implement the UI in a second pass after Designer ships. This is the additive schema work that unblocks both cook (long-running) and Designer (page redesign).
**What's needed:**
1. In `mobile/src/data/types.ts`, add to the `Recipe` Zod schema:
   - `total_time_minutes: z.number().int().positive()`
   - `active_time_minutes: z.number().int().positive()`
   - `difficulty: z.enum(["beginner", "intermediate", "advanced"])`
   - `equipment: z.array(z.string()).default([])`
   - `before_you_start: z.array(z.string()).max(3).default([])`
   - `mise_en_place: z.array(z.string()).default([])`
   - `finishing_note: z.string().optional()`
   - `leftovers_note: z.string().optional()`
2. All new fields are additive and optional or have sensible defaults — no breaking change to existing recipes that don't have them populated.
3. Update the TypeScript `Recipe` type accordingly.
4. **Do NOT update the recipe-detail UI yet** — wait for Designer's page redesign (separate Designer handoff). UI implementation lands in your second pass after the design ships.
5. Write an ADR (next number) covering the schema expansion.
**Files touched:** `mobile/src/data/types.ts`, `docs/adr/NNN-recipe-template-expansion.md`
**Cost:** ~1-2 hours.
**Sequencing:** Can be done in any order relative to Pantry v3 work — additive schema doesn't conflict with Pantry refactor.
**Blocks:** Cook's seed-recipes.ts repopulation (she can author into source `.md` files in `docs/coo/culinary-research/` in parallel; only the typed seed file blocks on this).

---

### HANDOFF → Product Designer · 2026-05-05 · DONE ✅ (delivered 2026-05-04 — verified by COO 5 May, no delta against DECISION-009)
**Delivered:** `docs/prototypes/recipe-detail-v2.html` — full 10-section Carbonara prototype. Hero, title/tagline/attribution, at-a-glance row (5 facts horizontal, <2s read), before-you-start framing block (blue), servings selector, ingredients with swap chips, equipment (gold-tint pills), mise en place (ochre, lighter type, no photos, tappable checkboxes, expand chip at 4), start cooking CTA, cook steps (unchanged), finishing & tasting (warm-brown framing, italic chef voice), leftovers (low surface, muted), attribution footer. Engineer handoff + conditional-rendering rules + risks section included. Cognitive-mode distinction (mise = fridge-open, cook steps = hands-wet) is the core of the design.
**Note:** COO's later "8-section template" wording was a counting error — referring to *new* sections being added, not total. Designer's prototype correctly shipped with all 10. Decision log corrected.
**From:** Patrick (via COO)
**Subject:** Redesign the recipe-detail page to display the new 10-section template
**Why:** DECISION-009 adopts a full recipe template. Each recipe now has additional sections — at-a-glance, before-you-start, equipment, mise en place, finishing & tasting, leftovers — that the current recipe page doesn't surface. The page needs to be redesigned with the right typographic and visual hierarchy. This is the page that defines whether Hone reads as a cookbook or as a recipe app.
**What's needed:**
1. Mockup the new recipe-detail page in `docs/prototypes/recipe-detail-v2.html`. Show one recipe end to end (use Pasta Carbonara since it's the canonical reference).
2. Display all sections in a clear vertical flow that reads top-to-bottom like a cookbook entry, not a long unstructured list.
3. Visual distinctions to spec:
   - **At-a-glance** is a compact horizontal row of facts (time, difficulty, leftover-friendly, cuisine) — read in <2 seconds
   - **What to know before you start** is a visually distinct framing block — short, prominent, before any heat-related content
   - **Equipment** sits separate from ingredients — possibly a collapsible row or pill row
   - **Mise en place** is visually distinct from cook steps — the cook reads prep with the fridge open, and reads cook steps with hands wet, so the section needs different treatment (lighter typography, no photos)
   - **Cook steps** stay as currently designed — photos, why-notes, doneness cues
   - **Finishing & tasting** is a final framing block, similar treatment to "What to know before you start" but at the end
   - **Leftovers & storage** is the last block — light, conclusive
4. Preserve all current design tokens (v0.7 dark) — gold accent, dark surfaces, Playfair display, Inter body. No visual direction change.
5. Engineer handoff block at the bottom of the prototype.
6. Written rationale at the bottom — what changes, what stays, what risks.
**Files touched:** `docs/prototypes/recipe-detail-v2.html`
**Blocks:** Engineer's UI implementation (second engineer pass for DECISION-008).

---

### HANDOFF → Culinary Verifier · 2026-05-05 · IN PROGRESS (DECISION-009 — Batch 1 ✅ Batch 2 ✅, Batch 3 open)
**From:** Patrick (via COO)
**Subject:** Apply full 10-section recipe template to every recipe in the database
**Why:** DECISION-009 expanded scope from the 17 priority recipes to every recipe in `mobile/src/data/seed-recipes.ts` plus the six new recipes in `docs/coo/culinary-research/`. Every recipe gets the full template treatment. Patrick: *"I prefer to fix every single recipe, everyone in my database."*

**BATCH 1 — Six new recipes — DONE ✅ (2026-05-05)**
All six new recipe files written in `docs/coo/culinary-research/` with full 10-section template:
- `chicken-schnitzel.md` ✅ — photography priority
- `chicken-vegetable-stir-fry.md` ✅
- `beef-lasagne.md` ✅ — after Marcella Hazan's Bolognese method
- `roast-lamb-rosemary-garlic.md` ✅
- `fish-and-chips.md` ✅
- `falafel.md` ✅ — Levantine; Palestinian/Lebanese/Syrian/Jordanian attribution; no single chef fabricated

Each carries: chef/traditional attribution, Australian English, metric units, substitutions with quality flags, per DECISION-007 every ingredient has `scales` flag + `scaling_note` where chef knowledge changes the answer, photography shot list.

**BATCH 2 — 11 launch-priority existing recipes — DONE ✅ (2026-05-06)**
All 11 launch-priority expansion files written in `docs/coo/culinary-research/` with full 10-section template + chef audit notes per recipe:
- `carbonara.md` ✅ — whole egg scaling fix flagged for Engineer; attribution URL needs verification
- `bolognese.md` ✅ — ATTRIBUTION FAIL flagged: channel URL not recipe URL; garlic timing why_note added
- `butter-chicken.md` ✅ — time_min UX CRITICAL fix flagged (90 → 330 for overnight marinade)
- `green-curry.md` ✅ — "Thai aubergine" → "Thai eggplant" fix flagged; attribution verification needed
- `smash-burger.md` ✅ — whole-food claim flagged for Patrick (American cheese was the trigger; field has since been retired entirely)
- `roast-chicken.md` ✅ — time_min fix flagged for overnight dry brine (14h+ commitment invisible)
- `pavlova.md` ✅ — fan oven instruction moved to before-you-start; attribution verification needed
- `barramundi.md` ✅ — salt/pepper ingredient split flagged; one of strongest recipes in library
- `shawarma.md` ✅ — overnight marinade, "London kitchen" → "home kitchen", tags beef → lamb flagged
- `hummus.md` ✅ — attribution URL → book citation fix flagged (Reem Kassis, *The Palestinian Table*)
- `pad-thai.md` ✅ — tofu duplication decision flagged for Patrick; attribution verification needed

**Data fixes for Engineer (from Batch 2 audit):**
- Carbonara: `whole egg → scales: 'linear'` + scaling_note
- Butter chicken: `time_min` 90 → 330
- Roast chicken: `time_min` update to reflect overnight brine commitment
- Shawarma: `time_min` update; description "London kitchen" → "home kitchen"; tags `'beef'` → `'lamb'`
- Green curry: `'Thai aubergine'` → `'Thai eggplant'`
- Bolognese: `video_url` — find specific Andy Cooks video or change `source.chef` to 'Hone Kitchen'
- Hummus: attribution URL → book citation "After Reem Kassis, *The Palestinian Table* (Phaidon, 2017)"

**Patrick decisions — BOTH RESOLVED ✅ (2026-05-06):**
- Smash burger: **Drop the whole-food claim.** Rule was: only set true for completely unprocessed meals; American cheese fails. The field itself was retired across the entire repo on 2026-05-07 — schema and seed data no longer carry it.
- Pad Thai: **Keep tofu as a listed ingredient (traditional prawn-and-tofu version).** Remove tofu from the prawns substitution array. Add correct substitutions: extra tofu (200g, good_swap, vegetarian), chicken thigh (great_swap), squid (great_swap). See `pad-thai.md` for full substitution spec.

**Attribution URLs to verify before ship (all 4 flagged):**
- Carbonara: `https://www.youtube.com/watch?v=5t7JLjr1FxQ` (Gordon Ramsay)
- Butter Chicken: `https://www.youtube.com/watch?v=mrDJ2K3JXsA` (Joshua Weissman)
- Green Curry: `https://www.youtube.com/watch?v=lleTlMtbN8Q` (Andy Cooks)
- Pad Thai: `https://www.youtube.com/watch?v=6Lb1PyJxVQM` (Andy Cooks)

**BATCH 3 — Remaining ~25 existing seed library recipes — OPEN (next session)**
Walk through `mobile/src/data/seed-recipes.ts` and write expansion notes in `docs/coo/culinary-research/<recipe-slug>.md` for each remaining recipe.

Recipes remaining (in seed-recipes.ts order):
- [ ] chicken-adobo
- [ ] classic-beef-stew
- [ ] musakhan
- [ ] kafta-meshwi
- [ ] fattoush
- [ ] prawn-tacos-pineapple-salsa
- [ ] sourdough-starter
- [ ] sourdough-country-loaf
- [ ] mushroom-risotto
- [ ] baja-fish-tacos
- [ ] french-onion-soup
- [ ] red-wine-braised-short-ribs
- [ ] shoyu-ramen
- [ ] beef-wellington
- [ ] tarka-dal
- [ ] scrambled-eggs
- [ ] spaghetti-aglio-e-olio
- [ ] mujadara
- [ ] sheet-pan-harissa-chicken
- [ ] egg-fried-rice
- [ ] nasi-lemak
- [ ] beef-rendang
- [ ] curry-laksa
- [ ] char-kway-teow
- [ ] saag-paneer
- [ ] chicken-katsu
- [ ] tom-yum-goong
- [ ] flour-tortillas

For each recipe, additions to author:
- At-a-glance numbers (total_time_minutes, active_time_minutes, difficulty)
- 1–3 "what to know" framings
- Equipment list
- Mise en place tasks (discrete pre-heat prep)
- Finishing & tasting paragraph
- Leftovers & storage note
- Ingredient `scales` flags + `scaling_note` where chef knowledge matters

Output to per-recipe `.md` files in `docs/coo/culinary-research/`. Engineer migrates content into seed-recipes.ts in their second pass.
**Cost remaining:** ~30 min per recipe × ~28 recipes = ~14 hours across multiple sessions.
**Sequencing:** Proceeds independently — markdown is unstructured, no schema dependency.
**Blocks:** Engineer's seed-recipes.ts repopulation. Launch quality.

---

### SYNC NOTE → Senior Engineer · 2026-05-05 · DONE (2026-05-03)
**From:** COO
**Subject:** Pantry track is fully unblocked — here is the right sequence across the four open Engineer handoffs
**Why this exists:** Both Designer and Culinary Verifier wrapped sessions today. Their outputs unblock work that was previously waiting. There are now four open Engineer handoffs (Pantry v3 implementation, two bugs from on-device, six new recipes, derivation-aware matching). Doing them in random order causes throwaway work — e.g., fixing BUG 1 before Pantry v3 means the bug fix lands in code that's about to be deleted. Read this sync block before opening any other handoff.

**What just landed (verified by COO):**
- ✅ `docs/prototypes/pantry-v3.html` — Product Designer's Pantry v3 prototype with full annotated implementation spec for four UX fixes (inline search, emoji inline with name, Clear-all confirmation modal, "Getting close" banner clarity).
- ✅ `docs/coo/culinary-research/` — Culinary Verifier shipped all six source recipe files (chicken-schnitzel, chicken-vegetable-stir-fry, beef-lasagne, roast-lamb-rosemary-garlic, fish-and-chips, falafel). Each carries chef attribution, Australian English, metric units, substitutions with quality flags, and per DECISION-007 every ingredient has the `scales` flag set with `scaling_note` populated where chef knowledge changes the answer.
- ✅ `mobile/src/data/ingredient-derivations.ts` — Phase 1 of the joint handoff. Verifier defined the source→derived ingredient map ("eggs" → "egg yolks" + "egg whites", etc.) covering both the existing seed library and the six new recipes.

**Recommended sequence (do in this order):**

1. **Pantry v3 implementation FIRST** — see the existing `Senior Engineer · 2026-05-03` handoff below. Largest refactor; sets the structural surface that everything downstream lands on. While doing this, **incorporate the fix for BUG 1 (stale match counter)** into the new state model. The "+" affordance behaviour needs to be clarified during this work — coordinate with the Designer's spec on whether tapping "+" adds to shopping list or pantry, and make the visual feedback unambiguous.

2. **BUG 2 fix during Pantry v3** — the carousel snap regression. Fix the snap behaviour AND see the regression ask below.

3. **Six new recipes** — populate `mobile/src/data/seed-recipes.ts` from the source files in `docs/coo/culinary-research/`. Pure data work; doesn't depend on UI. Could be done in parallel with Pantry v3 if you have spare cycles.

4. **Derivation-aware matching (Phase 2)** — update `mobile/src/data/pantry-helpers.ts` to use the new `ingredient-derivations.ts` per the existing `Culinary Verifier (first) → Senior Engineer (second) · 2026-05-04` handoff.

**Regression discipline ask (NEW — Patrick raised this; Designer reinforced it):**

The carousel snap was fixed in session 29 April and reintroduced during the dark restyle / Pantry v2 work. The OneDrive null-byte issue happened once and has the potential to recur. Two regressions in three weeks is a pattern, not bad luck. Please do this small piece of structural work the next time you fix BUG 2:

- Create `docs/regression-checklist.md` with a simple format: previously-fixed bug name, one-line description, repro steps, the commit hash that originally fixed it.
- Seed it with the carousel snap regression and the OneDrive null-byte issue.
- Add an entry to `docs/SMOKE-TEST.md` linking to it: "Run regression checklist before every release tag."
- Going forward: every bug you fix that took non-trivial work to find gets one line in this checklist. Cheap on the way out, saves rediscovery cost.

This becomes the seed for QA Test Lead's eventual smoke-test scope. Don't wait for QA — start the file now.

**Files this session will touch (rough estimate):**
- `mobile/src/components/IngredientSearchOverlay.tsx` (DELETE)
- `mobile/app/(tabs)/pantry.tsx` (Pantry v3 + BUG 1 + BUG 2)
- `mobile/src/data/seed-recipes.ts` (six new recipes)
- `mobile/src/data/types.ts` (already updated for `scaling_note` per DECISION-007 — verify still in)
- `mobile/src/data/pantry-helpers.ts` (Phase 2 derivation matching)
- `docs/regression-checklist.md` (NEW)
- `docs/SMOKE-TEST.md` (link to regression-checklist)

**Existing handoffs to read in detail (in sequence order above):**
- `Senior Engineer · 2026-05-03 · OPEN (Pantry v3 implementation)` — full Designer spec
- `Senior Engineer · 2026-05-05 · OPEN (two pantry bugs)` — both bugs detailed
- `Senior Engineer · 2026-04-29 · IN PROGRESS (multi-task)` — Task 3 (six recipes) is now unblocked
- `Culinary Verifier → Senior Engineer · 2026-05-04 · OPEN (derivation matching)` — Phase 2

When all of the above is complete, write a single consolidated session report (`docs/sessions/Hone_Session_Report_DD_Month_YYYY.md` or `_2.md` if it's the second of the day) and update each existing handoff to DONE status.

---

### HANDOFF → Senior Engineer · 2026-05-03 · DONE (2026-05-03)
**From:** Product Designer
**Subject:** Implement the three Pantry v3 design fixes from `docs/prototypes/pantry-v3.html`
**Why:** Pantry v3 prototype delivered in response to Patrick's on-device feedback. Three UX problems identified; all fixed in the prototype. Engineer needs to wire them into `pantry.tsx`.

**What's done (Designer):**
- `docs/prototypes/pantry-v3.html` — full annotated prototype with three screen states, component comparison, and this engineer handoff.

**What's needed (Engineer — implement in this order):**

**1. Delete `IngredientSearchOverlay.tsx` and switch to inline search.**
The full-screen takeover was the wrong pattern for an augmentation flow. Inline is correct.
- Remove `IngredientSearchOverlay.tsx` from `mobile/src/components/`.
- Remove the import and modal render from `pantry.tsx`.
- When `isSearchActive === true`, freeze the header (pills row stays visible) and replace the `SectionList` data source with autocomplete results — no navigation, no overlay, no z-index fight.
- Transition: `withTiming(opacity, { duration: 150 })` on the results list entering/leaving.
- Search bar becomes active-state when focused: `border-color: #E8B830` + `box-shadow: 0 0 0 3px rgba(232,184,48,0.10)`. A "Cancel" text button appears to the right; tapping it clears query and collapses back to browse state.
- **Shape spec for the search input** (Alt 1 — rounded rect):
  - `background: #1A1A1A` (surface token), `border: 1.5px solid rgba(232,184,48,0.22)` at idle
  - `border-radius: 14px`, padding `12px 14px`
  - Magnifying glass icon left, placeholder "Search or add an ingredient…" in `#8A7E72` (muted)
  - On active: border goes solid gold, focus ring as above

**2. Emoji inline — leaf emoji and ingredient name must be in the same flex row.**
Currently the leaf emoji is on its own line in autocomplete results (disjointed). Fix: `flexDirection: 'row'`, `alignItems: 'center'`, emoji and name in the same `<Text>` or side-by-side `<Text>` nodes. No line-break between them.

**3. Relocate "Clear all" and add confirmation modal.**
- Remove "Clear all" from its current position below the search bar.
- Add a trash icon button (`Ionicons name="trash-outline"`) to the right side of the Pantry screen title row (same row as "My Pantry" heading).
- Icon should be `#8A7E72` (muted) at rest — low prominence, hard to hit accidentally.
- On press: show a `Modal` (not `Alert` — Alert cannot be styled to match dark tokens) with:
  - Copy: `"Clear [N] stocked ingredients?"` — N is the live count, not the string "all"
  - Destructive button: `"Clear [N] ingredients"` in red (`#E05252` or similar)
  - Cancel button: `"Keep my pantry"` (phrased positively — this is the safe default)
  - Semi-transparent scrim behind modal (`rgba(0,0,0,0.70)`)

**4. Update match banner — replace bare `›` with explicit "See all" pill CTA.**
The "Getting close" element currently reads as ambiguous (tappable? header?). Replace with:
- Copy: `"[N] recipes you can cook now · [M] more within 1–3 ingredients"`
- Remove the bare `›` arrow.
- Add a small gold pill button labelled `"See all"` at the right end of the banner row.
- If `"See all"` is not yet wired to a destination screen, navigate to recipe-search filtered by pantry ingredients (or no-op with a `TODO` comment — do not silently do nothing without the comment).
- Banner colour: stays gold-tinted as currently implemented.

**Files to touch:**
- `mobile/src/components/IngredientSearchOverlay.tsx` — **DELETE**
- `mobile/app/(tabs)/pantry.tsx` — inline search, clear-all modal, banner update, emoji fix
- `mobile/src/components/` — no new components needed for these changes

**Does NOT block:** Derivation-aware matching (Phase 2) — that lands on top of these changes independently.
**Blocks:** Patrick's next on-device review session.

---

### HANDOFF → Senior Engineer · 2026-05-05 · DONE (2026-05-03)
**From:** Patrick (via COO)
**Subject:** Two bugs found on-device in v0.4.1 build 49
**Why:** Patrick spent on-device time today walking through the pantry-match flow. Found two issues that need engineer triage. Both should also be logged as GitHub Issues per CLAUDE.md (Patrick can do this from phone, OR engineer creates them when working the fix).

**BUG 1 — Match counter stale after pantry change.**
- **Severity:** P1 (feature broken in user-visible way)
- **Repro:** Open Pantry. Add "Spaghetti", "Sumac", "Black pepper", "Salt" to pantry. Pasta Carbonara recipe card shows "3 OF 7 MATCHED" badge. Tap the "+" affordance on a missing ingredient (e.g., "Whole egg" or "Pecorino Romano"). Observe: badge does NOT update — still says "3 OF 7."
- **Root cause hypotheses to investigate:**
  - "+" tap might be adding to shopping list (not pantry) — in which case counter shouldn't change, but the visual feedback for the user needs to be much clearer that "shopping list" ≠ "pantry"
  - OR pantry state IS updating but the recipe-card badge isn't re-rendering on state change (memo/key issue)
  - OR the matching algorithm is recomputing but the displayed count is cached
- **Fix:** Investigate and resolve. If "shopping list ≠ pantry" is the intended behaviour, work with Designer (open handoff) on visual clarity so user sees what tapping "+" actually does. If it's a stale-state bug, fix the state propagation.

**BUG 2 — Recipe carousel snap regression.**
- **Severity:** P2 (polish regression)
- **Repro:** Open Pantry with stocked ingredients. In the "Closest Matches" horizontal carousel, swipe between recipe cards. Observe: cards no longer snap cleanly to one card per view — partial cards visible on left and right edges (e.g., "...bled Eggs" / "Mujadara" both partially shown).
- **History:** This was reportedly fixed in session 29 April: *"Recipe card carousel: Fixed the card snap behaviour so cards settle cleanly on one card instead of bouncing between two."* Suggests regression — likely reintroduced during the dark-direction restyle or Pantry v2 changes.
- **Fix:** Reinstate the snap-to-card behaviour. Bonus: add a regression test or visual smoke check so this doesn't return.
- **Note for QA Test Lead** (when spun up): two regressions caught in the past week (this carousel + the prior plan.tsx OneDrive corruption). Worth thinking about a regression-prevention layer in the smoke test.

**Files touched:** `mobile/app/(tabs)/pantry.tsx` (BUG 1 state), recipe-card carousel component (BUG 2)
**Blocks:** Pantry experience polish.

---

### HANDOFF → Culinary Verifier (first) → Senior Engineer (second) · 2026-05-04 · DONE ✅ (Phase 1 ✅ 2026-05-03 · Phase 2 ✅ 2026-05-05 — pantry-helpers.ts already had full derivation matching implemented)
**From:** Patrick (via COO)
**Subject:** Pantry needs derivation-aware ingredient matching — "I have eggs" should match recipes calling for "egg yolks"
**Why:** Patrick discovered on-device that the pantry-match algorithm treats every ingredient as atomic. He has eggs in his pantry. Pasta Carbonara wants egg yolks. The match misses entirely. This is one of many cases — chicken stock comes from a whole chicken, lemon zest from lemons, ground spices from whole spices, etc. The pantry-match feature is the kill feature; right now it's quietly under-counting matches and making the recipe library look thinner than it actually is.

**The split (handoff has two phases):**

**PHASE 1 — Culinary Verifier defines the derivations.**
- Create `mobile/src/data/ingredient-derivations.ts` (or equivalent — coordinate location with Engineer).
- The structure is a map from "source ingredient" → list of "derived ingredients."
- Examples to seed:
  - `eggs` → `egg yolks`, `egg whites`
  - `whole chicken` → `chicken breast`, `chicken thighs`, `chicken stock`, `chicken bones`
  - `lemon` → `lemon juice`, `lemon zest`
  - `lime` → `lime juice`, `lime zest`
  - `cumin seeds` → `ground cumin`
  - `coriander seeds` → `ground coriander`
  - `whole peppercorns` → `ground black pepper`
  - `garlic` → `crushed garlic`, `minced garlic`, `garlic paste`
  - `ginger` → `grated ginger`, `ginger paste`
  - `tomatoes` → `diced tomatoes`, `crushed tomatoes` (only when fresh substitutes for tinned — flag as compromise)
  - `parmesan` → `grated parmesan`
  - `pecorino` → `grated pecorino`
- Walk through the existing seed library and the 6 new recipes you're writing — every derived ingredient that appears as a recipe ingredient needs a parent in this map.
- For ambiguous ones (canned vs fresh tomatoes, dried vs fresh herbs), flag them with a `prep_note` so the user sees "you have fresh tomatoes — for the depth this dish wants, tinned is better, but fresh works."

**PHASE 2 — Senior Engineer updates the matching algorithm.**
- After Verifier ships the derivations file, update `mobile/src/data/pantry-helpers.ts` (the existing scoring file).
- New matching rule: an ingredient in the user's pantry counts as "matched" for a recipe ingredient if EITHER (a) the names match directly, OR (b) the recipe ingredient is in the derivations list under one of the user's pantry ingredients.
- Surface the derivation in the UI: when a derivation match happens, show a small "from your eggs" annotation under the matched ingredient row, and optionally a small icon indicating "requires prep." Coordinate with Designer on visual treatment.
- Update the match percentage / "X of Y matched" counter to count derivation matches as full matches (not partial).

**Sequencing:** Phase 1 must complete before Phase 2 starts. Engineer is blocked until derivations file exists.
**Files touched:** `mobile/src/data/ingredient-derivations.ts` (new, by Verifier), `mobile/src/data/pantry-helpers.ts` (by Engineer), `mobile/app/(tabs)/pantry.tsx` (UI surface, by Engineer + Designer)
**Blocks:** Pantry feature accuracy. Currently every recipe with a derived ingredient under-counts the match.

---

**PHASE 1 COMPLETE — 2026-05-03 (Culinary Verifier)**

`mobile/src/data/ingredient-derivations.ts` delivered. Summary for the Engineer:

**Genuine gaps the current matcher MISSES (where this file fixes real bugs):**
- `eggs` → `egg yolks`, `egg whites`, `egg yolk`, `egg white`, `beaten egg`, `egg wash`
  — the plural/component split breaks all substring and token checks
- `parmesan` ↔ `parmigiano` / `parmigiano reggiano`
  — the Bolognese recipe uses the Italian name; these share no substring
- `whole chicken` → `chicken stock` (stock-making is a transformation)
- `beef bones` → `beef stock`
- `prawns` → `prawn stock` (from reserved shells — Laksa recipe)
- `unsalted butter` / `butter` → `ghee`
- `desiccated coconut` → `kerisik` ("kerisik" is opaque, no substring relationship to "coconut")

**Also included (for UI annotation "from your X →" even though substring already catches them):**
- `lemon`/`lime` → juice/zest; `garlic` → paste/crushed/minced; `ginger` → grated/paste
- `cumin seeds`/`coriander seeds`/`black peppercorns`/`allspice berries`/`cardamom pods`/
  `cinnamon stick`/`whole cloves`/`nutmeg`/`mustard seeds` → their ground forms
- `tomatoes` → tinned/crushed/paste (with honest compromise `prep_note`s)
- `fresh herbs` (thyme, rosemary, mint, coriander, parsley) → their variants
- `bread` → `breadcrumbs`, `panko breadcrumbs`, `stale bread`
- `pitta bread` → `stale pitta bread`, `flatbread`
- `lemongrass` → `lemongrass paste`
- `dried chickpeas` → `tinned chickpeas`/`cooked chickpeas`
- `pure cream`/`double cream` → each other, `thickened cream`

**What the Engineer needs to do (Phase 2):**
1. Import `DERIVATION_LOOKUP` and `getDerivationEntry` from `./ingredient-derivations`
2. In `scoreRecipeAgainstPantry()`, expand `isMatch()` to check: after the existing
   direct-name checks fail, loop over `haveNorms`, call `DERIVATION_LOOKUP.get(p)`,
   and test whether `norm` matches any derived name (run normalizeForMatch on each
   derived name before comparing)
3. When a derivation match fires, add the source pantry item + `DerivationEntry`
   to a side-channel so the UI can show "from your eggs →" and the prep icon
4. Count derivation matches as full matches (not partial) in `haveCount`
5. Designer coordination: small "from your X" annotation below matched ingredient row;
   `prep_note` shown on tap if present; "requires prep" icon if `prep_note` is set

---

### HANDOFF → Product Designer · 2026-05-04 · DONE (delivered 2026-05-03)
**Delivered:** `docs/prototypes/pantry-v3.html` — inline search (Alt 1 rounded-rect, recommended), Clear all relocated to title row with confirmation modal, "Getting close" banner replaced with gold "See all" pill CTA. Engineer handoff block included.
**From:** Patrick (via COO)
**Subject:** Pantry v3 — revisit full-screen search, fix Clear-all hazard, clarify "Getting close" element
**Why:** Patrick spent on-device time today after engineer shipped Pantry v2 (3 back-and-forths). He's flagged three specific issues. Honest note from COO: the full-screen search pattern was my recommendation in the previous Pantry handoff, and Patrick is rightly questioning it. Don't feel bound to keep it — the better answer may be inline.

**Issues:**

0. **Search bar itself needs a holistic rethink — not just relocation.** Patrick (5 May, on-device): "I want the product designer not just move the location, I want them to think what is the best way, font, location size, to display the search box that should look good as well as functional." Currently the "Search or add an ingredient..." reads more like a section heading than a tappable input — there's no visible boundary, no shape, no affordance. It also sits awkwardly between the page heading and the pill cluster, and the "Clear all" is tucked underneath it which makes the whole zone feel cramped. Don't just move it. Treat the search box as a first-class design problem and recommend the right shape, weight, position, and affordance for an "augmenting your pantry" task. Reference apps to consider: how Notion handles its search input, how Apple Notes treats the search bar, how Things 3 surfaces "add a task." All of those make the input field unambiguously a tappable surface, not text. Propose at least two alternatives (e.g., a pill-shaped input near the bottom of the pantry zone vs a top-bar search like Spotify) and pick one with rationale.

1. **Full-screen search may not be the right pattern.** When Patrick taps the search bar, the page transitions away from the Pantry view and into a full-screen ingredient browser. He notices that he loses his pantry context (the pills he's already added) while searching, which feels wrong for an *augmentation* flow rather than a *navigation* flow. Reference apps to consider: Spotify keeps the pantry-like context visible while showing search results inline; Apple Notes does full-screen takeover. Material Design 3 default is full-screen. Your call — research, recommend, mock both options if unclear which is better, and write a one-paragraph rationale. Also: the leaf emoji is on a separate line from the ingredient name, which feels disjointed. Either drop the emoji or get it inline with the name.

2. **Clear all is too easy to press accidentally.** It currently sits right under the search bar, in thumb-tap territory. The 5-second undo toast (from v0.3, may or may not still be present in v0.7 dark) is helpful but not enough — accidental destructive actions should be harder to trigger in the first place. Options to consider: (a) move Clear all into a long-press menu on a pantry pill, (b) move it to a Settings/More sheet, (c) require a confirmation modal with the count ("Clear all 4 ingredients?"), (d) hold-to-clear gesture. Pick the one you think fits best, propose it.

3. **"Getting close" element looks like a button — is it?** The "Getting close · 6 matches · ranked by coverage →" element with the right-pointing arrow reads as tappable. Patrick can't tell if it does anything. If it's tappable and goes to a fuller match-results screen, the destination needs to be designed; if it's not tappable, drop the arrow and treat it as a section header. Coordinate with Senior Engineer on what (if anything) the current behaviour is, then propose either a clear destination or a static section header.

**Constraint:** Dark v0.7 tokens locked. Pill style for added ingredients locked. Don't touch what works.

**Deliverable:** Update `docs/prototypes/pantry-redesign-v2.html` (or new `pantry-v3.html` if the changes are large), with all three fixes shown, plus rationale at the bottom and engineer handoff block.

**Files touched:** `docs/prototypes/pantry-v3.html` (new) or update existing
**Blocks:** Engineer's next Pantry-related work. Patrick reviews the mockup as soon as you ship.

### HANDOFF → Patrick · 2026-05-02 · OPEN (awaiting on-device validation)
**From:** Senior Engineer
**Subject:** Pantry v0.5.0 redesign — install build #90 and smoke-test
**Why:** Full pantry redesign delivered and committed to main. Build #90 running.
**What's done:**
- `pantry-helpers.ts`: `RecipeMatchResult` now includes `missingIngredients[]` (name + amount + unit); missing ingredients sorted by substitution availability
- `IngredientSearchOverlay.tsx` (new): full-screen slide-up search modal with autofocus, have-it pills row, SectionList grouped by category, query highlighting
- `pantry.tsx` v0.5.0: tappable search bar → overlay; horizontal scrollable pills row; gold match summary banner; Variant A chips (add to shopping list + undo toast); % badge removed
**What's needed:** Patrick installs APK from build #90, runs through smoke-test checklist in `docs/sessions/Hone_Session_Report_2_May_2026.md`
**Files:** `docs/sessions/Hone_Session_Report_2_May_2026.md` (full checklist + rationale)
**Commit:** `f7cb9e077c689df2df8eb84425927c324c95b6e0`

---

### HANDOFF → Product Designer · 2026-05-01 · DONE (delivered 2 May 2026)
**From:** Patrick (via COO)
**Subject:** Pantry screen redesign — fix search dropdown layering, rethink missing-ingredient affordance, preserve pill style
**Why:** Patrick is unable to shoot photography this weekend (away on personal commitments — weekend 1 slipped). He's redirecting team energy to design and function improvements that don't depend on him being at his PC. The Pantry screen is the kill feature ("Cook with what you have"), so it needs to land cleanly. Patrick took two screenshots of the current Pantry and identified specific issues. Fix is needed at the design level before engineer touches code.

**Context — what Patrick said specifically:**
- "Many windows like Pantry have the right idea but the way the search displays is no where near desirable."
- "The search looks very messy when ingredients are populating."
- "I like the pills style display of the food i have added like brown onion and Paprika."
- "Looking toward you and the team to offer better suggestions or better execution."

**Issues identified from Patrick's screenshots (current state — Pantry screen, v0.4.1 build 44, dark v0.7 tokens applied):**

1. **Search dropdown layering / opacity is broken.** When the user types into the search bar, the autocomplete dropdown ("Onion powder", "Brown onion · also yellow onion", with category labels like "Spices & Seasonings", "Produce") is rendering with insufficient z-index or transparent background. The recipe carousel content underneath ("CLOSEST MATCHES", "1 OF 9 MATCHED", "Hummus from Scratch", recipe photo) bleeds through the dropdown visually. Looks half-finished. **Fix direction:** dropdown needs solid background that fully obscures content behind it. Consider a full-screen takeover when the search is active (Material Design search pattern) so the user is fully focused on ingredient selection rather than competing visual hierarchy.

2. **The "+" symbol on missing ingredients reads as "tap to add to pantry" but isn't.** Beneath the recipe match card ("Classic Beef Stew · 10% match · 1 OF 10 MATCHED"), the missing ingredients are shown as `+ Beef chuck   + Carrots   + Potatoes   + Tomato paste`. The plus sign is the universal "add" affordance, so the user expects tapping these to add them to their pantry. Right now it's purely decorative/informational. Either (a) make the action match the affordance — tapping `+ Beef chuck` adds it to the shopping list or pantry, OR (b) change the icon to something that means "missing" not "add" (e.g., a small dot, a strikethrough, or no icon at all and just a "Missing:" label). Patrick hasn't told me which way to go — propose both options as variants.

3. **Pill style for added ingredients works.** "Brown onion ×" and "Paprika ×" sage-green pills are clean. Don't redesign these. Carry the same idiom into the search dropdown so when the user taps an ingredient, it visually transitions into a pill below the search bar.

**Other things worth thinking about while you're in the Pantry screen:**
- The match percentage (10%) is prominent in gold corner badge — do users actually understand "10%" or would "1 of 10 ingredients" as primary feel more useful?
- The "1 OF 10 MATCHED" pill is clear but redundant with the percentage. Could one or the other go?
- "CLOSEST MATCHES · 6 dishes · ranked by match" header is clean, keep.
- The empty-state vs typing-state should be visually obvious — when search is active, the page should feel like search mode; when search is empty, the page should feel like browse mode.

**What's needed:**
1. **Mockup of the redesigned Pantry screen** at `docs/prototypes/pantry-redesign-v2.html`. Show three states: empty pantry, pantry with 2-3 ingredients added (current state in screenshot 1), and active search with autocomplete dropdown (current state in screenshot 2). Use v0.7 dark tokens — bg `#111111`, cards `#1A1A1A`, gold accent `#E8B830`.
2. **For the missing-ingredient affordance**, propose two variants in the same prototype file (variant A: tap-to-add, variant B: missing-label-only). Patrick picks Monday.
3. **Written rationale** at the bottom of the prototype — what changed, what stays, why.
4. **Engineer handoff block** at the bottom — implementation notes, state changes, any new tokens needed, accessibility notes.

**Constraints:**
- Dark v0.7 tokens locked per DECISION-006. Don't change colours.
- Pill style locked per Patrick's feedback. Don't redesign added-ingredient pills.
- Stage photo dependency — ignore for the Pantry screen specifically, but the recipe match cards within it still need to show "Photos soon" badges per DECISION-003 / Product Designer's earlier card-states spec.

**Files touched:** `docs/prototypes/pantry-redesign-v2.html` (new), `docs/coo/handoffs.md` (this file, mark IN PROGRESS when started)
**Blocks:** Engineer's next Pantry-related work. Patrick reviews mockup Monday morning when he's back at his PC.

**Patrick is offline for the weekend** — the Designer can ship a complete mockup with rationale today; Patrick reviews Monday morning. No live iteration needed mid-session.

### HANDOFF → Culinary & Cultural Verifier · 2026-04-30 · OPEN (URGENT — Senior Engineer blocked)
**From:** Senior Engineer
**Subject:** Deliver source recipes for 6 new dishes — Senior Engineer cannot proceed without them
**Why:** Priority 2, Task 3 of the Senior Engineer multi-task handoff requires adding 6 new recipes to `mobile/src/data/seed-recipes.ts`. The original COO handoff (below) says Senior Engineer must block on Culinary Verifier to provide authoritative sources before populating chef attribution. As of 30 April 2026, `docs/coo/culinary-research/` does not exist — no source files have been delivered.
**What's needed:** Deliver the 6 source recipe files per the original COO handoff instructions (reproduced below for convenience). Output to `docs/coo/culinary-research/<recipe-slug>.md`. For each dish: chef-attributed source URL (or "traditional" framing), ingredient list, steps, substitutions, cuisine/type categories, Australian English check.
1. `chicken-schnitzel.md` — consider Adam Liaw or another modern AU chef
2. `chicken-vegetable-stir-fry.md` — Bill Granger, RecipeTinEats Nagi, or "traditional Australian weeknight"
3. `beef-lasagne.md` — consider Marcella Hazan classic or modern AU
4. `roast-lamb-rosemary-garlic.md` — consider Maggie Beer or "Sunday roast traditional"
5. `fish-and-chips.md` — likely "Australian Friday traditional"
6. `falafel.md` — Levantine; credit cuisine + region; specific chef optional
**Sequence:** Item 1 (chicken schnitzel) first — Photography Director needs it before the 10–11 May shoot weekend (first weekend slipped; second weekend is now the target).
**Blocks:** Senior Engineer Task 3 (recipe population), Photography Director (chicken schnitzel shoot weekend)

---

### HANDOFF → Senior Engineer · 2026-04-30 · DONE ✅ (Patrick confirmed on-device)
**From:** Product Designer + COO (direction switch confirmed by Patrick 30 April 2026)
**Engineer note (30 Apr 2026):** All wiring done. APK build triggered. Patrick confirmed on-device — dark tokens look correct. Priority 2 now in progress.
**Subject:** Roll out v0.7 token changes — Dark Dramatic direction (font swap + full palette inversion)
**Why:** Patrick chose the Dark Dramatic direction on 30 April 2026, superseding the earlier Medium Iteration pick. `mobile/src/theme/tokens.ts` is now at v0.7 with the complete dark token set. The Engineer needs to swap the Google Fonts package, wire up Inter, and verify all components render correctly on the inverted dark palette.

⚠️ **NOTE:** The previous handoff for this slot said Medium Iteration (terracotta #C04A2E, cream bg). That is **superseded**. Implement v0.7 dark tokens. Do not implement v0.6.

**What's done:** `mobile/src/theme/tokens.ts` updated to v0.7 — OLED dark bg (#111111), gold primary (#E8B830), inverted ink (#F5EFE8), Inter font constants, cook mode true black (#000000).

**What's needed (in this order):**

1. **Install Inter, remove Source Sans 3:**
   ```
   npx expo install @expo-google-fonts/inter
   ```
   Remove `@expo-google-fonts/source-sans-3` from `mobile/package.json` dependencies.

2. **Update `useFonts()` in `mobile/app/_layout.tsx`:**
   Replace the `SourceSans3_*` font imports with:
   ```ts
   import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
   ```
   Update the `useFonts({})` call to load those three weights.

3. **Grep for any hardcoded `SourceSans3` or `source-sans` references** outside of tokens.ts and update them.

4. **Grep and fix all hardcoded light surface colours** — any `#F6F0E8`, `#EBE2D6`, `#FFFFFF`, `#181008`, `#D88A7B`, `#C04A2E`, `#B86A5A` in component files. Replace with the appropriate token reference.

5. **Check StatusBar and NavigationBar configuration** — on dark bg the system bars need `dark-content` → `light-content` (light icons on dark bg). Update any `StatusBar` style props accordingly.

6. **Build a dev APK and smoke-test:**
   - App bg is near-black `#111111`, not cream
   - Body text is warm off-white `#F5EFE8`, legible on dark
   - Primary accent (buttons, chips, active states) is gold `#E8B830`, not terracotta
   - Browse screen renders with Inter body text
   - Headings still in Playfair Display
   - Gold buttons use dark label text (`tokens.bgDeep`), not light — the surface is light gold
   - Cook mode true black `#000000` is visually darker than app bg `#111111`
   - No cream or pink remnants anywhere

**Files to touch:** `mobile/package.json`, `mobile/app/_layout.tsx`, any component with hardcoded font or colour strings, StatusBar configuration.
**Pro