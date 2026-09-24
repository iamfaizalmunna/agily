# Agily

Local agile planner: Jira capability, Monday boards, Notion-like writing — **our SQLite only**. No cloud APIs, no OAuth, no paid AI.

Phases 1–2: own-DB auth, four access levels, teams, copy-link invites. Later: tickets, four views, Lens + **Ollama on this machine**.

## Hard rules

- Identity lives in `User` + `Session` in SQLite. Email is a unique login key, not a mailbox we send to.
- No Auth0, Clerk, NextAuth OAuth, Google/GitHub/Apple sign-in.
- No OpenAI / Anthropic / Gemini / SMTP / analytics SDKs.
- GitHub gets source + `/kb` + README. Never `.env`, `*.db`, `.ollama/`, `*.gguf`.

## Run

```bash
cp .env.example .env
npx prisma migrate dev
npm run dev
```

App: [http://127.0.0.1:43123](http://127.0.0.1:43123) (phone: same host on your LAN if you bind it; default is loopback).

**Signup:** pick Owner (name a studio), Member, or Viewer. Admin is granted by an owner — you cannot self-select it. Invites are copied `/join/[token]` links. Nothing is emailed.

## Stack

Next.js App Router, TypeScript, Tailwind, Prisma + SQLite, bcrypt, httpOnly `agily_session` cookie. Fonts ship in `/public/fonts`.

## Later

Projects, Ledger / Flow / Orbit / Pulse, filter lenses, in-app bell, Lens + Ollama (`127.0.0.1:11434`). After Ollama is installed: `ollama pull llama3.2:3b`.

Phase stories: [docs/phases](docs/phases/README.md).
