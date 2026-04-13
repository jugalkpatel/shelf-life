# Playwright Recipes

This checklist is intentionally exhaustive for the current Shelf application. It mixes end-to-end browser coverage, API coverage through Playwright's `request` client, accessibility checks, visual baselines, performance budgets, and course-lab safety checks.

Use this legend:

- `[ ]` already covered by a committed Playwright spec
- `[ ]` not covered yet, or not covered completely enough

## Suite Foundations And Fixtures

- [ ] Seed a stable authenticated reader session and persist storage state for the main authenticated project.
- [ ] Seed a stable authenticated administrator session and persist storage state for the administrator lab project.
- [ ] Replay Open Library search results from a HAR fixture so search tests do not depend on the live network.
- [ ] Reset shelf content through the testing seed endpoint before mutation-heavy specs.
- [ ] Capture browser console errors, page errors, and failed requests through the shared fixture layer.
- [ ] Add an anonymous-only project with no stored session so redirect behavior can be asserted without hand-rolled setup.
- [ ] Add a second non-admin reader fixture so cross-user authorization and isolation can be tested directly.
- [ ] Add a helper that seeds a completely empty shelf for empty-state specs without deleting records inline in each test.
- [ ] Add a helper that seeds multiple years of `finishedAt` data so reading-goal year-boundary tests are deterministic.
- [ ] Add Open Library fixtures for zero results, timeout, non-2xx responses, missing descriptions, missing authors, and missing publication years.
- [ ] Add a helper that asserts live-region status messages consistently across add, rate, mark-read, remove, and save-goal flows.
- [ ] Add a helper that measures and fails on unexpected console warnings in the core smoke journey, not just hard errors.
- [ ] Add a mobile viewport project and a tablet viewport project so layout regressions are first-class, not ad hoc.
- [ ] Add a reduced-motion project so motion-sensitive regressions can be caught deliberately.
- [ ] Add a JavaScript-disabled project so progressive-enhancement behavior is tested intentionally instead of by accident.
- [ ] Add an offline or throttled-network project for resilience specs.
- [ ] Add a helper that freezes time or seeds deterministic timestamps for visual and year-boundary assertions.
- [ ] Add a helper that seeds public-handle collisions, such as `alice@example.com` and `alice@other.com`, so ambiguous public shelf URLs can be exercised.
- [ ] Add a helper that fails the suite on hydration-mismatch warnings in the browser console.
- [ ] Add a raw API request fixture for anonymous, reader, non-owner reader, and administrator callers so permission tests stay easy to write.
- [ ] Add a visual helper that waits for web fonts and layout stability before taking screenshots.
- [ ] Add a contract test that verifies the testing seed endpoint itself still returns the expected seeded readers and books.

## Full User Journeys

- [ ] Existing reader can sign in, search for a book, add it to the shelf, rate it, mark another book as read, set a yearly goal, and sign out in one uninterrupted flow.
- [ ] New reader can start from the public homepage, create an account, land on the originally requested protected page, add a first book, and see the shelf summary update.
- [ ] Reader with an empty shelf can move from the shelf empty state to search, add a book, and return to a non-empty shelf.
- [ ] Administrator can sign in and successfully reach the administrator goals dashboard from the primary navigation or direct URL.
- [ ] Logged-out visitor can browse public pages, attempt a protected route, sign in, and be returned to the exact nested destination.
- [ ] Reader can log out and confirm that back-navigation does not restore protected content from session state.
- [ ] Reader can finish enough books to meet the yearly goal and immediately see the green goal-met treatment on both `/shelf` and `/goals`.
- [ ] Reader can open their public shelf in a second anonymous browser context and verify private mutations appear only after the next server render.
- [ ] Reader can fail a sign-in attempt, recover with valid credentials, and still land on the original protected destination.
- [ ] Administrator can feature a book through the API, refresh the public homepage, and see the featured ordering update.

## Public Shell And Home Page

