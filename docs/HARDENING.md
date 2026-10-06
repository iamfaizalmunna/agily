# Hardening (post–R12)

Local-first security and reliability defaults.

**Roadmap:** security track **S1–S12 complete** — see [phases/SECURITY_README.md](phases/SECURITY_README.md). Operator pass: [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

| Area | What we do |
|------|------------|
| **HTTP headers** | Baseline headers + **CSP** (report-only in dev; enforced in production). COOP/CORP via `src/lib/security/headers.ts` → `next.config.ts` |
| **CSP tuning** | Dev: `Content-Security-Policy-Report-Only` (allows `unsafe-eval` for Next). Prod: enforcing CSP with **sha256** for theme boot script. Force enforce in dev: `SECURITY_CSP_ENFORCE=true` |
| **Env** | `assertServerEnv()` — `DATABASE_URL`, `SESSION_SECRET` (32+ chars in prod), optional `SESSION_DAYS` ≤ 90 in prod |
| **Sessions** | httpOnly / `SameSite=Lax` / `Secure` in prod; `maxAge` aligned with DB expiry; **rotate** all user sessions on sign-in; logout deletes DB row + cookie |
| **Server Actions** | `Origin` / `Host` check on mutations (`src/lib/security/origin.ts`); see [SECURITY_SERVER_ACTIONS.md](SECURITY_SERVER_ACTIONS.md) |
| **Sign-in** | Throttle v2: per **email** and **client IP** (in-memory); uniform errors; retry-after in UI. Join links rate-limited similarly |
| **RBAC / IDOR** | Matrix: [SECURITY_RBAC_MATRIX.md](SECURITY_RBAC_MATRIX.md); `requireTeamMember(slug, minRole)` on people/settings |
| **Validation** | Field caps + CSV bounds; safe URLs — [SECURITY_VALIDATION.md](SECURITY_VALIDATION.md) |
| **Downloads** | CSV export filenames sanitized (`safeDownloadFilename`) |
| **Lens / Ollama** | Loopback-only base URL; API rate limits + KB/CORS — [SECURITY_LENS_API.md](SECURITY_LENS_API.md) |
| **Production** | [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md), `.env.example` |
| **Audit log** | `SecurityEvent` rows for auth, RBAC, CSV export — owners see last 50 in studio settings |
| **Data at rest** | Session/invite token formats, bcrypt 12, SQLite permissions — [DATA_AT_REST.md](DATA_AT_REST.md) |
| **Supply chain** | CI `scripts/npm-audit-ci.mjs`, Dependabot — [SECURITY_EXCEPTIONS.md](SECURITY_EXCEPTIONS.md) |

### CSP violations in dev

Open DevTools → Console. Report-only CSP does not block; it logs what would be blocked in production. Fix new inline scripts by adding a hash in `src/lib/security/csp.ts` or moving logic to a file.

## Verify

```bash
npm test
npm run test:coverage
npm run build
npm run test:e2e   # includes security-smoke
```
