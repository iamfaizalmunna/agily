# Agily

[![Unit pack](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml/badge.svg)](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml)
[![Phase](https://img.shields.io/badge/phase-7%2F10-c9844a)](docs/phases/README.md)
[![Coverage](https://img.shields.io/badge/unit%20pack-100%25-10b981)](docs/phases/README.md)
[![AI](https://img.shields.io/badge/AI-Ollama%20localhost%20only-12100e)](docs/phases/README.md)

Local agile planner: Jira capability, Monday boards, Notion-like writing — **our SQLite only**. No cloud APIs, no OAuth, no paid AI.

**Now:** own-DB auth, invites, boards, assignees, four views, lenses, focus stage.  
**Later:** in-app bell, Lens + Ollama on this machine.

## Main

Phases **1–7 are merged on `main`** through feature branches (Phase 7: `phase-7-focus-stage` → PR → merge).

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

App: [http://127.0.0.1:43123](http://127.0.0.1:43123)

**Signup:** Owner names a studio. Member / Viewer wait for a `/join/[token]` link. Admin is granted by an owner.

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
| 8–10 | not started | [docs/phases/README.md](docs/phases/README.md) |

Colour map: [docs/phases/index.html](docs/phases/index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases)

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
```

Playwright is **not** installed. We add it when phases 8–10 are done, not now.

## Stack

Next.js App Router, TypeScript, Tailwind, Prisma + SQLite, bcrypt, httpOnly `agily_session`. Fonts in `/public/fonts`.

Architecture: [PLAN.md](PLAN.md)
