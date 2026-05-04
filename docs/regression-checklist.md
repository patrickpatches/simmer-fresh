# Hone — Regression Checklist

> Every non-trivial bug fix gets one row here before the session ends.
> Run this checklist before every release tag — it takes under two minutes.
> Managed by: Senior Engineer. Owned by: QA Test Lead once spun up.

## Purpose

Two regressions in three weeks (carousel snap → returned; null-byte corruption → returned).
Both were previously found, diagnosed, and fixed. Both were rediscovered at cost.
This file is the memory so we don't pay the rediscovery cost twice.

**Rule:** if finding the bug took more than fifteen minutes, it goes here.
**Trigger for re-check:** before every release tag, and whenever `pantry.tsx`,
`plan.tsx`, or a carousel-containing component is touched.

---

## Format

Each entry:
```
### [REGN-NNN] — Short name
**Description:** One-line summary of the bug.
**Repro steps:** Minimal steps to reproduce.
**Fixed in:** Commit hash + session date.
**Regressed in:** Commit hash or session date when it came back (fill in if it recurs).
**Check:** ✅ / 🔴 (update each time you run the checklist)
**Guard:** What to watch for in code review to prevent recurrence.
```

---

## Regression entries

### [REGN-001] — Recipe card carousel partial-snap
**Description:** Swiping the "Closest Matches" horizontal carousel in the Pantry tab no longer
snaps cleanly to one card per view — partial cards from adjacent entries are visible on both edges.
**Repro steps:**
1. Open the Pantry tab.
2. Stock at least 3–4 ingredients so the carousel populates with recipe matches.
3. Swipe the horizontal "Closest Matches" carousel left and right.
4. **Pass:** each card settles exactly one-card-wide in the viewport with no bleed from adjacent cards.
5. **Fail:** partial cards are visible on either edge, or the snap lands between two cards.
**Fixed in:** Session 29 April 2026 — `pagingEnabled` prop set on the `FlatList`/`ScrollView`; card width set to `Dimensions.get('window').width - [horizontal margins]` so exactly one card fills the viewport.
**Regressed in:** Pantry v2 redesign (Pantry v2 dark-direction restyle) — the `pagingEnabled` prop or the card-width calculation was dropped during the rewrite.
**Check:** 🔴 *Update to ✅ after on-device verification*
**Guard:** When touching `pantry.tsx` carousel: verify `pagingEnabled={true}` is present AND that `cardWidth` is computed from `Dimensions.get('window').width` minus the horizontal padding, not a hardcoded pixel value. A hardcoded width breaks snap on all non-standard screen sizes.

---

### [REGN-002] — OneDrive/file-sync null-byte corruption
**Description:** Files edited via the OneDrive-synced path occasionally have 1,045+ null bytes (U+0000) appended by the sync client. The build fails with `SyntaxError: Unexpected character '\x00'` pointing to the end of the affected file.
**Repro steps:**
1. Edit any source file via a path that goes through OneDrive sync (e.g. the Windows Documents folder rather than the workspace mount).
2. Push and trigger the GitHub Actions build.
3. **Fail:** build log shows `SyntaxError: plan.tsx: Unexpected character ''. (N:0)` — the null byte is invisible in most editors.
**Diagnosed in:** Session 28 April 2026. `plan.tsx` was found with 1,045 null bytes appended; `recipe/[id].tsx` was truncated mid-code. Fixed by stripping null bytes from `plan.tsx` and restoring `recipe/[id].tsx` from commit `4bca5c6`.
**Regressed in:** Not a code regression — a process regression. Recurs whenever files are edited via the OneDrive path instead of the workspace mount.
**Check:** ✅ *Process fix in place — write via GitHub API or workspace mount only*
**Guard:** Always write source files via the GitHub API (`PUT /repos/.../contents/...`) or via the `/sessions/.../mnt/hone/` workspace mount. Never write through the OneDrive-synced Documents path. If a build fails with an unexpected-character error near the end of a file, run `grep -cP '\x00' <file>` — a count > 0 confirms null-byte corruption; strip with `tr -d '\000' < broken.tsx > fixed.tsx`.

---

### [REGN-003] — pantry.tsx file-write truncation (Pantry v3)
**Description:** Large file writes via shell heredoc or Python base64 push can silently truncate mid-expression. Pantry v3 was cut at `{undo` (line 1219), then a reconstruction attempt missed the `>` closing the `<Text>` opening tag. Metro bundler caught it only at bundle time as either `Unexpected token, expected "}"` or `Unexpected token, expected "..."`.
**Repro steps:**
1. Push any file > 40 KB via the GitHub API.
2. Trigger a build.
3. **Fail:** Metro reports a `SyntaxError` near the end of the file or mid-expression in a component.
4. **Pass:** clean APK builds, Metro bundles with no syntax errors.
**Fixed in:** Session 3 May 2026 — built a validation script (brace balance + line-count check) before pushing. Rebuilt pantry.tsx and pantry-helpers.ts from known-good git base commits `f7cb9e0` (pantry.tsx) and `f7cb9e0` (pantry-helpers.ts); pushed ingredient-derivations.ts for the first time.
**Regressed in:** Not a code regression — a process regression. Can recur on any large API write without the validation gate.
**Check:** ✅ *REGN-003 script (`scripts/validate-before-push.sh`) in place*
**Guard:** Before any GitHub API file push > 20 KB: (1) count braces/parens in the local buffer, (2) confirm line count matches expected, (3) download the pushed file and re-validate. Never reconstruct a truncated file by appending a manually-written tail — always download → edit → re-validate → push.

---

### [REGN-004] — Pantry search focus dumps full ingredient catalog (v3)
**Description:** Tapping the Pantry search input immediately rendered the entire INGREDIENT_CATALOG (every ingredient grouped by category) as a full-screen SectionList, because `isSearchActive = addName.length > 0 || isFocused`. The result looked identical to the deleted IngredientSearchOverlay and dismissed when the user tapped away.
**Repro steps:**
1. Open the Pantry tab.
2. Tap the "Search or add an ingredient…" input without typing anything.
3. **Fail:** the entire ingredient catalog appears as a categorised full-screen list.
4. **Pass:** tapping the input leaves the browse view unchanged; the catalog only appears after 2+ characters are typed.
**Fixed in:** Commit `c917965` — Session 4 May 2026.
  - `isSearchActive = addName.trim().length > 0` (removed `|| isFocused`)
  - `autocompleteSections` returns `[]` when query < 2 chars (removed full-catalog fallback)
  - Empty state distinguishes 1-char "keep typing" from 2+ "no match + add" CTAs
**Check:** 🔴 *Update to ✅ after on-device verification in build #57*
**Guard:** When touching the `isSearchActive` or `autocompleteSections` logic in `pantry.tsx`: confirm the condition does NOT include bare `isFocused` — focus state is only for border styling and the Cancel button. Never use `isFocused` as the trigger to show catalog content.
