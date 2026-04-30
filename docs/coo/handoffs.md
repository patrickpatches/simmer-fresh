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

### HANDOFF → Senior Engineer · 2026-04-30 · IN PROGRESS (awaiting Patrick on-device confirm)
**From:** Product Designer + COO (direction switch confirmed by Patrick 30 April 2026)
**Engineer note (30 Apr 2026):** All wiring done. APK build triggered. Awaiting Patrick's on-device smoke-test. Do NOT advance to Priority 2 until confirmed.
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

### HANDOFF → Senior Engineer · 2026-04-29 · OPEN (multi-task — sequence in this order)
**From:** Patrick (via COO)
**Subject:** Three priority tasks — bundle rename, substitution UI, add 6 new recipes
**Why:** Patrick made multiple decisions on 29 April that all queue up to Senior Engineer. Sequenced because each unblocks downstream work.
**What's done:** Patrick approvals + Product Designer specs.
**What's needed (in this order):**

1. **Rename bundle ID** `com.patricknasr.simmerfresh` → `com.patricknasr.hone` in `mobile/app.json` and `mobile/package.json`. Verify clean APK build. Write ADR (`docs/adr/NNN-bundle-id-rename.md`). Tell Patrick the Play Console steps for the next AAB upload (new app entry under new package name auto-creates).

2. **Implement Substitution UI + recipe-card photo-badge states** per Product Designer's specs at `docs/prototypes/substitution-sheet.html` and `docs/prototypes/recipe-card-states.html`. Use `@gorhom/bottom-sheet` (`BottomSheetModal`) for the SubstitutionSheet component. Derive `hasStagePhotos` from `steps.every(s => !!s.photo_url)` — no schema change needed. Badge text "Photos soon" (not "Stage photos coming soon"). See the handoff block in those HTML files for full spec.

3. **Add 6 new recipes** to `mobile/src/data/seed-recipes.ts` per DECISION-004:
   - Chicken schnitzel (Australian pub classic)
   - Easy chicken & vegetable stir-fry (generic Australian weeknight)
   - Beef lasagne (Australian household staple)
   - Roast lamb with rosemary & garlic (Sunday roast)
   - Fish & chips (Australian Friday classic)
   - Falafel (Levantine)
   Each must follow the standard schema (chef-attributed if possible — coordinate with Culinary Verifier on sources — substitutions populated, `whole_food_verified: true` where appropriate, Australian English, metric units, dual-axis categories). Block on Culinary Verifier to provide authoritative sources before populating chef attribution.

