# Hone Session Report — 6 May 2026 (Report 4)

## What happened this session

Build #80 came back with three persistent failures that were previously reported as fixed. This session diagnosed the actual root causes and applied proper fixes — no workarounds.

---

## Root causes identified

### Watch & Plan buttons invisible (build #80)

**Why the previous fix failed:** Changing the button colours from gold rgba to rust rgba made no visible difference because `tokens.primaryLight = 'rgba(184,64,48,0.09)'` — 9% opacity — is nearly indistinguishable from the cream card background `#FAFAF7`. The `borderWidth: 2` should have been the fallback, but Android's `Pressable` component with a **function-style `style` prop** (i.e. `style={({ pressed }) => ({ ... })}`) does not reliably apply layout properties like `borderWidth`, `backgroundColor`, or `borderRadius` on Android.

This is a documented React Native Android limitation. The `Start Cooking` pill was already using the correct pattern — `Pressable` as a bare touch target with `android_ripple`, all visual styling on an inner `View` with a static style object. The Watch and Plan buttons never got the same treatment.

**Fix applied (build #81):** Pressable+View split on both buttons:
- `Pressable`: touch target only — `android_ripple`, `borderRadius` wrapper, no visual styling
- Inner `View`: `borderWidth: 2`, `borderColor: tokens.primaryInk`, `backgroundColor`, layout props

**Unplanned state:** transparent background, 2px rust border, rust text/icon — clearly visible against cream  
**Planned state:** `tokens.primary` (rust) fill, white text/icon — clearly visible contrast

### Card misalignment on first scroll (REGN-001, build #80)

**Why the first fix failed:** Setting `windowSize={99}` and `removeClippedSubviews={false}` prevents Android from unmounting off-screen items, which was the original hypothesis. But the actual cause is different: `FlatList` estimates `ListHeaderComponent` height at mount time. The header contains dynamic elements — the cuisine chip row only renders when `availableCuisines.length > 0`, and the "Cooking tonight" banner only renders when `allPlannedRecipes.length > 0`. When these appear or disappear after initial render, the header's actual height diverges from FlatList's estimate. FlatList corrects card positions on the first scroll — that's the jump Patrick sees.

**Fix applied (build #81):** Replaced `FlatList` entirely with `ScrollView` + `.map()`. There is no estimated-position step. Every card renders immediately at its true position. 17 active recipes at ~340px each ≈ 5.8 KB of DOM — zero memory concern at this scale.

### Leftovers section duplication

**Fix applied:** Removed the standalone `leftover_mode.note` banner ("Designed for leftovers" callout). The `LEFTOVERS & STORAGE` section using `leftovers_note` already covers this content with more detail. One section, not two.

---

## Commits pushed

| Commit | File | Summary |
|---|---|---|
| `fcdcd10d` | `mobile/app/recipe/[id].tsx` | Pressable+View split on Watch/Plan buttons + remove duplicate leftover banner |
| `d01b6fbe` | `mobile/app/(tabs)/index.tsx` | FlatList → ScrollView + .map() |

## Build dispatched

**Build #81** — both commits above on `main`

---

## What Patrick needs to do

1. **Install build #81 APK** when GitHub Actions completes (~25 min)
2. **Test the Kitchen screen:** scroll down past the fold on the recipe list — cards should sit perfectly with no jump
3. **Test any recipe:** tap "Watch the original" — should appear as a clear outlined pill with play icon and rust border. Tap "Plan this recipe" — should appear as a full-width button, outlined when unplanned, filled rust when planned
4. **Check leftovers:** open a recipe with `leftover_mode` (e.g. Roast Chicken, Bolognese) — should see ONE leftovers section, not two
5. **If all clear:** close REGN-001 on GitHub Issues

---

## Still open

- REGN-001 remains **FIX ATTEMPTED** until Patrick validates on-device. Status rule: Claude never self-closes.
