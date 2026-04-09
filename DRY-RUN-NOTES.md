# Dry Run Notes: Self-Testing AI Agents Course

Working log for the course walkthrough. Walks `index.toml` in order. One section per lesson/lab.

Status legend:

- ✅ clean — no drift, no fix needed
- 🔧 fixed inline — drift patched on `playwright-dry-run-edits`
- 🛠 shelf work — code change landed on `yet-another-dry-run`
- ⚠️ needs user attention — flagged for review before publish
- ⏸ prose-only (not executed) — could not run end-to-end

Shelf branch: `yet-another-dry-run` · Course branch: `playwright-dry-run-edits`

## Checkpoint A — Framing and instructions

### `the-hypothesis.md`

- ✅ Prose-only, conceptual. Only state claim is "small SvelteKit + TypeScript book-rating app called Shelf with Vitest + Playwright" — matches.

### `instructions-that-wire-the-agent-in.md`

- ⚠️ The illustrative "what green means" block (lines 54–68 and 97–104) lists `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` as four separate commands. Shelf's `npm run test` script already chains `test:unit && test:e2e`, so a reader who copies the four-command block verbatim will run e2e twice. The lesson uses this as a teaching template rather than as "the exact Shelf commands," so it's not broken — just worth knowing. Flagged for author review rather than silently changing, because the prose "a task is not done until all four of these exit zero" is pedagogically deliberate.

### `lab-rewrite-the-bad-claude-md.md`

- 🛠 Rewrote `shelf-life/CLAUDE.md` against the lab's full acceptance checklist. New file is 52 lines, contains a numbered "What 'done' means" block naming `npm run typecheck`, `npm run lint`, `npm run test`, a Playwright locator rule naming `getByRole`/`getByLabel`/`data-testid`, a TDD/test-layout rule, a UI-copy rule keeping course and test language out of rendered pages, and negative rules ("do not ... `eslint-disable`", etc.). Every named path resolves except the deliberately-negated `src/routes/demo/` (a do-not-reintroduce rule).
- 🛠 Created `tests/fixtures/README.md` because the new `CLAUDE.md` references the directory and the lab's stretch goals also assume it exists ("Shelf has a `tests/fixtures/` directory that's underused"). Previously missing — drift between the stretch-goal claim and actual repo state.
- 🔧 None needed on the lab prose itself — the acceptance-criteria grep/`wc`/`ls` probes all run cleanly against the rewritten `CLAUDE.md`.

**Side finding — local DB drift:** `npm run test:e2e` ran `drizzle-kit push --force`, which **dropped** `featured_book`, `user_profile`, `reading_goal` tables plus several columns on `book` and `shelf_entry` from the local SQLite. The schema code in `src/lib/server/db/schema.ts` does not declare any of those — someone previously began implementing part of the richer shelf app, then reverted the code without resetting the local DB. Nothing broken (tests pass, schema now matches code), but worth noting because later checkpoints (reading goals, stats, Open Library metadata like `published_year`/`source`) will need to re-introduce some of those tables.

**Verification:** `npm run typecheck` ✓ (0 errors), `npm run lint` ✓, `npm run test` ✓ (12 unit + 5 e2e pass).

**Probes against acceptance checklist:**

- `wc -l CLAUDE.md` → `52` (≤60 ✓)
- `grep -iE 'clean|best practices|good|appropriate' CLAUDE.md` → no matches ✓
- Every `npm run <cmd>` cited resolves to a real `package.json` script ✓
- Every resolving path (`src/lib/components/`, `src/routes/design-system/`, `tests/end-to-end/`, `tests/fixtures/`, `src/lib/server/db/auth.schema.ts`, `playwright-report/index.html`) exists ✓
- `grep -E 'getByRole|getByLabel|data-testid' CLAUDE.md` → 1 hit ✓
- Has a Playwright locator rule, a TDD rule, a UI-copy rule, and a "do not" rule ✓
