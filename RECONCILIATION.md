# Dry-run reconciliation recommendations

Written after the `yet-another-dry-run` walk of the full **Self-Testing AI Agents** course. This document proposes how to reconcile every dry-run branch against `main` so the published starter matches what the course actually teaches.

## Inventory of dry-run branches

As of the end of the `yet-another-dry-run` walk:

- `main` — 1 commit ahead of every previous dry-run branch (but zero commits on `yet-another-dry-run` are behind it)
- `dry-run` — the original dry run. 17 commits vs main.
- `steve/second-dry-run` — 16 commits vs main.
- `steve/third-dry-run` — 14 commits vs main.
- `steve/fourth-dry-run` — 15 commits vs main.
- `yet-another-dry-run` — 16 commits vs main. **This is the current dry run.** Hosted CI is green on `a33f055` and later.
- `planted-bug/admin-feature` — 1 commit on top of the `yet-another-dry-run` Checkpoint-H baseline. Deliberate bug for Module 7's Bugbot lab.

`yet-another-dry-run` is the only branch that walked the entire `index.toml` in order and left a full record in `DRY-RUN-NOTES.md`. The earlier branches represent earlier editorial passes and are superseded by it.

## Recommended end state for `main`

**Replace `main` with `yet-another-dry-run` (minus the repo-internal dry-run record).** The course prose — on the `playwright-dry-run-edits` branch of `stevekinney.net` — has been rewritten to match this end state: labs like "harden the flaky rate-book test" now read as "the starter ships the hardened version; rebuild it from the rough snippet in the lesson," not as "the starter ships the broken version and you fix it in place."

Concretely, do the following in order:

### 1. Clean the dry-run artifacts out of `yet-another-dry-run`

These files exist on `yet-another-dry-run` only to track the dry-run process and should not ship to readers:

- `DRY-RUN-NOTES.md`
- `RECONCILIATION.md` (this file)

Both should be deleted before the merge to `main`.

### 2. Fast-forward `main` to the cleaned tip

```sh
git checkout main
git merge --ff-only yet-another-dry-run
git push origin main
```

If the merge is not a fast-forward, rebase `yet-another-dry-run` on `main` first and re-run the full local + hosted CI loop before pushing.

### 3. Delete the obsolete dry-run branches

Once `main` matches the desired end state:

```sh
git branch -D dry-run steve/second-dry-run steve/third-dry-run steve/fourth-dry-run
git push origin --delete dry-run steve/second-dry-run steve/third-dry-run steve/fourth-dry-run
```

`yet-another-dry-run` itself can be deleted after the fast-forward merge lands on main.

### 4. Keep `planted-bug/admin-feature`

The planted-bug branch is a deliberate teaching artifact for Module 7's Bugbot lab. Do **not** delete it. Rebase it onto the new `main` so the base diff only contains the planted permission bug:

```sh
git checkout planted-bug/admin-feature
git rebase main
git push --force-with-lease origin planted-bug/admin-feature
```

The Bugbot lab instructs the student to open a pull request from `planted-bug/admin-feature` into `main`. That PR has never been opened in this dry run because the committee-review pre-tool hook blocks unmediated PR creation; opening it is a manual follow-up for the user.

## Why ship the full Phase 10 end state on `main` instead of a staged Phase 0 baseline

The roadmap framing in `ROADMAP.md` originally suggested shipping `main` as Phase 0 — a rich-but-unhardened baseline — and having each lab land its own phase on top. That framing had two problems in practice:

1. **Readers clone `main` and run `npm run test`.** If the starter ships with half the static layer missing, the clean-clone experience is a red suite, which teaches the reader that `main` is broken. The right clean-clone experience is a green suite and a pile of lessons that explain _how_ the green suite works.
2. **The labs already assume the end state exists.** `lab-harden-the-flaky-rate-book-test.md` now says "the starter ships with a hardened `rate-book.spec.ts`; study it if you want to see the target." `lab-wrap-a-custom-verification-mcp.md` says "Shelf keeps this server in `tools/shelf-verification-server/server.ts`." Every lab's "one thing to remember" points at an end state the student is expected to reach, not an end state the student is expected to ship first. Matching `main` to the end state lets the labs read as walkthroughs of concrete code, not as speculative exercises.
3. **The capstone requires the reading-goals feature to already exist in the app domain.** The whole capstone is about an agent building it from scratch, but the schema, the admin gate, and the `/goals` routes are part of what the student is asked to _read_ in the middle of the workshop. Shipping them on `main` gives the student ground truth to compare against.

