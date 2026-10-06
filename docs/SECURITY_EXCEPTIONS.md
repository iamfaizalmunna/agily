# Security audit exceptions

CI runs `node scripts/npm-audit-ci.mjs` on every PR (see `.github/workflows/test.yml`).

## Policy

- **Fail** on `critical`.
- **Log** `high` and track waivers below (tooling transitive deps); tighten to fail-on-high when the tree is clean.
- **Dev-only** advisories: fix when `npm audit fix` is safe; otherwise document here with expiry.

## Active waivers

| Advisory / package | Reason | Review by |
|--------------------|--------|-----------|
| `braces`, `micromatch`, `fast-glob` (eslint/shadcn chain) | Dev-only tooling; CI uses `scripts/npm-audit-ci.mjs` | 2026-Q2 |
| `deepmerge-ts` (prisma config) | Dev install path; no runtime exposure | 2026-Q2 |

## Dependabot

Weekly npm updates: `.github/dependabot.yml`.

## GitHub Actions

Workflows use `@v4` major tags on official actions (`checkout`, `setup-node`). Pin to commit SHAs only if your org requires it.
