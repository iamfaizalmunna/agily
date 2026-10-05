# S9 — Dependency & CI supply chain

**Status:** planned  
**Branch:** `security/s9-supply-chain`

## Goal

Catch known-vulnerable dependencies and lockfile drift in CI.

## Deliverables

- [ ] **`npm audit`** in GitHub Actions (fail on `high`+ or `critical` — document policy).
- [ ] **Dependabot** (or Renovate) config for npm weekly PRs.
- [ ] **Pin** GitHub Actions to SHAs or major version tags (already `@v4` — document).
- [ ] Optional: `npm audit --production` job separate from devDeps noise.
- [ ] Document exception process in `docs/SECURITY_EXCEPTIONS.md` (if audit must be waived).

## Acceptance

- CI fails on intentional test advisory or documents waiver.
- Main branch green with audit step enabled.

## Verify

```bash
npm test && npm run test:coverage && npm run build
npm audit --audit-level=high
```
