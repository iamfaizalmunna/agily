# S1 — CSP & security headers v2

**Status:** complete  
**Branch:** `security/s1-csp-headers`

## Goal

Reduce XSS and clickjacking risk without breaking Next.js dev, theme boot script, or local Lens proxy.

## Deliverables

- [ ] **Content-Security-Policy** — start with **Report-Only** in dev; enforce in production build or behind `SECURITY_CSP_ENFORCE=true`.
  - Allow: `self`, Next static, inline theme boot (nonce or hash documented), `127.0.0.1` Lens rewrite if needed.
- [ ] **Optional headers:** `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-site` (verify no break on `/lens-api` rewrite).
- [ ] Centralize in `src/lib/security/headers.ts`; wire through `next.config.ts`.
- [ ] Doc section in [HARDENING.md](../../HARDENING.md) — how to read CSP violations locally.
- [ ] Unit tests for header map keys/values and CSP builder edge cases (add files to `.c8rc.json` pack if new pure helpers).

## Acceptance

- App loads on `http://127.0.0.1:43123` with demo login; board + focus + ⌘K work.
- No CSP console errors on critical paths in dev (or documented exceptions).
- `npm run build` passes.

## Verify

```bash
npm test && npm run test:coverage && npm run build
curl -sI http://127.0.0.1:43123/ | rg -i 'content-security|x-frame'
```
