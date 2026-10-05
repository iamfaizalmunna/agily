# S2 — Session lifecycle & cookies

**Status:** complete  
**Branch:** `security/s2-sessions`

## Goal

Limit session theft and fixation; make logout and expiry behavior explicit.

## Deliverables

- [ ] **Rotate session token** on successful sign-in (invalidate prior session row for same user or same device policy — document choice).
- [ ] **Logout** clears server session + cookie (audit all sign-out paths).
- [ ] **Expiry:** align cookie `maxAge` / `expires` with `sessionExpiry()`; reject expired sessions on every `getSession` path (web + `apps/api`).
- [ ] **Cookie flags audit:** `httpOnly`, `SameSite`, `Secure` (prod), `Path=/` — single helper `sessionCookieOptions` used everywhere.
- [ ] Optional: `SESSION_DAYS` cap documented; warn if > 90 in production env validation.
- [ ] Tests: identity + cookie-options + session repository behavior.

## Acceptance

- Sign in → new token; old token from another “browser” no longer works after rotation policy.
- Expired session returns to sign-in, not partial UI.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
