# S4 — Auth abuse & lockout UX

**Status:** planned  
**Branch:** `security/s4-auth-abuse`

## Goal

Slow credential stuffing and password spraying without leaking which emails exist.

## Deliverables

- [ ] **Throttle v2:** optional IP + email composite key (in-memory; interface ready for Redis later).
- [ ] **Uniform errors** on sign-in failure (no “user not found” vs “bad password”).
- [ ] **Lockout UI:** clear message when throttled; retry-after hint from server.
- [ ] **Timing:** constant-ish response path (avoid obvious fast-path on missing user) — best effort in Node.
- [ ] Rate limit **join token** attempts and **invite accept** if not already bounded.
- [ ] Extend `sign-in-throttle.test.ts` + auth action tests.

## Acceptance

- 11th failure in 15 minutes blocks further attempts for that bucket.
- E2E or unit test proves throttle message surfaces.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
