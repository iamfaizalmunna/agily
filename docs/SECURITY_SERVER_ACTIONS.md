# Server Actions & CSRF (S3)

## Threat model

Agily uses **httpOnly** session cookies with `SameSite=Lax`. Cross-site **POST** requests from attacker pages do not include that cookie in most browsers, so simple cross-site form posts are already weakened.

We still validate **`Origin` / `Host`** on **state-changing** Server Actions so that:

- Forged requests that do include cookies (e.g. future `SameSite=None`, compromised subdomains, or non-browser clients) cannot drive mutations from an arbitrary origin.
- Operators have an explicit guardrail in code, not only framework defaults.

**Next.js:** Server Actions use POST with framework headers. We do not rely on a custom CSRF token; we add `checkMutationOrigin()` in `src/lib/security/origin.ts` via `trustedMutationOriginError()`.

## Inventory (`"use server"` mutations)

| Module | Actions |
|--------|---------|
| `auth/actions.ts` | sign up, sign in, sign out |
| `teams/join.ts` | accept invite |
| `teams/actions.ts` | create team, invite, role change, remove member, settings, revoke invite |
| `items/actions.ts` | projects, groups, items, comments, kanban, bulk update, gantt |
| `data/actions.ts` | CSV import, duplicate project |
| `labels/actions.ts` | create / update / delete label |
| `subtasks/actions.ts` | create / toggle / delete subtask |
| `lenses/actions.ts` | save / delete lens |
| `notices/actions.ts` | open notice, mark all read |
| `projects/board-settings-actions.ts` | workflow, custom fields |

**Read-only (no origin guard):** `search/actions.ts`, `auth/redirectIfSignedIn`, `studio/nav.ts` queries.

**Route handlers:** `export/route.ts` is GET (download); session + membership required.

## Configuration

| Env | Purpose |
|-----|---------|
| `APP_URL` | Canonical site URL; hostname added to trusted set in production |
| `VERCEL_URL` | Fallback hostname on Vercel |

Local dev trusts `localhost` and `127.0.0.1` (any port).

## Operator notes

If legitimate requests fail with “Request blocked”, check that the browser `Origin` matches the site `Host` (reverse proxy should forward `Host` / `X-Forwarded-Host`).
