# Agily

[![Unit pack](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml/badge.svg)](https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml)
[![Phase](https://img.shields.io/badge/phase-3%2F10-c9844a)](docs/phases/README.md)
[![Coverage](https://img.shields.io/badge/unit%20pack-100%25-10b981)](docs/phases/README.md)
[![AI](https://img.shields.io/badge/AI-Ollama%20localhost%20only-12100e)](docs/phases/README.md)

Local agile planner: Jira capability, Monday boards, Notion-like writing — **our SQLite only**. No cloud APIs, no OAuth, no paid AI.

**Now:** own-DB auth, four access levels, copy-link invites, boards with groups and tickets.  
**Later:** Ledger / Flow / Orbit / Pulse, lenses, focus stage, Lens + Ollama on this machine.

## Hard rules

- Identity lives in `User` + `Session` in SQLite. Email is a login key, not a mailbox.
- No Auth0, Clerk, NextAuth OAuth, Google/GitHub/Apple sign-in.
- No OpenAI / Anthropic / Gemini / SMTP / analytics SDKs.
- GitHub gets source + `/kb` + README. Never `.env`, `*.db`, `.ollama/`, `*.gguf`.

## Run

```bash
cp .env.example .env
npx prisma migrate dev
npm install
npm test
npm run dev
```

App: [http://127.0.0.1:43123](http://127.0.0.1:43123)

**Signup:** Owner names a studio. Member / Viewer wait for a `/join/[token]` link. Admin is granted by an owner.

## Phases

| Phase | Status | Story |
|------:|:-------|:------|
| 1 Auth | done | [docs/phases/01-auth.md](docs/phases/01-auth.md) |
| 2 Teams + invites | done | [docs/phases/02-teams.md](docs/phases/02-teams.md) |
| 3 Projects / groups / items | done | [docs/phases/03-projects.md](docs/phases/03-projects.md) |
| 4–10 | next | [docs/phases/README.md](docs/phases/README.md) |

Colour map: [docs/phases/index.html](docs/phases/index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases)

## Tests

```bash
npm test              # node:test, Prisma-free pack
npm run test:coverage # c8, 100% lines / funcs / branches on that pack
```

Playwright is **not** installed. We add it when phases 4–10 are done, not now.

## Stack

Next.js App Router, TypeScript, Tailwind, Prisma + SQLite, bcrypt, httpOnly `agily_session`. Fonts in `/public/fonts`.

Architecture: [PLAN.md](PLAN.md)
