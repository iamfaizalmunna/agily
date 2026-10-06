# Hardening (post–R12)

Local-first security and reliability defaults.

**Roadmap:** phased hardening **S1–S12** — see [phases/SECURITY_README.md](phases/SECURITY_README.md). Say **“S1”** in chat to start phase-by-phase implementation.

| Area | What we do |
|------|------------|
| **HTTP headers** | Baseline headers + **CSP** (report-only in dev; enforced in production). COOP/CORP via `src/lib/security/headers.ts` → `next.config.ts` |
| **CSP tuning** | Dev: `Content-Security-Policy-Report-Only` (allows `unsafe-eval` for Next). Prod: enforcing CSP with **sha256** for theme boot script. Force enforce in dev: `SECURITY_CSP_ENFORCE=true` |
| **Env** | `assertServerEnv()` — `DATABASE_URL`, `SESSION_SECRET` (32+ chars in prod), optional `SESSION_DAYS` ≤ 90 in prod |
| **Sessions** | httpOnly / `SameSite=Lax` / `Secure` in prod; `maxAge` aligned with DB expiry; **rotate** all user sessions on sign-in; logout deletes DB row + cookie |
| **Server Actions** | `Origin` / `Host` check on mutations (`src/lib/security/origin.ts`); see [SECURITY_SERVER_ACTIONS.md](SECURITY_SERVER_ACTIONS.md) |
| **Sign-in** | In-memory throttle: 10 failures / 15 minutes per email (generic errors) |
| **Downloads** | CSV export filenames sanitized (`safeDownloadFilename`) |
| **Lens / Ollama** | Loopback-only base URL (see `packages/lens`) |

### CSP violations in dev

Open DevTools → Console. Report-only CSP does not block; it logs what would be blocked in production. Fix new inline scripts by adding a hash in `src/lib/security/csp.ts` or moving logic to a file.

## Verify

```bash
npm test
npm run test:coverage
npm run build
```
