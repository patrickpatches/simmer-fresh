# Hone Session Report — Saturday 16 May 2026

**Engineer:** Senior Product Engineer (Claude)
**Builds dispatched this session:** #110, #111, #112 (plus #110 hotfix `9fd9dd5`)
**Latest HEAD on origin/main:** `c45472e` (build-log hash-fill for #112)
**APK to install:** **build #112** when it finishes — cumulative HEAD, contains every fix from #95–#112.

---

## Headline

Five distinct deliveries this session:

1. **Build #110** — 4-of-5 items from the COO's brief (skipped item 3 — DECISION-015 cook data wasn't on origin at the time; flagged back).
2. **#110 hotfix** — stripped a leftover REJECTED SMASH_BURGER hero URL caught in the post-build bug check.
3. **Build #111** — cook's DECISION-015 per-recipe migration once her work landed: 64 colour overrides + 12 step_overrides authored across the 16 launch recipes.
4. **Build #112** — Patrick's URGENT pantry-persistence bug fix (`allowBackup: false`) + the R-014 truncation CI guardrail the engineer had flagged.
5. **Repo cleanup** — handoffs.md kept current via Contents-API pushes; local file resynced; build-log table now tracks every dispatch.

Per R-015 — none of this is "done." All four builds are **shipped to main, awaiting Patrick on-device validation.**

---

## Build #110 — five-item bundle (commit `070483a`, dispatched 2026-05-13 21:41 UTC)

Patrick's brief: 5 items, one build. Shipped 4 of 5.

| # | Item | Result |
|---|---|---|
| 1 | tsc sanity with new CuisineId / TypeId enum values | ✅ R-014 recovery — cook's `ff86010` truncated `types.ts`; restored from `b0382e0` clean tail + re-applied `'dessert'` |
| 2 | Cuisine filter tiles wired to launch data | ✅ Added missing CUISINE_LABELS (`palestinian`, `german`, `british`); extended CATEGORIES tile list to cover every CuisineId; existing `availableCategoryIds` filter trims to ≥1 launch recipe |
| 3 | DECISION-015 per-recipe substitution data | ❌ **Not shipped** — searched origin for cook's discrepancy tables, zero hits. Default 4-to-3 mapping from #107 still in force. Flagged COO + cook |
| 4 | Hero image migration (APPROVED only) | ✅ 3 Unsplash heroes wired: PASTA_CARBONARA (`photo-1612874742237-6526221588e3`), FALAFEL (`photo-pQnsKWk5ljQ` Anton), PAVLOVA (`photo-5nCTfEru3Do` Eugene Krasnaok). Shawarma CONDITIONAL — defaulted to "wait for replacement." |
| 5 | Attribution display | ✅ New `hero_attribution` optional string on the Recipe schema; rendered as a dark-scrim pill at the bottom-right of the hero image on the recipe screen |

**Taxonomy guardrail also added:** `validateDecision015` in `db/seed.ts` now scans every launch recipe's `categories.cuisines` + `categories.types` against the enums; console.warns any value outside the schema.

### #110 hotfix — commit `9fd9dd5` (rolled into #112's tree, no separate build)

Bug-check pass found SMASH_BURGER still carried a stale `photo-1568901346375-23c9450c58cd` hero URL. Cook's ledger had REJECTED it (wrong cheese, red onion rings). Patrick's #110 brief said "DO NOT MIGRATE smash-burger." Without the strip, #110 would have rendered a rejected image. Removed.

---

## Build #111 — DECISION-015 per-recipe migration (commit `c8430f6`, dispatched 2026-05-13 22:35 UTC)

Pre-flight gate confirmed cook's work landed (16/16 research files carry `DECISION-015` markers; GitHub code-search index was lagging but direct file fetch was authoritative).

| Change layer | Count |
|---|---|
| Colour overrides applied (where cook diverged from default 4-to-3 mapping) | 64 |
| `step_overrides` arrays added (where cook authored alternate step text) | 12 |
| Final pill distribution | 211 🟢 / 338 🟡 / 94 🔴 / 0 legacy |
| step_overrides recipes | Carbonara, Green Curry, Bolognese, Shawarma, Butter Chicken, Tortillas, Schnitzel, Lasagne |

**8 gaps flagged back to cook + COO** (not invented; require explicit input):
- Override text not authored: SMASH_BURGER (×3 — Wagyu, American cheese, Bread & butter pickles); HUMMUS (Tinned chickpeas → s2); PAD_THAI (×4); FALAFEL (×2).
- Ambiguous step anchors: BEEF_LASAGNE "ragù step" (could be `step_2_brown_mince` / `step_4_wine` / `step_5_simmer`); ROAST_LAMB "prep" (could be `step_1_temper` / `step_2_score` / `step_3_season`).
- Missing substitution in seed: FLOUR_TORTILLAS "Vegetable shortening" — cook's table includes it but the recipe const doesn't.

**R-014 incident this commit:** my step_overrides insertion produced 9 missing-comma syntax errors (single-line substitution objects). tsc caught it, a targeted regex pass fixed it cleanly. Verified at the byte level before push.

---

## Build #112 — URGENT pantry persistence + R-014 CI guardrail (commit `1f7bb88`, dispatched 2026-05-14 ~00:30 UTC)

### Item 1 — R-016 fix (pantry/shopping list survives uninstall)

**Root cause:** Google Android Auto Backup is on by default for Expo Android builds. The system silently backs up the app's SQLite database to the user's Google Drive and restores it on reinstall. Contradicts the offline-first / privacy-first stance in CLAUDE.md and produces Patrick's bug: clean uninstall + wipe + reinstall still shows pre-uninstall pantry items.

**Fix in `mobile/app.json`:**
- `expo.android.allowBackup = false`
- `expo.android.versionCode` 47 → 48

The next prebuild's `AndroidManifest.xml` will carry `android:allowBackup="false"` on the `<application>` tag. Auto Backup is suppressed; SQLite stays on-device only.

**Validation gate Patrick must run** (cannot self-close per R-015):
1. On current build: add a few pantry items + tick a few shopping list items.
2. Uninstall: long-press → uninstall. Then **Settings → Apps → Hone → Storage → Clear all data**.
3. Reboot the phone for belt-and-braces certainty.
4. Install build #112.
5. Open Pantry → **must be empty**. Open Shop → **must be empty**.

If pantry comes back populated despite #112, the cause isn't Auto Backup. Possible follow-on suspects: Play Console restore-from-backup path, an MCP cloud-sync layer, or an OAuth token cache. Send the symptom and the engineer digs further.

### Item 2 — R-014 truncation CI guardrail

Three commits this fortnight silently truncated `.ts` files via the Edit tool (Patrick's `6813ddc`, cook's `ff86010`, engineer's mid-DECISION-015 pass). Each cost a build cycle.

**`scripts/check-ts-truncation.sh`** — 30-line bash; asserts every `.ts`/`.tsx` under `mobile/src/` and `mobile/app/` ends on a balanced closing token (`}` `)` `;` `,` or `]`). Skips `.d.ts` declarations, the `recipes-holding/` pen (per DECISION-013), `_test/` artifacts, and `node_modules/`. Runs in <2s.

**`.github/workflows/ts-truncation-check.yml`** — runs the script on every push to main and every PR. Fails loudly with the offending file path and last 120 bytes of its tail.

Self-tested both ways:
- Against a deliberately truncated `export const FOO = "bar` file: exits 1 ✅
- Against current main: exits 0, "25 .ts/.tsx files all end on a balanced token" ✅

The workflow run #1 (commit `1f7bb88`) and run #2 (commit `c45472e`) both went green in CI alongside the Android build.

---

## Cumulative state on `main` after #112

| Layer | Status |
|---|---|
| Launch roster | 16 launch / 30 holding (DECISION-013 split holding) |
| Substitution quality | 211 🟢 / 338 🟡 / 94 🔴 / 0 legacy (DECISION-015 cook-authored) |
| step_overrides | 12 cook-authored across 8 recipes |
| Hero images | 3 APPROVED on-screen (Carbonara, Falafel, Pavlova) + photographer attribution rendered |
| Cuisine tiles | Cover every CuisineId; filter trims to ≥1 launch-recipe cuisines (Australian, Levantine, Italian, Indian, Thai, American, Mexican) |
| Cook mode | Wake lock ✅ / OLED true-black ✅ / haptics ✅ / knuckle-tap-to-advance ✅ |
| Pantry persistence | `allowBackup: false` in place; awaiting Patrick uninstall-reinstall test |
| R-014 guardrail | CI workflow live on every push + PR |

---

## Open handoffs Patrick should action

### Patrick on-device validation (R-015 gate)

1. **Build #112 uninstall-reinstall test** — see "Validation gate" above. Closes R-016.
2. **Build #111 on-device spot checks** — at least these:
   - Open **Pasta Carbonara** → tap Guanciale → swap to "Whole eggs only" → step 4 switches to alternate emulsion text with sage border + "≈ adapted for your Whole eggs swap" cue.
   - Open **Butter Chicken** → swap chicken to breast → step 2 switches. Swap tomatoes to fresh → step 3 switches. Swap cream to yoghurt → step 5 switches.
   - Open **Flour Tortillas** → swap butter to Lard → step 3 switches to lard-temperature text.
   - Hero images: Carbonara, Falafel, Pavlova show real photos with credit in bottom-right.
3. **Build #110 on-device spot checks** — cuisine tiles render only the 7 in-use cuisines; tapping each filters list; tapping again returns to All.

### COO

- **Cook DECISION-015 gaps (×8)** — see #111 section above. Cook needs to author the missing step_override text, pick step anchors, and either add the missing FLOUR_TORTILLAS Vegetable shortening substitution or drop the table entry.
- **PAT rotation per DECISION-010** — Patrick UI action; URGENT handoff posted earlier in handoffs.md. Current PAT expires 2026-07-21 (~9 weeks out).

### Photography Director

- 10 not-yet-reviewed hero images await cook validation (Bolognese, Roast Chicken, Butter Chicken, Green Curry, Schnitzel, Lasagne, Fish & Chips, Hummus, Pad Thai, Roast Lamb).
- 2 REJECTED heroes (Smash Burger, Flour Tortillas) need replacements.
- 1 CONDITIONAL hero (Shawarma — raw chicken, not charred) — Patrick to call.

---

## Operating notes for the next engineer session

### Local git state (still locked)

The local clone at `C:\Users\patri\hone\.git` has stale lock files (`HEAD.lock`, `index.lock`, `index.stash.29.lock`, `refs/remotes/origin/main.lock`) that the Linux sandbox can't delete (Windows mount permissions). Workaround in use: GitHub Contents/Git Data API for all writes; local working files synced from origin after each push so Cowork sees current state.

To unstick properly, Patrick (or any next engineer with Windows shell access) should:
```
cd C:\Users\patri\hone
del .git\HEAD.lock .git\index.lock .git\index.stash.29.lock .git\refs\remotes\origin\main.lock
git fetch origin
git reset --hard origin/main
```

Until that happens, every code+docs commit goes through the API path (Git Data → tree → commit → ref).

### Build-log discipline

Build log row goes into `docs/coo/handoffs.md` in the **same tree** as the code that triggers the build. Hash field is `pending` at commit time; an immediate follow-up commit fills in the real hash (~5 second lag). The row content is visible from the moment the code lands.

### R-014 CI guardrail now active

Next engineer: if you ever see a CI failure from "R-014 truncation check" — recover via:
```
git show HEAD:<path> > /tmp/clean.ts
# diff against the broken file, re-apply your intended edits, retry
```

### Open R-015 risk

Engineer **never** says "done." Always "shipped to main, awaiting Patrick on-device validation." Status remains OPEN/IN PROGRESS until Patrick confirms.

---

## Repo state

| | |
|---|---|
| origin/main HEAD | `c45472e` |
| Most recent code commit | `1f7bb88` (build #112) |
| Build #112 status | in_progress at session close — Android Build + R-014 truncation check + Pages deploy all running |
| Build #111 status | shipped to main — Patrick validation pending |
| Build #110 status | shipped to main + hotfix `9fd9dd5` rolled in — Patrick validation pending |
| App version on main | v0.5.0, versionCode 48 |

---

*End of session report — 16 May 2026*
