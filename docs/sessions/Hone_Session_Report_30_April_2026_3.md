# Hone — Senior Engineer Session Report 3
**Date:** 30 April 2026
**Role:** Senior Product Engineer
**Priority:** HANDOFF Priority 2 (unblocked after Patrick confirmed dark tokens)

---

## Summary

Executed all three Priority 2 tasks from the 29 April multi-task handoff. Tasks 1 and 2 are complete and committed. Task 3 (add 6 new recipes) is blocked on Culinary Verifier — a handoff has been written and the task is paused.

**Patrick's actions:** Install the new APK (GitHub Actions → Hone Android Build → latest run) and verify substitution sheet, photo badges, and bundle ID. For Play Console: see ADR 001 for exact steps when uploading the first AAB under the new package name.

---

## What was done

### Task 1 — Bundle ID rename

**Why:** The Android package identifier still read `com.patricknasr.simmerfresh`. Every AAB is permanently bound to its package name in the Play Console. Renaming before the first production upload costs nothing; renaming after costs everything (new listing, lost reviews). This was the last safe moment.

**Changes:**
- `mobile/app.json` — `ios.bundleIdentifier` and `android.package`: `com.patricknasr.simmerfresh` → `com.patricknasr.hone`
- `mobile/app.json` — `splash.backgroundColor` and `android.adaptiveIcon.backgroundColor`: `#FAF7F2` (old light cream) → `#111111` (dark bg, matches v0.7 tokens)
- `docs/adr/001-bundle-id-rename.md` — full rationale, alternatives considered, Play Console steps for Patrick

**Play Console steps (summary — full detail in ADR):**
1. Build the release AAB via GitHub Actions
2. In Play Console → Create app → name "Hone", English (Australia)
3. Upload AAB to Internal Testing first
4. The old `com.patricknasr.simmerfresh` entry (if it exists) can be archived — do not publish it

---

### Task 2 — Substitution UI + photo badge states

#### SubstitutionSheet component (new)

**Why:** Every ingredient in Hone carries a `substitutions[]` array — it's a Golden Rule feature and a direct competitive advantage. The sheet needed to exist before the app is useful to real cooks. The spec called for `@gorhom/bottom-sheet` `BottomSheetModal` for native spring animation and gesture dismissal (swipe down closes the sheet without needing a close button tap).

**Files:**
- `mobile/src/components/SubstitutionSheet.tsx` — new component
- `mobile/package.json` — added `@gorhom/bottom-sheet: ^5.2.12` (compatible with reanimated ~4.1.1 and gesture-handler ~2.28.0 — both already installed)
- `mobile/package-lock.json` — regenerated
- `mobile/app/_layout.tsx` — wrapped tree with `BottomSheetModalProvider` (required by @gorhom/bottom-sheet for portal rendering)
- `mobile/src/components/Icon.tsx` — added `camera` icon (Lucide-style, used for photo placeholders and "Photos soon" badge)

**Sheet behaviour:**
- Opens when user taps an ingredient row that has substitutions (in non-cook mode)
- Two-step flow: tap row to stage → confirm button appears → tap to confirm. Prevents accidental swaps.
- Quality pills: `perfect_swap` → solid sage, `great_swap` → sageLight, `good_swap/good` → ochre, `compromise` → bgDeep/muted
- "Back to original" row appears if a swap is already active for that ingredient
- Hard-to-find notice shown when `substitution.hard_to_find` is set
- Gold confirm button (`tokens.primary` bg, `tokens.bgDeep` text) per spec
- Cook mode support: `inCookMode` prop switches sheet surfaces to `tokens.cookMode.*`
- Gesture dismissal via `enablePanDownToClose`

#### recipe/[id].tsx wiring

**Changes:**
- Ingredient rows: swap icon (`Icon name="swap"`) shown right-side when `ing.substitutions?.length > 0` and not in cook mode
- Tap ingredient row (non-cook mode, has swaps) → opens SubstitutionSheet for that ingredient
- Tap ingredient row (cook mode) → existing tick behaviour unchanged
- Active swap displayed in gold; original ingredient shown struck-through in muted
- `activeSwaps` state: `Record<string, Substitution | null>` — persists per-session, no SQLite write needed
- Stage notice banner: `tokens.skyLight` background, camera icon in `tokens.skyDeep`, shown once in recipe detail when `!hasStagePhotos && !cooking`
- Step photo placeholder: dashed border box (100dp), camera icon, "Photo coming soon" text — shown when `!step.photo_url`. Step photo renders at 160dp when `step.photo_url` is set.
- `hasStagePhotos` derived as `recipe.steps.every(s => Boolean(s.photo_url))` — no schema change