**Files touched:** `mobile/app.json`, `mobile/package.json`, `mobile/app/recipe/[id].tsx`, `mobile/src/components/SubstitutionSheet.tsx` (new), `mobile/src/components/RecipeCard.tsx` (or equivalent), `mobile/src/data/seed-recipes.ts`, `docs/adr/`
**Blocks:** All future AAB uploads (#1), v1 feature completeness (#2), photography of new showcase recipes (#3)

### HANDOFF → Patrick · 2026-04-29 · OPEN
**From:** COO
**Subject:** Confirm or amend launch date target
**Why:** Recommending push to 24 July 2026 from June. Reasoning in `docs/coo/launch-plan.md`.
**What's done:** New schedule drafted with milestones.
**What's needed:** Patrick says yes / amend / push back further.
**Files touched:** `docs/coo/launch-plan.md`, `docs/roadmap.md` (still to update)
**Blocks:** Roadmap update, all downstream sequencing

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

### HANDOFF → Photography Director · 2026-04-29 · OPEN (URGENT — first shoot 3-4 May)
**From:** COO · **Direction update added 30 April 2026**
**Subject:** Build shot lists for showcase 10 + hero-only for everything else

⚠️ **DIRECTION UPDATE (30 Apr 2026):** Patrick chose the **Dark Dramatic** visual direction. The app bg is now near-black `#111111`. This changes what good photography looks like in the UI — food shot against dark surfaces, dark boards, and dark plates will integrate far more powerfully than food on white or wood. Factor this into all surface and prop recommendations below.

**Why:** Photography is the longest pole. Per DECISION-004, scope is now ~34 recipes — 10 showcase (full stage shots) + ~24 hero-only.
**What's done:** Brief at `docs/coo/specialists/photography-director.md`. Recipe library locked per DECISION-004.
**What's needed:**
1. **Showcase shot list** at `docs/coo/photography/shot-list-showcase.md` for the 10 showcase recipes (hero + ~6 stage shots each = ~60 shots). The 10 are: Roast Chicken, Spaghetti Bolognese, Spaghetti Carbonara, Butter Chicken, Thai Green Curry, Chicken Schnitzel, Smash Burger, Pan-Fried Fish (barramundi), Pavlova, Chicken Shawarma.
2. **Hero-only shot list** at `docs/coo/photography/shot-list-hero-only.md` for ~24 recipes — 7 from priority list (stir-fry, lasagne, roast lamb, fish & chips, hummus, pad thai, falafel) plus all existing seed recipes not in the showcase 10. One hero shot each, batchable in 1–2 dedicated weekends.
3. **Pre-flight checklist** Patrick uses every shoot weekend. One-page printable. **Include dark surface recommendations (dark slate, black board, charcoal linen) as preferred first-choice props for all dishes where they work aesthetically.**
4. **Post-processing preset** documented (white balance, contrast, sharpening — so reshoots match). **For dark direction: slightly richer shadows, deeper blacks, food colours should feel saturated against the dark bg. Avoid over-brightening whites.**
5. **Schedule recommendation** — propose which 2 showcase recipes to shoot each weekend, ordered by which are easiest to get right first (build Patrick's confidence) and which need most attention.
**Coordination:** New showcase recipe (chicken schnitzel) needs to be in the seed library before its shoot weekend — coordinate with Senior Engineer on timing.
**Dark surface prop notes:** The 2×2 browse grid in the approved prototype uses square crops. Props that disappear into the edges of the frame (dark plates, dark boards) look best — the food is the hero, not the surface. Avoid: white plates, bright-wood boards, busy printed linens. Prefer: matte black slate, charcoal/grey linen, raw dark timber, brushed steel.
**Files touched:** `docs/coo/photography/shot-list-showcase.md`, `docs/coo/photography/shot-list-hero-only.md`, `docs/coo/photography/preflight-checklist.md`, `docs/coo/photography/post-processing-preset.md`
**Blocks:** First photo weekend (3-4 May 2026)

### HANDOFF → Culinary & Cultural Verifier · 2026-04-29 · OPEN (URGENT)
**From:** COO
**Subject:** Audit existing recipes + provide source recipes for 6 NEW additions
**Why:** v1.0 launch library expanded per DECISION-004. Now ~34 recipes need audit, AND 6 new recipes need authoritative sources before Senior Engineer can populate them.
**What's done:** Brief at `docs/coo/specialists/culinary-verifier.md`. Recipe library locked per DECISION-004.
**What's needed:**

1. **Provide source recipes for the 6 new dishes** that Senior Engineer needs to populate. For each, deliver: a chef-attributed source URL (or "traditional" framing if no chef is right), the ingredient list, the steps, plausible substitutions list, the cuisine and type categories, and Australian English check. Output to `docs/coo/culinary-research/<recipe-slug>.md`. The 6:
   - Chicken schnitzel (consider Adam Liaw or another modern AU chef)
   - Easy chicken & vegetable stir-fry (Bill Granger, RecipeTinEats Nagi, or "traditional Australian weeknight")
   - Beef lasagne (consider Marcella Hazan classic or modern AU)
   - Roast lamb with rosemary & garlic (consider Maggie Beer or "Sunday roast traditional")
   - Fish & chips (likely "Australian Friday traditional")
   - Falafel (Levantine — credit cuisine + region; specific chef optional)

2. **Audit pass** on all priority 17 recipes per the format in your brief. Output to `docs/coo/culinary-audit.md`. Required before launch.

3. **Audit pass** on remaining seed library recipes (musakhan, mujadara, kafta, fattoush, lamb shawarma, char kway teow, ramen, katsu, etc.) — same format. Especially check: no Israeli labels for Levantine; no fabricated chef attributions; Australian English everywhere.

**Sequence:** Item 1 first (Senior Engineer is blocked on it). Items 2-3 can run in parallel after.
**Files touched:** `docs/coo/culinary-research/`, `docs/coo/culinary-audit.md`, `mobile/src/data/seed-recipes.ts` (read-only), `docs/prototypes/hone.html` (read-only)
**Blocks:** Senior Engineer's recipe-add task (#1 above), Photography Director's showcase shoot for chicken schnitzel

### HANDOFF → QA Test Lead · 2026-04-29 · OPEN
**From:** COO
**Subject:** Stand up the smoke-test checklist v1
**Why:** Currently `docs/SMOKE-TEST.md` exists but isn't owned. We need it to be the gate before every build.
**What's done:** Brief written in `docs/coo/specialists/qa-test-lead.md`.
**What's needed:** Take ownership of `docs/SMOKE-TEST.md`, expand to cover: cold start time, scroll jank, dropped network mid-cook, TalkBack labels, 200% text scale, low storage, malformed user input.
**Files touched:** `docs/SMOKE-TEST.md`