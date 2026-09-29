<h1 align="center">Agily</h1>

<p align="center">
  Local agile planner — teams, boards, filters, and optional on-device AI.<br>
  <strong>Foundation (1–10)</strong> and <strong>Revamp (R1–R12)</strong> are <strong>complete</strong> on <code>main</code>.
</p>

<p align="center">
  <a href="https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml"><img src="https://github.com/iamfaizalmunna/agily/actions/workflows/test.yml/badge.svg" alt="Unit pack"></a>
  <a href="docs/phases/README.md"><img src="https://img.shields.io/badge/Foundation-10%2F10-c9844a?style=flat-square" alt="Foundation"></a>
  <a href="docs/phases/REVAMP_README.md"><img src="https://img.shields.io/badge/Revamp-12%2F12-10b981?style=flat-square" alt="Revamp"></a>
  <a href="docs/phases/README.md"><img src="https://img.shields.io/badge/Unit%20pack-100%25-10b981?style=flat-square" alt="Coverage"></a>
  <a href="#run-in-cursor-agent"><img src="https://img.shields.io/badge/App-127.0.0.1%3A43123-c9844a?style=flat-square" alt="App"></a>
  <a href="#run-in-cursor-agent"><img src="https://img.shields.io/badge/Lens%20API-127.0.0.1%3A43124-12100e?style=flat-square" alt="Lens API"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Express%205-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Prisma%206-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Zod-3B82F6?style=flat-square" alt="Zod">
  <img src="https://img.shields.io/badge/Zustand-443B36?style=flat-square" alt="Zustand">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/dnd--kit-8B5CF6?style=flat-square" alt="dnd-kit">
  <img src="https://img.shields.io/badge/Base%20UI-000000?style=flat-square" alt="Base UI">
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square" alt="shadcn">
  <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square" alt="Lucide">
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/c8%20coverage-10b981?style=flat-square" alt="c8">
  <img src="https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white" alt="Ollama">
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions">
</p>

<p align="center">
  <a href="#roadmap">Roadmap</a> ·
  <a href="#tech-we-use">Tech</a> ·
  <a href="#run-in-cursor-agent">Run in Cursor</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#demo-logins">Logins</a> ·
  <a href="#hard-rules">Rules</a> ·
  <a href="PLAN.md">PLAN.md</a> ·
  <a href="docs/phases/REVAMP_README.md">Revamp R1–R12</a> ·
  <a href="docs/HARDENING.md">Hardening</a> ·
  <a href="http://127.0.0.1:43123/qa/phases">Phase gallery</a>
</p>

---

## In plain English

**What it is:** Agily is a **local** planning app for small teams — sign in, create a studio, add projects, and manage work on boards. Everything stays in a **SQLite file on your machine** (no cloud account required for the demo).

**What you can do:** Summary dashboard, list, kanban board, calendar, and timeline on the **same tickets**; labels, checklists, epics, comments, filters, CSV import/export, command palette (⌘K), and studio settings. Optional **Lens** assistant uses **Ollama on your laptop** (or built-in help text if AI is off).

**Quality:** Automated **unit tests** (100% line coverage on our core pack), **browser tests** for main flows, and **GitHub Actions** on every change. A **security hardening** pass adds safer headers, login attempt limits, and stricter startup checks — see [HARDENING.md](docs/HARDENING.md).

