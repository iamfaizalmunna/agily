# Input validation & XSS notes (S6)

## Server limits

Central caps: `src/lib/security/validation-limits.ts` (`FIELD_LIMITS`).

CSV import: `src/lib/data/import-bounds.ts` — max **512 KB**, **500** data rows, **2000** chars per cell.

## URLs

User-provided links must pass `isSafeHttpUrl()` (`src/lib/security/safe-url.ts`) — blocks `javascript:`, `data:`, etc.

## HTML in the UI

- Ticket titles, comments, and activity render as **plain text** in React (no `dangerouslySetInnerHTML` on user content).
- The only boot script using `dangerouslySetInnerHTML` is theme init in `src/app/layout.tsx` (static `THEME_BOOT_SCRIPT`, CSP hash in S1).

## Tests

- `src/lib/security/safe-url.test.ts`
- `src/lib/data/import-bounds.test.ts`
- Existing parsers: `parseItemTitle`, `parseCommentBody`, `parseLensName`