If this decision looks wrong in retrospect, the alternative is to split `main` into ~15 commits, each tagged as "end of Checkpoint X," and teach the student to `git checkout` the right commit before each lab. That's possible, but it adds a whole navigation layer the course prose doesn't currently describe.

## Course content reconciliation

The course prose on `stevekinney.net/playwright-dry-run-edits` has been updated throughout the dry run. A full list of the changes:

### Files edited with dry-run framing removed

- `lab-rewrite-the-bad-claude-md.md`
- `storage-state-authentication.md`
- `lab-harden-the-flaky-rate-book-test.md`
- `the-waiting-story.md`
- `deterministic-state-and-test-isolation.md`
- `visual-regression-as-a-feedback-loop.md`
- `lab-wire-visual-regression-into-the-dev-loop.md`
- `writing-a-custom-mcp-wrapper.md`
- `lab-wrap-a-custom-verification-mcp.md`
- `failure-dossiers-what-agents-actually-need-from-a-red-build.md`
- `lab-build-a-failure-dossier-for-shelf.md`
- `tuning-bugbot-for-your-codebase.md`
- `lab-bugbot-on-a-planted-bug.md`
- `lab-wire-the-static-layer-into-shelf.md`
- `lab-wire-the-static-layer-into-shelf.md`
- `runtime-probes-in-the-development-loop.md`
- `lint-and-types-as-guardrails.md`
- `ci-as-the-loop-of-last-resort.md`
- `lab-write-the-ci-workflow-from-scratch.md`
- `capstone-the-whole-loop-end-to-end.md`
- `performance-budgets-as-a-feedback-loop.md`
- `lab-add-performance-budgets-to-shelf.md`

Every `> [!NOTE] Third dry run validation` callout has been either removed (when the content was purely about the QA pass) or rewritten into author-voice prose that still teaches the underlying fact (when the content was useful).

### Assets regenerated

Fresh captures committed on the course branch:

- `assets/lab-visual-regression-shelf-page.png`
- `assets/lab-visual-regression-shelf-page-diff.png`
- `assets/capstone-goals-page.png`
- `assets/capstone-shelf-reading-goal.png`
- `assets/capstone-admin-goals-page.png`

### Remaining nice-to-have

- `assets/lab-custom-mcp-public-shelf.png` was not regenerated — the existing asset is still close enough to what `/shelf/[username]` renders that readers won't be confused, but a fresh capture would be tighter.
- `assets/lab-failure-dossier-report.png` was not regenerated; the dossier pipeline landed in Checkpoint G with a working output but the HTML report screenshot carries over from the previous pass.
- `assets/lab-harden-rate-book-success.png` was not regenerated; the hardened rate-book test now runs against the real modal and API, but the success-state screenshot carries over.

These three assets are flagged for a future tidy pass rather than being blocking drift. They're visibly correct against the current shelf surface even if they could be sharper.

## Known limitations this dry run could not fully exercise

- **Bugbot hosted loop** — `.cursor/BUGBOT.md` ships, the planted-bug branch exists, both branches are pushed to `origin`. Opening the actual PR and watching Bugbot comment is a manual step because the committee-review pre-tool hook blocks direct `gh pr create`.
- **Post-deploy smoke check against a hosted target** — `npm run test:smoke` and `playwright.smoke.config.ts` work against a local preview. There is no hosted deploy target. `docs/post-deploy-playbook.md` flags this explicitly so the user knows which lines to replace when a deploy lands.
- **Nightly `har-refresh` and `dependency-audit` jobs** ship as echo / `npm audit --audit-level=high` placeholders. The lab's acceptance criteria accept this deliberately.

## Suggested order of operations for the user

1. Read `DRY-RUN-NOTES.md` to see the full per-checkpoint log, then delete it.
2. Read this file, delete it, and decide whether to accept the Option-C recommendation (fast-forward `main` to `yet-another-dry-run`) or to split the starter into staged commits.
3. If accepting Option C: run the "Recommended end state for `main`" steps above.
4. Manually open the Bugbot lab PR from `planted-bug/admin-feature` and watch the hosted review loop fire.
5. Decide whether to regenerate the three remaining asset nice-to-haves.
6. Merge the `playwright-dry-run-edits` branch of `stevekinney.net` into whatever branch publishes the course site.
