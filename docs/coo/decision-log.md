# Decision Log

> Business decisions for Hone. Distinct from `docs/adr/` which records technical architecture decisions. Newest at top.

---

## DECISION-011 · 2026-05-05 · Palette switch: Dark Dramatic → Sage
**Status:** ✅ APPROVED by Patrick 5 May 2026 ("lets do it!")
**Decider:** Patrick
**Context:** A Sage concept prototype was built during the 5 May design session (`docs/prototypes/app-flow-v2.html`). Patrick reviewed the 5-screen prototype (Kitchen, Pantry, Shop, Profile, Recipe Detail) with five design improvements applied and approved the direction. The prototype showed all five improvements in context on the Sage palette, making the decision unambiguous.
**Previous direction:** Dark Dramatic (v0.7) — near-black surfaces (`#111111`), warm off-white text (`#F5EFE8`), gold primary (`#E8B830`). Decided 30 April 2026 (DECISION-007).
**New direction:** Sage — sage-green surfaces (`#E8F0E6`), dark text (`#111410`), rust primary (`#B84030`), forest secondary (`#2E5E3E`).
**Five design improvements shipped alongside the palette:**
1. **Eyebrow colour split** — Kitchen eyebrow = rust (warm anchor tab). Pantry/Shop eyebrow = forest (utility tabs). Prevents two rust elements competing on screens where the italic headline word uses the same accent colour.
2. **Card surface softened** — `#FAFAF7` (warm near-white) instead of white. Warmer against the sage background; matches the cream value used throughout.
3. **Tab bar inactive opacity raised** — `rgba(17,20,16,0.52)` instead of 38% transparent white. Inactive tabs were disappearing into the light dock at lower opacity; 52% dark ink gives legibility without competing with the active rust pill.
4. **Match banner colour distributed** — Left strip stays rust (signal function). Title text is now ink with only the count number in rust. "See all" chip moves to forest. All three elements previously being rust made the banner read as an alarm, not an achievement.
5. **Recipe Detail** — all prototype sections (before you start, mise en place, cook steps, why callouts, finishing block) validated at concept level; already shipped in DECISION-008 implementation.
**Token name changes:** None — all token names unchanged, values replaced. One new token added: `onPrimary` (#FAFAF7) for text/icon on solid rust surfaces.
**Files changed:** `mobile/src/theme/tokens.ts`, `mobile/app/(tabs)/_layout.tsx`, `mobile/app/(tabs)/pantry.tsx`, `mobile/app/(tabs)/shop.tsx`.
**Cook mode:** Unchanged — stays OLED true black (`#000000`). CLAUDE.md mandate. Now even more visually distinct as the app bg is a light sage green.
**Revisit when:** User testing shows dark-on-light text reads poorly outdoors in harsh Australian sun, or if the sage bg reads as medicinal/clinical to test users.

---

## DECISION-008 · 2026-05-02 · Pantry missing-ingredient affordance — Variant A (tap-to-add chips)
**Status:** ✅ APPROVED by Patrick 2 May 2026
**Decider:** Patrick
**Context:** Pantry redesign v2 (`docs/prototypes/pantry-redesign-v2.html`) proposed two variants for how missing ingredients are displayed on recipe match cards. The current build shows decorative "+" prefixes that have no action — a broken affordance. Two fixes were designed: Variant A (gold tappable chips that add directly to shopping list), Variant B (informational plain-text list, no per-ingredient action).
**Options considered:**
1. **Variant A** — Gold chip per missing ingredient, "+" prefix, tapping adds that ingredient (with quantity) to the shopping list, chip disappears, undo banner appears. More expressive, more granular, requires shopping list integration in the Pantry screen.
2. **Variant B** — Hollow dot list, no action affordance, single "Add all to shopping list" row action at card bottom. Simpler to build, less cognitive overhead, all-or-nothing.
**Decision:** Variant A.
**Rationale:** The "+" has to do something — the current state where it does nothing is the bug. Variant A delivers on the affordance and gives the user per-ingredient control, which matters when they only need 2 of 5 missing items (the other 3 might be available as substitutions or already owned and not toggled). Per-ingredient granularity is the right resolution.
**Five implementation refinements confirmed alongside the pick:**
1. Remove the hint caption below the chips — the design should carry its own affordance.
2. Cap at 4 chips visible; "+N more →" routes to recipe detail for the rest.
3. On tap: chip disappears (confirmation) + 3-second undo banner at bottom of screen.
4. Add with quantity and unit (full ingredient object), not just the name string.
5. Sort chips by substitution availability first — ingredients with substitutions surface at the front of the row.
**Consequences:** Engineer needs to reshape <code>RecipeMatchResult</code> to expose <code>missingIngredients: Array&lt;{name, amount, unit, substitutions}&gt;</code>, not just <code>missingNames: string[]</code>. Pantry screen gains a shopping list write path. New component: <code>IngredientSearchOverlay</code> (search takeover). All in <code>mobile/app/(tabs)/pantry.tsx</code> and <code>mobile/src/components/IngredientSearchOverlay.tsx</code>.
**Revisit when:** User testing shows per-chip tapping is awkward (small targets, fat-finger errors) — in that case downgrade to Variant B's "Add all" row action.

---

## DECISION-010 · 2026-05-05 · Repo goes private until launch day
**Status:** ✅ APPROVED by Patrick 5 May 2026 ("go private now")
**Decider:** Patrick
**Context:** Patrick received an automated cold-outreach email (NiubiStar / hello@fronyl.com — bot-scraped his README structure, pitched a paid placement service). Worried about discoverability friction and competitive risk while pre-launch. COO recommended going private until launch day as the highest-leverage low-cost move.
**Decision:** Make `github.com/patrickpatches/hone` private effective immediately. Flip back to public on launch day (24 July 2026 target).
**Rationale:**
- Stops automated bot scrapers that are already finding the repo
- Hides internal docs (decision log, risk register, command centre, launch plan, recipe research, prototypes) from public visibility
- Removes the surface area for the "someone scrapes recipes and ships a knock-off" risk
- Costs effectively nothing for a pre-launch project — open-source credibility doesn't apply yet because there are no users
- Re-flipping at launch is a one-click action
**Consequences:**
- **GitHub Pages caveat:** The web preview at `patrickpatches.github.io/hone/` will stop being publicly accessible if the repo is private on GitHub Free. Two options: (a) accept the loss of the web preview until launch — Patrick uses the APK on his phone for testing anyway, or (b) upgrade to GitHub Pro (~$4/month) which allows public Pages from a private repo. Recommended: option (a). Web preview is not the primary product.
- **PAT exposure during public period:** The GitHub PAT embedded in `.git/config` remote URL was visible during the public window. Senior Engineer should rotate the PAT after the repo flips private. Separate engineer handoff written.
- **GitHub Actions free minutes:** Private repos on GitHub Free get 2,000 free Actions minutes/month — well above what Hone uses.
- **Specialist workflows:** No change. Specialists work via local files; Patrick's PAT-authenticated remote handles push/pull. Operating rhythm gains a small note so future specialist sessions know the repo is private.
- **Trademark / LICENSE:** Per `docs/patrick-action-list.md`, both deferred to post-launch. Stays the right call.
**Revisit when:** Launch day (24 July 2026) — flip back to public.

---

## DECISION-009 · 2026-05-05 · Full recipe template — every recipe in the database becomes a teaching artefact
**Status:** ✅ APPROVED by Patrick 5 May 2026 ("I prefer to fix every single recipe, everyone in my database")
**Decider:** Patrick
**Context:** Patrick observed that recipes in their current state read like ingredient + step lists — the structure of every other recipe app. He wants Hone's recipes to read as world-class teaching artefacts: chef knowledge baked in, prep separated from cook, before-you-start framing, finishing/tasting guidance, leftovers and storage handled. Asked how the cook, the verifier, and a recipe designer would collaborate. COO recommended folding the recipe-design craft into the cook's brief rather than spinning up a separate Recipe Designer specialist. Patrick chose the full-fat option (full template) and explicitly extended scope from the 17 priority recipes to every recipe in the database.

**Decision:** Adopt the 10-section recipe template for every recipe in the seed library. The cook owns content AND structure. No new specialist role created. *(Note: prior drafts of this entry referred to "8 sections" — that count was the new sections being added, not the total. The full template has 10 sections including hero, ingredients, and cook steps which existed already. Corrected for accuracy 5 May.)*

**The 10-section template:**
1. **Hero** — title, hero photo, chef attribution if applicable, cuisine + type tags, base servings
2. **At a glance** — total time, active time, difficulty, leftover-friendliness, cuisine
3. **Description** — 1-2 sentences on what this is and why someone would make it. Chef-direct, not food-blog prose.
4. **What to know before you start** — 1-3 short framing bullets the cook needs in their head before they start. Examples: "This goes fast once the pan's hot — get everything prepped before you turn on the heat." or "Salt at every stage. The dish is built on layered seasoning."
5. **Equipment** — pans, tools, anything the cook needs that isn't food. Listed before the cook starts so they can check the cupboard.
6. **Ingredients** — current schema, with substitutions, quality flags, scales, scaling_note (per DECISION-007).
7. **Mise en place** — what to do BEFORE turning on the heat. Chop, measure, bring eggs to room temp, get the pan hot. Distinct from step 1. Read with the fridge open.
8. **Cook steps** — current `steps[]` with `photo_url`, `why_note`, doneness cues, recovery tips for failure modes.
9. **Finishing & tasting** — taste, adjust, plate. The chef-table moment most home cooks miss. "It probably needs more salt or a squeeze of lemon. Trust your palate."
10. **Leftovers & storage** — *"This improves overnight."* / *"Freezes for three months. Reheat with a splash of stock."*

**Scope:** All recipes in `mobile/src/data/seed-recipes.ts` plus the six new recipes the cook is currently writing in `docs/coo/culinary-research/`. Estimated 30+ recipes total. Cook re-writes structure on each. ~30 minutes per recipe × 30+ recipes = ~15-20 hours of cook work, parallelisable across multiple sessions.

**Schema additions needed:**
- `total_time_minutes: number`
- `active_time_minutes: number`
- `difficulty: "beginner" | "intermediate" | "advanced"`
- `equipment: string[]`
- `before_you_start: string[]` — max 3 entries
- `mise_en_place: string[]` — discrete prep tasks
- `finishing_note: string` — tasting + adjustment guidance
- `leftovers_note: string` — storage, freezing, refresh tips
- Existing `description` field stays but trimmed to 1-2 sentences

**Rationale:** Recipes are the product. Stage photos and dark visual direction matter only because they serve the recipe. Without recipe quality at this depth, Hone is a prettier Yummly. With it, Hone is a cookbook in your phone.

**Consequences:**
- Engineer extends Recipe Zod schema in `mobile/src/data/types.ts` (additive, ~1-2 hours).
- Designer redesigns the recipe-detail page surface to display the new sections (~1 session).
- Engineer implements the new UI sections (~1 session).
- Cook expands every recipe to the new template (~15-20 hours across multiple sessions). The six new recipes she's writing now should adopt the new template immediately.
- Photography is unaffected — cook step photos still apply.
- Launch date — tight but achievable within 24 July if cook can dedicate sustained sessions to recipe work and the schema/UI work happens in parallel. If cook capacity becomes the bottleneck, fall back to two-tier launch: 17 priority recipes get full template, remaining recipes ship in current form with hero photo and "Photos soon" badge — full template applied post-launch in v1.0.x patches.

**Revisit when:** Cook capacity proves infeasible to hit all recipes by launch — re-plan with two-tier scope.

---

## DECISION-007 · 2026-04-30 · Portion-sizing authority — cook owns scaling knowledge, engineer owns math
**Status:** ✅ APPROVED by Patrick 30 April 2026 ("do it")
**Decider:** Patrick
**Context:** The current schema has `scales: "linear" | "fixed" | "custom"` per ingredient. Engineer's `mobile/src/data/scale.ts` does the math. The flag is supposed to capture "this scales linearly, this doesn't" but nothing forces the flag to be correct, and `"custom"` had no implementation. Patrick's instinct: chefs know how dishes scale in reality (bread is fixed, salt-to-pasta-water is sub-linear, eggs in carbonara are 1-per-100g not "scale by serving ratio") — the cook should annotate, not the engineer.

**Options considered:**
1. **Light** (chosen): Cook annotates every ingredient with the existing `scales` flag plus a new optional `scaling_note: string` field. The note is plain English and shows in the UI when the user changes serving size. Engineer adds the field to the Zod schema and surfaces it in the recipe-detail UI. Half-session of engineer, in-scope for cook's existing recipe-writing work.
2. **Medium**: Add `scaling_breakpoints` to ingredients that don't scale linearly. Cook specifies discrete points ("at 4 servings = 2 tbsp; at 8 servings = 3 tbsp") and engineer interpolates. ~1 session of engineer, schema change. Deferred to v1.1.
3. **Heavy**: Each recipe ships with multiple hand-tuned serving variants (2/4/6/8). No interpolation. Most accurate but cook does ~3× the work per recipe. Probably 2 weeks slip. Rejected.

**Decision:** Light implementation for v1.0.
- New optional field on Ingredient schema: `scaling_note?: string`. Plain English. Cook writes it. UI displays it when user changes serving count.
- Existing `scales` enum stays as-is (`"linear" | "fixed" | "custom"`). Documentation updated to clarify `"custom"` means "needs `scaling_note` to handle correctly."
- Cook owns annotation. Engineer owns the math + UI surface.

**Rationale:** Honours Patrick's instinct that chef knowledge beats math for scaling. Honest under Rule 5 — when scaling produces a wrong-looking number, the user sees the cook's note explaining why. Differentiator vs Yummly/Supercook (who just multiply blindly). Doesn't break existing engineer code or schema — purely additive.

**Consequences:**
- Cook's brief updated with annotation responsibility for every ingredient.
- Senior Engineer handoff gains a small new task: add `scaling_note?: string` to Ingredient in `mobile/src/data/types.ts` (Zod), surface in recipe detail UI when servings ≠ base.
- Cook applies the new annotation as she writes the 6 source recipes — zero rework if she gets the message before going deeper. Patrick sends a short paste-message to the active cook chat now.
- Existing seed library recipes also need `scaling_note` annotation as part of the cook's audit pass, but only for ingredients that genuinely scale weirdly. Most won't need a note.

**Revisit when:** Beta tester feedback shows users hit scaling problems the note doesn't cover — then we promote to Medium (breakpoints) for v1.1.

---

## DECISION-006 · 2026-04-30 · Visual direction switch — Dark Dramatic replaces Medium Iteration
**Status:** ✅ APPROVED by Patrick 30 April 2026 — "confirmed, i like the dark style"
**Decider:** Patrick
**Context:** On 30 April 2026 the Product Designer delivered a second round of three direction options (Pastel Cool, Bold Magazine, Japanese Minimal) after Patrick found the first round too visually similar. Patrick then requested food-forward and dark-dramatic concepts inspired by reference apps (Pizza Party, Kopi Kap, Burger House). After iterative refinement of the dark dramatic prototype — gold border on image, square grid, fixed-height label panels, real embedded food photography — Patrick confirmed the dark direction.

Earlier in the same session Patrick had chosen "Option B — Medium Iteration" and that token set had already been committed to `mobile/src/theme/tokens.ts` (v0.6). This decision supersedes that choice.

**Options considered:**
1. **Medium Iteration** (v0.6, warm cream #F6F0E8, deep terracotta #C04A2E, Inter body). Already tokened and handed off to engineer. Rejected on aesthetic grounds — Patrick's reference apps had darker, more dramatic visual language.
2. **Dark Dramatic** (v0.7, OLED near-black #111111 bg, gold #E8B830 accent, Playfair + Inter unchanged). Full-bleed food photography on dark surfaces; gold as sole typographic accent. Approved.
3. Pastel Cool, Bold Magazine, Japanese Minimal — all considered and not chosen this session.

**Decision:** Dark Dramatic is the visual direction for Hone v1.0.
- App bg: `#111111` (dark), card surfaces: `#1A1A1A`, label panels: `#080808`
- Primary accent: gold `#E8B830` (replaces terracotta `#C04A2E`)
- Ink inverted: warm off-white `#F5EFE8` (was near-black `#181008`)
- Cook mode: true `#000000` (visually distinct from app bg)
- Font pairing unchanged: Playfair Display (display) + Inter (body)
- Prototype reference: `docs/prototypes/concept-dark-dramatic.html`

**Rationale:** Food photography is the product's core differentiator. Dark surfaces make food photos "pop" more than light/cream backgrounds — the photo becomes the primary visual element rather than competing with a warm background. Gold as a single accent colour is disciplined and memorable. The dark direction also means cook mode (already mandated dark by CLAUDE.md) is a natural continuation of the app's overall visual language rather than an abrupt shift.

**Consequences:**
- `mobile/src/theme/tokens.ts` updated to v0.7 with dark token set (done this session).
- Senior Engineer handoff updated — font swap instructions unchanged (Inter still needed), palette swap now covers the full dark token set not just terracotta.
- Photography Director handoff updated — food should now be shot against dark surfaces/boards/slates where possible so hero and stage photos integrate with the dark UI.
- v0.6 token values (Medium Iteration) are superseded. No components were updated to use them yet, so there is no rollback work required in components — the engineer just implements v0.7.
- The warm-cream prototype references (`refresh-B-medium.html`, `refresh-A-refinement.html`) remain in `docs/prototypes/` as archived direction options but are no longer the reference implementation.

**Revisit when:** Patrick sees the dark palette on-device and wants to adjust specific values (bg lightness, gold saturation, or card surface contrast). Fine-tuning is expected; the direction itself is locked.

---

## Format

```
## DECISION-NNN · YYYY-MM-DD · [Title]
**Decider:** Patrick / COO / [specialist]
**Context:** Why this decision needed to be made
**Options considered:** What we looked at
**Decision:** What we picked
**Rationale:** Why we picked it
**Consequences:** What this means downstream — both intended and side effects
**Revisit when:** A trigger that should make us reconsider
```

---

## DECISION-005 · 2026-04-29 · Session-report naming convention — clarify multi-session-per-day case
**Status:** ✅ APPROVED 29 April 2026 (COO accepted File Organiser's recommendation)
**Decider:** File Organiser proposed, COO approved, applied to CLAUDE.md and FILE_MAP.md.
**Context:** On 29 April 2026 the COO created a second session report on the same day and named it `Hone_Session_Report_29_April_2026_COO.md`. The File Organiser flagged this as a naming convention breach — CLAUDE.md specifies `Hone_Session_Report_DD_Month_YYYY.md` with nothing after the date. The original convention didn't address the case of multiple reports on the same day.
**Options considered:**
1. Allow role tags as suffixes (`_COO`, `_engineer`, etc.). Rejected — creates a parallel naming convention that erodes over time as roles multiply.
2. Sequential numbering for the second-and-later report of the day (`_2`, `_3`, etc.). **Accepted.**
3. Force append-to-existing-report-for-the-day. Rejected — sometimes sessions are distinct enough to warrant their own write-up.
**Decision:** Convention going forward is `Hone_Session_Report_DD_Month_YYYY.md` for the first (or only) report of the day, and `_2.md`, `_3.md` etc. for further reports. Discoverable content goes in the H1 title and summary inside the file, never in the filename.
**Consequences:** CLAUDE.md, FILE_MAP.md, and `docs/coo/operating-rhythm.md` updated to make this explicit. The existing `Hone_Session_Report_29_April_2026_COO.md` remains as-is on GitHub — File Organiser's call not to retroactively rename. It stands as a one-time exception that documents the lesson.
**Revisit when:** A naming case comes up that this rule doesn't cover (e.g., session reports authored from a different timezone where dates collide).

---

## DECISION-004 · 2026-04-29 · Expand launch library from 10 to 17 priority recipes
**Status:** ✅ APPROVED by Patrick 29 April 2026
**Decider:** Patrick
**Context:** COO recommended 10 launch recipes. Patrick reviewed the popularity tier list from `docs/coo/launch-recipe-research.md` and elected to ship all 17 recipes from the data-derived list as the v1.0 priority launch library. Carbonara only (creamy chicken pasta deferred). Both pan-fried fish AND fish & chips ship as separate recipes.
**Decision:** v1.0 launch library = 17 priority recipes from popularity research, of which 10 receive full stage-by-stage photography (showcase) and 7 receive hero shot + "Photos soon" badge. All existing recipes in seed library continue to ship per DECISION-003.
**Rationale:** Patrick's instinct: a recipe app launching in Australia should have all the major Australian household dishes. A 10-recipe library reads thin; 17 reads like a real cookbook of what Australians actually cook. The showcase-vs-hero split preserves the differentiator (stage photos as the visible competitive advantage) without forcing every recipe to wait for full photography.
**Consequences:**
- 6 new recipes to add to seed library: schnitzel, stir-fry, lasagne, roast lamb, fish & chips, falafel. Senior Engineer + Culinary Verifier work, ~1–2 sessions.
- Photography expands from 5 weekends to 6–7 weekends (5 for showcase, 1–2 for hero shots of all non-showcase recipes including the existing library).
- Audit scope grows from 28 to ~34 recipes.
- 24 July launch date still achievable but margins compress. Any milestone slip = launch slip.
**Revisit when:** A milestone slips by more than one week, OR Patrick wants to add or cut a recipe from the 17.

---

## DECISION-003 · 2026-04-29 · Recipes 11–28 already in app — what happens at launch
**Status:** ✅ APPROVED by Patrick 29 April 2026 — Option 2 (hero shot + "Photos soon" badge)
**Badge text update:** Product Designer shortened "Stage photos coming soon" → "Photos soon" (less internal-feeling, fits the chip space). Implementation spec in `docs/prototypes/recipe-card-states.html`.
**Decider:** Patrick decides, COO recommends
**Context:** App currently contains 28 seeded recipes. Launch plan focuses on 10 fully-photographed launch recipes. Question: what happens to the other 18 recipes that won't have full stage-by-stage photography by 24 July?
**Options considered:**
1. **Strip them from v1.** Ship with only 10 recipes. Simplest, but library feels thin.
2. **Ship them with hero shots only, badged "Stage photos coming soon".** Honest per Rule 5, library stays full, differentiator is preserved on the showcase 10.
3. **Ship them with no photo indicator.** Rule 4 violation — diluting the visual differentiator.
**Recommendation:** Option 2. Library reads full, showcase 10 carry the differentiator, badge keeps us honest. Post-launch we add stage shots one recipe at a time and remove the badge as each is upgraded.
**Consequences if Option 2 chosen:** Photography Director needs to plan a hero shot for each non-launch recipe (18 quick shots, ~1 weekend). Product Designer needs a "Stage photos coming soon" badge component. Recipe sort defaults to showing the 10 launch recipes first.

---

## DECISION-002 · 2026-04-29 · Defer Rule 3 (user-added recipes) to v1.1
**Status:** ✅ APPROVED by Patrick 29 April 2026
**Decider:** COO recommends, Patrick approv