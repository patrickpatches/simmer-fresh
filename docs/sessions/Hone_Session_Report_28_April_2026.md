# Hone Cooking App — Session Report
**Date:** 28 April 2026
**Project:** Hone (cooking app)
**Repo:** https://github.com/patrickpatches/simmer-fresh
**App location:** C:\Users\patri\the file system\Documents\Claude\Projects\Cooking App\mobile

---

## Summary

This session covered four areas: fixing the APK crash-on-launch bug, fixing a GitHub Actions build failure, redesigning the shopping list and recipe screen UI, and fixing two Android rendering bugs that made the Start Cooking button invisible and the shopping list items stack vertically.

---

## 1. APK Crash on Launch (Fixed)

**Problem:** The Hone APK crashed immediately when opened on Android — the app wouldn't even get past the splash screen.

**Root causes found:**

- **Missing animation plugin in babel.config.js.** The Pantry screen uses react-native-reanimated for smooth animations (colour transitions, sliding). The reanimated babel plugin was missing from `babel.config.js`. Without it, animation functions aren't transformed at build time and the native module crashes at runtime. Since expo-router imports all tab screens at startup, this crash happens immediately on launch.

- **Stray react-native-worklets dependency.** `react-native-worklets@0.8.1` was listed in `package.json` but never imported anywhere. This package is part of the Reanimated 4 alpha refactor. Having it alongside Reanimated 3.16 means two competing native worklets runtimes get auto-linked, which can cause a crash during native module initialisation.

**Fixes applied:**
- Added `plugins: ['react-native-reanimated/plugin']` to `babel.config.js`
- Removed `react-native-worklets` from `package.json`

**Important:** These are build-time fixes. Any APK built before this fix will still crash. A fresh build from the current main branch is required.

---

## 2. GitHub Actions Build Failure (Fixed)

**Problem:** The GitHub Actions build was failing with `SyntaxError: plan.tsx: Unexpected character ''. (781:0)`.

**Root cause:** the file system file corruption. `plan.tsx` had 1,045 null bytes (invisible junk characters) appended to the end of the file. This is a known file sync issues documented in the project's CLAUDE.md. Additionally, `recipe/[id].tsx` was found truncated mid-code from a previous commit.

**Fixes applied:**
- Stripped the null bytes from `plan.tsx`
- Restored `recipe/[id].tsx` from the last intact commit (`4bca5c6`) and re-applied the intentional edits from the broken commit

---

## 3. UI Redesign — Shopping List & Recipe Screen (Done)

**Shopping list (plan.tsx):**
- Category headers (Produce, Meat & Seafood, etc.) redesigned with a paprika accent bar on the left, Lora display serif font, and a count chip on the right
- Each category is now its own white card section with a soft shadow
- Checkboxes are rounded squares that fill sage green when checked, with strikethrough on the text
- "Add an extra item..." input is now a polished pill shape with a styled plus button
- Better spacing throughout — 16pt row padding, 60dp min row height, 22pt between sections

**Recipe detail (recipe/[id].tsx):**
- Removed the old full-width "I'm cooking this now" bar and the "Screen stays on..." hint text
- Added a floating pill-shaped "Start Cooking" button — positioned at the bottom centre of the screen, rounded, paprika colour, drop shadow, visible while scrolling
- When all cook-mode steps are completed, the pill switches to a sage green "Done — eat well" variant

---

## 4. Android Rendering Bugs — Invisible Button & Stacked Text (Fixed)

**This is the most important fix to understand for future work.**

**Problem 1:** The floating "Start Cooking" pill button was rendering as white text with no visible background — nearly invisible against the cream/linen app background.

**Problem 2:** Shopping list items were stacking the quantity and ingredient name on separate lines (e.g. "30g" on one line, "White onion" below it) instead of displaying them side by side.

**Root cause (same for both):** Android's `Pressable` component has a quirk. When you use the function form of the style prop — `style={({pressed}) => ({...})}` — and put layout-defining properties like `backgroundColor` and `flexDirection` directly on it, Android sometimes doesn't apply them. The background colour was technically set to paprika, but Android was ignoring it entirely, making the button transparent. Same thing with `flexDirection: 'row'` on the shopping list items — Android ignored it and defaulted to vertical stacking.

**The fix pattern (applied to both):**
- `Pressable` is now used as a bare tap target only — it handles `onPress` and `android_ripple` for feedback, but carries NO visual or layout styling
- An inner `View` component carries all the layout and visual properties (backgroundColor, flexDirection, borderRadius, shadow, etc.)
- This inner View always renders correctly on Android because it's a standard View, not a Pressable with conditional styling

**Additional shopping list fix:** The quantity and ingredient name are now a single `Text` component with the quantity as an inline nested `<Text>` styled differently (bold, primary colour). This guarantees they're always on the same line. The quantity font was also changed from Lora (serif) to Inter Bold (sans) to match the ingredient name font and eliminate visual dissonance.

---

## Current State of Main Branch

All fixes are committed and pushed to `main`. The latest commits (newest first):

```
564ccc5 — Fix Android Pressable rendering (invisible pill + stacked shop rows)
828774b — Shopping list redesign + floating Start Cooking pill
d411460 — Refresh text colours + swap fonts to Lora + Inter
a073e03 — Fix Android bundle failure + clear stale TS errors
ff8e260 — Fix APK crash: add reanimated plugin, remove stray worklets dep
```

**Fonts on main:** Lora (display/headlines) + Inter (body text)
**Colour tokens:** Check `tokens.ts` for the full palette — ink, inkSoft, muted, primary, sage, paprika, etc.

---

## What Patrick Needs To Do

1. Go to GitHub Actions on the repo
2. Hit "Run workflow" on the Hone Android Build workflow (it's manual dispatch, not auto-triggered on push)
3. Wait ~15-20 minutes for the build
4. Download the APK artifact from the completed build run
5. Delete the old app from his phone
6. Install the new APK

---

## ATO Development Log Entry

This session's work should be added to the development log spreadsheet at:
`C:\Users\patri\the file system\Documents\Claude\Projects\Cooking App\Simmer_Fresh_Development_Log_FY2025-26.xlsx`

- **Date:** 28 April 2026
- **Description:** Fixed APK crash-on-launch (missing build config + conflicting package), fixed GitHub build failure (the file system file corruption), redesigned shopping list UI and recipe screen, fixed Android rendering bugs (invisible Start Cooking button and stacked shopping list layout)
- **Category:** Development / Bug Fix / Design
- **Hours:** 3

---

## Known Issues Not Addressed This Session

- The app name in the repo/GitHub is still "simmer-fresh" in the URL — Patrick may want to rename the GitHub repo to "hone" at some point
- The app.json bundle identifier and display name should be verified to say "Hone" not "Simmer Fresh"
- file corruption is a recurring problem — files can get null bytes appended. If a build fails with a syntax error pointing to an unexpected character at the end of a file, check for trailing null bytes
