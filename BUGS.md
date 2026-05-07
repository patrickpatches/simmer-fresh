# BUGS.md — Session Bug Cache

> This file is the session-level cache of all known bugs, synced from GitHub Issues at the start of each session.
> Source of truth: GitHub Issues at https://github.com/patrickpatches/hone/issues
> Status flow: OPEN → FIX ATTEMPTED → VALIDATED ✅ (by Patrick) or REJECTED 🔴 (reopened)
> Rule: never self-close. Status only moves to VALIDATED when Patrick confirms on-device.

---

## Active tickets

| ID | Title | Status | Notes |
|---|---|---|---|
| REGN-001 | Recipe cards misalign after first scroll | FIX ATTEMPTED | Commit `1fca0aaa3d3d` — awaiting Patrick on-device validation |
| REGN-005 | seed-recipes.ts truncation — build #86 failure | FIX ATTEMPTED | Commit `e4a9d5d6462d` — awaiting Patrick on-device validation |
| REGN-006 | tokens.ts truncation — build #87 failure | FIX ATTEMPTED | Commit `23bd653ce877` — awaiting Patrick on-device validation (build #88 triggered) |

**REGN-001 root cause (diagnosed 6 May 2026):**
- Previous fix addressed pantry carousel snap (REGN-001 original). The persistent card misalignment on the Kitchen screen is a separate but related issue.
- Root cause: FlatList windowing. RecipeCard heights vary (1–2 line title/tagline = ~315–358px). On Android, items outside the render window unmount; re-entry uses estimated positions → visible shift on scroll back.
- Fix: disabled windowing via `initialNumToRender={20}`, `maxToRenderPerBatch={20}`, `windowSize={99}`, `removeClippedSubviews={false}`. 17 active items (~340px each) = trivial memory cost.

**REGN-005 root cause (diagnosed 7 May 2026):**
- Culinary verifier applied step-flow fixes to a stale base of seed-recipes.ts (pre-Phase 2 batch). Write truncated mid-sentence at FLOUR_TORTILLAS s6, wiping Phase 2 batch (6 recipes) + export array.
- Fix: restored from git commit `9f64870` (4,673 lines, brace-balance=0), applied all 10 HIGH culinary fixes on top, re-verified balance, pushed as `e4a9d5d6462d`.
- Lesson: before writing any large TypeScript file, verify you are on the most recent GitHub HEAD, not a cached copy.

**REGN-006 root cause (diagnosed 7 May 2026):**
- `mobile/src/theme/tokens.ts` truncated at line 150 — `displayItalic` string cut off mid-value (`'PlayfairDisplay_500Med`). `fonts` export object never closed; `TokenName` type missing.
- Metro bundler: `SyntaxError: Unterminated string constant. (150:17)` → build #87 failed at `Task :app:createBundleReleaseJsAndAssets`.
- Fix: reconstructed complete 156-line file, pushed as commit `23bd653ce877`, build #88 triggered.
- Class: same file-write truncation pattern as REGN-002/003/005. All large .ts file writes must pass brace-balance + line-count assertion before push.


---

## Session log — 7 May 2026

### Builds dispatched this session
| Build | Commit | Summary |
|---|---|---|
| #87 | `e4a9d5d6462d` | seed-recipes.ts restored + 10 HIGH culinary fixes — FAILED (tokens.ts truncation, unrelated) |
| #88 | `23bd653ce877` | tokens.ts complete 156-line restore — fixes Metro SyntaxError at line 150 |

### Changes this session
- **seed-recipes.ts** — restored from git `9f64870`, applied 10 HIGH priority culinary fixes (sourdough rest step, ramen chashu prep note, chicken-adobo rice, rendang kerisik step, laksa tofu step, barramundi 20→50 min, pavlova 150→210 min, saag-paneer chef corrected, butter-chicken 90→330 min, roast-chicken 90→1530 min)
- **tokens.ts** — restored complete `fonts` export (was truncated at line 150; missing `sans`, `sansBold`, `sansXBold`, closing brace, `TokenName` type)

---

## Closed / Validated tickets

