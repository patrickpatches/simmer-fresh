# Hone Session Report — 8 May 2026 (Report 2)

**Session type:** Senior Product Engineer
**Build triggered:** No — per CLAUDE.md, awaiting Patrick's explicit go.
**Commits pushed (4):** `ee111a0`, `5ac153b`, `e649f0f`, `c5f6a2d`

## Headline

Three queued jobs from the top of `docs/coo/handoffs.md` all landed. Brand-safety blocker (broken attribution URLs) cleared. Every browsable recipe except one now carries full DECISION-008 sections (Equipment, Prep, What-to-know, Finishing, Leftovers, total/active timings). The one exception (sourdough-maintenance) renders an honest placeholder line instead of empty space. None of this is built into an APK yet — Patrick triggers when ready.

## What landed

| Commit | Subject | Files | Net change |
|---|---|---|---|
| `ee111a0` | ATTR-FAIL: 16 broken attribution URLs converted to book citations | `seed-recipes.ts` | −68 / +70 |
| `5ac153b` | DECISION-009 Batch 2 migration (11 launch-priority recipes) | `seed-recipes.ts` | +273 |
| `e649f0f` | DECISION-009 Batch 3+4 migration (27 cook-extras) | `seed-recipes.ts` | +626 |
| `c5f6a2d` | UI placeholder for recipes with no Equipment AND no Prep | `recipe/[id].tsx` | +42 / −1 |

## Job 1 — ATTR-FAIL (commit `ee111a0`)

The Culinary Verifier's first-pass attribution audit (`docs/coo/culinary-audit.md`) flagged 16 of 45 recipes as Golden Rule 1 violations: `video_url` pointed to a channel page, site root, about page, or chef listing — none of which resolve to a specific recipe.

Patrick's explicit direction: default to book citation; only chase a YouTube URL when quick and the video genuinely exists. None of the 16 had a verifiable specific URL at audit time, so all 16 became book citations or, where the chef has no book (Andy Cooks), an honest "inspired by, no URL" note.

The Python script at `/tmp/attr-fix.py` (transient, not committed) drove a single regex pass over the source block of each named recipe, replacing the `chef:` + `video_url:` lines with `chef:` + `notes:` and writing the file once. Brace/paren/bracket balance was 0 before and after. tsc clean.

Per-recipe verdicts captured in the commit message.

## Jobs 3 + 3b — DECISION-009 migration (commits `5ac153b` and `e649f0f`)

The Cook's research files in `docs/coo/culinary-research/*.md` had been authored for 38 recipes but only 6 had been ported into `seed-recipes.ts` (the original Batch 1). The 11 launch-priority recipes had been queued as a separate handoff; on inspection 27 more had been authored by the Cook in their later batches.

The cook used two formats:
1. **Older** (`## 1. Hero` / `## 2. At a Glance` / `## 4. What to Know …` etc.) — used by all 11 launch-priority recipes.
2. **Newer** (`### At a glance` table with code-quoted field names; sections like `### Equipment (\`equipment\`)` containing fenced code blocks) — used by the 27 cook-extras.

I wrote a single Python parser that:
- Auto-detects format by checking for `# Recipe Content — DECISION-009` as the first line.
- For older format: parses `## N. Heading` sections by number, table rows for the at-a-glance numbers, numbered/bulleted lists by markdown.
- For newer format: parses `### Heading (\`field_name\`)` sections by literal field name, extracts content from fenced code blocks.
- Strips markdown bold (`**text**`) from every inserted string — React Native Text doesn't render markdown, the asterisks would have shown as literal characters and clashed with FALAFEL/CHICKEN_SCHNITZEL/etc. that already had clean Batch 1 strings.
- Strips italic editorial asides like `*(no change needed)*` from finishing/leftovers paragraphs.
- Normalises time expressions: "4 hours 30 min" → 270, "~3.5 hours" → 210, "14+ hours (overnight dry brine)" → 840, "overnight" alone → 720 floor.

Two passes: I noticed during validation of Batch 2 that markdown bold had leaked into the inserted `before_you_start` strings. Reverted the file (`git show HEAD:... > clean.ts && cp clean.ts ...`), updated the parser to strip bold, re-ran. Result was clean — the lone `**` remaining in the file is the JSDoc opener `/**` at line 1.

Brace/paren/bracket balance verified after each commit: `1541/1541, 594/594, 737/737`. tsc clean throughout.

