# BUGS.md — Session Bug Cache

> This file is the session-level cache of all known bugs, synced from GitHub Issues at the start of each session.
> Source of truth: GitHub Issues at https://github.com/patrickpatches/hone/issues
> Status flow: OPEN → FIX ATTEMPTED → VALIDATED ✅ (by Patrick) or REJECTED 🔴 (reopened)
> Rule: never self-close. Status only moves to VALIDATED when Patrick confirms on-device.

---

## Active tickets

| ID | Title | Status | Notes |
|---|---|---|---|
| REGN-001 | Recipe cards misalign after first scroll | FIX ATTEMPTED | Commits `fcdcd10d` + `d01b6fbe` — build #81 — awaiting Patrick on-device validation |

**REGN-001 root cause (diagnosed 6 May 2026, fix attempt 2):**
- Previous fix (build #80): disabled FlatList windowing via `windowSize={99}`, `removeClippedSubviews={false}`. Insufficient — FlatList still estimates ListHeaderComponent height, and when `availableCuisines` chips render or the "Cooking tonight" banner shows, the header height changes post-mount. FlatList corrects item positions on first scroll → visible jump.
- True fix (build #81): Replaced `FlatList` entirely with `ScrollView` + `.map()`. No estimated positions, no virtualisation step. 17 active recipes at ~340px each = ~5.8 KB; zero memory concern.

**Watch/Plan button root cause (diagnosed 6 May 2026, fix attempt 2):**
- Previous fix (build #80): changed button colours from gold to rust. Buttons still nearly invisible because `tokens.primaryLight = 'rgba(184,64,48,0.09)'` (9% opacity) is indistinguishable from the cream card background. `borderWidth: 2` with `borderColor: tokens.primaryInk` should have been visible but Android `Pressable` with function-style `style` prop (returning an object) does not reliably render `borderWidth` or `backgroundColor`.
- True fix (build #81): Split Pressable+View. `Pressable` is a bare touch target with `android_ripple` only. All visual styling (`borderWidth`, `backgroundColor`, `borderRadius`) lives on an inner `View` with a static style object. This is the same pattern the "Start Cooking" pill already uses successfully.

---

## Closed / Validated tickets

| ID | Title | Status | Closed |
|---|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-001 (carousel) | Pantry recipe card carousel partial-snap | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-002 | OneDrive null-byte corruption | VALIDATED ✅ | 28 Apr 2026 — process fix; write via GitHub API only |
| REGN-003 | pantry.tsx file-write truncation | VALIDATED ✅ | 3 May 2026 — full-file rebuild + Python assert validation before push |

---

## Session log — 6 May 2026 (Report 4)

### Commits pushed this session
| Commit | Summary |
|---|---|
| `fcdcd10d` | Fix Watch/Plan buttons (Pressable+View split) + consolidate leftovers section |
| `d01b6fbe` | Replace FlatList with ScrollView+map — eliminates first-scroll card misalignment (REGN-001) |

### Build dispatched
| Build | Commits | Summary |
|---|---|---|
| #81 | `fcdcd10d` + `d01b6fbe` | Watch/Plan button fix + FlatList→ScrollView alignment fix |

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
