# Hone Session Report — 7 May 2026

## What was built

### 1. Dark palette — `tokens.ts` (DECISION-012)

Surfaces moved from sage-green light to very dark grey near-black:

| Token | Before | After |
|---|---|---|
| `bg` | `#E8F0E6` (sage green) | `#141414` (very dark grey) |
| `bgDeep` | `#DEEADB` | `#0F0F0F` |
| `cream` | `#FAFAF7` | `#1E1E1E` (elevated card) |
| `ink` | `#111410` (near-black) | `#F5EFE8` (warm cream) |
| `inkSoft` | `#3D3830` | `#C4B8A8` |
| `line` | `#D8E4D6` | `rgba(255,255,255,0.07)` |
| `lineDark` | `#C0D4BE` | `rgba(255,255,255,0.13)` |

Cook mode (`cookMode.*`) unchanged — still OLED `#000000`, visually distinct from `#141414` app bg.

Single token file change propagates to all screens automatically.

### 2. Pressable+View split — all screens and components

**Root cause:** React Native Android silently drops layout/visual properties (borderRadius, backgroundColor, borderColor, overflow, borderWidth, flexDirection) when they come from a function-style `style={({ pressed }) => ...}` prop on `<Pressable>`.

**Fix pattern:** Bare `<Pressable>` (touch only: `android_ripple`, `onPress`, `hitSlop`, minimal static style) wrapping a static `<View>` (all visual styles).

**Files fixed:**
- `RecipeCard.tsx` — outer card wrapper
- `ServingsSelector.tsx` — +/− stepper buttons; `borderWidth: 1.5 → 2`
- `SubstitutionSheet.tsx` — CTA confirm button, SubRow rows
- `SwapSheet.tsx` — SwapOption rows
- `SearchOverlay.tsx` — 7 instances (trending chips, result rows, filter chips)
- `recipe/[id].tsx` — 5 instances (back button, plan toggle, favourite, Add to Plan CTA)
- `shop.tsx` — 4 instances (share, clear, ShoppingItemRow, remove button)
- `pantry.tsx` — 10 instances (pill buttons, search rows, CTAs, unlock nudge)

Also fixed `borderWidth: 1.5 → 2` in all files (non-integer values render unreliably on Android).

### 3. Post-fix audit — View tag truncation repairs

Two files were truncated during the previous session's Python editing:

- **`RecipeCard.tsx`** — MetaChip function was missing `</View>`, `);`, `}` (3 lines)
- **`SubstitutionSheet.tsx`** — SubRow function cut off mid-`hardToFindNote` block (8 lines missing)
- **`shop.tsx` DropdownRow** — outer row `<View>` was missing its closing `</View>` before `</Pressable>`

All three repaired and verified with per-function View balance checks.

### 4. Colour fix: SubstitutionSheet confirm button

`color: tokens.bgDeep` on the confirm button text → `color: tokens.onPrimary`. 
`tokens.bgDeep` is now `#0F0F0F` (near-black) — text would have been invisible on the rust button background.

## Files pushed to GitHub

| File | Commit SHA |
|---|---|
| `mobile/src/theme/tokens.ts` | fb2c092 |
| `mobile/src/components/RecipeCard.tsx` | f32abcf |
| `mobile/src/components/ServingsSelector.tsx` | 4afe473 |
| `mobile/src/components/SubstitutionSheet.tsx` | 783d63c |
| `mobile/src/components/SwapSheet.tsx` | 0a4f46f |
| `mobile/src/components/SearchOverlay.tsx` | 95b47af |
| `mobile/app/recipe/[id].tsx` | cdcd18c |
| `mobile/app/(tabs)/shop.tsx` | d7e93dd |
| `mobile/app/(tabs)/pantry.tsx` | f131467 |

## What Patrick needs to do

1. **Trigger EAS build** from GitHub Actions (workflow dispatch `eas-build.yml`)
2. **Install the APK** and validate on device
3. **Smoke test:**
   - Kitchen tab: cards visible with correct shapes/borders/shadows
   - Recipe detail: back button, favourite, plan toggle all have correct backgrounds
   - Ingredient swap sheet: opens, rows selectable, confirm button text readable
   - Pantry: search dropdown rows have correct backgrounds; "Add to pantry" CTA visible
   - Shop: shopping item rows, section headers render correctly
   - ServingsSelector: +/− buttons have visible circle borders
   - **Dark theme throughout** — all surfaces should be near-black, text warm cream
4. Close the GitHub Issues for the Pressable button bugs once validated on device

## Known remaining items

- `IngredientSearchOverlay.tsx` still exists on disk but is not imported anywhere (dead code). Can be deleted in a future cleanup session.
- `pantry.tsx:623` has an intentional opacity-only function-style Pressable prop (safe — opacity is not affected by the Android bug).