- [ ] Public homepage reads like a real application and does not advertise design-system or playground routes in the primary navigation.
- [ ] Public homepage hero shows a visible `Sign in` call to action in the main content area.
- [ ] Header `Sign in` button uses accessible foreground and background contrast.
- [ ] Header `Sign in` button navigates to `/login`.
- [ ] Hero `Sign in` button navigates to `/login`.
- [ ] Signed-out primary navigation exposes the expected public links and nothing else.
- [ ] Signed-in primary navigation exposes the expected authenticated links and authenticated account affordances.
- [ ] Brand link in the header returns to `/` from every major route.
- [ ] Active navigation styling follows the current route for `Home`, `Search`, `Shelf`, and `Goals`.
- [ ] Search stays visible in the primary navigation for both signed-out and signed-in readers.
- [ ] Shelf and Goals links are absent from the primary navigation when the reader is signed out.
- [ ] Header shows the signed-in reader's display name and email address.
- [ ] Signed-in shell shows `Sign out` and hides header-level `Sign in`.
- [ ] Signed-out shell shows header-level `Sign in` and hides reader identity metadata.
- [ ] Public homepage featured-book cards render title, author, and description consistently.
- [ ] Public homepage featured-book cards remain ordered by their configured featured-book position.
- [ ] Public homepage featured-book cards render status chips when the featured data includes a shelf status.
- [ ] Public homepage featured-book cards render ratings when the featured data includes a rating.
- [ ] Public homepage hero and featured sections still load correctly for signed-in readers viewing `/`.
- [ ] Direct navigation to `/design-system` still works even though it is not in the primary navigation.
- [ ] Direct navigation to `/playground` still works even though it is not in the primary navigation.
- [ ] Public homepage has no horizontal overflow at narrow mobile widths.
- [ ] Public homepage has no unexpected console errors or failed requests during a clean load.
- [ ] Public homepage renders correctly when there are zero featured books.
- [ ] Public homepage renders correctly when featured books contain very long titles or author names.
- [ ] Public homepage still looks intentional after the recent corner-radius reductions.
- [ ] Header remains sticky and usable after scrolling a long page.

## Error Pages

- [ ] Unknown route renders the custom 404 page with product-facing copy instead of framework defaults.
- [ ] 404 page preserves brand shell and a clear recovery path back into the app.
- [ ] Unexpected server failure renders the custom error page without leaking a stack trace.
- [ ] Signed-in non-administrator hitting an administrator route receives a coherent `403` page instead of a generic framework error.
- [ ] Error pages still include the shared brand shell and a working home link.
- [ ] Error page layout remains usable on mobile widths.

## Authentication And Redirect Safety

- [ ] Anonymous visitor hitting `/search` is redirected to `/login?returnTo=%2Fsearch`.
- [ ] Anonymous visitor hitting `/shelf` is redirected to `/login?returnTo=%2Fshelf`.
- [ ] Creating an account from a protected route returns the reader to the originally requested destination.
- [ ] Login page renders the expected email, password, display-name, sign-in, and create-account controls.
- [ ] Anonymous visitor hitting `/goals` is redirected to `/login?returnTo=%2Fgoals`.
- [ ] Anonymous visitor hitting `/admin/goals` is redirected to `/login?returnTo=%2Fadmin%2Fgoals`.
- [ ] Already-authenticated reader visiting `/login` is redirected to `/shelf`.
- [ ] Already-authenticated reader visiting `/login?returnTo=%2Fsearch%3Fquery%3Dpiranesi` is redirected to `/search?query=piranesi`.
- [ ] Valid sign-in with seeded reader credentials lands on `/shelf`.
- [ ] Valid sign-in with seeded administrator credentials lands on `/shelf` or the requested destination.
- [ ] Hidden `returnTo` input is present on the login form and contains the normalized destination.
- [ ] Email input is trimmed before sign-in.
- [ ] Email input is trimmed before account creation.
- [ ] Display name input is trimmed before account creation.
- [ ] Account creation immediately establishes an authenticated session without a second sign-in step.
- [ ] Sign-in failure stays on `/login` and does not partially navigate.
- [ ] Invalid email address shows a clear validation error on the login page.
- [ ] Wrong password shows a clear error without a broken layout or silent failure.
- [ ] Unknown email address shows a clear sign-in failure state.
- [ ] Duplicate email on account creation shows a clear error without creating a second account.
- [ ] Blank display name on account creation still succeeds and falls back to `Shelf reader`.
- [ ] Blank password on sign-in shows a visible failure state.
- [ ] Blank password on account creation shows a visible failure state.
- [ ] Very short password on account creation surfaces the Better Auth validation error cleanly.
- [ ] Email field value is preserved after a failed authentication attempt.
- [ ] `returnTo` value is preserved after a failed authentication attempt.
- [ ] Pressing Enter in the login form submits the correct action.
- [ ] Pressing Enter while focused in `Display name` still submits the primary sign-in action unless the secondary button is explicitly chosen.
- [ ] External `returnTo` value is rejected and replaced with the default authenticated destination.
- [ ] Protocol-relative `returnTo` value is rejected and replaced with the default authenticated destination.
- [ ] Malformed `returnTo` value is rejected and replaced with the default authenticated destination.
- [ ] Encoded protocol-relative `returnTo=%2F%2Fevil.example` is rejected and replaced with the default destination.
- [ ] `returnTo=/` sends the reader to the public homepage after authentication.
- [ ] `returnTo` with a hash fragment is preserved after authentication.
- [ ] Administrator can sign in with `returnTo=/admin/goals` and land there successfully.
- [ ] Root-relative nested `returnTo` with its own query string is preserved exactly.
- [ ] Login page has no unexpected console errors.
- [ ] Login page does not expose stack traces or raw backend errors when Better Auth fails unexpectedly.

## Logout And Session Boundaries

