# Revamp v2 changelog (R1–R12)

Shipped on `main` after the foundation phases (1–10). Each row matches a revamp PR.

| Phase | Highlights |
|:-----:|------------|
| **R1** | Kanban DnD, column ordering, swimlanes, WIP hints, board display prefs |
| **R2** | Team labels, filter bar chips, label CRUD in settings |
| **R3** | Checklists on tickets, open-checklist lens |
| **R4** | Epic hierarchy, issue types (task/bug/story/epic), epic filter |
| **R5** | Comments, replies, @mentions, activity / `ItemEvent` audit |
| **R6** | Summary analytics: burndown, status donut, sparkline |
| **R7** | Timeline (Gantt), dependencies, drag due dates, blocked lens |
| **R8** | ⌘K command palette, team search, recents |
| **R9** | Per-project workflow JSON, custom fields, board settings |
| **R10** | CSV import/export, ticket templates, duplicate board |
| **R11** | Studio shell: sidebar collapse, Create menu, settings layout, empty states |
| **R12** | Playwright revamp paths, 100-ticket Atlas seed, gap doc + ship QA |

## Views (names in UI)

| View | URL param | Notes |
|------|-----------|--------|
| Summary | `view=summary` (default) | Stats + charts |
| List | `view=list` | Split pane + filters |
| Board | `view=flow` | Kanban |
| Calendar | `view=orbit` | Month orbit |
| Timeline | `view=timeline` | Gantt |

E2E: `npm run test:e2e` — `auth.setup` (sign-in), smoke, board drag, revamp ship, keyboard, not-found.
