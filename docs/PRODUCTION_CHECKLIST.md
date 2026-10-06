# Production checklist

Use with [HARDENING.md](HARDENING.md) and `.env.example`.

## Before first deploy

1. Copy `.env.example` → `.env` and replace **all** placeholders.
2. Set `NODE_ENV=production`, `APP_URL=https://your-host`, strong `SESSION_SECRET` (32+ random bytes).
3. Set `NEXT_PUBLIC_DEMO_MODE=false` (or omit); do not set `DEMO_MODE=true`.
4. Run `npm run build` and `assertServerEnv` via app boot (Next + API).
5. Put SQLite `*.db` outside web root; restrict file permissions (`chmod 600`).
6. Terminate TLS at reverse proxy; forward `X-Forwarded-Proto` / `Host`.
7. Bind API to loopback (`127.0.0.1`); expose only Next through the proxy.
8. Set `LENS_KB_HTTP=false` unless you intentionally serve KB markdown over HTTP.

## Ongoing

- Backup `DATABASE_URL` file on a schedule.
- Rotate `SESSION_SECRET` only with a planned logout (invalidates all sessions).
- Run `npm audit --audit-level=high` before releases; track waivers in [SECURITY_EXCEPTIONS.md](SECURITY_EXCEPTIONS.md).
