# Decision Log

> Business decisions for Hone. Distinct from `docs/adr/` which records technical architecture decisions. Newest at top.

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
**Decider:** COO recommends, Patrick approves
**Context:** Rule 3 says users can add and edit their own recipes. Implementation requires recipe form, ingredient parser, image upload, validation, possibly cloud sync, possibly moderation. 3–4 sessions of engineering work plus test surface.
**Options considered:**
1. Ship Rule 3 in v1 as currently scoped
2. Ship a stripped-down version (text-only recipes, no images) in v1
3. Defer entirely to v1.1 (recommended)
**Decision (recommended):** Option 3 — defer to v1.1, target ~September 2026.
**Rationale:** The kill feature is the seeded chef-inspired library with stage photos. Ship that perfectly. User-added recipes is a feature surface where rough edges (parser bugs, missing fields) hurt the perceived quality of the entire app. After launch we'll have real users telling us what they actually want to add, and we can build it once with the right shape rather than guessing.
**Consequences:** v1 launches with seed-only library. Onboarding messaging adjusts. Marketing copy doesn't promise user-added recipes at launch. v1.1 backlog gains the user-added flow as its lead feature, which gives v1.1 a marketable hook.
**Revisit when:** Patrick says no, or beta testers report user-added recipes as a top-3 missing feature.

---

## DECISION-001 · 2026-04-29 · Recommend launch date push from June to 24 July 2026
**Status:** ✅ APPROVED by Patrick 29 April 2026 — "24 July works for me unless we need more time."
**Decider:** COO recommends, Patrick approves
**Context:** Original target was June 2026 (per `docs/patrick-action-list.md` last updated 19 April 2026). Now that engineering velocity is clear, and the bottlenecks are revealed as photography time, Google Play gates, and beta-driven polish — June is achievable only by sacrificing quality.
**Options considered:**
1. Hold June date, cut scope aggressively
2. Push to late July with a polish cycle (recommended)
3. Push to August or September for two polish cycles
**Decision (recommended):** Option 2 — 24 July 2026 public launch.
**Rationale:** Photography requires 4–5 weekends with re-shoots. Closed Testing requires 14 consecutive days minimum. Polish cycle after beta is where products become world-class. June compresses all three; 24 July gives breathing room without inviting scope creep.
**Consequences:** All downstream milestones shift. Internal Alpha 22 May, Closed Testing 5 June, graduation 19 June, Production submission 10 July, public launch 24 July. Roadmap and patrick-action-list need updating.
**Revisit when:** Patrick says no or wants to change the target. Also revisit if a Closed Testing milestone slips by more than a week.
