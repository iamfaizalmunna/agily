# 08 — Features by domain

Cross-cutting capabilities and where they surface in the UI. For route details see [05](./05-routes-studio.md) and [06](./06-routes-project-board.md).

## Authentication & security

- Email/password registration and login
- Server-side sessions, cookie-based
- Login rate limiting and security audit events ([HARDENING.md](../HARDENING.md))
- CSRF-safe server actions pattern

## Studios (teams)

- Create studio, unique slug
- Member roles: owner, admin, member, viewer
- Copy-link email invites (`/join/{token}`)
- Team settings: who can create projects / invite
- Team labels (shared across projects)

## Projects & tickets

- Projects (boards) under a studio
- Groups (columns/sections) and ordered **items**
- Types: task, bug, story, epic, etc.
- Priority, status (workflow-driven), due dates, markdown body
- **Story points** (where enabled in data model)
- **Epics** — parent/child hierarchy, `epic=` filter
- **Subtasks / checklists** — progress, checklist lens
- **Custom fields** — per-project schema
- **Assignees** — many-to-many on same item row
- **Dependencies** — timeline blocked lens, Gantt links
- **Activity** — `ItemEvent` audit trail; comments with @mentions

## Views (same data)

- Summary analytics
- List with sort and bulk selection
- Kanban with DnD, swimlanes, WIP hints
- Calendar by due date
- Timeline / Gantt

## Filters & lenses

- Quick lenses: Mine, Overdue, Unassigned, This week, Open checklists, Blocked
- Status, assignee, priority, text find, labels, epic
- **Saved lenses** per user per studio (`FilterLens` model)
- Filter bar desktop + mobile sheet

## Collaboration

- Threaded comments on tickets (focus view)
- In-app **notifications** (assignments, mentions, etc.)
- Inbox page + bell badge + optional live SSE toasts
- Notification preferences in studio settings

## Search & navigation

- **Command palette** (⌘K / Ctrl+K) — search tickets, jump views, theme toggle actions
- Studio-wide search action from palette
- Recent tickets in palette
- Keyboard shortcut help (`?`)

## Settings & data

- Studio: general, notifications, labels, templates, security log (owner)
- Project: workflow editor, custom fields, CSV import/export, duplicate board
- Profile: avatar, global appearance (CU1–18)

## UI system

- shadcn + Base UI components
- **AppIcon** semantic icons across four packs
- Theme presets + light/dark/system
- Layout contracts (`src/lib/ui/layout-contract.ts`) for scroll and split panes
- Mobile shell: bottom nav, sheets, touch targets

## AI (optional)

- Lens chat panel in studio chrome
- Express API + Ollama
- `/kb` markdown knowledge base

## Quality & ops

- Unit tests (`npm test`), coverage pack
- Playwright e2e (`npm run test:e2e`)
- Screenshot tour (`npm run screenshots` → [APP_TOUR.md](../APP_TOUR.md))
- GitHub Actions `test` workflow

## Not included (see FEATURE_GAP)

Examples: SMTP email, OAuth providers, cloud hosting, real-time multi-user sync, billing, native mobile apps, enterprise SSO.

---

## Quick reference — demo data

| Item | Value |
|------|--------|
| Login | `owner@agily.com` / `password123` |
| Studio slug | `northwind` |
| Project slug | `atlas` |
| Ticket scale | ~100 seeded items for stress/demo |
