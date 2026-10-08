# 07 — APIs & integrations

Agily is primarily a **Next.js server-rendered app** with **server actions** for mutations. A small set of **HTTP routes** supports avatars, live notifications, and exports.

## Next.js App Router routes

| Path | Method | Auth | Purpose |
|------|--------|------|---------|
| `/api/profile/avatar/[userId]` | GET | Session (own user or team visibility rules) | Serve uploaded avatar bytes |
| `/api/notices/live` | GET (SSE) | Session + studio context | Push new notifications to open clients |
| `/t/.../p/.../export` | GET | Member+ | CSV export for project |

Most writes use **Server Actions** in `src/lib/**/actions.ts` (items, teams, profile, notices, search, etc.)—not REST CRUD.

## Lens API (Express)

| | |
|---|---|
| **Package** | `apps/api` (`@agily/api`) |
| **Default URL** | http://127.0.0.1:43124 |
| **Health** | `GET /v1/health` |

**Auth:** Reads the same **httpOnly session cookie** as the web app; resolves user from SQLite.

**Typical use:** In-app Lens panel sends chat to local **Ollama** with optional context from `/kb` markdown. If Ollama is unavailable, fallback help text still responds.

**Knowledge:** Not fetched from the internet—only `kb/*.md` and bundled prompts.

Start with `npm run dev` (web + API) or `npm run dev:api` alone.

## Client-side integration points

| Feature | Mechanism |
|---------|-----------|
| **Theme / appearance boot** | Inline `THEME_BOOT_SCRIPT` in root layout + `localStorage` key `agily-appearance` |
| **Command palette** | Client component + `searchStudioAction` server action |
| **Recent tickets** | `localStorage` `agily-recent-tickets` |
| **Sidebar collapsed** | `localStorage` |
| **Notification sound** | `src/lib/notices/sound.ts` (user prefs) |

## Database

- **Prisma** ORM, **SQLite** file path from `DATABASE_URL`.
- Migrations in `prisma/migrations/`; seed via `npx prisma db seed` (demo northwind/atlas).

## What we do not expose

- Public REST API for third-party integrations
- Webhooks
- GraphQL
- Mobile native SDK

All “integration” is local: CSV import/export, copy-link invites, Ollama loopback.