- [ ] Clicking `Sign out` returns the reader to the public homepage.
- [ ] Signing out from `/search`, `/shelf`, and `/goals` all return the reader to `/`.
- [ ] Sign-out form issues a `POST /logout` and receives the expected redirect response.
- [ ] Signing out clears session state so a direct request to `/api/shelf` returns unauthorized afterward.
- [ ] Browser back-navigation after sign-out does not reveal stale protected content.
- [ ] Multiple tabs respect sign-out, with the second tab losing access after refresh.
- [ ] `GET /logout` is rejected consistently if the route is accessed with the wrong method.

## Search Page

- [ ] HAR-backed search for `station eleven` renders Station Eleven with the expected author metadata.
- [ ] Adding a search result through the UI sends the expected `POST /api/shelf` request and announces success.
- [ ] Search page with no query shows the instructional empty state instead of stale results.
- [ ] Search page with a query that yields no matches shows the no-results empty state.
- [ ] Search count uses correct singular grammar for one result.
- [ ] Search count uses correct plural grammar for many results.
- [ ] Search box is prefilled from the `query` URL parameter on initial load.
- [ ] Submitting the search form updates the URL query parameter.
- [ ] Pressing Enter in the search field submits the form.
- [ ] Searching twice replaces the old result list instead of appending to it.
- [ ] Leading and trailing whitespace in the query is trimmed before search.
- [ ] Whitespace-only query does not call the Open Library upstream endpoint.
- [ ] Search results remain in their returned relevance order now that the layout is a true vertical list.
- [ ] Visible result count matches the number of rendered result cards.
- [ ] Search results with duplicate titles remain distinguishable by author or metadata.
- [ ] Search result with a missing author falls back to `Unknown author`.
- [ ] Search result with a missing description omits the description block cleanly.
- [ ] Search result with a missing publication year omits the year label cleanly.
- [ ] Search result docs missing both identifier and title are filtered out before rendering.
- [ ] Search result chooses `cover_edition_key` before `edition_key`, and `edition_key` before work key, when multiple identifiers exist.
- [ ] Search result already on the shelf shows `Already on your shelf`.
- [ ] Search result already on the shelf does not expose an `Add to shelf` button.
- [ ] `Add to shelf` button enters a pending state and resists double-click duplication.
- [ ] While one result is pending, other result cards remain interactive.
- [ ] Pending result button label changes to `Adding…` and reverts after completion.
- [ ] Adding a result updates the live status region with the specific book title.
- [ ] Adding a result is idempotent when the server reports the book is already shelved.
- [ ] Successful add invalidates the page so the same card flips from `Add to shelf` to `Already on your shelf`.
- [ ] API-level add failure shows the red error banner with the server error message.
- [ ] Network failure during add shows the generic network-error banner.
- [ ] Result list survives add-to-shelf mutation without losing the current query context.
- [ ] Search results tolerate very long descriptions without breaking card actions.
- [ ] Search results tolerate very long titles and author names without clipping or overlapping controls.
- [ ] Search results safely render descriptions containing HTML-like text such as `<script>` or `<em>`.
- [ ] Search results safely render apostrophes, ampersands, accented characters, and non-Latin text.
- [ ] Keyboard-only reader can tab through results and add a book without using a pointer.
- [ ] Browser back and forward navigation restore the last search query and visible results.
- [ ] Search page has no unexpected console errors in the happy path.
- [ ] Search page degrades gracefully when Open Library times out.
- [ ] Search page degrades gracefully when Open Library returns a non-2xx response.
- [ ] Search page handles special characters in the query string safely.
- [ ] Search page remains usable on narrow mobile widths.

## Shelf Page