| ID | Title | Status | Closed |
|---|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-001 (carousel) | Pantry recipe card carousel partial-snap | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-002 | OneDrive null-byte corruption | VALIDATED ✅ | 28 Apr 2026 — process fix; write via GitHub API only |
| REGN-003 | pantry.tsx file-write truncation | VALIDATED ✅ | 3 May 2026 — full-file rebuild + Python assert validation before push |

---

## Session log — 7 May 2026

### Commits pushed this session
| Commit | Summary |
|---|---|
| `e4a9d5d6462d` | fix(seed-recipes): restore complete file from git history + apply 10 HIGH culinary fixes |
| `f6c96cdad053` | docs: session report 07 May 2026 |

### Root cause of build #86 failure
Culinary verifier applied step-flow audit to an older base of `seed-recipes.ts`. Her commit truncated the file at FLOUR_TORTILLAS step s6 mid-sentence and wiped the Phase 2 batch (CHICKEN_SCHNITZEL, CHICKEN_VEG_STIR_FRY, BEEF_LASAGNE, ROAST_LAMB, FISH_AND_CHIPS, FALAFEL) plus the export array. Metro bundler failed during Gradle — APK never produced.

### Fix
- Pulled complete `seed-recipes.ts` from git commit `9f64870` (4,673 lines, balance=0)
- Applied all 10 HIGH priority step-flow fixes from culinary verifier audit
- Verified balance=0, 17 spot-checks passing
- Pushed commit `e4a9d5d6462d`, triggered build #87

### HIGH culinary fixes applied (build #87)
1. sourdough-loaf: s6 "Rest — do not cut yet" added (1 hour timer)
2. ramen: chashu pork i7 gets explicit prep note (make ahead / char siu sub)
3. chicken-adobo: rice ingredient i8 added + concurrent cook notes in s2/s4
4. beef-rendang: kerisik step s4b added (toast + pound during 2h braise)
5. curry-laksa: tofu pan-fry step s3b added (before broth, not raw into broth)
6. barramundi: time_min 20→50 + asparagus blanch note in s3
7. pavlova: time_min 150→210 + room-temp egg white note in s1
8. saag-paneer: bad video_url removed (channel homepage = Golden Rule 1 violation); chef → Hone Kitchen
9. butter-chicken: time_min 90→330 (4h marinade now surfaced to user)
10. roast-chicken: time_min 90→1530 (overnight dry brine now surfaced to user)

---

## Session log — 6 May 2026 (Report 5)

### Build dispatched
| Build | Commit | Summary |
|---|---|---|
| #84 | `a8da5341` | ChipAdd redesign: Pressable+View split, rust outline→fill pill states, drop hint text |

### Changes this session
- **pantry.tsx** — ChipAdd fully redesigned: Pressable+View split fixes Android layout drop bug; 2px rust outline for "need" state; rust fill + white text for "added" state; removed "Tap to add to shopping list" hint text
- **RecipeMatchCard** — outer Pressable converted to static style + `android_ripple` (same Android layout bug fix)
- Root cause documented: Android silently drops layout/visual properties (borderRadius, backgroundColor, borderColor) from function-style Pressable `style` props

---

## Session log — 6 May 2026 (Report 4)

### Build dispatched
| Build | Commit | Summary |
|---|---|---|
| #83 | `078e616e` (SHA at time) | MiseItem Pressable+View split: borderWidth 1.5→2, fix layout stacking on Android |

### Changes this session
- **recipe/[id].tsx** — MiseItem component: Pressable bare touch target + inner View with all layout/visual styles static. Non-integer `borderWidth: 1.5` → `borderWidth: 2` (Android non-integer border rendering fix)
- **RecipeCard.tsx** — Difficulty pill text `color: tokens.ink` → `color: '#FFFFFF'` (dark text on dark scrim was unreadable)
- **seed-recipes.ts** — Added `whole_food_verified: true` to SMASH_BURGER (Zod refine was blocking `refreshSeedRecipeFields` silently)
- **types.ts** — Removed `whole_food_verified` `.refine()` enforcement per Patrick's explicit request; field data preserved, just not required

