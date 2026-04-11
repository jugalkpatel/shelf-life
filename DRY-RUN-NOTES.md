# Course Dry Run — 20260411-134907-d51c

## Session metadata

- **Session slug:** `20260411-134907-d51c`
- **Started:** 2026-04-11
- **Authorization mode:** `local-only` (zero remote writes; remote-gated labs stop at the network boundary)
- **shelf-life baseline SHA:** `6cdb7bf1e3e395309c2881e6284bc02411b67c65` on `main`
- **shelf-life working branch:** `dry-run/20260411-134907-d51c`
- **stevekinney.net branch for course edits:** `tweak-playwright-again` (edit directly per user direction; no new branch)
- **Course walk order:** `/Users/stevekinney/Developer/stevekinney.net/courses/self-testing-ai-agents/index.toml`

## Baseline hosted CI

`gh run list --commit 6cdb7bf1 --limit 3 --json status,conclusion` returned `[]` — no CI runs exist for the current `main` SHA. Baseline recorded as **no-runs**. This is not a red baseline; it is simply absent. Reconciliation in Phase 5 will push a fresh SHA and verify CI against that new SHA.

## Preflight outcomes

- ✅ shelf-life clean on `main`, fetch succeeded, only `main` and `planted-bug/admin-feature` branches present.
- ✅ stevekinney.net clean on `tweak-playwright-again`. User directed edits stay on this branch.
- ✅ No stale worktrees, `tmp/dry-run/` empty, no tag/branch collisions for `20260411-134907-d51c`.
- ✅ Working branch `dry-run/20260411-134907-d51c` created off baseline SHA.

## Findings (cumulative)

### Finding 1 — SKILL.md bootstrap was broken

**Surface:** `.claude/skills/course-dry-run/SKILL.md` bootstrap step list (the "Immediately after `git worktree add`" block).

**Symptom:** Step 5 (`npx drizzle-kit push --force`) fails in every fresh worktree with `ConnectionFailed("Unable to open connection to local database ./tmp/dry-run.db: 14")`. The libsql client cannot create the SQLite file because its parent directory `tmp/` does not exist in a freshly-added worktree.

**Root cause:** The `dry-run.env.template` sets `DATABASE_URL=file:./tmp/dry-run.db`, but nothing in the bootstrap list creates `tmp/`. The Docker block in `references/pitfalls.md` does `mkdir -p tmp` before `drizzle-kit push`, so the pattern was known — just absent from the main SKILL.md bootstrap.

**Secondary issue found while patching:** Step 2 said "Exclude the worktree's own nested `tmp/` via `.git/info/exclude`," but in a linked worktree `.git` is a file pointing at `<main-repo>/.git/worktrees/<name>/`. The path `.git/info/exclude` does not exist inside a worktree — the correct path is `<main-repo>/.git/worktrees/<worktree-name>/info/exclude`, and the `info/` directory must be created first.

**Fix applied:** Inserted a new step 2 (`mkdir -p tmp`), corrected the exclude-path step, noted that `npm ci` fires `prepare` via postinstall on this project, and renumbered subsequent steps 3 through 11. See commit that lands this note.

**Reproduction:** `git worktree add tmp/dry-run/<slug>/fresh/<lab>/ <sha>` → copy env template → `npm ci` → `npx drizzle-kit push --force` reproduces `ConnectionFailed (14)`.

## Session pause point

This session stopped partway through Phase 1 lab 1 (`lab-rewrite-the-bad-claude-md`) to commit the SKILL.md fix before continuing. Pause state:

- **Worktree:** `tmp/dry-run/20260411-134907-d51c/fresh/rewrite-claude-md/` exists, detached at baseline SHA `6cdb7bf1`.
- **Bootstrap progress:** steps 1-6 of the (new, corrected) 11-step bootstrap are complete. `.env` written, `tmp/` created, `npm ci` ran (which fired `prepare`), `drizzle-kit push --force` succeeded. **Steps 7-11 (build, port check, launch preview, seed, record PID) have not run yet.**
- **Lab execution:** the lab itself has not been touched. `CLAUDE.md` in the worktree is unmodified from baseline.
- **Gates:** not run.
- **Screenshot decision:** still pending (expected `text-only`).

To resume: re-enter the worktree, continue from step 7 (`npm run build`), then execute the lab, run gates, log, and proceed to lab 2.

## Lab execution log

_Phase 1 entries will be appended below per lab. No entries yet — lab 1 is in progress, see pause point above._

## Backport ledger

_Phase 2 will consolidate the ledger below._