- [ ] Reader can rate Station Eleven and the saved rating persists through the API.
- [ ] Reader can mark Piranesi as read and the saved status persists through the API.
- [ ] Reader can remove Piranesi from the shelf and the deletion persists through the API.
- [ ] Empty shelf renders the empty-state heading, body copy, and `Open search` call to action.
- [ ] Empty-shelf `Open search` call to action navigates to `/search`.
- [ ] Shelf heading uses the reader's possessive name, such as `Steve Kinney's shelf`.
- [ ] Shelf heading falls back to `Your shelf` when the reader has no display name.
- [ ] Shelf summary cards show correct totals for books on shelf, currently reading, and average rating.
- [ ] Shelf summary values update immediately after rating a book.
- [ ] Shelf summary values update immediately after marking a book as read.
- [ ] Shelf summary values update immediately after removing a book.
- [ ] Shelf average rating rounds or formats consistently when multiple rated books exist.
- [ ] Shelf entries render in `updatedAt` descending order.
- [ ] Status chip correctly distinguishes `To read`, `Currently reading`, and `Finished`.
- [ ] Rating badge is hidden when an entry has no rating.
- [ ] Rating badge appears after a successful save.
- [ ] `Mark as read` action disappears once an entry is already finished.
- [ ] `Rate this book`, `Mark as read`, and `Remove from shelf` disable only on the pending entry.
- [ ] `Mark as read` preserves any existing rating on the same shelf entry.
- [ ] Marking a book as read updates the reading-goal progress card on the shelf page.
- [ ] Removing a finished book updates the reading-goal progress card on the shelf page.
- [ ] Shelf goal card shows the no-goal helper copy and no progress bar when the reader has not set a target.
- [ ] Shelf goal card shows a green progress bar and goal-met pill when the target has been met.
- [ ] `Update your reading goal` link navigates to `/goals`.
- [ ] Removing the last remaining entry transitions the page into the empty shelf state.
- [ ] Shelf mutations announce clear live-region feedback for rate, mark-read, and remove.
- [ ] Rate failure shows the red error banner and leaves the dialog state recoverable.
- [ ] Mark-read failure shows the red error banner and leaves the card unchanged.
- [ ] Remove failure shows the red error banner and leaves the card visible.
- [ ] Network failure during any shelf mutation shows the generic network-specific error copy.
- [ ] Shelf page remains correct after a full browser reload following mutations.
- [ ] Opening the rate dialog for a second card switches the active dialog target cleanly.
- [ ] Removing the entry that is currently targeted by the dialog closes that dialog.
- [ ] Shelf page handles very long book titles without breaking the action row.
- [ ] Shelf page handles very long author names without clipping metadata.
- [ ] Shelf page safely renders descriptions containing quotes, angle brackets, and unicode punctuation.
- [ ] Shelf page has no unexpected console errors.
- [ ] Shelf page remains usable on narrow mobile widths.

## Rate-Book Dialog

- [ ] Opening the rating dialog moves focus into the dialog.
- [ ] Rating dialog is labelled with the target book title.
- [ ] Existing rating is preselected when reopening the dialog for a previously rated book.
- [ ] `Save rating` is disabled until a rating choice is made.
- [ ] Dialog presents exactly five radio choices, labeled `1 star` through `5 stars`.
- [ ] `Cancel` closes the dialog without mutating the shelf entry.
- [ ] Pressing Escape closes the dialog without mutating the shelf entry.
- [ ] Arrow-key navigation moves between radio choices inside the dialog.
- [ ] Tab order stays inside the dialog while it is open.
- [ ] Successful save closes the dialog automatically.
- [ ] Failed save keeps the dialog open and surfaces a visible error state.
- [ ] Focus returns to the triggering `Rate this book` button after the dialog closes.
- [ ] Only one rating dialog can be open at a time.
- [ ] Dialog radio inputs are keyboard-accessible without pointer interaction.

## Reading Goals

- [ ] `/goals` renders the current-year goal summary, progress metrics, and editable goal field.
- [ ] Setting a valid goal saves successfully and updates the visible target.
- [ ] Updating an existing goal overwrites the previous target instead of duplicating it.
- [ ] Goal-save success appears with the green status treatment and without a full page reload.
- [ ] Goal validation failure appears with the red error treatment and without a full page reload.
- [ ] Goal value `0` is rejected.
- [ ] Goal value `1000` is rejected.
- [ ] Negative goal values are rejected.
- [ ] Non-integer goal values are rejected.
- [ ] Blank goal submissions are rejected.
- [ ] Decimal goal values are rejected even when they parse to a number.
- [ ] Valid goal submissions tolerate surrounding whitespace.
- [ ] Goal form can be submitted by pressing Enter.
- [ ] Progress bar width matches the completed-to-target ratio.
- [ ] Progress percentage rounds to the nearest whole number.
- [ ] Progress percentage is capped at `100`.
- [ ] Progress bar is omitted entirely when the reader has not set a goal.
- [ ] Progress summary copy switches between the null-target and active-target variants.
- [ ] Goal-met state appears when completed books meet or exceed the target.
- [ ] Only books finished in the current UTC year count toward the completed total.
- [ ] Books finished in the previous year do not count toward the current goal.
- [ ] Books finished in the next year do not count toward the current goal.
- [ ] `To read` and `Currently reading` books do not count toward completed totals.
- [ ] Goal page survives a browser reload after a successful save and still shows the persisted target.
- [ ] Goals page has no unexpected console errors.
- [ ] Goals page remains usable on mobile widths.

## Public Shelves

- [ ] Public shelf page renders the selected reader's heading, summary copy, and book list.
- [ ] Public shelf page shows public status chips and ratings without exposing mutation controls.
- [ ] Public shelf description includes the `@handle` form derived from the reader email prefix.
- [ ] Public shelf page never exposes the reader's email address.
- [ ] Public shelf page shows a clean empty state when the reader has no books.
- [ ] Public shelf handle lookup is case-insensitive.
- [ ] Public shelf heading and summary match the same totals as the private shelf for the same reader.
- [ ] Public shelf entry order follows `updatedAt` descending order just like the private shelf.
- [ ] Unknown public shelf handle returns the custom 404 page.
- [ ] Two users with the same email prefix across different domains resolve predictably, or the collision is explicitly surfaced and documented.
- [ ] Public shelf reflects newly added books after the owner updates their private shelf.
- [ ] Public shelf reflects removals after the owner deletes a book privately.
- [ ] Signed-in viewers and signed-out viewers see the same public shelf content.
- [ ] Public shelf remains accessible without authentication.
- [ ] Public shelf has no unexpected console errors.
- [ ] Public shelf remains usable on mobile widths.

## Administrator Goals Dashboard

- [ ] Administrator can reach `/admin/goals` and see aggregate cards for total readers, readers with goals, and progress summaries.
- [ ] Signed-in non-administrator is rejected from `/admin/goals`.
- [ ] Anonymous visitor is redirected away from `/admin/goals` to login.
- [ ] Administrator dashboard shows the seeded reader rows with the expected counts.
- [ ] Administrator dashboard handles the zero-readers state cleanly.
- [ ] Administrator dashboard table ordering stays predictable when multiple readers exist.
- [ ] Administrator per-reader rows are sorted by finished-book count descending.
- [ ] Administrator rows with no goal show an em dash in the target column.
- [ ] Administrator percentages are rounded consistently and capped at `100`.
- [ ] Administrator dashboard header still shows administrator identity and the shared `Sign out` action.
- [ ] Administrator dashboard has no unexpected console errors.
- [ ] Administrator dashboard remains usable on mobile or narrow desktop widths.

## JSON API Coverage Through Playwright Request

### Shelf Collection API

- [ ] Anonymous `GET /api/shelf` returns unauthorized.
- [ ] Authenticated `GET /api/shelf` returns only the current reader's entries.
- [ ] Authenticated `GET /api/shelf` returns entries ordered by `updatedAt` descending.
- [ ] Authenticated `GET /api/shelf` serializes `createdAt` and `updatedAt` as ISO strings.
- [ ] Anonymous `POST /api/shelf` returns unauthorized.
- [ ] `POST /api/shelf` rejects malformed JSON bodies with `400 Invalid JSON`.
- [ ] `POST /api/shelf` rejects a payload without `openLibraryId`.
- [ ] `POST /api/shelf` rejects a new-book payload without title.
- [ ] `POST /api/shelf` rejects a new-book payload without author.
- [ ] `POST /api/shelf` creates a new shelf entry with default `to-read` status.
- [ ] `POST /api/shelf` trims `openLibraryId`, title, and author before persistence.
- [ ] `POST /api/shelf` with an invalid status value falls back to `to-read`.
- [ ] `POST /api/shelf` against an existing book reuses the stored book row instead of overwriting metadata from the request body.
- [ ] Duplicate `POST /api/shelf` returns the existing entry instead of creating another.
- [ ] `POST /api/shelf` trims or preserves payload fields exactly as intended by the application contract.

### Individual Shelf Entry API

- [ ] Owner can `GET /api/shelf/:entryId` successfully.
- [ ] Anonymous `GET /api/shelf/:entryId` returns unauthorized.
- [ ] Different signed-in reader cannot `GET /api/shelf/:entryId` for someone else's entry.
- [ ] `GET /api/shelf/:entryId` for a missing entry returns not found.
- [ ] `GET /api/shelf/:entryId` returns the expected book metadata fields.
- [ ] Anonymous `PATCH /api/shelf/:entryId` returns unauthorized.
- [ ] `PATCH /api/shelf/:entryId` rejects malformed JSON bodies with `400 Invalid JSON`.
- [ ] Different signed-in reader cannot `PATCH /api/shelf/:entryId` for someone else's entry.
- [ ] `PATCH /api/shelf/:entryId` can update rating only.
- [ ] `PATCH /api/shelf/:entryId` can clear rating with `null`.
- [ ] `PATCH /api/shelf/:entryId` can update status to `currently-reading`.
- [ ] `PATCH /api/shelf/:entryId` can update status and rating in the same request.
- [ ] `PATCH /api/shelf/:entryId` stamps `finishedAt` when status becomes `finished`.
- [ ] `PATCH /api/shelf/:entryId` does not replace `finishedAt` if the entry is already finished and is patched with `finished` again.
- [ ] `PATCH /api/shelf/:entryId` clears `finishedAt` when status moves away from `finished`.
- [ ] `PATCH /api/shelf/:entryId` rejects an invalid status value.
- [ ] `PATCH /api/shelf/:entryId` rejects a rating below the allowed range.
- [ ] `PATCH /api/shelf/:entryId` rejects a rating above the allowed range.
- [ ] `PATCH /api/shelf/:entryId` rejects a rating with the wrong type.
- [ ] `PATCH /api/shelf/:entryId` rejects a request with no updatable fields.
- [ ] Anonymous `DELETE /api/shelf/:entryId` returns unauthorized.
- [ ] Different signed-in reader cannot `DELETE /api/shelf/:entryId` for someone else's entry.
- [ ] Owner `DELETE /api/shelf/:entryId` returns `204`.
- [ ] Deleting a non-existent shelf entry returns not found.

### Reading Goal Action Coverage

- [ ] Anonymous goal submission is rejected or redirected consistently.
- [ ] Valid goal submission persists the expected numeric value.
- [ ] Goal submission overwrites the existing row instead of creating duplicates for the same user and year.
- [ ] Invalid goal submission returns a validation error payload instead of a server error.

### Administrator Featured-Books API

- [ ] Administrator can create or update a featured-book position successfully.
- [ ] Administrator can clear a featured-book position by sending `position: null`.
- [ ] Anonymous caller cannot use the featured-books API.
- [ ] Signed-in non-administrator cannot use the featured-books API.
- [ ] Featured-books API rejects malformed JSON bodies with `400 Invalid JSON`.
- [ ] Featured-books API rejects missing `openLibraryId`.
- [ ] Featured-books API rejects missing `position`.
- [ ] Featured-books API rejects invalid `position` values.
- [ ] Featured-books API trims `openLibraryId` before lookup.
- [ ] Featured-books API returns not found when the referenced book does not exist.

### Testing Seed API

- [ ] Testing seed endpoint returns the expected seeded dataset in test mode.
- [ ] Testing seed endpoint accepts an empty body and still returns the default dataset.
- [ ] Testing seed endpoint honors `resetUsers` by removing users created during a spec.
- [ ] Testing seed endpoint preserves existing seeded users when `resetUsers` is false.
- [ ] Testing seed endpoint accepts custom reader and administrator names, emails, and passwords.
- [ ] Testing seed endpoint wipes shelf entries and books before reseeding.
- [ ] Testing seed endpoint is unavailable when `ENABLE_TEST_SEED` is disabled.

### Malformed Request Safety

- [ ] JSON APIs return a controlled client error for malformed JSON bodies instead of a server error.
- [ ] JSON APIs reject unsupported HTTP methods with the correct status code.
- [ ] JSON API error responses do not expose stack traces or internal driver errors.

## Design System Route

- [ ] Design-system page matches the full-page visual baseline.
- [ ] Empty-state primary action keeps readable contrast.
- [ ] Design-system route has no automated accessibility violations.
- [ ] Design-system route has no unexpected console errors.
- [ ] Design-system route still renders correctly after a hard reload with no hydration mismatches.
- [ ] Primary button examples render a consistent foreground color across link and button elements.
- [ ] Outline button examples render readable contrast and focus-visible treatment.
- [ ] Ghost button examples remain visually distinct while preserving readable text contrast.
- [ ] Shared button sizing is consistent across text labels of different lengths.
- [ ] Shared button radius is consistent after the reduced-corner pass.
- [ ] Disabled button examples are visibly disabled and non-interactive.
- [ ] Shared input component renders label, hint, and described-by wiring correctly.
- [ ] Shared input component keeps consistent height and radius across text, search, and disabled states.
- [ ] Shared input component keeps consistent browser appearance in Chromium, Firefox, and WebKit.
- [ ] Shared input placeholder color remains readable and visually consistent.
- [ ] Shared book-card example renders title, author, metadata, and action slots correctly.
- [ ] Shared book-card example renders the status chip when status is present.
- [ ] Shared book-card example renders the rating when rating is present.
- [ ] Starter library card grid renders the expected number of featured books.
- [ ] Design-system route remains stable on mobile widths.

## Locator Playground Route

- [ ] Locator playground renders every major practice section heading.
- [ ] Locator playground keeps the reading-list item count and ratings-table row count expected by the current lab spec.
- [ ] Buttons section exposes distinct roles, names, and visual states for each example control.
- [ ] Buttons section keeps the duplicate `Delete` buttons intentionally ambiguous so scoped locators are still required.
- [ ] Buttons section keeps the disabled `Out of stock` button non-interactive.
- [ ] Buttons section includes an article-scoped `Rate this book` control for nested locator practice.
- [ ] Form-fields section keeps all visible text inputs at a consistent height and corner radius.
- [ ] Form-fields section still demonstrates labeled, hinted, unlabeled, and `aria-label` inputs intentionally.
- [ ] Text-content section keeps separate examples for exact match, partial match, and disambiguation.
- [ ] Text-content exact-match examples stay unique enough for a strict text locator.
- [ ] Text-content partial-match examples stay intentionally similar enough to require substring or scoped locators.
- [ ] Text-content disambiguation examples stay intentionally ambiguous enough to require better scoping.
- [ ] Lists-and-tables section preserves stable accessible names and row or item counts.
- [ ] Lists-and-tables section preserves the exact four reading-list items the labs currently expect.
- [ ] Lists-and-tables section preserves the exact three data rows in the ratings table.
- [ ] Navigation section preserves landmarks and `aria-current` semantics.
- [ ] Navigation section preserves two identical `View details` links so text-only locators still need scoping.
- [ ] Navigation section preserves a breadcrumb landmark labelled `Breadcrumb`.
- [ ] Status-indicators section preserves alert, status, and badge semantics.
- [ ] Status-indicators section keeps the `Syncing...` status example and the polite success message example.
- [ ] Dialogs section opens and closes with the expected accessible labels.
- [ ] Dialogs section can submit a rating and close the modal in-place.
- [ ] Dynamic-content section still changes in a way that supports waiting recipes.
- [ ] Dynamic-content section keeps the `Load more` button disabled while async content is in flight.
- [ ] Dynamic-content section keeps the delayed `Content loaded` example for waiting-on-text recipes.
- [ ] ARIA-attributes section preserves labelled and described relationships, pressed states, and similar affordances.
- [ ] ARIA-attributes section keeps `aria-expanded` and `aria-controls` in sync with the expandable panel.
- [ ] ARIA-attributes section keeps the progress bar labeled `Reading progress` with the expected numeric values.
- [ ] ARIA-attributes section keeps the pagination control with `aria-current="page"` on page 2.
- [ ] Test-ID fallbacks section preserves the intentionally last-resort selectors used in the labs.
- [ ] Test-ID fallbacks section preserves the `book-count` and `custom-widget` identifiers exactly.
- [ ] Anti-patterns section remains clearly labelled as anti-patterns and does not drift into production-quality guidance.
- [ ] Anti-patterns section keeps examples that are intentionally hard to locate by role, name, or label.
- [ ] Locator playground route has no unexpected console errors.
- [ ] Locator playground route remains usable on mobile widths.

## Progressive Enhancement And No JavaScript

- [ ] Public homepage renders useful content with JavaScript disabled.
- [ ] Login page renders useful content with JavaScript disabled.
- [ ] Search page renders useful content with JavaScript disabled.
- [ ] Public shelf page renders useful content with JavaScript disabled.
- [ ] Design-system page renders useful content with JavaScript disabled.
- [ ] Locator playground renders useful content with JavaScript disabled.
- [ ] Sign-in flow works with JavaScript disabled because the login form still submits through a real server action.
- [ ] Account-creation flow works with JavaScript disabled because the login form still submits through a real server action.
- [ ] Goal-saving flow works with JavaScript disabled because the goals form still submits through a real server action.
- [ ] Search form works with JavaScript disabled because it is a standard `GET` form.
- [ ] Empty-state links such as `Open search` still work with JavaScript disabled.

## Data Quality And Strange Content

- [ ] Book titles with apostrophes, ampersands, colons, and unicode punctuation render correctly everywhere they appear.
- [ ] Author names with accents, initials, apostrophes, and non-Latin characters render correctly everywhere they appear.
- [ ] Descriptions containing HTML-like text render as text, not markup.
- [ ] Descriptions containing very long unbroken strings do not overflow cards.
- [ ] Titles and authors with enough length to wrap onto multiple lines do not collide with badges or action buttons.
- [ ] Public shelf handles with uppercase input still resolve to the same lowercased reader.
- [ ] Public shelf handle collisions across domains resolve deterministically or are blocked explicitly.

## Accessibility Coverage

- [ ] Shelf page has no automated axe violations for WCAG 2 A and AA rules.
- [ ] Search page has no automated axe violations for WCAG 2 A and AA rules.
- [ ] Public homepage has no automated axe violations.
- [ ] Login page has no automated axe violations.
- [ ] Goals page has no automated axe violations.
- [ ] Public shelf page has no automated axe violations.
- [ ] Administrator goals page has no automated axe violations.
- [ ] Design-system page has no automated axe violations.
- [ ] Locator playground page has no automated axe violations.
- [ ] Keyboard-only user can complete the primary reader journey without pointer interaction.
- [ ] Focus-visible treatment appears consistently on navigation links, buttons, inputs, radios, and dialogs.
- [ ] Live regions announce search-add, shelf-rate, shelf-remove, shelf-mark-read, and goal-save actions.
- [ ] Rating dialog traps focus correctly while open.
- [ ] Color-contrast assertions exist for primary, secondary, outline, and destructive interactive controls.
- [ ] Muted metadata text remains readable against card backgrounds.

## Visual Regression Coverage

- [ ] Public design-system route has a full-page visual baseline.
- [ ] Authenticated shelf page has a full-page visual baseline.
- [ ] Public homepage has a full-page visual baseline.
- [ ] Public homepage signed-in state has a full-page visual baseline.
- [ ] Login page has a full-page visual baseline.
- [ ] Login page with an error banner has a visual baseline.
- [ ] Search results page has a full-page visual baseline.
- [ ] Search no-results state has a full-page visual baseline.
- [ ] Empty shelf state has a full-page visual baseline.
- [ ] Goals page has a full-page visual baseline.
- [ ] Goals page with a goal-met state has a full-page visual baseline.
- [ ] Public shelf page has a full-page visual baseline.
- [ ] Public empty shelf page has a full-page visual baseline.
- [ ] Administrator goals page has a full-page visual baseline.
- [ ] Administrator goals empty-state page has a full-page visual baseline.
- [ ] Rate-book dialog has a focused modal visual baseline.
- [ ] Search result card with a long description has a stress-case visual baseline.
- [ ] Mobile homepage has a visual baseline.
- [ ] Mobile search page has a visual baseline.
- [ ] Mobile shelf page has a visual baseline.
- [ ] Mobile login page has a visual baseline.
- [ ] Mobile goals page has a visual baseline.
- [ ] Long-title and long-author cards have a stress-case visual baseline.

## Performance And Runtime Resilience

- [ ] Shelf route stays within the configured `domContentLoaded` budget.
- [ ] Public homepage stays within a `domContentLoaded` budget.
- [ ] Login page stays within a `domContentLoaded` budget.
- [ ] Search route under HAR replay stays within a runtime budget.
- [ ] Search route with no query stays within a runtime budget.
- [ ] Shelf mutation flows stay within a user-visible latency budget.
- [ ] Search add-to-shelf mutation stays within a user-visible latency budget.
- [ ] Goal-save action stays within a user-visible latency budget.
- [ ] Core smoke journey finishes without unexpected console errors.
- [ ] Core smoke journey finishes without unexpected failed network requests.
- [ ] Open Library timeout path resolves to a usable UI within the expected timeout window.
- [ ] Browser refresh during an in-flight shelf mutation resolves without duplicate writes.
- [ ] Rapid repeated clicks on mutation controls do not create duplicate writes.
- [ ] Offline behavior after initial load fails gracefully for search and shelf mutations.
- [ ] Offline behavior after initial load fails gracefully for goal saves.

## Cross-Browser And Responsive Coverage

- [ ] Core smoke suite passes in Chromium, Firefox, and WebKit.
- [ ] Authentication journey passes in Chromium, Firefox, and WebKit.
- [ ] Search add-to-shelf journey passes in Chromium, Firefox, and WebKit.
- [ ] Shelf mutation journey passes in Chromium, Firefox, and WebKit.
- [ ] Goals form journey passes in Chromium, Firefox, and WebKit.
- [ ] Public shelf journey passes in Chromium, Firefox, and WebKit.
- [ ] Public homepage layout is stable on an iPhone-sized viewport.
- [ ] Login layout is stable on an iPhone-sized viewport.
- [ ] Search layout is stable on an iPhone-sized viewport.
- [ ] Shelf layout is stable on an iPhone-sized viewport.
- [ ] Goals layout is stable on an iPhone-sized viewport.
- [ ] Public shelf layout is stable on an iPhone-sized viewport.
- [ ] Administrator goals layout is stable on an iPhone-sized viewport.
- [ ] Header and navigation do not overflow at narrow widths.
- [ ] Very long display names do not break the authenticated header.
- [ ] Very long book metadata does not break cards on mobile widths.
- [ ] Firefox and WebKit preserve the normalized shared input appearance instead of reverting to browser-specific shapes.
- [ ] Touch interactions can open dialogs, choose radio inputs, and submit forms successfully.

## Security And Authorization

- [ ] Anonymous users cannot reach protected HTML routes.
- [ ] Anonymous users cannot mutate shelf APIs.
- [ ] Anonymous users cannot mutate administrator APIs.
- [ ] Signed-in non-administrator cannot access administrator HTML or JSON surfaces.
- [ ] One signed-in reader cannot read another reader's private shelf entry by identifier.
- [ ] One signed-in reader cannot update another reader's private shelf entry by identifier.
- [ ] One signed-in reader cannot delete another reader's private shelf entry by identifier.
- [ ] Malicious `returnTo` values cannot escape the application origin.
- [ ] Malicious `returnTo` values encoded as nested query parameters cannot escape the application origin.
- [ ] Public shelf route exposes only intended public fields and never leaks private account details.
- [ ] Open Library data is rendered as plain text and cannot inject markup into the page.
- [ ] Authentication error states do not leak whether an account exists beyond the intended Better Auth messaging.
- [ ] Oversized or malformed JSON payloads return controlled client errors instead of `500` responses.

## Course And Lab Safety Nets

- [ ] Reader authentication setup exists for the main authenticated Playwright project.
- [ ] Administrator authentication setup exists for the lab-focused Playwright project.
- [ ] Lab fixture spec exists to validate the intended starting state for course exercises.
- [ ] Broken-trace lab scenarios exist as dedicated specs in the labs folder.
- [ ] Course labs still match the current homepage copy, navigation labels, and sign-in labels after product-facing copy changes.
- [ ] Course labs still match the current shelf actions, including `Mark as read` and `Remove from shelf`.
- [ ] Course labs still match the current search layout now that results render as a vertical list instead of a fake masonry grid.
- [ ] Course labs still match the current locator-playground text-content buckets for exact match, partial match, and disambiguation.
- [ ] Course labs still match the current input shapes in the locator playground after the shared input normalization work.
