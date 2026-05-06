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

**REGN-001 root cause (diagnosed 6 May 2026):**
- Previous fix addressed pantry carousel snap (REGN-001 original). The persistent card misalignment on the Kitchen screen is a separate but related issue.
- Root cause: FlatList windowing. RecipeCard heights vary (1–2 line title/tagline = ~315–358px). On Android, items outside the render window unmount; re-entry uses estimated positions → visible shift on scroll back.
- Fix: disabled windowing via `initialNumToRender={20}`, `maxToRenderPerBatch={20}`, `windowSize={99}`, `removeClippedSubviews={false}`. 17 active items (~340px each) = trivial memory cost.

---

## Closed / Validated tickets

| ID | Title | Status | Closed |
|---|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-001 (carousel) | Pantry recipe card carousel partial-snap | VALIDATED ✅ | 5 May 2026 — Patrick confirmed on-device |
| REGN-002 | OneDrive null-byte corruption | VALIDATED ✅ | 28 Apr 2026 — process fix; write via GitHub API only |
| REGN-003 | pantry.tsx file-write truncation | VALIDATED ✅ | 3 May 2026 — full-file rebuild + Python assert validation before push |

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
- Why it breaks: Android IME fires `onLayout` during keyboard animation → spurious `onBlur` → s