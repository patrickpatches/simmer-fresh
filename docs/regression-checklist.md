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
3. **Fail:** Metro reports a `SyntaxError` near th