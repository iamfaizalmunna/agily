# S12 — Ship: smoke tests & runbook

**Status:** planned  
**Branch:** `security/s12-ship`

## Goal

Lock the track with automated smoke checks and a single operator runbook.

## Deliverables

- [ ] **Playwright security smoke** (extend `test:e2e`): unauthenticated redirect, viewer cannot open edit form (or gets error), sign-out clears session.
- [ ] **Manual pen-test checklist** in `docs/SECURITY_REVIEW.md` (30-minute pass: IDOR, XSS, clickjacking, open redirect, file download).
- [ ] **Update [HARDENING.md](../../HARDENING.md)** — full table from S1–S11.
- [ ] **Update [SECURITY_README.md](SECURITY_README.md)** — mark S1–S12 complete.
- [ ] Optional: link SECURITY_REVIEW in README “Deploying” section.

## Acceptance

- `npm run test:e2e` includes new specs and passes on `e2e.db`.
- New contributor can follow HARDENING + PRODUCTION_CHECKLIST without asking.

## Verify

```bash
npm test && npm run test:coverage && npm run build
npm run test:e2e
```
