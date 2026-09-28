# Hardening (post–R12)

Local-first security and reliability defaults.

| Area | What we do |
|------|------------|
| **HTTP headers** | `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` via `next.config.ts` |
| **Env** | `instrumentation.ts` calls `assertServerEnv()` — `DATABASE_URL` + `SESSION_SECRET` (32+ chars in production) |
| **Sign-in** | In-memory throttle: 10 failures / 15 minutes per email (generic errors) |
| **Downloads** | CSV export filenames sanitized (`safeDownloadFilename`) |
| **Lens / Ollama** | Loopback-only base URL (see `packages/lens`) |

## Verify

```bash
npm test
npm run test:coverage
npm run build
```
