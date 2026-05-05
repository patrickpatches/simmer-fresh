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
   - **Whole-food badge** — only if `recipe.whole_food_verified === true`. Small sage-green pill, same treatment as in the detail page. Sits below the at-a-glance strip.

**What does NOT change:** card tap behaviour, favourite icon, match badge (pantry context), planned-recipe indicator. Those stay exactly as-is.

**Conditional rendering rule:** At-a-glance strip and whole-food badge are both conditional — cards without those fields look like slightly simplified current cards, not broken.

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

### HANDOFF → Culinary Verifier · 2026-05-05 · IN PROGRESS (DECISION-009 — Batch 1 DONE ✅, Batch 2 open)
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

**BATCH 2 — Existing seed library — OPEN (next session)**
Walk through `mobile/src/data/seed-recipes.ts` and write expansion notes for each recipe in `docs/coo/culinary-research/<recipe-slug>.md` with the full template populated.

Priority order (11 launch-priority first):
- [ ] carbonara
- [ ] bolognese
- [ ] butter-chicken
- [ ] green-curry
- [ ] smash-burger
- [ ] roast-chicken
- [ ] pavlova
- [ ] barramundi
- [ ] shawarma
- [ ] hummus
- [ ] pad-thai
- [ ] (remaining ~17 recipes after launch priority set)

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
**Prototype reference:** `docs/prototypes/concept-dark-dramatic.html` (open in Chrome — Cowork panel renders prototypes poorly)
**Blocks:** Photography weekend planning (Patrick needs to see the dark tokens on-device before finalising photo surface decisions)

---

### HANDOFF → File Organiser · 2026-04-29 · DONE
**From:** COO
**Subject:** Session report naming breach acknowledged + convention clarified
**Why:** File Organiser flagged that `Hone_Session_Report_29_April_2026_COO.md` uses a role-tag suffix that doesn't match the CLAUDE.md naming convention.
**What's done by File Organiser:** Caught the breach, recommended a sequential-number convention (`_2`, `_3`) for multi-session days, asked COO to enforce going forward without retroactively renaming the existing file.
**What's done by COO (this session):** Recommendation accepted in full.
- `CLAUDE.md` Part 4 naming conventions and "Where things go" table updated to specify `_N` sequential suffix for additional reports on the same day, and to explicitly forbid role tags.
- `docs/FILE_MAP.md` naming conventions updated to match.
- `docs/coo/operating-rhythm.md` "At session end" ritual updated so every specialist sees the rule.
- DECISION-005 logged in `docs/coo/decision-log.md` with full rationale and the existing file's status as a one-time exception.
**Net effect:** Future multi-session days will produce `Hone_Session_Report_DD_Month_YYYY.md` and `_2.md`, never `_COO.md` or similar. Existing file on GitHub stands.
**Note:** This catch is exactly the value the File Organiser role exists to provide. The system worked.

### HANDOFF → Product Designer · 2026-04-29 · DONE (delivered 30 Apr)
**From:** Patrick (via COO)
**Subject:** Stylistic refresh — propose 3 genuinely different directions with mockups
**What's done by Designer (this session, 30 Apr):**
Patrick found the original three levels (Refinement / Medium / Alternative) too visually similar. Designer pivoted to three fundamentally distinct aesthetic worlds:

1. **Direction 1 — Pastel Cool** (`docs/prototypes/direction-1-pastel.html`)
   Fraunces + Plus Jakarta Sans. Dulux Piglet blush, sage, lavender, butter, sky. Category-coloured card pills. Soft and tactile — the antithesis of recipe-app beige. Cost: ~2 engineer sessions.