**Demo:** [http://127.0.0.1:43123](http://127.0.0.1:43123) after `npm run dev` — studio **northwind**, project **atlas**, logins below.

---

## Roadmap

**Foundation (phases 1–10)** and **Revamp v2 (R1–R12)** are finished on `main`. **Next track:** [Mobile-first & solid UI (MF1–MF12)](docs/phases/MOBILE_README.md) — Jira-like phone experience, site-wide.

**Charts (browser):** [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases) · [docs/phases/index.html](docs/phases/index.html)  
**Gap matrix:** [docs/FEATURE_GAP.md](docs/FEATURE_GAP.md) · **Git loop:** [docs/phases/REVAMP_GIT_LOOP.md](docs/phases/REVAMP_GIT_LOOP.md)

### Foundation — phases 1–10 (complete)

| | Phase | What shipped |
|:--:|:------|:-------------|
| [![01](https://img.shields.io/badge/01-c9844a?style=flat-square)](docs/phases/01-auth.md) | **[Own-DB auth](docs/phases/01-auth.md)** | Email + password in SQLite; httpOnly `agily_session` cookie |
| [![02](https://img.shields.io/badge/02-e09a5c?style=flat-square)](docs/phases/02-teams.md) | **[Teams + invites](docs/phases/02-teams.md)** | Studios, roles, `/join/[token]` copy-link invites |
| [![03](https://img.shields.io/badge/03-f4efe6?style=flat-square&labelColor=12100e)](docs/phases/03-projects.md) | **[Projects & items](docs/phases/03-projects.md)** | Groups, tickets, status, due dates, markdown body |
| [![04](https://img.shields.io/badge/04-c9844a?style=flat-square)](docs/phases/04-assign.md) | **[People + assign](docs/phases/04-assign.md)** | `ItemAssignee` on the same row — no duplicate cards |
| [![05](https://img.shields.io/badge/05-c9844a?style=flat-square)](docs/phases/05-views.md) | **[Views](docs/phases/05-views.md)** | Same data in multiple views (evolved in revamp to Summary / List / Board / Calendar / Timeline) |
| [![06](https://img.shields.io/badge/06-c9844a?style=flat-square)](docs/phases/06-lenses.md) | **[Filter lenses](docs/phases/06-lenses.md)** | Mine, overdue, saved chips per user per team |
| [![07](https://img.shields.io/badge/07-c9844a?style=flat-square)](docs/phases/07-focus.md) | **[Focus + notes](docs/phases/07-focus.md)** | Stage / drawer, `ItemUpdate` thread on a ticket |
| [![08](https://img.shields.io/badge/08-c9844a?style=flat-square)](docs/phases/08-bell.md) | **[In-app bell](docs/phases/08-bell.md)** | `Notification` rows — no SMTP |
| [![09](https://img.shields.io/badge/09-c9844a?style=flat-square)](docs/phases/09-lens.md) | **[Lens AI](docs/phases/09-lens.md)** | Turborepo, Express `@agily/api`, Ollama loopback + `/kb` |
| [![10](https://img.shields.io/badge/10-c9844a?style=flat-square)](docs/phases/10-ship.md) | **[Ship chrome](docs/phases/10-ship.md)** | `?` shortcuts, empty/error pages, Playwright smoke |

Full index: [docs/phases/README.md](docs/phases/README.md)

### Revamp v2 — R1–R12 (complete)

| | Phase | Status | What shipped |
|:--:|:------|:------:|:-------------|
| [![R1](https://img.shields.io/badge/R1-10b981?style=flat-square)](docs/phases/revamp-01-board.md) | **[Board excellence](docs/phases/revamp-01-board.md)** | done | Kanban DnD, column reorder, swimlanes, WIP, board settings |
| [![R2](https://img.shields.io/badge/R2-10b981?style=flat-square)](docs/phases/revamp-02-labels.md) | **[Labels & taxonomy](docs/phases/revamp-02-labels.md)** | done | Team labels, filter bar, settings CRUD |
| [![R3](https://img.shields.io/badge/R3-10b981?style=flat-square)](docs/phases/revamp-03-subtasks.md) | **[Subtasks & checklists](docs/phases/revamp-03-subtasks.md)** | done | Checklists, progress, `?q=checklist` lens |
| [![R4](https://img.shields.io/badge/R4-10b981?style=flat-square)](docs/phases/revamp-04-hierarchy.md) | **[Hierarchy & types](docs/phases/revamp-04-hierarchy.md)** | done | Epic parent/child, task/bug/story/epic, `?epic=` filter |
| [![R5](https://img.shields.io/badge/R5-10b981?style=flat-square)](docs/phases/revamp-05-activity.md) | **[Comments & activity](docs/phases/revamp-05-activity.md)** | done | Activity tab, `ItemEvent` audit, replies, @mentions |
| [![R6](https://img.shields.io/badge/R6-10b981?style=flat-square)](docs/phases/revamp-06-analytics.md) | **[Analytics & charts](docs/phases/revamp-06-analytics.md)** | done | Burndown, status donut, sparkline, Pulse overdue |
| [![R7](https://img.shields.io/badge/R7-10b981?style=flat-square)](docs/phases/revamp-07-timeline.md) | **[Timeline & dependencies](docs/phases/revamp-07-timeline.md)** | done | Gantt deps, milestones, drag due, Blocked lens |
| [![R8](https://img.shields.io/badge/R8-10b981?style=flat-square)](docs/phases/revamp-08-search.md) | **[Search & command palette](docs/phases/revamp-08-search.md)** | done | ⌘K palette, team search, recents |
| [![R9](https://img.shields.io/badge/R9-10b981?style=flat-square)](docs/phases/revamp-09-custom.md) | **[Custom fields & workflows](docs/phases/revamp-09-custom.md)** | done | Per-project workflow, custom fields, board settings |
| [![R10](https://img.shields.io/badge/R10-10b981?style=flat-square)](docs/phases/revamp-10-data.md) | **[Import / export](docs/phases/revamp-10-data.md)** | done | CSV in/out, templates, duplicate board |
| [![R11](https://img.shields.io/badge/R11-10b981?style=flat-square)](docs/phases/revamp-11-shell.md) | **[Shell & visual parity](docs/phases/revamp-11-shell.md)** | done | Sidebar, topbar, empty states, settings layout |
| [![R12](https://img.shields.io/badge/R12-10b981?style=flat-square)](docs/phases/revamp-12-ship.md) | **[Ship revamp](docs/phases/revamp-12-ship.md)** | done | E2E revamp paths, 100-ticket seed, [changelog](docs/REVAMP_CHANGELOG.md) |

**Revamp views on a board:** Summary · List (`?view=list`) · Board (`?view=flow`) · Calendar (`?view=orbit`) · Timeline (`?view=timeline`). See [REVAMP_CHANGELOG.md](docs/REVAMP_CHANGELOG.md).

---

## Run in Cursor (Agent)

Open this repo in **Cursor**. Required: **Node 22+** (matches CI), **npm 10+**. SQLite is file-based — no MySQL. The Agent can copy env, migrate, seed, test, and start web + Lens API together.

**Paste into Agent chat**

```text
Run Agily for local development.

1. Copy env if missing: cp .env.example .env
   Set SESSION_SECRET to a long random string (keep DATABASE_URL as file:./prisma/dev.db).
2. npm ci
   (Repo has .npmrc legacy-peer-deps for gantt-task-react + React 19.)
3. npx prisma generate && npx prisma migrate dev && npx prisma db seed
4. npm test && npm run test:coverage
5. npm run dev
6. Tell me when the UI is at http://127.0.0.1:43123 and Lens health is at http://127.0.0.1:43124/v1/health.
7. Sign in as owner@agily.com / password123, open team northwind, project atlas.
```

Optional local AI: `ollama pull llama3.2:3b` and keep Ollama on `127.0.0.1:11434`. If Ollama is down, Lens still answers from `/kb` snippets and board counts.

| After it runs | Open |
|---------------|------|
| App | [http://127.0.0.1:43123](http://127.0.0.1:43123) |
| Sign-in (demo rows when `npm run dev`) | [http://127.0.0.1:43123/signin](http://127.0.0.1:43123/signin) |
| Phase gallery | [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases) |
| Lens health | [http://127.0.0.1:43124/v1/health](http://127.0.0.1:43124/v1/health) |
| Demo studio / project | Team **northwind** · project **atlas** |

Manual steps: [Quick start](#quick-start). E2E: `npm run test:e2e` (uses `prisma/e2e.db`).

---

## Tech we use

Everything below is in this repo today — not a wish list.

| Area | Technologies |
|------|----------------|
| **App shell** | [Next.js 16](https://nextjs.org/) App Router, [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), Server Actions, `next dev` on `127.0.0.1:43123` |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/), PostCSS (`@tailwindcss/postcss`), [tw-animate-css](https://www.npmjs.com/package/tw-animate-css), `clsx`, `tailwind-merge`, [class-variance-authority](https://cva.style/docs) |
| **UI components** | [Base UI](https://base-ui.com/), [shadcn](https://ui.shadcn.com/) CLI, [Lucide](https://lucide.dev/) icons |
| **Client state** | [Zustand](https://zustand.docs.pmnd.rs/) (Lens panel rail) |
| **Boards & timeline** | [@dnd-kit](https://dndkit.com/) (core, sortable, modifiers, utilities), kanban server actions, [frappe-gantt](https://frappe.io/gantt), [gantt-task-react](https://www.npmjs.com/package/gantt-task-react) |
| **API service** | [Express 5](https://expressjs.com/) (`apps/api`), [cookie-parser](https://www.npmjs.com/package/cookie-parser), shared `@agily/lens` package |
| **Database** | [Prisma 6](https://www.prisma.io/) + [SQLite](https://www.sqlite.org/) (`file:./prisma/dev.db`), migrations + `tsx` seed |
| **Auth & sessions** | [bcrypt](https://www.npmjs.com/package/bcrypt), httpOnly `agily_session` cookie, role ladder on `User` / `TeamMember` |
| **Validation** | [Zod 4](https://zod.dev/) (forms, Lens payloads, env guards) |
| **AI (local only)** | [Ollama](https://ollama.com/) on loopback (`OLLAMA_BASE_URL`), bundled markdown in `public/kb/`, extractive fallback when the model is down |
| **Monorepo & dev** | npm workspaces, [Turborepo](https://turbo.build/), [concurrently](https://www.npmjs.com/package/concurrently) (web + API), [tsx](https://tsx.is/) for scripts and tests |
| **Testing** | Node.js built-in [`node:test`](https://nodejs.org/api/test.html), [c8](https://github.com/bcoe/c8) coverage (100% lines on the configured pack), [Playwright](https://playwright.dev/) E2E |
| **Lint & quality** | [ESLint 9](https://eslint.org/) + `eslint-config-next`, optional [SonarQube](https://www.sonarsource.com/products/sonarqube/) (`sonar-project.properties`, `npm run sonar`) |
| **Hardening** | [docs/HARDENING.md](docs/HARDENING.md) — headers, env guard, sign-in throttle, safe exports |
| **CI & tooling** | [GitHub Actions](https://github.com/features/actions) (Node 22, `npm ci`, Prisma generate, unit pack), `.npmrc` `legacy-peer-deps` for React 19 + Gantt peers |
| **Runtime** | Node **22+** (CI), no Docker required for the default demo |

### Why these choices

| Layer | Choice | Why it is here |
|-------|--------|----------------|
| UI | Next.js + React + Tailwind + Base UI / shadcn | One codebase for studio chrome, boards, and focus stage |
| Data | Prisma + SQLite | Single-machine demo; migrations committed |
| Auth | bcrypt + session cookie | No OAuth vendors; identity stays in our DB |
| Monorepo | `apps/api` + `packages/lens` | Lens Express beside Next without a second repository |
| AI | Ollama loopback + `/kb` | No paid LLM keys; non-loopback `OLLAMA_BASE_URL` is rejected |
| Boards | dnd-kit + server actions | Revamp R1 ordering and WIP on the same `Item` row |
| Quality | node:test + c8 + Playwright + Sonar (optional) | `.github/workflows/test.yml` on every push / PR |

---

## Quick start

```bash
git clone https://github.com/iamfaizalmunna/agily.git
cd agily
cp .env.example .env          # set SESSION_SECRET
npm ci
npx prisma migrate dev
npx prisma db seed
npm test
npm run dev
```

- App: [http://127.0.0.1:43123](http://127.0.0.1:43123)
- Lens API: [http://127.0.0.1:43124/v1/health](http://127.0.0.1:43124/v1/health)

`npm run dev` runs Next and Express together (`concurrently`). Public demo host pattern (like ZenFlow `example.*`): set `NEXT_PUBLIC_DEMO_MODE=true` or use a hostname starting with `example.`.

---

## Demo logins

Same convention as [ZenFlowAI](https://github.com/iamfaizalmunna/zenflowai): `*@agily.com` / **`password123`**. Tap a row on `/signin` when demo mode is on.

| Email | Role |
|-------|------|
| `owner@agily.com` | Owner |
| `admin@agily.com` | Admin |
| `member@agily.com` | Member |
| `viewer@agily.com` | Viewer |

Seed all four on studio **Northwind**: `npx prisma db seed`

---

## Hard rules

- Identity lives in `User` + `Session` in SQLite. Email is a login key, not a mailbox.
- No Auth0, Clerk, NextAuth OAuth, Google/GitHub/Apple sign-in.
- No OpenAI / Anthropic / Gemini / SMTP / analytics SDKs.
- GitHub gets source + `/kb` + README. Never `.env`, `*.db`, `.ollama/`, `*.gguf`.

---

## What you can try today

| Area | In the product |
|------|----------------|
| **Studio home** | Pulse — your work, overdue, quick links |
| **Board views** | Summary · List · Board (kanban) · Calendar · Timeline (Gantt) |
| **Planning** | Labels, checklists, epics, issue types, custom fields, per-project workflow |
| **Filters** | Mine, overdue, status, labels, saved lenses |
| **Data** | CSV import/export, ticket templates, duplicate board |
| **Collaboration** | Comments, activity, @mentions, in-app notifications |
| **Chrome** | Collapsible sidebar, ⌘K command palette, team search, `?` shortcuts |
| **Lens** | Side panel — local Ollama + bundled help articles |
| **Focus** | Open one ticket full-screen with notes (`?focus=`) |

**Tests**

```bash
npm test              # node:test (~130+ tests on core logic)
npm run test:coverage # c8 — 100% lines on configured pack
npm run test:e2e      # Playwright (sign-in, board, filters, timeline, settings)
npm run sonar         # coverage + sonar-scanner (local)
```

**CI SonarQube (optional):** In GitHub → Settings → Secrets and variables → Actions, set `SONAR_TOKEN` and `SONAR_HOST_URL` (for [SonarCloud](https://sonarcloud.io), use `https://sonarcloud.io`). Add repository variable `SONAR_ENABLED` = `true` to run the Sonar job after the unit pack. Uncomment `sonar.organization` in `sonar-project.properties` for SonarCloud.

---

## Architecture

```
src/                 Next.js app (routes, components, server actions)
apps/api/            Express Lens service (@agily/api)
packages/lens/       Shared Lens helpers
prisma/              schema, migrations, seed (demo-studio)
public/kb/           Bundled markdown for Lens retrieval
docs/phases/         One story per phase + HTML gallery
PLAN.md              Architecture snapshot
```

Repo: [github.com/iamfaizalmunna/agily](https://github.com/iamfaizalmunna/agily)
