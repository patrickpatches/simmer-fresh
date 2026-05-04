# BUGS.md — Session Bug Cache

> This file is the session-level cache of all known bugs, synced from GitHub Issues at the start of each session.
> Source of truth: GitHub Issues at https://github.com/patrickpatches/hone/issues
> Status flow: OPEN → FIX ATTEMPTED → VALIDATED ✅ (by Patrick) or REJECTED 🔴 (reopened)
> Rule: never self-close. Status only moves to VALIDATED when Patrick confirms on-device.

---

## Active tickets

| ID | Title | Status | Build | Commit | Notes |
|---|---|---|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | VALIDATED ✅ | #59 | `8c0db90873d7` | Patrick validated 2026-05-05 |

---

## Closed / Validated tickets

| ID | Title | Status | Closed |
|---|---|---|---|
| REGN-001 | Recipe card carousel partial-snap | VALIDATED ✅ | Build #61–#62 — Patrick validated 2026-05-05 |
| REGN-002 | OneDrive null-byte corruption | VALIDATED ✅ | Session 28 Apr 2026 — process fix; write via GitHub API only |
| REGN-003 | pantry.tsx file-write truncation | VALIDATED ✅ | Session 3 May 2026 — full-file rebuild + Python assert validation before push |

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
