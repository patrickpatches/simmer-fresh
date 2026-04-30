# Hone — Senior Engineer Session Report
**Date:** 30 April 2026
**Role:** Senior Product Engineer
**Priority:** HANDOFF Priority 1 — v0.7 Dark Dramatic token rollout

---

## Summary

Rolled out the v0.7 Dark Dramatic visual direction across all wired components. `mobile/src/theme/tokens.ts` was already at v0.7 (Designer committed it). This session wired the rest of the app — font swap, colour fixes, StatusBar — and pushed a dev APK build to GitHub Actions.

**Patrick's action:** Install the APK from the Actions artifact and confirm the dark direction looks right on-device. Do not proceed to Priority 2 until confirmed.

---

## What was done

### 1. Font package swap — Source Sans 3 → Inter

**Why:** `tokens.ts` v0.7 defines `Inter_400Regular`, `Inter_600SemiBold`, `Inter_800ExtraBold` as the body font constants. The running app was still loading Source Sans 3, so `fonts.sans`, `fonts.sansBold`, and `fonts.sansXBold` would have resolved to the wrong typeface at runtime. Inter is more architectural at UI sizes (12–15sp) and suits the dark dramatic palette.

Changed:
- `mobile/package.json`: removed `@expo-google-fonts/source-sans-3`, added `@expo-google-fonts/inter`
- `mobile/package-lock.json`: regenerated via `npm install --package-lock-only`
- `mobile/app/_layout.tsx`: replaced `SourceSans3_*` imports with `Inter_400Regular`, `Inter_600SemiBold`, `Inter_800ExtraBold` from `@expo-google-fonts/inter`; updated `useFonts()` accordingly; updated file-level comment

### 2. StatusBar — dark → light

**Why:** `StatusBar style="dark"` renders dark icons (for light backgrounds). With the app bg now `#111111`, dark icons are invisible. `style="light"` renders light icons which read against the near-black surface.

Changed: `mobile/app/_layout.tsx` line 69: `style="dark"` → `style="light"`

### 3. RecipeCard — difficulty chip dark scrim

**Why:** The chip's background was `rgba(255,255,255,0.9)` (near-white), designed for the old light theme where it sat over a food photo with dark ink text. In v0.7, `tokens.ink` is `#F5EFE8` (warm off-white) — near-white text on a near-white chip is unreadable. On the dark dramatic direction, photo overlays use dark scrims so food is the hero.

Changed: `mobile/src/components/RecipeCard.tsx` — difficulty chip `backgroundColor` from `rgba(255,255,255,0.9)` to `rgba(0,0,0,0.62)`. Text stays `tokens.ink` (cream on dark scrim = high contrast).

### 4. Tab bar — palette inversion fix

**Why:** The floating pill tab bar used `tokens.ink` as its background. In the old palette `tokens.ink` was near-black (`#181008`) — a dark dock. In v0.7 `tokens.ink` is warm off-white (`#F5EFE8`) — the dock had become a cream pill, which is the wrong direction. Additionally, focused tab icons/labels used `tokens.ink` on a gold (`tokens.primary`) active pill — gold on cream is low contrast. Per `tokens.ts` comment: "Buttons with backgroundColor: primary use color: tokens.bgDeep (dark label)."

Changed: `mobile/app/(tabs)/_layout.tsx`
- Pill background: `tokens.ink` → `tokens.cream` (`#1A1A1A` — dark card surface)
- Focused icon/label colour: `tokens.ink` → `tokens.bgDeep` (`#080808` — near-black on gold pill)
- Unfocused: `rgba(255,255,255,0.55)` unchanged — semi-transparent white reads fine on the dark pill

---

## Smoke-test checklist (for Patrick on-device)

- [ ] App background is near-black `#111111`, not cream
- [ ] Status bar icons (time, battery, signal) are white/light
- [ ] Body text is warm off-white `#F5EFE8` — legible on dark
- [ ] Browse screen uses Inter for recipe card titles and meta text
- [ ] Headings (recipe titles) still in Playfair Display
- [ ] Primary accent (buttons, active states) is gold `#E8B830`, not terracotta
- [ ] Tab bar pill is dark `#1A1A1A` (not cream)
- [ ] Active tab: gold pill, dark `#080808` icon/label — readable
- [ ] Inactive tabs: semi-transparent white icons on dark pill — readable
- [ ] Difficulty chip on recipe cards is a dark scrim, cream text — readable over photos
- [ ] Cook mode background is true black `#000000` — visually darker than app bg `#111111`
- [ ] No cream, pink, or terracotta remnants anywhere

---

## Files changed

| File | Change |
|---|---|
| `mobile/package.json` | source-sans-3 → inter |
| `mobile/package-lock.json` | regenerated |
| `mobile/app/_layout.tsx` | Inter fonts, StatusBar light |
| `mobile/src/components/RecipeCard.tsx` | difficulty chip dark scrim |
| `mobile/app/(tabs)/_layout.tsx` | dark pill, gold-bg label fix |

---

## Handoff status

**Priority 1 handoff:** Marked IN PROGRESS — awaiting Patrick's on-device confirmation.

**Priority 2 handoff:** BLOCKED until Patrick confirms dark tokens on-device. Per handoff instructions: do not advance.

---

## Patrick's next actions

1. **Download the APK** from the GitHub Actions run triggered by this commit (Actions → Hone Android Build → latest run → artifact `hone-v0.4.0-build-NNN.apk`).
2. **Install it** on your Android device (you may need to allow "Install from unknown sources").
3. **Run through the smoke-test checklist above.**
4. **Reply here** — "dark tokens confirmed" or flag any specific issue. Only then will Priority 2 begin.
