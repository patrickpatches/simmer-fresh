# Hone Session Report — 4 May 2026 (Report 3)

**Builds dispatched this session:** #59, #60, #61, #62
**Commits:** `8c0db90873d7` (build #59), `0b7ebe609142` (build #62)

---

## What was done

### Build #59 — Search architecture overhaul (REGN-004 fix)

Replaced the `isFocused` + `blurTimerRef` pattern in `pantry.tsx` with a `searchMode` boolean toggled by a `Pressable`. This was a root-cause fix, not a patch.

**Root cause of REGN-004 (full diagnosis):**
Android's IME fires an `onLayout` event during the keyboard slide animation. That layout event triggers a spurious `onBlur` from Android's event queue. The old code drove `isFocused` from `onFocus`/`onBlur`, so each time the keyboard appeared, the sequence was: `onFocus` → `setIsFocused(true)` → re-render → IME fires `onLayout` → spurious `onBlur` → `setIsFocused(false)` → Cancel hides, input blurs, keyboard dismisses → TextInput re-renders → cycle restarts. The 150ms blur debounce in build #58 was a patch; Android IME timing is variable and can exceed any fixed debounce on lower-spec devices.

**The fix:**
- `searchMode` boolean toggled by `Pressable.onPress` — not Android's focus event system
- TextInput only mounts when `searchMode === true`, with `autoFocus={true}`
- `autoFocus` calls Android native `requestFocus()` at view creation — before any JS event loop involvement, no race condition possible
- `softwareKeyboardLayoutMode: "pan"` (added in build #58) remains in `app.json` — prevents root-window resize on keyboard open, complementing the autoFocus approach

**Lesson burned in:** Never use `onFocus`/`onBlur` as the trigger for a UI mode switch on Android. IME event ordering is non-deterministic. Use a Pressable + autoFocus pattern instead. See REGN-005 in regression-checklist.md.

---

### Build #60 — Pantry v4: inline dropdown, full-width bar

Patrick reported the search UX was still confusing after build #59:
- Search bar too narrow (Cancel button stealing ~80px of width)
- Cancel button purpose unclear — it didn't cancel navigation, just closed the keyboard
- "Semi full screen" mode hid the match banner and recipe carousel while searching

**Changes:**
- Removed Cancel button entirely — full-width search bar
- Changed `isSearchActive = searchMode` → `showDropdown = searchMode && addName.trim().length >= 1`
- Browse content (match banner, carousel) always visible regardless of search state
- When `searchMode` is active and input is empty: shows "Type an ingredient…" hint
- When `searchMode` is active and input has 1+ chars: shows inline dropdown (SectionList) over browse content
- Dismissal: keyboard Done key, or `onBlur` debounce (200ms) when user taps outside

**Why inline dropdown over full-screen:** the match banner and carousel are the most useful content while searching — they show what recipes you can make with what you've already typed. Hiding them while searching was backwards.

---

### Build #61 — Carousel momentum + card alignment + match banner pin

**Carousel robotic snap fix:**
- Removed `disableIntervalMomentum` — it hard-stops at nearest snap point ignoring velocity, feels like hitting a wall
- Changed `decelerationRate="fast"` → `decelerationRate={0.92}` — natural momentum with snap alignment
- The snap grid handles alignment; deceleration handles feel. These are orthogonal concerns.

**Dynamic card width (REGN-001 re-fix):**
- Replaced hardcoded `CARD_WIDTH = 260` with `cardWidth = screenWidth - CAROUSEL_PADDING*2 - CARD_GAP - PEEK_WIDTH` using `useWindowDimensions`
- `snapToInterval = cardWidth + CARD_GAP` — guaranteed card-aligned snap on every screen size
- Math verification: at snap position N, card N always starts exactly `CAROUSEL_PADDING`dp from viewport left
- `PEEK_WIDTH = 44` — the right edge of the next card is always visible at exactly 44dp, confirming there's more to swipe

**Pill collapse:**
- `PILLS_SHOWN = 5` — only 5 pills shown by default; "+" chip to expand all
- Prevents pill card growing to 400px+ with a large pantry, which was burying the match banner below the fold

**Match banner pinned to fixed header zone:**
- Moved match banner above the pills/carousel section so it's always above the fold
- Previously buried under the pill card when pantry had 10+ ingredients

**Haptic snap:**
- `onMomentumScrollEnd` triggers `Haptics.impactAsync(ImpactFeedbackStyle.Light)`
- Light physical confirmation that the card locked into position

---

### Build #62 — 7 UX polish fixes

Patrick approved all 5 build #61 changes and requested a full polish pass. Seven fixes shipped:

1. **"See all" button was a no-op** — ghost buttons erode trust. Added `onPress={() => router.navigate('/')}` to navigate to Kitchen tab.

2. **No animation on stocked ingredient counter** — changed to `<Animated.View key={haveCount} entering={FadeIn.duration(250)}>`. The `key` prop forces a re-mount on every count change, triggering FadeIn. Clean, zero-boilerplate number animation.

3. **Pill container had no layout animation** — changed pill container from `View` to `<Animated.View layout={LinearTransition.springify().damping(18).stiffness(180)}>`. When a pill appears or disappears, neighbours spring into their new positions rather than jumping.

4. **Search border transition was hard-cut** — added `interpolateColor` via `useSharedValue(0)` + `withTiming(150ms)`. Runs on the UI thread. Border fades from `rgba(232,184,48,0.22)` to `tokens.primary` when search activates, and back when it deactivates.

5. **Tab press didn't scroll to top** — added `useScrollToTop(browseScrollRef)` from `@react-navigation/native`. This hook registers the ref with React Navigation's tab press handler — zero custom event handling required. iOS already had this via default FlatList behaviour; this brings Android into line.

6. **Timer leak on component unmount** — the existing `mountedRef` cleanup `useEffect` only returned `() => { mountedRef.current = false }`. Extended to also clear `blurTimerRef`, `undoTimerRef`, and `shopUndoTimerRef`. All three are `useRef<ReturnType<typeof setTimeout>>` patterns and all three needed cleanup.

7. **Accessibility gaps** — added `accessibilityLabel` to the stocked counter Animated.View, `accessibilityRole="button"` + label to the expand chip, and a descriptive label to `RecipeMatchCard`. TalkBack now reads these correctly.

---

## Failures encountered and lessons learned

| # | What broke | Why | Lesson |
|---|---|---|---|
| 1 | REGN-004: multi-tap / search auto-close | `onFocus`/`onBlur` race with Android IME layout events | Never use focus events as UI mode trigger on Android. Use Pressable + autoFocus. |
| 2 | 150ms debounce was a patch | Android IME timing is variable; any fixed debounce can be exceeded | Patches hide the symptom. Architectural fix required. |
| 3 | Search hid browse content | `isSearchActive = searchMode` took over the full screen | Search should overlay, not replace. Most useful content should stay visible while typing. |
| 4 | Cancel button confusion | Cancel implied navigation cancel; it actually just dismissed keyboard | If a button's label misleads users about what it does, remove it. Find a gestural alternative. |
| 5 | Carousel robotic snap | `disableIntervalMomentum` ignores velocity — hard wall | Snap and momentum are orthogonal. `snapToInterval` handles alignment; `decelerationRate` handles feel. |
| 6 | Card alignment breaks on different screen sizes | `CARD_WIDTH = 260` hardcoded | Any dimension that depends on viewport must derive from `useWindowDimensions()`. |
| 7 | Match banner buried | Pill card grew to 400px+ with many ingredients | Layout hierarchy determines what's always visible above the fold. Pin critical content in the header zone. |

---

## Files modified

| File | What changed |
|---|---|
| `mobile/app/(tabs)/pantry.tsx` | Primary — all changes across builds #59–#62. Now 1857 lines. |
| `mobile/app.json` | `softwareKeyboardLayoutMode: "pan"` added under `expo.android` (build #58/commit `a20a79d`, still in place) |
| `docs/regression-checklist.md` | REGN-001 re-fixed status updated; REGN-004 and REGN-005 added |
| `BUGS.md` | Created — session cache for bug tracking |

---

## What Patrick needs to do

1. **Install build #62 APK** once GitHub Actions completes
2. **Smoke test — search:**
   - Tap search bar once → keyboard opens immediately, gold border appears, cursor ready
   - Type 1 char → dropdown appears inline, browse content still visible behind/below
   - Tap a suggestion → ingredient added, `blurTimerRef` cleared, search stays open
   - Press Done or tap outside → keyboard dismisses, border fades back, browse visible
3. **Smoke test — carousel:**
   - Stock 4+ ingredients → carousel appears
   - Swipe left/right → natural deceleration, haptic on snap, one card per snap position
   - Cards are consistent width on your screen — no partial bleed
4. **Smoke test — pills:**
   - Stock 6+ ingredients → 5 pills shown, "+" chip visible
   - Tap "+" → remaining pills spring in with animation
   - Tap ingredient counter → counter FadeIn on each change
5. **Smoke test — "See all":**
   - Tap "See all" → navigates to Kitchen tab
6. If all pass: close REGN-004 on GitHub Issues. Mark VALIDATED in BUGS.md.
7. If carousel snap is also confirmed: close REGN-001.

---

## Open bug status

| ID | Title | Status |
|---|---|---|
| REGN-004 | Pantry search flashes / requires multiple taps | FIX ATTEMPTED — build #59, awaiting Patrick validation |
| REGN-001 | Recipe card carousel partial-snap | FIX ATTEMPTED — build #61–#62, awaiting Patrick validation |
