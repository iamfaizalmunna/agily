# Data at rest & tokens (S11)

## SQLite

- Database path from `DATABASE_URL` (default `file:./prisma/dev.db`).
- `*.db`, journals, and WAL files are **gitignored** — never commit them.
- On a server: `chmod 600` on the DB file; prefer full-disk encryption (FileVault, LUKS).

## Sessions

- Tokens: **32 bytes** CSPRNG → 64 hex chars (`src/lib/auth/session-token.ts`).
- Validated on create; httpOnly cookie, rotation on sign-in (S2).

## Invites

- Tokens: **18 bytes** hex (36 chars) from `newInviteToken()`.
- Expiry enforced on accept (`expiresAt`); invite row deleted after successful join.
- Invalid format or expired link → generic error (no token leakage).

## Passwords

- **bcrypt** cost **12** (`BCRYPT_ROUNDS` in `src/lib/auth/password.ts`).
- Demo passwords only in dev seed / `NEXT_PUBLIC_DEMO_MODE` — not for production.
