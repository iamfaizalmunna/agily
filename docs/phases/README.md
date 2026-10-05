# Phases 1–10 (foundation — complete)

Each story starts with **who it is for**, **what you see**, and **how it works**. Open a row on GitHub. Open the gallery for the colour map.

**Install with AI:** paste the Agent block in [README.md — Run in Cursor](../../README.md#run-in-cursor-agent).

All **10 foundation phases are on `main`.** New work uses **Revamp v2**:

| | |
|--|--|
| **Active roadmap** | **[SECURITY_README.md](SECURITY_README.md)** — S1+ hardening · **[GROWTH_README.md](GROWTH_README.md)** — G1–G3 **complete** · [MOBILE_README.md](MOBILE_README.md) — MF1–MF12 **complete** · [REVAMP_README.md](REVAMP_README.md) — R1–R12 **complete** |
| Feature checklist | [FEATURE_GAP.md](../FEATURE_GAP.md) |

| | Phase | In one sentence | Story |
|:--:|:------|:----------------|:------|
| [![01](https://img.shields.io/badge/01-c9844a?style=flat-square)](01-auth.md) | Own-DB auth | Email + password in our SQLite; httpOnly session cookie. | [Read](01-auth.md) |
| [![02](https://img.shields.io/badge/02-e09a5c?style=flat-square)](02-teams.md) | Teams + copy-link invites | Create a studio; invite by email identity + `/join/[token]`. | [Read](02-teams.md) |
| [![03](https://img.shields.io/badge/03-f4efe6?style=flat-square&labelColor=12100e)](03-projects.md) | Projects, groups, items | One board: groups and tickets (status, due, markdown body). | [Read](03-projects.md) |
| [![04](https://img.shields.io/badge/04-c9844a?style=flat-square)](04-assign.md) | People + assign | Assignees on the same item. | [Read](04-assign.md) |
| [![05](https://img.shields.io/badge/05-c9844a?style=flat-square)](05-views.md) | Four views | Ledger / Flow / Orbit / Pulse on the same rows. | [Read](05-views.md) |
| [![06](https://img.shields.io/badge/06-c9844a?style=flat-square)](06-lenses.md) | Filter lenses | Saved chips per user per team. | [Read](06-lenses.md) |
| [![07](https://img.shields.io/badge/07-c9844a?style=flat-square)](07-focus.md) | Focus stage + comments | Desktop stage, mobile drawer. | [Read](07-focus.md) |
| [![08](https://img.shields.io/badge/08-c9844a?style=flat-square)](08-bell.md) | In-app bell | Notification rows. No email. | [Read](08-bell.md) |
| [![09](https://img.shields.io/badge/09-c9844a?style=flat-square)](09-lens.md) | Lens AI | Ollama on loopback + `/kb` + Express. | [Read](09-lens.md) |
| [![10](https://img.shields.io/badge/10-c9844a?style=flat-square)](10-ship.md) | Ship chrome | Keyboard, Playwright, empty/error. | [Read](10-ship.md) |

**Gallery:** [index.html](index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases)

| Also | Open |
|------|------|
| Architecture | [PLAN.md](../../PLAN.md) |
| Product README | [../../README.md](../../README.md) |

Unit pack: `npm test` (100% on the Prisma-free files). Playwright: `npm run test:e2e`.

Not in this product: cloud sign-in, SMTP, paid LLM APIs, cloud sync, billing. (Gantt and board DnD are in revamp R1/R7.)

---

## Revamp v2 quick map

| Phase | Focus |
|:-----:|-------|
| R1 | Board: DnD order, swimlanes, WIP |
| R2 | Labels |
| R3 | Subtasks |
| R4 | Epics & types |
| R5 | Activity & threaded comments |
| R6 | Burndown & charts |
| R7 | Timeline dependencies |
| R8 | ⌘K search |
| R9 | Custom statuses & fields |
| R10 | CSV & templates |
| R11 | Shell polish |
| R12 | QA & ship |