### Root cause documented: Zod `.refine()` + `refreshSeedRecipeFields`
- `refreshSeedRecipeFields` calls `RecipeSchema.safeParse(raw)` before updating DECISION-009 columns
- SMASH_BURGER missing `whole_food_verified: true` → Zod refine returned `success: false` → recipe silently skipped → equipment/mise_en_place stayed NULL in SQLite
- Fix: both adding the field to the seed data AND removing the hard enforcement

---

## Session log — 6 May 2026 (Report 3)

### Commits pushed this session
| Commit | Summary |
|---|---|
| `38cbab3b` | Recipe screen: Watch/Plan button colours, equipment pills, mise header, expand chip |
| `1fca0aaa` | FlatList windowing disabled — fixes REGN-001 card misalignment (awaiting validation) |

---

## Session log — 6 May 2026 (Report 2)

### Builds dispatched this session
| Build | Commit | Summary |
|---|---|---|
| (queued) | `de86d257` + `e253b0e7` | DECISION-009 data for 12 chef recipes + retire 28 incomplete recipes to holding |

### UI fixes pushed (commit `3a9da3ca3cf8`, earlier today)
- Equipment section: horizontal ScrollView → flex-wrap View (long items now wrap)
- Mise en place: paddingHorizontal 16 → 20 (Android border-radius clipping fix)

---

## Session log — 5 May 2026

### Builds dispatched this session
| Build | Commit | Summary |
|---|---|---|
| #68 | `a5acbb2a50c3` | DECISION-011 — Sage palette (tokens.ts, _layout.tsx, pantry.tsx, shop.tsx) |

---

## Session log — 4 May 2026

### Builds dispatched this session
| Build | Commit | Summary |
|---|---|---|
| #59 | `8c0db90873d7` | searchMode + autoFocus architecture — fixes REGN-004 multi-tap bug |
| #60 | *(part of session)* | Pantry v4: inline dropdown, full-width bar, Cancel removed, browse always visible |
| #61 | *(part of session)* | Pantry v4 polish: dynamic cardWidth, carousel momentum, pill collapse, banner pin, haptic snap |
| #62 | `0b7ebe609142` | 7 UX polish fixes: See All nav, counter FadeIn, pill LinearTransition, animated search border, scroll-to-top, timer cleanup, accessibility labels |

### Failures encountered and lessons learned

**Failure 1 — Multi-tap / search auto-close (root cause of REGN-004)**
- Pattern: `isFocused` state driven by `onFocus`/`onBlur` on TextInput
- Why it breaks: Android IME fires `onLayout` during keyboard animation → spurious `onBlur` → state cycling
- Lesson: Never use `onFocus`/`onBlur` as the trigger for UI mode switches on Android. IME event timing is unpredictable and variable across devices.
- Fix: `searchMode` boolean (Pressable toggle) + `autoFocus` TextInput (native `requestFocus()` before JS event loop). See REGN-005 in regression-checklist.md.

**Failure 2 — 150ms blur debounce was a patch, not a fix**
- Pattern: Adding a debounce to fight spurious IME blurs
- Why it breaks: Android IME timing can exceed any fixed debounce on lower-spec devices
- Lesson: Debounces are bandages on the wrong wound. Fix the architecture, not the timing.

**Failure 3 — "Semi full screen" content-hiding UX problem**
- Pattern: `isSearchActive = searchMode` hid match banner + carousel when search was active
- Why it breaks: Users couldn't see their matches while searching — the most useful moment to see them
- Lesson: Search should overlay, not replace. Browse content should stay visible; dropdown overlays it.

**Failure 4 — Carousel robotic snap**
- Pattern: `disableIntervalMomentum` + `decelerationRate="fast"` on carousel ScrollView
- Why it breaks: `disableIntervalMomentum` hard-stops at nearest snap point ignoring velocity — feels like hitting a wall
- Lesson: Natural snap = `snapToInterval` + `decelerationRate={0.92}`. The snap grid handles alignment; momentum handles feel.

**Failure 5 — Static CARD_WIDTH on different screen sizes**
- Pattern: `const CARD_WIDTH = 260` hardcoded constant
- Why it breaks: On large-screen Android devices (tablets, foldables, large phones), peek width becomes enormous and snap math breaks
- Lesson: All layout dimensions that depend on viewport must derive from `useWindowDimensions()`.
