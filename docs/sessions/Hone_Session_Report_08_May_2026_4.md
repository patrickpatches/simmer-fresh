# Hone Session Report — 8 May 2026 (Report 4)

**Session type:** Senior Product Engineer
**Build dispatched:** #96 on commit `ce3ff2b`
**Commits pushed (2):** `ce3ff2b` (code), and the docs commit follows.

## Headline

DECISION-014 per-recipe portion sizing landed — the v0.6.0 milestone marker per DECISION-012. Every launch-16 recipe now scales by its own unit: "Makes 4 burgers" for Smash Burger, "Makes 1 chicken" for Roast Chicken, "Makes 2 cups" for Hummus, "Makes 13 tortillas" for Flour Tortillas, "Serves 4 serves" for the per-person dishes (which has a small wording oddity I've flagged for Patrick to call). "Make extra for tomorrow" hint is now recipe-aware — Smash Burger says "Make only what you'll eat — smash burgers don't reheat", Bolognese says "Double the batch — freezes 3 months", and so on.

Functional version is shipped per Patrick's instruction. Designer's visual polish is queued as a separate handoff and lands as a second pass — engineering does not block on Designer.

## What landed

| Commit | Subject | Files |
|---|---|---|
| `ce3ff2b` | DECISION-014 per-recipe portion units | 5 files: types.ts, seed-recipes.ts, ServingsSelector.tsx, recipe/[id].tsx, RecipeCard.tsx |

## Detail

### Schema changes (types.ts)

Four new optional fields on `Recipe`:

```ts
output_unit: z.string().optional()
output_unit_plural: z.string().optional()
output_default: z.number().int().positive().optional()
extra_for_tomorrow_label: z.string().optional()
```

All `.optional()` — when absent, the UI falls back to the legacy "people / portions" rendering. This is the additive-only commitment Patrick called out: non-launch recipes keep working.

### Migration of 16 launch recipes (seed-recipes.ts)

Cook authored `docs/coo/culinary-research/launch-recipe-units.md` with the per-recipe unit spec. Migrated verbatim via Python script:

| Recipe | unit | default | hint |
|---|---|---|---|
| SMASH_BURGER | burger | 4 | "Make only what you'll eat — smash burgers don't reheat once the crust softens" |
| PASTA_CARBONARA | serve | 4 | "No tomorrow — carbonara's emulsion breaks within 30 min" |
| WEEKDAY_BOLOGNESE | serve | 6 | "Double the batch — freezes 3 months in 2-serve portions" |
| BUTTER_CHICKEN | serve | 4 | "+1 lunch tomorrow — sauce freezes well" |
| THAI_GREEN_CURRY | serve | 4 | "+1 lunch tomorrow — keeps 2 days, reheat gently" |
| CHICKEN_SCHNITZEL | schnitzel | 4 | "+1 extra schnitzel — reheats crispy in a 200°C oven" |
| BEEF_LASAGNE | serve | 8 | "Always one full tray — better day 2" |
| ROAST_CHICKEN | chicken | 1 | "+1 second bird — leftovers make stock" |
| ROAST_LAMB | serve | 6 | "Roast a 6-serve shoulder deliberately" |
| FISH_AND_CHIPS | serve | 4 | "No tomorrow — battered fish goes soft" |
| BARRAMUNDI | serve | 4 | "+1 lunch tomorrow — eat fresh for crispy skin" |
| PAVLOVA | serve | 10 | "Always one full pavlova — slice fewer if needed" |
| CHICKEN_SHAWARMA | serve | 4 | "+2 wraps tomorrow — chicken keeps 3 days" |
| HUMMUS | cup | 2 | "Double the batch — keeps 5 days" |
| PAD_THAI | serve | 2 | "No tomorrow — noodles go gummy" |
| FLOUR_TORTILLAS | tortilla | 13 | "+N tortillas — reheat in dry pan" |

Verified: 16 `output_unit` lines in seed-recipes.ts after migration. tsc clean.

### ServingsSelector rebuild (functional only)

The component now accepts three new optional props (`outputUnit`, `outputUnitPlural`, `extraForTomorrowLabel`) and derives:

- Header label: "How many burgers" / "How many serves" / "How many loaves" — falls back to "How many people" when `outputUnit` is absent.
- Stepper big-number caption: "{plural}" — falls back to "person/people".
- Right-side prefix: "Serves" when `outputUnit === 'serve' || 'person'`; "Makes" otherwise.
- Right-side caption: pluralised unit — falls back to "portions".
- Mode hint: `extraForTomorrowLabel` when leftover mode is non-tonight AND the recipe has authored its label; falls back to leftover-option generic hint.

Two helper functions added:
- `pluralise(unit, plural?, n)` — picks singular/plural with explicit override or naive append-"s".
- `isPersonUnit(unit)` — true when unit is `'serve'` or `'person'`.

### Recipe screen (recipe/[id].tsx)

Two changes:
1. Default people-count on recipe load uses `recipe.output_default ?? recipe.base_servings`. Recipes that haven't been migrated still get their legacy default.
2. `<ServingsSelector>` call passes the three new props through.

### Kitchen card (RecipeCard.tsx)

The meta chip in the Kitchen browse card previously read just the count (`"4"`). Updated to read `"{count} {plural}"` — e.g., "4 burgers", "1 chicken", "8 tortillas". Falls back to bare count when `output_unit` is absent.

## File-write integrity

Five truncation/null-byte events caught and recovered mid-session, all REGN-003 class:
1. `types.ts` truncated at line 401 mid-comment after the Edit tool inserted the schema fields. Recovered by appending the missing tail via heredoc.
2. `ServingsSelector.tsx` truncated at line 218 mid-`LEFTOVER_OPTIONS.map((opt) =>`. Recovered from HEAD via Python and re-applied edits.
3. `recipe/[id].tsx` truncated at line 1597 mid-`<Icon name="check"`. Recovered from HEAD via Python.
4. `RecipeCard.tsx` truncated mid-card-body. Recovered from HEAD via Python.
5. Various null-byte tails stripped via `data.rstrip(b'\\x00')`.

The recovery pattern is well-rehearsed: `git show HEAD:<path>` to get clean source, apply edits via Python's `text.replace(old, new)`, write back, verify with `tail -c` and `tsc`. This continues to argue for a `REGN-006` regression-checklist entry covering the Edit tool's mid-write truncation behaviour.

## What Patrick needs to do next

Build #96 is queued (https://github.com/patrickpatches/hone/actions/runs/...). When it lands:

1. Open Smash Burger — should read "Makes 4 burgers" / "1 burger" stepper. Header reads "How many burgers".
2. Open Roast Chicken — "Makes 1 chicken". Header "How many chickens".
3. Open Hummus — "Makes 2 cups". Header "How many cups".
4. Open Flour Tortillas — "Makes 13 tortillas". Header "How many tortillas".
5. Open Pasta Carbonara — currently reads "Serves 4 serves" (the unit IS "serve", the prefix IS "Serves"). This is grammatically valid but reads oddly. **Decision needed from Patrick:** see the on-device validation handoff at the top of `handoffs.md` for three options.
6. Tap "Make extra for tomorrow" mode pills on Smash Burger — should read "Make only what you'll eat — smash burgers don't reheat". On Hummus: "Double the batch — keeps 5 days". On Carbonara: "No tomorrow — carbonara's emulsion breaks".
7. Kitchen browse cards: each card's meta chip should read "4 burgers" / "1 chicken" / "8 tortillas" instead of just "4".

If anything looks wrong, raise a GitHub Issue — I won't close per CLAUDE.md.

## Tracked follow-ups

- **"Serves N serves" oddity** — flagged in the on-device validation handoff at top of `handoffs.md`. Three options laid out; Patrick picks.
- **Designer visual treatment** — separate handoff to Product Designer, in flight in parallel. They produce the mockup; engineering polishes the styling in a second pass.
- **Cook's `make_extra_note` long-form copy** — current `extra_for_tomorrow_label` is a short single-line label. Cook's spec includes longer paragraphs explaining storage/reheating per recipe. If Patrick wants those surfaced (e.g., as a tap-to-expand "more" affordance under the leftover mode hint), that's a separate UI pass.
- **Step-flow audit fixes** (10 HIGH, 9 MEDIUM, separate Senior-Engineer handoff dated 2026-05-06) — still open, not touched in this session.
- **`flour-tortillas.md` re-author** — Culinary Verifier handoff still open.
- **`sheet-pan-harissa-chicken` cuisine tag** — culinary-audit flagged levantine→north_african.
- **REGN-006 regression-checklist entry** — file-write truncation pattern.

## Repo state

- Local main: `ce3ff2b`
- Origin main: `ce3ff2b` (synced)
- Build #96: queued (pending dispatch confirmation)
- App version: 0.5.0 (DECISION-012; v0.6.0 bump happens when Patrick says go, after this validates)
