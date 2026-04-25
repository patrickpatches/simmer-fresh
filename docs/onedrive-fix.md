# OneDrive corruption — root cause and permanent fix

**Diagnosed:** 2026-04-25, Session 12
**Symptom:** code edits silently truncated mid-file. Files keep their old byte count but the content after a certain offset is missing or replaced with junk. TypeScript compile fails with cascade JSX errors. App may still build because Metro/Babel is more forgiving than `tsc`, but state on disk is corrupt.

## What's actually broken

The project lives at `C:\Users\patri\OneDrive\Documents\Claude\Projects\Cooking App\`. OneDrive's sync engine and Files-On-Demand feature interfere with **incremental file writes** — the read-modify-write pattern used by Claude's `Edit` tool.

Specifically:
1. `Edit` tool reads the file, applies a diff in memory, writes the new full content back.
2. OneDrive's local sync agent locks the file briefly during background sync.
3. If the lock and the write race each other, the write returns "success" but the bytes after the sync-lock point are dropped or replaced with stale buffer content.
4. The file ends up the same byte count as expected, but truncated mid-content. TypeScript chokes on unterminated strings and unclosed JSX.

I verified this in session 12 by running controlled writes:

| Write method | Result |
|---|---|
| `Edit` tool (incremental diff) | **Corrupts** — files truncated |
| `Write` tool (full file rewrite) | Clean — `AddToPlanSheet.tsx` (9.6 KB) intact |
| Shell `cp` | Clean — verified with 24 KB test file |
| Shell `echo > file` | Clean |
| Shell `python -c "open(...).write(...)"` | Clean |

The common factor for everything that worked: **single atomic write, no re-read, no diff merge**. The common factor for what failed: read-modify-write within the same tool call.

`rm` also frequently fails with "Operation not permitted" — same root cause: OneDrive holds the file lock for a few seconds after any change.

## The permanent fix — pick one

### Option A — quick, no project move (recommended)

**On Patrick's side, in Windows:**
1. Open File Explorer.
2. Navigate to `C:\Users\patri\OneDrive\Documents\Claude\Projects\`.
3. Right-click the `Cooking App` folder.
4. Select **"Always keep on this device"**.
5. Wait for OneDrive to finish syncing all files locally (the cloud icon turns into a green tick).

This disables Files-On-Demand for the folder. Files become local-first. OneDrive still syncs in the background but doesn't reach in and lock files mid-write.

**On Claude's side, going forward:**
- Use `Write` tool (full file rewrite) for any change to a source file. Never `Edit`.
- This burns more tokens but is the only reliable write path inside an OneDrive-synced folder.

This combination is the minimum permanent fix.

### Option B — move the project out of OneDrive (cleanest, recommended for long-term)

Treat OneDrive as a backup destination, not a working folder. The actual project lives outside the sync zone.

**One-time setup, on Patrick's side (PowerShell as administrator):**

```powershell
# 1. Pause OneDrive briefly so the move is clean
# Right-click OneDrive cloud icon → Pause syncing → 2 hours

# 2. Move the project out
$src = "C:\Users\patri\OneDrive\Documents\Claude\Projects\Cooking App"
$dst = "C:\Users\patri\Projects\Hone"
New-Item -ItemType Directory -Force -Path "C:\Users\patri\Projects" | Out-Null
Move-Item -Path $src -Destination $dst

# 3. (Optional) symlink the new location back into OneDrive so backups still happen
New-Item -ItemType Junction -Path $src -Target $dst

# 4. Resume OneDrive sync
```

**In Cowork:**
- Re-select the working folder. Point it at `C:\Users\patri\Projects\Hone\` (the real location), not the symlink. The symlink in OneDrive keeps a synced backup automatically.

**Why this is cleanest:**
- OneDrive never sees a write-in-progress on the actual files. No locks, no truncation.
- The symlink gives you OneDrive backup of the same content, but read-only as far as the source of truth is concerned.
- Git is the real source of truth anyway; OneDrive is belt-and-braces.

### Option C — pause OneDrive while editing (manual, last resort)

Right-click OneDrive icon → **Pause syncing → 2 hours** before any session that involves code edits. Resume after. Brittle (easy to forget) but works.

## Don't do these

- **Don't reinstall OneDrive or change account.** The issue is the sync architecture, not the install.
- **Don't disable OneDrive entirely** unless you also have another backup of the project. You'd lose the off-machine copy of work.
- **Don't try to override the lock with `chmod` or `attrib`** — the lock is at the OneDrive driver level, not the file system permissions.

## How to detect a recurrence

After any code change session, run this check from the project root:

```bash
# In Cowork's bash shell:
cd /sessions/<your-session>/mnt/"Cooking App"
for f in mobile/app/(tabs)/*.tsx mobile/app/recipe/*.tsx mobile/src/**/*.ts mobile/src/**/*.tsx; do
  last=$(tail -1 "$f" 2>/dev/null | head -c 30)
  if [[ "$last" =~ ^[[:space:]]*([}\];]|export.*\}|}\)|//.*) ]]; then
    : # OK
  else
    echo "SUSPECT: $f — last line: $last"
  fi
done
```

A file that doesn't end in `}`, `);`, `;`, `]`, or a comment is almost certainly truncated.

## Aftermath of this session (2026-04-25)

In session 12 I attempted P0 code changes to fix the pantry confusion, add calendar buttons for Add-to-plan, and ship the AddToPlanSheet shared component. Most of the `Edit` calls ended up corrupting files. I detected the corruption via TypeScript errors and the file integrity check above. Recovery:

- All corrupted files restored from `mobile/.claude/worktrees/silly-williams-21445f/` (a stale Claude Code worktree that, by luck, OneDrive's permission lock had prevented from being deleted in earlier cleanup attempts — the worktree turned out to be the most recent intact snapshot).
- `seed-recipes.ts` was also corrupted on disk (truncated mid-string at line 3384). Restored from the same worktree.
- The new `mobile/src/components/AddToPlanSheet.tsx` survived (Write tool, 9.6 KB) and remains in place. It is currently orphaned — nothing imports it — and should be wired up in the next session.
- Backlog doc `docs/session-12-backlog.md` survived (Write tool).
- This document survived (Write tool).

The lesson landed: **inside this OneDrive folder, never use `Edit`, only `Write`.** Until Patrick applies Option A or B above, this is the rule.
