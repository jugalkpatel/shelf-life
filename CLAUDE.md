# Shelf Starter Instructions

Shelf is the starter repository for the **Self-Testing AI Agents** course. It is a real SvelteKit + TypeScript book application, not a generated scaffold.

## What "done" means

A task is not done until all three exit zero, in this order:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`

Do not report a task complete with any of these failing. If a failure looks unrelated, say so explicitly and link the failing test name in your summary.

## Routes

- Public: `/`, `/login`, `/design-system`
- Protected: `/search`, `/shelf` — gate server-side on `locals.user`, never with client guards
- Do not reintroduce `src/routes/demo/` or any generated starter pages
- New routes must match the Shelf product domain (books, shelves, ratings), not generic examples

## How tests get written

- Write a failing test before the implementation. Commit the test first.
- Unit tests live next to the file under test as `<name>.test.ts` and run with Vitest.
- End-to-end tests live in `tests/end-to-end/` and run with Playwright.
- Test fixtures live in `tests/fixtures/`. Share data there instead of redefining it per spec.

## Playwright locator rules

- `getByRole` first. `getByLabel` or `getByText` second. `data-testid` only when semantics genuinely don't exist.
- Never use raw CSS or XPath selectors in specs.
- Never use `page.waitForTimeout`. Use `expect(locator).toBeVisible()`, `page.waitForResponse`, or `page.waitForRequest`.
- When a Playwright test fails, open `playwright-report/index.html` and its trace before proposing a fix.

## UI and components

- Reuse the primitives in `src/lib/components/` (e.g. `button.svelte`, `book-card.svelte`, `input.svelte`). Do not introduce parallel components.
- When adjusting primitives, mirror the change in `src/routes/design-system/` so the gallery stays the visual-regression baseline.
- Do not add an external component framework.

## UI copy

- User-facing copy stays about books, shelves, and reading. Do not mention Playwright, seeded fixtures, test IDs, HARs, course modules, or dry-run notes in page copy.
- Testing rationale, course notes, and infrastructure details belong in code comments, `CLAUDE.md`, or `README.md` — never in rendered UI.

## Do not

- Do not silence type errors with `any` or `@ts-expect-error`. Fix the type.
- Do not add `eslint-disable` comments. Fix the code.
- Do not add new dependencies without flagging it in your summary.
- Do not modify `src/lib/server/db/auth.schema.ts` by hand — regenerate with `npm run auth:schema`.
