# S3 — CSRF, origin, and Server Actions

**Status:** complete  
**Branch:** `security/s3-csrf-actions`

## Goal

Ensure state-changing requests cannot be driven from arbitrary third-party sites.

## Deliverables

- [ ] Inventory all `actions.ts` / `"use server"` entry points (items, teams, auth, labels, projects, …).
- [ ] **Origin / Host check** helper for sensitive actions (sign-in, join, role change, delete team, bulk update).
- [ ] Rely on Next.js Server Action built-ins where applicable; document what we depend on.
- [ ] Reject cross-site form posts to legacy routes if any remain.
- [ ] Tests for origin helper (allowed dev hosts, production host from env `APP_URL` or `VERCEL_URL` pattern).

## Acceptance

- Documented threat model: “attacker site cannot invoke action with victim’s cookie” for listed mutations.
- No regression on local `127.0.0.1` and `localhost`.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
