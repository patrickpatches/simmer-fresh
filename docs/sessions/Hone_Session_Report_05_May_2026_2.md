# Hone Session Report — 05 May 2026 (Report 2)

**Commits this session:**
- `a5acbb2a50c3` — feat(palette): DECISION-011 — Sage palette

**Build dispatched:** #68 (running)

---

## What was done

### DECISION-011 — Sage palette adopted

Patrick approved the Sage direction ("lets do it!") after reviewing the 5-screen `app-flow-v2.html` prototype built in the first session of today.

**Four files changed:**

| File | What changed |
|---|---|
| `mobile/src/theme/tokens.ts` | Full palette swap — Dark Dramatic → Sage. New `onPrimary` token added. |
| `mobile/app/(tabs)/_layout.tsx` | Tab bar: active label `tokens.bgDeep` → `tokens.onPrimary`; inactive `rgba(255,255,255,0.55)` → `rgba(17,20,16,0.52)` |
| `mobile/app/(tabs)/pantry.tsx` | Eyebrow forest; match banner title ink+number-in-rust; "See all" chip forest |
| `mobile/app/(tabs)/shop.tsx` | Eyebrow forest |

**Decision log:** DECISION-011 written to `docs/coo/decision-log.md`.

---

### Token changes in detail

**Surfaces (inverted back to light):**
- `bg`: `#111111` → `#E8F0E6` (sage green)
- `bgDeep`: `#080808` → `#DEEADB` (deeper sage)
- `cream`: `#1A1A1A` → `#FAFAF7` (warm near-white cards)

**Ink (inverted back to dark):**
- `ink`: `#F5EFE8` → `#111410`
- `inkSoft`: `#C4B8A8` → `#3D3830`

**Primary (gold → rust):**
- `primary`: `#E8B830` → `#B84030`
- `primaryDeep`: `#C49820` → `#8E2E20`
- `primaryLight`: `rgba(232,184,48,0.18)` → `rgba(184,64,48,0.09)`
- **New:** `onPrimary: '#FAFAF7'` — text/icon on solid rust surfaces

**Secondary (muted sage → forest green):**
- `sage`: `#AACCA8` → `#2E5E3E`
- `sageDeep`: `#8AAE88` → `#1E4E2E`
- `sageLight`: `rgba(170,204,168,0.20)` → `rgba(46,94,62,0.11)`

**Tertiary / structural:**
- `ochre`: `#F2D896` → `#A05C28`
- `warmBrown`: `#C4A882` → `#8A6040`
- `line`: `rgba(255,255,255,0.08)` → `#D8E4D6`
- `lineDark`: `rgba(255,255,255,0.14)` → `#C0D4BE`
- Added: `amber: '#FEF4E2'`, `amberLine: 'rgba(160,92,40,0.18)'`

**Cook mode: unchanged** — stays OLED black (`#000000`). Now even more visually distinct as the app bg is light sage.

---

### Design improvement reasoning (all five from the prototype)

1. **Eyebrow colour split** — Kitchen = rust (warm anchor). Pantry/Shop = forest (utility tabs). Prevents competing rust elements when the italic headline word is also the accent colour.

2. **Card surface** — `#FAFAF7` not pure white. Softer against sage, matches cream throughout.

3. **Tab bar inactive opacity** — `rgba(17,20,16,0.52)` dark ink on light dock. Previous `rgba(255,255,255,0.55)` (semi-transparent white) was nearly invisible on the now-light dock surface. 52% dark ink gives legibility without fighting the active rust pill.

4. **Match banner colour distribution** — Three rust elements (strip + title + "See all") read as alarm. Strip stays rust (signal). Title = ink with only the count in rust. "See all" = forest. Each element now has a distinct semantic role.

5. **`onPrimary` token** — the tab bar previously used `tokens.bgDeep` as the active label colour. With Dark Dramatic this worked (`#080808` on gold). In Sage, `tokens.bgDeep` is `#DEEADB` (sage green on rust = illegible). `onPrimary: '#FAFAF7'` is the clean, future-proof solution — any component rendering on a solid primary surface uses this token.

---

## Bug status

No open bug tickets. REGN-001 and REGN-004 both validated by Patrick 5 May 2026.

---

## What Patrick needs to do

1. **Install build #68** when it completes (~10–15 min from session end). Download from GitHub Actions → Hone Android Build → latest run.
2. **Smoke test the Sage palette on-device** — check all four tabs, cook mode (should still be dark), recipe detail, and tab bar active/inactive states.
3. **Report any issues** via GitHub Issues as usual.

---

## Open backlog (next priority queue)

| Priority | Item |
|---|---|
| HIGH | DECISION-009 Batch 2 — apply full 10-section template to 28 existing seed recipes |
| HIGH | PAT rotation — repo went private, PAT was visible during public window (DECISION-010) |
| MEDIUM | DECISION-008 Variant A chips — Pantry missing-ingredient affordance (tap-to-add) |
| MEDIUM | Photography Director — shoot weekend prep |
| LOW | QA Test Lead — smoke-test checklist ownership |