2. **Direction 2 — Bold Magazine** (`docs/prototypes/direction-2-magazine.html`)
   Space Grotesk throughout. Deep cobalt (#0B1628) surfaces. Recipe titles overlaid directly on full-bleed food photos via gradient scrim — no text below the photo card. Amber (#F0A500) as the only accent. Cost: ~2 engineer sessions.

3. **Direction 3 — Japanese Minimal** (`docs/prototypes/direction-3-minimal.html`)
   Noto Serif Display + Noto Sans. Browse is a pure typographic list — no cards, no photos. Extreme whitespace. A single vermillion (#CC3311) reserved for the "Start Cooking" CTA only. Best launch story: browse screen looks complete with zero photos. Cost: ~1.5 engineer sessions.

**What Patrick needs to do:** Pick one direction. Reply in the next session with "go with Direction N" and the Designer/Engineer pipeline picks up from there.
**Files touched:** `docs/prototypes/direction-1-pastel.html`, `docs/prototypes/direction-2-magazine.html`, `docs/prototypes/direction-3-minimal.html`
**Blocks resolved:** Photography weekend timing depends on Patrick's pick (see Photography Director handoff).

### HANDOFF → Senior Engineer · 2026-05-02 · OPEN — Pantry redesign (new, do before existing multi-task)
**From:** Product Designer (Patrick confirmed 2 May 2026)
**Subject:** Implement pantry redesign v2 — search takeover, have-it pills, match card chips (Variant A)
**Why:** Patrick confirmed Variant A (tap-to-add missing ingredient chips) on 2 May 2026. Pantry is the kill feature — this takes priority over the recipe-add task in the multi-task handoff below. Full spec in `docs/prototypes/pantry-redesign-v2.html` engineer handoff block — open in Chrome, not Cowork panel.
**What's needed (in priority order):**
1. **IngredientSearchOverlay** — new full-screen component replacing the broken floating dropdown. Mounts on add-ingredient input focus. Solid `tokens.bg` background, autocomplete SectionList grouped by category, added-this-session pills row at top. File: `mobile/src/components/IngredientSearchOverlay.tsx`.
2. **Have-it pills row** — horizontal ScrollView of sage pills for `have_it === true` items, above search bar in `ListHeaderComponent`. × to toggle off.
3. **Gold match banner** — replace the sage `Pressable` pill with a left-gold-accent card (`tokens.primary` left border, `tokens.surface` bg, `tokens.gold-border` outer border).
4. **Variant A missing-ingredient chips** — reshape `RecipeMatchResult` to expose `missingIngredients: Array<{name, amount, unit, substitutions}>`. Cap at 4 chips visible, "+N more →" for overflow. On tap: chip disappears + 3-second undo banner. Sort substitution-available first. No hint caption. `hitSlop={8}` on each chip `Pressable`.
5. **Remove percentage badge** from `MatchCard` entirely. "N of X ingredients" + progress bar is sufficient.
**Files:** `mobile/app/(tabs)/pantry.tsx`, new `mobile/src/components/IngredientSearchOverlay.tsx`
**Decision reference:** DECISION-008 in `docs/coo/decision-log.md`
**Blocks:** Pantry is the kill feature — must land before Internal Alpha (22 May milestone).

---

### HANDOFF → Senior Engineer · 2026-04-29 · IN PROGRESS
**From:** Patrick (via COO)
**Subject:** Three priority tasks — bundle rename, substitution UI, add 6 new recipes
**Why:** Patrick made multiple decisions on 29 April that all queue up to Senior Engineer. Sequenced because each unblocks downstream work.
**Engineer update (30 Apr 2026):**
- ✅ Task 1 (bundle ID rename) — COMPLETE. `com.patricknasr.simmerfresh` → `com.patricknasr.hone` in `mobile/app.json`. ADR written at `docs/adr/001-bundle-id-rename.md`. Play Console steps in the ADR. `splash.backgroundColor` and `android.adaptiveIcon.backgroundColor` also updated to `#111111`.
- ✅ Task 2 (Substitution UI + photo badge) — COMPLETE. `SubstitutionSheet.tsx` built with `@gorhom/bottom-sheet` `BottomSheetModal`. Wired into `recipe/[id].tsx` — ingredient rows show swap icon when substitutions exist, tap opens sheet. "Photos soon" badge added to `RecipeCard.tsx` (bottom-right, dark scrim). Stage notice banner added to recipe detail. Step photo placeholder added to each step. `BottomSheetModalProvider` added to root `_layout.tsx`.
- 🔴 Task 3 (add 6 new recipes) — BLOCKED. `docs/coo/culinary-research/` does not exist. Culinary Verifier has not delivered source recipes. See new OPEN handoff below. Do not proceed until Culinary Verifier delivers.
**What's done:** Patrick approvals + Product Designer specs.
**What's needed (in this order):**

1. **Rename bundle ID** `com.patricknasr.simmerfresh` → `com.patricknasr.hone` in `mobile/app.json` and `mobile/package.json`. Verify clean APK build. Write ADR (`docs/adr/NNN-bundle-id-rename.md`). Tell Patrick the Play Console steps for the next AAB upload (new app entry under new package name auto-creates).

2. **Implement Substitution UI + recipe-card photo-badge states** per Product Designer's specs at `docs/prototypes/substitution-sheet.html` and `docs/prototypes/recipe-card-states.html`. Use `@gorhom/bottom-sheet` (`BottomSheetModal`) for the SubstitutionSheet component. Derive `hasStagePhotos` from `steps.every(s => !!s.photo_url)` — no schema change needed. Badge text "Photos soon" (not "Stage photos coming soon"). See the handoff block in those HTML files for full spec.

**3a. (NEW per DECISION-007) Schema change — add `scaling_note` to Ingredient.** Do this BEFORE populating the 6 new recipes so cook's scaling annotations have a place to land:
- In `mobile/src/data/types.ts`: add `scaling_note: z.string().optional()` to the `Ingredient` Zod schema. Update the TypeScript type accordingly.
- In `mobile/src/data/scale.ts`: when scale.ts produces a scaled ingredient list, the `scaling_note` field passes through unchanged (it's plain English, not math).
- UI surface: in `mobile/app/recipe/[id].tsx`, when the user changes serving count and an ingredient has a `scaling_note`, surface the note as a small icon/tooltip next to the amount (or in the ingredient row's secondary text). Designer hasn't speced this — use minimal styling consistent with v0.7 dark tokens (muted text, gold info icon if needed). Spec it lightly and ship; we'll iterate.
- Purely additive change — no breaking effect on existing recipes that don't use the field.
- Cost: ~1 hour of engineer.

3. **Add 6 new recipes** to `mobile/src/data/seed-recipes.ts` per DECISION-004:
   - Chicken schnitzel (Australian pub classic)
   - Easy chicken & vegetable stir-fry (generic Australian weeknight)
   - Beef lasagne (Australian household staple)
   - Roast lamb with rosemary & garlic (Sunday roast)
   - Fish & chips (Australian Friday classic)
   - Falafel (Levantine)
   Each must follow the standard schema (chef-attributed if possible — coordinate with Culinary Verifier on sources — substitutions populated with quality flags, `scales` flag set per ingredient, `scaling_note` populated where chef knowledge changes the answer, `whole_food_verified: true` where appropriate, Australian English, metric units, dual-axis categories). Block on Culinary Verifier to provide authoritative source recipes before populating chef attribution.

**Files touched:** `mobile/app.json`, `mobile/package.json`, `mobile/app/recipe/[id].tsx`, `mobile/src/components/SubstitutionSheet.tsx` (new), `mobile/src/components/RecipeCard.tsx` (or equivalent), `mobile/src/data/seed-recipes.ts`, `docs/adr/`
**Blocks:** All future AAB uploads (#1), v1 feature completeness (#2), photography of new showcase recipes (#3)

### HANDOFF → Patrick · 2026-04-29 · DONE (✅ approved 29 Apr — DECISION-001)
**From:** COO
**Subject:** Confirm or amend launch date target
**Resolution:** Patrick approved 24 July 2026 launch date on 29 April: "24 July works for me unless we need more time." DECISION-001 logged. This handoff is closed — engineer reports referencing it as "still open" reflect stale awareness, not actual status.

_(Substitution UI handoff superseded by the consolidated Senior Engineer multi-task handoff above.)_

### HANDOFF → Product Designer · 2026-04-29 · DONE
**From:** COO
**Subject:** Design the Substitution bottom-sheet + "Stage photos coming soon" badge
**Why:** Engineer needs visual specs before building. Must respect terracotta/olive/gold tokens and Playfair/Source Sans 3 type scale. Per DECISION-003, the badge is needed for ~18 non-launch recipes.
**What's done:** Both specs delivered 29 Apr 2026.
- `docs/prototypes/substitution-sheet.html` — interactive bottom-sheet prototype. Full flow: ingredient tap → sheet open → substitution select → confirm. All quality pill states (perfect_swap / great_swap / good_swap / compromise), hard_to_find notice, all spacing/token annotations, engineering handoff block.
- `docs/prototypes/recipe-card-states.html` — recipe card 3 states, recipe detail with/without stage photos, step placeholder, full spec tables. Badge is a dark-scrim pill ("Photos soon") bottom-right of card image — opposite corner from the existing difficulty badge. No collision.
**Key design decisions:**
- Badge text: "Photos soon" (not "Stage photos coming soon" — shorter, less internal-feeling)
- Derive `hasStagePhotos` from `steps.every(s => !!s.photo_url)` — no new schema field needed
- Dark scrim on badge (not sky/blue) so it reads on any photo colour
- Stage notice appears once in recipe detail (not repeated per step)
**Files touched:** `docs/prototypes/substitution-sheet.html`, `docs/prototypes/recipe-card-states.html`

---

_(Designer-to-engineer handoff folded into the consolidated Senior Engineer multi-task handoff above. Specs remain at the prototype paths for engineer reference.)_

### HANDOFF → Photography Director · 2026-04-29 · IN PROGRESS (all pre-shoot deliverables delivered 1 May)
**From:** COO · **Direction update 30 Apr · Schedule update 1 May**
**Subject:** Build shot lists for showcase 10 + hero-only for everything else

⚠️ **SCHEDULE UPDATE (1 May 2026):** Photography weekend 1 (3–4 May) is **lost** — Patrick is away on personal commitments. Re-baselined: **weekend 2 (10–11 May) is now the de facto first shoot weekend.** Phase A buffer is consumed; no further weekends can slip without launch impact. Patrick is using this morning's window to push design and product work forward instead — see new Product Designer handoff for Pantry redesign.

⚠️ **DIRECTION UPDATE (30 Apr 2026):** Patrick chose the **Dark Dramatic** visual direction. The app bg is now near-black `#111111`. This changes what good photography looks like in the UI — food shot against dark surfaces, dark boards, and dark plates will integrate far more powerfully than food on white or wood. Factor this into all surface and prop recommendations below.

**Why:** Photography is the longest pole. Per DECISION-004, scope is now ~34 recipes — 10 showcase (full stage shots) + ~24 hero-only.
**What's done:** Brief at `docs/coo/specialists/photography-director.md`. Recipe library locked per DECISION-004.
**What's needed:**
1. **Showcase shot list** at `docs/coo/photography/shot-list-showcase.md` for the 10 showcase recipes (hero + ~6 stage shots each = ~60 shots). The 10 are: Roast Chicken, Spaghetti Bolognese, Spaghetti Carbonara, Butter Chicken, Thai Green Curry, Chicken Schnitzel, Smash Burger, Pan-Fried Fish (barramundi), Pavlova, Chicken Shawarma.
2. **Hero-only shot list** at `docs/coo/photography/shot-list-hero-