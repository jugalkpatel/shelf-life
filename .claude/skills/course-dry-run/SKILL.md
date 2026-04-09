---
name: course-dry-run
description: Walk the Self-Testing AI Agents course end-to-end against the current shelf-life main, patch drift, audit prose for unexplained code, and reconcile main. Use when the user asks to "dry-run the course", "rerun the dry run", "validate the course against the starter", or any equivalent phrasing about reconciling shelf-life with /Users/stevekinney/Developer/stevekinney.net/courses/self-testing-ai-agents.
---

# Course dry-run

Repeatable validation pass for the **Self-Testing AI Agents** course. The job is to walk every lesson and lab against the actual `shelf-life` starter, patch whatever drifts, audit the prose for "unexplained code" the labs ask readers to write, and reconcile `main` so a fresh clone walks the course cleanly.

## The two repositories

- **Code:** `/Users/stevekinney/Developer/shelf-life` — SvelteKit + TypeScript book app, the starter a reader clones at the beginning of the course.
- **Course:** `/Users/stevekinney/Developer/stevekinney.net/courses/self-testing-ai-agents` — 46 lesson + lab markdown files plus assets in `./assets/`. Use `index.toml` as the canonical walk order.

## Working branches

- Create a dry-run working branch on shelf-life: `dry-run/<short-slug>` off current `main`.
- Do course prose edits on the existing `playwright-dry-run-edits` branch of `stevekinney.net`, or a new branch if that one is stale.
- Do not touch `main` on either side until the reconciliation phase.

## The four phases

### Phase 1 — Walk every lesson and lab against the real shelf-life state

Walk `index.toml` in order, grouping related lessons into checkpoints: framing → pyramid → Playwright armor → visual regression → performance budgets → runtime + MCP → failure dossiers → review agents → static layer → CI → post-deploy → capstone → appendices.

For every lesson + lab pair:

1. Read the file front to back.
2. Reality-check every concrete claim against shelf-life: every file path referenced should exist, every `npm run X` script should exist and do what the lesson says, every shell command in a fenced block should run successfully, every screenshot should match what the reader will actually see.
3. Execute the lab as a reader would. If the starter already ships the lab's end state, verify the shipped file does what the lab describes. If it does not yet ship, build it and commit.
4. After each lab lands, run: `npm run typecheck && npm run lint && npm run knip && npm run test`. All four must exit zero before moving on.
5. Record findings in `shelf-life/DRY-RUN-NOTES.md` as you go — one section per lesson/lab in `index.toml` order. Status legend: ✅ clean, 🔧 fixed inline, 🛠 shelf code change, ⚠️ needs user attention, ⏸ prose-only.

### Phase 2 — Prose audit for "unexplained code"

After Phase 1 is done, do a prose audit with this single question for every lesson + lab pair: **does the lesson introduce every piece of code, config, API, file path, and command that the matching lab asks the reader to write?**

Dispatch an Explore agent to walk all 46 files systematically. The report should rank gaps by severity: CRITICAL (blocks lab completion), MODERATE (requires external knowledge), MINOR (would smooth the experience). For each gap, include a direct quote from the lab and explain what the lesson is missing.

Failure modes to watch for:

- Lab asks for a script that parses some tool's JSON output; lesson never shows the schema or a walk of the structure.
- Lab asks for config values the lesson names but never explains.
- Lab asks for an ESLint selector, GitHub Actions YAML, Playwright projects block, or markdown playbook structure the lesson mentions in prose but never shows in code.
- Lab references a file path the lesson says "you'll see" but never introduces.

### Phase 3 — Fill every gap

For each gap Phase 2 surfaces:

- If CRITICAL or MODERATE: add the code to the lesson body. Show the actual schema, the actual walk, the actual selector, with plain-English explanation of why each piece matters. Cross-reference the shipped file in the starter using the pattern "Shelf ships X; read the sketch above to understand the walk, then open the shipped file to see the production shape."
- If MINOR: either show the code or reframe the lab to point at a specific lesson section and shipped file.

Then walk every lab one more time asking "is there anything the reader would still have to invent?" Where a lab still asks for speculative work, rewrite as a walkthrough of the shipped file with section-specific pointers back to the lesson.

Also regenerate any course assets that drifted from the current UI. Capture via Playwright against a live preview server:

```sh
ENABLE_TEST_SEED=true npm run preview -- --host 127.0.0.1 --port 4173 &
curl -s -X POST http://127.0.0.1:4173/api/testing/seed -H "Content-Type: application/json" -d '{"resetUsers": true}'
```

Then drive a headless Playwright browser through the flows and screenshot into the course's `assets/` directory.

### Phase 4 — Reconcile `main`

Look at all dry-run branches in shelf-life (`git branch -a`). Compare their tips. They should converge on roughly the same file set. If your current dry-run branch's tip represents the desired starter state:

1. Delete `DRY-RUN-NOTES.md` and any other dry-run-internal files on a `starter-baseline` branch off your dry-run working branch.
2. Run all four gates green on `starter-baseline`.
3. Fast-forward `main` to `starter-baseline` (or force-push if history rewrote).
4. Rebase `planted-bug/admin-feature` onto the new `main` with `--force-with-lease`.
5. Delete all legacy dry-run branches locally and on origin, except `planted-bug/admin-feature`.
6. Clean-clone `main` into `/tmp/shelf-main-verify`, run `npm install` and all four gates, confirm green.
7. Verify hosted CI on `main` is green via `gh run list --branch main --limit 1`.

