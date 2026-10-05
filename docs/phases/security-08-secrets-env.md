# S8 — Secrets, env templates, production checklist

**Status:** planned  
**Branch:** `security/s8-secrets-env`

## Goal

Make misconfiguration hard before first production deploy.

## Deliverables

- [ ] **`.env.example`** (no real secrets) listing all vars: `DATABASE_URL`, `SESSION_SECRET`, `LENS_API_URL`, `OLLAMA_*`, optional `APP_URL`, CSP flags.
- [ ] **`validateServerEnv` extensions:** warn on default/demo secrets in `NODE_ENV=production`; optional `DEMO_MODE` blocked in prod.
- [ ] **Logging:** grep for `console.log` of session, password, invite token — remove or redact.
- [ ] **`docs/PRODUCTION_CHECKLIST.md`** — reverse proxy TLS, file permissions on `*.db`, backup, rotate `SESSION_SECRET` procedure.
- [ ] README link from [HARDENING.md](../../HARDENING.md).

## Acceptance

- Fresh clone: copy `.env.example` → `.env`, app boots with documented values.
- `NODE_ENV=production` + short `SESSION_SECRET` fails fast at startup.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