#### RecipeCard.tsx — "Photos soon" badge

**Why:** Most recipes in the initial library don't have stage photos yet. The badge sets honest expectations at the browse level — users see the pill before tapping in, so it's not a surprise when they open a recipe. Honest about limitations is Golden Rule 5.

**Badge spec:** Bottom-right corner of hero image (opposite corner from difficulty chip). Dark scrim `rgba(26,19,14,0.62)`. Camera icon 11dp + "Photos soon" text in `rgba(255,255,255,0.92)`. Hidden when `hasStagePhotos` is true.

---

### Task 3 — Add 6 new recipes — BLOCKED

**Why blocked:** The original handoff requires Senior Engineer to block on Culinary Verifier providing authoritative source recipes before populating chef attribution. As of this session, `docs/coo/culinary-research/` does not exist — no files have been delivered.

**Action taken:** New URGENT handoff written in `docs/coo/handoffs.md` addressed to Culinary & Cultural Verifier, requesting the 6 source files in priority order (chicken schnitzel first, as Photography Director needs it before the 3–4 May shoot).

---

## Files changed

| File | Change |
|---|---|
| `mobile/app.json` | Bundle ID rename + splash/adaptive bg colours |
| `mobile/package.json` | Added @gorhom/bottom-sheet ^5.2.12 |
| `mobile/package-lock.json` | Regenerated |
| `docs/adr/001-bundle-id-rename.md` | New — full rationale + Play Console steps |
| `mobile/src/components/SubstitutionSheet.tsx` | New — BottomSheetModal substitution sheet |
| `mobile/src/components/Icon.tsx` | Added `camera` icon |
| `mobile/app/_layout.tsx` | BottomSheetModalProvider added |
| `mobile/app/recipe/[id].tsx` | Swap wiring, stage notice, step placeholder |
| `mobile/src/components/RecipeCard.tsx` | "Photos soon" badge |
| `docs/coo/handoffs.md` | Priority 1 marked DONE, Priority 2 updated, Culinary Verifier URGENT added |

**Commit:** `9b15c5556aba7e6a35369d0275b46e8ee2c47204`

---

## Smoke-test checklist for Patrick

- [ ] Ingredient rows with substitutions show a small ⇅ swap icon on the right
- [ ] Tapping a swappable ingredient opens the bottom sheet (slides up from bottom with spring animation)
- [ ] Substitution rows show quality pills (sage = perfect/great swap, ochre = good, dark = tradeoff)
- [ ] Tapping a row stages it — gold left border appears, radio dot fills
- [ ] Confirm button appears at the bottom with the swap name
- [ ] After confirming: ingredient shows in gold with original struck through in muted
- [ ] Tapping the swapped ingredient again opens the sheet with "Back to original" row
- [ ] Swiping the sheet down dismisses it without needing to tap close
- [ ] Recipe detail shows stage notice banner (sky-blue tint, camera icon) for recipes with no stage photos
- [ ] Each recipe step shows a dashed 100dp placeholder box when no `step.photo_url`
- [ ] RecipeCard in browse shows "Photos soon" pill (bottom-right corner) for recipes without stage photos
- [ ] Cook mode: ingredient ticking still works normally; swap sheet does NOT open in cook mode
- [ ] App launch splash background is dark (near-black), not cream

---

## Patrick's next actions

1. **Install APK** from GitHub Actions → Hone Android Build → latest run
2. **Run through smoke-test checklist above** — reply with any issues
3. **For the first Play Store upload:** follow Play Console steps in `docs/adr/001-bundle-id-rename.md` — you need to create a new app entry under the new package name before uploading
4. **Unblock Culinary Verifier:** start a Culinary & Cultural Verifier session to deliver the 6 source recipe files. Chicken schnitzel first — Photography Director needs it before the 3–4 May shoot weekend
5. **Other open handoffs:** QA Test Lead (`docs/SMOKE-TEST.md`), Photography Director shot lists, and the launch date confirm (`docs/coo/handoffs.md → Patrick`) are all still waiting
