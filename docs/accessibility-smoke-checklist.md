# Accessibility smoke checklist

Run this manually after any UI change that touches a dialog, form, or navigation flow. The automated axe scan in `tests/end-to-end/accessibility.spec.ts` covers what a scanner can prove — this file covers what it cannot.

- Can every interactive control on `/shelf` be reached with `Tab` and `Shift+Tab` in a sensible order?
- When the **Rate this book** dialog opens, does focus move into it, and does it return to the triggering button when the dialog closes?
- Can a keyboard-only user submit the primary forms (search, login, rating) without ever touching the mouse?
- Are validation errors announced in text as well as color, and are they associated with their field via `aria-describedby`?
- Do status toasts (`role="status"` / `aria-live="polite"`) actually announce in a screen reader when they appear?

When you fail a check, fix the markup and re-run the automated scan to prove the fix. Do not suppress an axe rule as a workaround.
