# BUGS.md — Session Bug Cache

> This file is the session-level cache of all known bugs, synced from GitHub Issues at the start of each session.
> Source of truth: GitHub Issues at https://github.com/patrickpatches/hone/issues
> Status flow: OPEN → FIX ATTEMPTED → VALIDATED ✅ (by Patrick) or REJECTED 🔴 (reopened)
> Rule: never self-close. Status only moves to VALIDATED when Patrick confirms on-device.

---

## Active tickets

*No open bug tickets.* REGN-001 and REGN-004 validated by Patrick on 5 May 2026.

---

## Closed / Validated tickets

| ID | Title | Status | Closed |
|---|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-001 | Recipe card carousel partial-snap | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-002 | OneDrive null-byte corruption | VALIDATED ✅ | 28 Apr 2026 — process fix; write via GitHub API only |
| REGN-003 | pantry.tsx file-write truncation | VALIDATED ✅ | 3 May 2026 — full-file rebuild + Python assert validation before push |

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
- Pattern: `disableIntervalMom