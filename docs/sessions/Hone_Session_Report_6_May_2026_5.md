# Hone Session Report — 6 May 2026 (Report 5)

**Session focus:** Android Pressable layout bug — root cause identified and fixed across all affected components (MiseItem, ChipAdd, RecipeMatchCard, Watch/Plan buttons); pantry ingredient chips redesigned.

---

## What was built / fixed

### 1. Android Pressable function-style style bug — root cause diagnosed

The recurring pattern of "fix works in code but doesn't appear in app" was traced to a single root cause: **React Native on Android silently drops layout and visual properties (`flexDirection`, `borderRadius`, `backgroundColor`, `borderColor`, `borderWidth`) when they are returned from a function-style `style` prop on Pressable.**

Pattern that breaks:
```tsx
<Pressable style={({ pressed }) => ({ borderRadius: 999, backgroundColor: '...' })}>
```

Fix pattern applied everywhere:
```tsx
<Pressable onPress={...} android_ripple={{ ... }}>
  <View style={{ borderRadius: 999, backgroundColor: '...', /* all visual styles here */ }}>
    ...
  </View>
</Pressable>
```

**Why this happens:** Pressable's function-style prop is a React Native abstraction for pressed-state feedback. On Android, the bridge applies only opacity/ripple feedback from function-style props and does not forward arbitrary layout/visual styles reliably. Static `View` children are laid out normally by Android's layout engine — they are unaffected.

**Every instance fixed:**
- `MiseItem` checkbox row (recipe/[id].tsx)
- `Watch` and `Plan` buttons (recipe/[id].tsx) — fixed in an earlier build
- `ChipAdd` ingredient pill (pantry.tsx) — fixed this session (build #84)
- `RecipeMatchCard` outer Pressable (pantry.tsx) — fixed this session (build #84)

---

### 2. ChipAdd ingredient chips — full redesign (build #84)

**Problem:** Pantry "STILL NEED" section showed unformatted "+ Chicken breast fillets" plain text. Reported by Patrick from build #83 screenshot.

**Root causes:**
1. Android Pressable function-style style prop — dropped `borderRadius: 999`, `backgroundColor`, `borderColor` → pill shape invisible, looked like raw text
2. "Need" state used `tokens.primaryLight = rgba(184,64,48,0.09)` (9% opacity) as both background and border — effectively invisible against cream `#FAFAF7` card background

**Fix applied:**
- Pressable+View split with static style object on inner View
- "Need" (not yet added): transparent background + `borderWidth: 2, borderColor: tokens.primaryInk` (rust, fully opaque) + rust text
- "Added" (in pantry): `backgroundColor: tokens.primary` fill + white text + `✓` prefix
- Removed "Tap to add to shopping list" hint text — the pill's visual state communicates the action directly

**RecipeMatchCard fix:** Same function-style style prop issue; converted outer Pressable to static style + `android_ripple`.

---

### 3. Non-integer `borderWidth` (MiseItem, build #83)

`borderWidth: 1.5` in MiseItem checkbox circle. Android does not render non-integer border widths reliably — the border would flicker or disappear entirely on certain DPI densities.

Fix: `borderWidth: 2`.

---

### 4. Difficulty pill unreadable (RecipeCard, build #83)

`color: tokens.ink` (`#111410` near-black) on `rgba(0,0,0,0.62)` dark photo scrim. Dark text on dark scrim.

Fix: `color: '#FFFFFF'`.

---

### 5. SMASH_BURGER equipment/mise en place not showing (build #83)

**Root cause chain:**
1. SMASH_BURGER in `seed-recipes.ts` was missing `whole_food_verified: true`
2. `RecipeSchema` had a `.refine()` that required authored recipes to have `whole_food_verified: true`
3. `refreshSeedRecipeFields` (runs every app launch) calls `RecipeSchema.safeParse(raw)` before updating DECISION-009 columns
4. `safeParse` returned `{ success: false }` for SMASH_BURGER → `continue` skipped it → equipment/mise_en_place columns stayed NULL in SQLite

**Two-part fix:**
1. Added `whole_food_verified: true` to SMASH_BURGER in seed-recipes.ts
2. Removed the `.refine()` enforcement from types.ts (Patrick's explicit request — "remove the restrictions"). The field is retained in the schema as `z.boolean().optional()` — data preserved, just not required

---

### 6. Collapsible sections added to recipe screen (build #81)

- Description: `descExpanded` state, `numberOfLines={3}` when collapsed, "Read more ↓" / "Read less ↑" toggle
- Equipment accordion: Pressable header with chevron; `equipCollapsed` state
- "What to Know" accordion: Pressable header with chevron; `knowCollapsed` state
- Mise en place: "Show less ↑" chip appears when expanded

---

### 7. FlatList → ScrollView (Kitchen screen, build #81)

FlatList estimates `ListHeaderComponent` height at mount. Dynamic elements (cuisine chips, "Cooking tonight" banner) change height post-mount → FlatList corrects item positions on first scroll → visible card jump.

Fix: Replaced FlatList entirely with `ScrollView + results.map()`. No estimation step = no jump.

---

## Commits pushed

| SHA | File | Summary |
|---|---|---|
| `a8da5341` | pantry.tsx | ChipAdd redesign, RecipeMatchCard fix, hint text removed |
| `078e616e` (prev) | recipe/[id].tsx | MiseItem Pressable+View split, borderWidth fix |
| (prev) | RecipeCard.tsx | Difficulty pill white text |
| (prev) | seed-recipes.ts | SMASH_BURGER whole_food_verified |
| (prev) | types.ts | Remove whole_food_verified refine |

---

## Builds

| Build | Status | Key fix |
|---|---|---|
| #84 | Queued | ChipAdd pill redesign |
| #83 | Delivered | MiseItem fix, difficulty pill, SMASH_BURGER data |
| #82 | Delivered | (earlier session) |
| #81 | Delivered | FlatList→ScrollView, collapsible sections, description expand |

---

## What Patrick needs to do

1. **Install build #84** when the EAS notification arrives
2. **Check pantry "STILL NEED" section** — ingredient chips should now render as pill-shaped buttons with a rust outline (not yet added) → solid rust fill with ✓ (added to pantry)
3. **Confirm REGN-001** — does the card alignment jump still occur on the Kitchen screen? If it's gone, close GitHub Issue #REGN-001
4. **Confirm SMASH_BURGER** — open the Smash Burger recipe and verify equipment and mise en place sections now appear
5. **Confirm difficulty pills** — should now be white text on dark scrim (readable)
6. **Confirm collapsible sections** — description has Read more/less; Equipment and What to Know have expand/collapse chevrons

---

## Known open issues

| ID | Issue | Status |
|---|---|---|
| REGN-001 | Recipe cards misalign after first scroll (Kitchen screen) | FIX ATTEMPTED — awaiting Patrick validation |
