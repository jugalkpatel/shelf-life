# Shelf

Shelf is the starter SvelteKit application for the [**Self-Testing AI Agents**](https://stevekinney.com/courses/self-testing-ai-agents) course. The repository is intentionally small on day one: a working app shell, a few protected routes, and a tiny Playwright smoke loop that later lessons expand.

## Starter routes

- `/`: public home page
- `/login`: app-native email and password authentication
- `/search`: protected starter search surface
- `/shelf`: protected shelf shell
- `/design-system`: component gallery for later UI exercises
- `/playground`: locator-practice page used later in the course

## What is intentionally not built yet

This starter is meant to grow with the course. These pieces are added later:

- live [Open Library](https://openlibrary.org/) search integration
- shelf CRUD flows and persisted ratings
- stats, goals, and admin features
- storage-state auth for Playwright
- HAR recording
- accessibility automation
- visual regression
- performance budgets
- failure dossiers
- static-layer extras like hooks, secret scanning, and dead-code checks
- CI wiring
- custom verification MCP tools

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

Required variables:

- `DATABASE_URL`
- `ORIGIN`
- `BETTER_AUTH_SECRET`

The local `.env` file in this repository is set up for development with a local SQLite database.

## Local development

Install dependencies with npm:

```sh
npm install
```

Generate the Better Auth schema if needed:

```sh
npm run auth:schema
```

Start the development server:

```sh
npm run dev
```

## Open the database in Drizzle Studio

If you want to inspect the local SQLite database in a browser, Drizzle Studio is the quickest way to do it.

Make sure the schema exists first:

```sh
npm run db:push
```

Start Drizzle Studio:

```sh
npm run db:studio
```

Drizzle Studio will print a local URL in the terminal. Open that URL in your browser, then use the `user` table to inspect or edit reader accounts.

## Promote a reader to administrator

**How administrator access works today:** Shelf stores administrator access directly on the `user.isAdmin` column.

To promote a local account:

- Create the account through `/login` first if it does not exist yet.
- Open Drizzle Studio with `npm run db:studio`.
- Open the `user` table.
- Find the row for the account you want to promote.
- Change `isAdmin` to `true`.
- Save the row.
- Sign out, then sign back in so the next request picks up the updated user row.

## Verification commands

Run these before considering a change complete:

```sh
npm run typecheck
npm run lint
npm run test
```

If you only need the browser layer:

```sh
npm run test:e2e
```

## Testing notes

- Unit tests run with Vitest.
- End-to-end tests run with Playwright from `tests/end-to-end`.
- The default Playwright suite is intentionally small and only covers public starter routes.
- Later course labs add the larger Playwright setup, extra scripts, and the stricter verification loop.
