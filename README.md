# Agily

[![Unit pack](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml/badge.svg)](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml)
[![Phase](https://img.shields.io/badge/phase-10%2F10-c9844a)](docs/phases/README.md)
[![Coverage](https://img.shields.io/badge/unit%20pack-100%25-10b981)](docs/phases/README.md)
[![AI](https://img.shields.io/badge/AI-Ollama%20localhost%20only-12100e)](docs/phases/README.md)

Local agile planner: Jira capability, Monday boards, Notion-like writing — **our SQLite only**. No cloud APIs, no OAuth, no paid AI.

**Now:** full local studio — auth through Lens, keyboard chrome, Playwright smoke.  
**Later:** optional cloud deploy (out of scope for this repo).

## Main

All **10 phases are merged on `main`** through feature branches (Phase 10: `phase-10-ship-chrome` → PR → merge).

Repo: [github.com/iamfaizalmunna/agily](https://github.com/iamfaizalmunna/agily)

## Hard rules

- Identity lives in `User` + `Session` in SQLite. Email is a login key, not a mailbox.
- No Auth0, Clerk, NextAuth OAuth, Google/GitHub/Apple sign-in.
- No OpenAI / Anthropic / Gemini / SMTP / analytics SDKs.
- GitHub gets source + `/kb` + README. Never `.env`, `*.db`, `.ollama/`, `*.gguf`.

## Run

```bash
git clone https://github.com/iamfaizalmunna/agily.git
cd agily
cp .env.example .env
npm install
npx prisma migrate dev
npm test
npm run dev
```

App: [http://127.0.0.1:43123](http://127.0.0.1:43123) · Lens API: [http://127.0.0.1:43124/v1/health](http://127.0.0.1:43124/v1/health)

`npm run dev` starts Next and Express together. Optional: `ollama pull llama3.2:3b` then leave Ollama on `127.0.0.1:11434`. If it is down, Lens still answers from `/kb` and board counts.

**Signup:** Owner names a studio. Member / Viewer wait for a `/join/[token]` link. Admin is granted by an owner.

## Demo logins

Same convention as ZenFlow (`*@zenflowai.com` / `password123`). Agily uses `*@agily.com` / `password123`. Tap a row on `/signin` to sign in.

| Email | Role |
|-------|------|
| `owner@agily.com` | Owner |
| `admin@agily.com` | Admin |
| `member@agily.com` | Member |
| `viewer@agily.com` | Viewer |

Seed all four on Northwind: `npx prisma db seed`

### Example host (like example.zenflowai)

Demo rows on `/signin` when **any** of these is true:

1. `npm run dev` (local)
2. `NEXT_PUBLIC_DEMO_MODE=true` in `.env`
3. Hostname starts with `example.` (e.g. `example.agily.com`)

```bash
cp .env.example .env
# optional public demo:
# NEXT_PUBLIC_DEMO_MODE="true"
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Production installs without the flag hide demo logins. The same hard rules as ZenFlow apply: own SQLite, session cookies, no OAuth, no paid AI, no SMTP.

## Phases

| Phase | Status on `main` | Story |
|------:|:-----------------|:------|
| 1 Auth | merged | [docs/phases/01-auth.md](docs/phases/01-auth.md) |
| 2 Teams + invites | merged | [docs/phases/02-teams.md](docs/phases/02-teams.md) |
| 3 Projects / groups / items | merged | [docs/phases/03-projects.md](docs/phases/03-projects.md) |
| 4 People + assign | merged | [docs/phases/04-assign.md](docs/phases/04-assign.md) |
| 5 Four views | merged via PR | [docs/phases/05-views.md](docs/phases/05-views.md) |
| 6 Filter lenses | merged via PR | [docs/phases/06-lenses.md](docs/phases/06-lenses.md) |
| 7 Focus + notes | merged via PR | [docs/phases/07-focus.md](docs/phases/07-focus.md) |
| 8 In-app bell | merged via PR | [docs/phases/08-bell.md](docs/phases/08-bell.md) |
| 9 Lens + turbo | merged via PR | [docs/phases/09-lens.md](docs/phases/09-lens.md) |
| 10 Ship chrome | merged via PR | [docs/phases/10-ship.md](docs/phases/10-ship.md) |

Colour map: [docs/phases/index.html](docs/phases/index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases)

## Ship chrome (phase 10)

Keyboard sheet (`?`), Lens toggle (`/`), studio navigation (`g` chords), view digits on boards. Empty states on bell and boards. `not-found`, `error`, and `global-error` pages. Playwright smoke on `prisma/e2e.db`.

- `npm run test:e2e` — sign-in, Pulse, board, shortcuts, 404
- CI: `.github/workflows/e2e.yml`

## Lens (phase 9)

Turborepo around the existing Next app. Express at `apps/api`. Helpers in `@agily/lens`.

- Panel on the rail / phone header (Zustand). Same `agily_session` cookie — not JWT
- Next rewrites `/lens-api/*` to `127.0.0.1:43124`
- Ollama only on loopback. Non-loopback `OLLAMA_BASE_URL` is rejected
- `/kb` is bundled markdown. GitHub gets that source, never model weights
- If Ollama is down: extractive answers from board counts and KB snippets

## Bell (phase 8)

Assign and notes write `Notification` rows. No email.

- Bell on the rail, phone header, and `/t/[studio]/notices`
- Tap a row to mark it read and open `?focus=`
- Unread badge, Mark all read

## Focus (phase 7)

One ticket in the air. Same `Item` row.

- Ledger rows stay compact; tap to open
- Flow, Orbit, and Pulse open `?focus=`
- Desktop: centered stage. Mobile: bottom drawer
- Notes are `ItemUpdate` rows. Esc or the dim backdrop closes

## Lenses (phase 6)

One-tap chips on Ledger, Flow, and Orbit. Same tickets.

- Built-in: **Mine**, **Overdue**, **Unassigned**, **This week**, a person, a status
- Stack chips, then **Keep** to save your own name in SQLite (`FilterLens`)
- Query stays on the board: `?q=mine&status=doing` or `?lens=`

## Views (phase 5)

Same tickets, four chrome:

- **Pulse** — `/t/[studio]` — mine, overdue, recently assigned
- **Ledger** — board default — sparse sections
- **Flow** — `?view=flow` — status river (horizontal scroll on phones)
- **Orbit** — `?view=orbit` — month from `dueOn` + unscheduled

## Assign (phase 4)

People sit on the **same `Item` row** via `ItemAssignee`. No second ticket for kanban.

- Board: check teammates, or **Assign me** / **Unassign me**
- New ticket: optional **Assign me**
- Only studio members can be assigned
- People page shows ticket counts
- Viewer: initials only

## Tests

```bash
npm test              # node:test, Prisma-free pack
npm run test:coverage # c8, 100% lines / statements on that pack
npm run test:e2e      # Playwright on prisma/e2e.db
```

## Stack

Turborepo workspaces (`apps/*`, `packages/*`). Next.js App Router at the repo root, Express Lens API, TypeScript, Tailwind, Prisma + SQLite, bcrypt, httpOnly `agily_session`, Zustand for the Lens panel. Fonts in `/public/fonts`.

Architecture: [PLAN.md](PLAN.md)