## Job 2 — Audit + UI placeholder (commit `c5f6a2d`)

After the migration, only sourdough-maintenance lacked DECISION-008 fields. Per Patrick's spec ("must NOT silently hide the section if the data is empty; render a clear placeholder"), I added a conditional block in `mobile/app/recipe/[id].tsx` that renders only when both `recipe.equipment.length === 0` AND `recipe.mise_en_place.length === 0`. Sage-tinted card with a chef icon and one sentence:

> Equipment and prep notes are coming — the chef hasn't written the audit for this recipe yet. Ingredients and method below are complete.

The block sits between Ingredients and Method, where Equipment and Prep would otherwise render. Hidden in cook mode (no point showing "coming soon" while actively cooking).

## Audit table — final populated state

| Status | Count | Recipes |
|---|---|---|
| ✅ Full DECISION-008 sections | 44 | every seed recipe except sourdough-maintenance |
| ⚪ Renders the new placeholder | 1 | sourdough-maintenance — intentional, feeder-starter guide outside the schema |

## What Patrick needs to do next

1. Trigger an EAS build on `c5f6a2d` (or any newer SHA on main):
   ```
   gh workflow run "Hone Android Build" --field profile=preview --ref main
   ```
2. Uninstall the existing Hone APK from the device before sideloading the new one (Android keeps the previous build's resources around).
3. On-device, walk these:
   - Open chicken-adobo — book citation in source notes, full DECISION-008 sections render, no broken URL on the Watch button.
   - Open butter-chicken — total time should be 270 min (4h 30m, including marinade), not 90.
   - Open roast-chicken — total time should be 840 min (14h dry-brine).
   - Open lamb-shawarma — Prep checklist tappable, count ticks.
   - Open sourdough-maintenance — the new sage placeholder line should appear between Ingredients and Method, NOT empty space.
   - Spot-check 2–3 recipes from the Batch 3+4 migration (ramen, char-kway-teow, beef-rendang) for sanity.

If any of those fail, raise a fresh GitHub Issue and I'll dig in.

Per CLAUDE.md, I have NOT closed the GitHub issues. Patrick validates on-device and closes himself.

## Tracked follow-ups (separate handoffs)

- **Step-flow audit fixes (10 HIGH, 9 MEDIUM)** — separate Senior-Engineer handoff dated 2026-05-06; not touched in this session per Patrick's "keep them separate" direction.
- **`sheet-pan-harissa-chicken` cuisine tag** — culinary-audit flagged it as more accurately `north_african` than `levantine`. Content/cuisine-tag fix, not part of this session's scope.
- **`BEEF_LASAGNE` attribution caveat** — existing source.notes already clarify the bolognese-vs-lasagne distinction; no change needed but flagged in the ATTR-FAIL commit message.
- **`whole_food_verified` regression risk** — handoff to COO already closed (2026-05-07); cook briefed in writing in `docs/coo/specialists/culinary-verifier.md`. Session-end grep added to the cook's ritual.

## Repo state

- Local main: `c5f6a2d`
- Origin main: `c5f6a2d` (synced)
- Branches local: `main`, `claude` (claude is stale; can be pruned)
- No outstanding builds in the queue I dispatched. Build #93 (REGN-006/007 from 4725618) was the last build I triggered.

## Session integrity

- TypeScript: clean across all four commits.
- File-write truncation guard: each commit's modified files were `tail -c 60`-checked against expected end markers (`];`, `}`, etc.). Two truncation events were caught mid-session (`recipe/[id].tsx` lost the trailing `MiseItem` body and `formatTimer`) and recovered before commit.
- Brace/paren/bracket balance: 0 across every commit.
- Per-recipe DECISION-008 field counts: each of `total_time_minutes`, `equipment`, `before_you_start`, `mise_en_place`, `finishing_note`, `leftovers_note` appears 44 times in `seed-recipes.ts`.

## Note on the cook's 4 untracked files

When I synced, four cook research files (`fattoush.md`, `kafta.md`, `mujadara.md`, `musakhan.md`) were in my working tree as untracked but not on origin. I committed those as part of the migration — they were the cook's authored content (timestamps 2026-05-07 ~18:19 UTC) and would otherwise have been lost. The migration extracted their fields verbatim. If the cook later commits these files via another path, expect a benign no-op merge.
