# 01 — Product overview

## What Agily is

Agily is a **local-first** agile planning application for small teams. All product data lives in a **SQLite** database file on the machine where you run the app. There is no required cloud account, SMTP, or paid LLM API.

A **studio** (team) contains **projects** (boards). Each project holds **items** (tickets) in **groups** (columns or list sections). The same items appear in **Summary**, **List**, **Kanban**, **Calendar**, and **Timeline**—filters and lenses narrow the set without copying rows.

## Major parts of the stack

| Layer | Location | Role |
|-------|----------|------|
| **Web UI** | Next.js 16 (`src/app`) | Sign-in, studios, boards, settings, profile |
| **Data** | Prisma + SQLite (`prisma/`) | Users, sessions, teams, projects, items, notifications |
| **Lens API** | Express (`apps/api`, port **43124**) | Optional AI chat; reads session cookie + `/kb` markdown |
| **Knowledge** | `kb/*.md` + `/kb` routes | On-disk help Lens can cite |
| **Tests** | `src/**/*.test.ts`, `e2e/` | Unit pack (100% on core files), Playwright browser tests |

Default dev URLs: web **http://127.0.0.1:43123**, Lens **http://127.0.0.1:43124**.

## Shipped capability tracks (on `main`)

| Track | Summary |
|-------|---------|
| **Foundation (1–10)** | Auth, studios, projects, lenses, focus, inbox, Lens, ship chrome |
| **Revamp (R1–R12)** | Kanban DnD, labels, epics, comments, analytics, Gantt, ⌘K, custom fields, CSV |
| **Mobile (MF1–MF12)** | Bottom nav, board hub, sheets, mobile focus drawer |
| **Studio + appearance** | Live notification toasts, avatars, layout contracts, **CU1–18** global UI prefs |

## Core user journeys

1. **Sign up / sign in** → land on **Your studios** (`/home`).
2. **Open a studio** → pulse hub (`/t/{slug}`) with projects and overdue highlights.
3. **Open a project** → default **Summary**; switch views via tabs or `?view=`.
4. **Filter** → lens chips (Mine, Overdue, saved lenses, labels, epics, query params).
5. **Open a ticket** → focus stage (desktop) or drawer (mobile); comments and activity.
6. **Get notified** → bell + inbox; optional live toasts when SSE is connected.
7. **Customize** → **Profile & appearance** (per user, all studios); studio **Settings** (per team).

## Explicitly out of scope

- Hosted multi-tenant SaaS, billing, cloud sync
- Email delivery (invites are **copy-link** only)
- OAuth / social login
- Paid third-party AI keys (Lens uses **Ollama on loopback** or static help)

Gaps vs Jira/Monday/Notion are listed in [FEATURE_GAP.md](../FEATURE_GAP.md); many core PM features are already **Have**.

## Documentation map

- **This manual** — routes and access, page by page.
- **[APP_TOUR.md](../APP_TOUR.md)** — screenshots and demo narrative.
- **[phases/](../phases/README.md)** — how features were built (engineering history).
- **[PLAN.md](../../PLAN.md)** — short architecture anchor.
