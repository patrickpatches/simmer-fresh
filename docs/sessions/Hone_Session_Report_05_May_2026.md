# Hone Session Report — 05 May 2026

## Summary

Design prototype session focused on the v2 app-flow prototype. Two phases: (1) rebuilding the prototype to faithfully mirror live source code layout; (2) applying five design improvements to the corrected prototype, including a new Recipe Detail phone.

---

## What was built

### `docs/prototypes/app-flow-v2.html` — fully revised, committed `000e960`

The prototype was rebuilt twice this session.

**Phase 1 — Source-faithful rebuild**

Patrick flagged that the original prototype had invented layout. Every screen was re-read from the live source files (`index.tsx`, `pantry.tsx`, `shop.tsx`, `_layout.tsx`, `RecipeCard.tsx`) and the HTML was rebuilt to precisely mirror each screen's component hierarchy, content strings, icon placements, and tab bar structure.

**Phase 2 — Design improvements applied (Patrick approved all five)**

Five improvements were identified and applied as a concept:

1. **Eyebrow colour split** — Kitchen eyebrow uses rust (`#B84030`); Pantry and Shop eyebrows use forest (`#2E5E3E`). Prevents two rust elements competing on the same screen when the italic headline word is already rust.

2. **Card surface softened** — `#FAFAF7` instead of `#FFFFFF`. Warmer against the sage background, matches the `tokens.cream` value in the dark palette.

3. **Tab bar inactive opacity raised** — `rgba(17,20,16,0.52)` instead of `0.38`. Inactive tabs were disappearing into the dock; 52% gives them legibility without competing with the active rust pill.

4. **Match banner colour distributed** — Left strip stays rust (signal function). Title text is now ink with only the count number in rust. "See all" chip moves to forest. Previously all three elements were rust — distributing them stops the banner reading as an alarm.

5. **Recipe Detail phone added (5th screen)** — Full-bleed hero image with transparent status bar and back arrow; servings selector; "Before you start" framing block (rust `#DE5F4B` band header, cream body); mise en place zone (amber `#FEF4E2` background); three cook steps with rust-numbered circles and forest "why" callout panels; "Finishing & tasting" brown-band framing block; "Start cooking" rust pill with "Screen stays on · Dark mode activates" hint.

---

## Colour token map (Sage palette)

| Role | Token | Value |
|---|---|---|
| Background | `--bg` | `#E8F0E6` |
| Deep background | `--bg-deep` | `#DEEADB` |
| Card surface | `--surface` | `#FAFAF7` |
| Ink | `--ink` | `#111410` |
| Ink soft | `--ink-soft` | `#3D3830` |
| Muted | `--muted` | `#7A766E` |
| Rust (primary) | `--rust` | `#B84030` |
| Forest (secondary) | `--forest` | `#2E5E3E` |
| Amber (mise zone) | `--amber` | `#FEF4E2` |
| Line | `--line` | `#D8E4D6` |

---

## Files changed this session

| File | Change |
|---|---|
| `docs/prototypes/app-flow-v2.html` | Full rebuild × 2; 5 design improvements; Recipe Detail phone added |

---

## What Patrick needs to do

- **Open `docs/prototypes/app-flow-v2.html`** in a browser to review the 5-screen sage prototype including the new Recipe Detail phone.
- **Validate build #90** on-device (OPEN — previous session).
- **Review open bug tickets** in BUGS.md — two OPEN URGENT on-device bugs (stale match counter, carousel snap regression) and Pantry v3 are the priority queue.

---

## Open backlog (carried forward)

| Priority | Item |
|---|---|
| URGENT | Pantry v3 implementation |
| URGENT | BUG: stale match counter (on-device) |
| URGENT | BUG: carousel snap regression (on-device) |
| URGENT | 6 new recipe files — culinary verification |
| URGENT | Shot list — stage-by-stage photography |
| OPEN | Recipe detail UI second pass |
| OPEN | Schema expansion — 8 fields to `types.ts` |
| OPEN | Patrick: on-device validation build #90 |