## Hard gates

Pause and ask the user before any of these. Everything else is fair game.

- First push of any new branch to `origin`.
- Opening any pull request. The committee-review pre-tool hook will block `gh pr create` — log it and keep going, do not try to work around it. The Bugbot lab explicitly expects the reader to open that PR by hand.
- Force-pushing `main`.
- Deleting branches from `origin`.

## Operating rules

- When the user locks in a decision via `AskUserQuestion` (force-push approved, delete legacy branches, fix all gaps in one pass), treat it as authoritative for the rest of the session. Do not ask twice.
- Never use `--no-verify`. When the pre-commit hook complains, fix the underlying issue. The only exception is the bootstrap commit that lands `.husky/pre-commit` itself, which is a no-op through `lint-staged`.
- When `gh pr create` is blocked by the committee-review hook, log the URL (`https://github.com/stevekinney/shelf-life/pull/new/<branch>`) and continue. Opening the PR is a manual user follow-up.
- When checkpoint work produces drift between lesson prose and shipped code, **edit the prose to match the shipped code**, not the other way around. The ground truth is what a reader will see when they clone `main`.
- When you finish a checkpoint, report a short summary (what fired, what drifted, what committed). Do not pause for permission between checkpoints unless you hit a hard gate.
- For checkpoints that reference external tooling (Bugbot, post-deploy targets, review bots), treat unavailable tooling as a known limitation and record it in `DRY-RUN-NOTES.md` under "⚠️ needs user attention" — do not stub around it.

## Known recurring pitfalls

**Cross-platform visual regression.** Darwin-captured screenshot baselines fail on GitHub Actions Ubuntu runners because Playwright appends a `-linux` suffix. Generate Linux baselines via the Playwright Docker image:

```sh
docker run --rm -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v<current-version>-jammy bash -lc '
  cat > .env <<EOF
DATABASE_URL=file:./tmp/linux.db
ORIGIN=http://127.0.0.1:4173
BETTER_AUTH_SECRET=ci-test-secret-ci-test-secret-ci-test-secret-32chars
ENABLE_TEST_SEED=true
OPEN_LIBRARY_BASE_URL=https://openlibrary.org
EOF
  mkdir -p tmp
  npm ci --ignore-scripts
  npx drizzle-kit push --force
  npx playwright test --update-snapshots --project=setup --project=public --project=authenticated
'
```

Commit both `-darwin.png` and `-linux.png` baselines side by side. If residual pixel drift remains between the Docker image and the GitHub Actions runner image, set `maxDiffPixelRatio: 0.01` in the global `toHaveScreenshot` config. Note that running `npm ci` inside the Linux container will overwrite native extensions for macOS — you'll need to `rm -rf node_modules && npm install` on the host afterwards to restore Darwin binaries.

**Gitleaks CI step.** `gitleaks/gitleaks-action@v2` does a partial scan over `<prev>^..<current>` that fails on first-push branches. Use a direct CLI invocation instead:

```yaml
- name: Install gitleaks
  run: |
    curl -sSL https://github.com/gitleaks/gitleaks/releases/download/v8.28.0/gitleaks_8.28.0_linux_x64.tar.gz \
      | tar -xz -C /tmp gitleaks
    sudo install /tmp/gitleaks /usr/local/bin/gitleaks
- name: Secret scan
  run: gitleaks dir . --redact --config .gitleaks.toml
```

**Pre-commit hook clobbering `prepare`.** Running `npx husky init` will overwrite the `prepare` script in `package.json` with just `husky`. Restore `playwright install` and `svelte-kit sync` afterwards: `"prepare": "husky && (playwright install || echo '') && (svelte-kit sync || echo '')"`.

**Course-prose framing.** The published course should contain zero mentions of "dry run", "Third dry run validation", "current Shelf replay", or "validated Shelf repo". These are internal QA artifacts. Strip them inline as you find them.

## What "done" means

All of the following must be true before you report the pass complete:

- Clean clone of `main` passes `npm run typecheck && npm run lint && npm run knip && npm run test` on first try.
- Hosted CI on `main` is green.
- `planted-bug/admin-feature` rebased cleanly onto new `main`, single-commit diff is just the permission-check swap.
- No dry-run-internal files on `main` (`DRY-RUN-NOTES.md`, `RECONCILIATION.md`, etc. are absent).
- Only `main` and `planted-bug/admin-feature` branches exist locally and on `origin`.
- Every course lesson referenced by a lab either shows the code the lab asks for, or points at a specific file in `main` the lab can be rebuilt from.
- Every screenshot in `courses/self-testing-ai-agents/assets/` matches what the current `main` renders.
- Zero remaining "Third dry run" or "dry-run validation" callouts in published course prose.
- `DRY-RUN-NOTES.md` on the working branch records every checkpoint with status and commit hashes, so the user can review the cumulative diff before the reconciliation commit deletes the file.

## How to start

1. Read `index.toml` at `/Users/stevekinney/Developer/stevekinney.net/courses/self-testing-ai-agents/index.toml`.
2. `git branch -a` on shelf-life to see the current branch state.
3. `gh run list --branch main --limit 3` to see the current hosted CI state.
4. Draft a plan using ExitPlanMode. Include the four-phase structure above and any checkpoint-specific decisions the current code state forces.
5. Proceed through the phases once the plan is approved. Report progress after each phase completes.
