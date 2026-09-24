# Phases 1–10

Each story starts with **who it is for**, **what you see**, and **how it works**. Open a row on GitHub. Open the gallery for the colour map.

Phases **1–4 are merged on `main`**. The Phase 4 assignee commit is on GitHub — nothing left pending locally.

| | Phase | In one sentence | Story |
|:--:|:------|:----------------|:------|
| [![01](https://img.shields.io/badge/01-c9844a?style=flat-square)](01-auth.md) | Own-DB auth | Email + password in our SQLite; httpOnly session cookie. | [Read](01-auth.md) |
| [![02](https://img.shields.io/badge/02-e09a5c?style=flat-square)](02-teams.md) | Teams + copy-link invites | Create a studio; invite by email identity + `/join/[token]`. | [Read](02-teams.md) |
| [![03](https://img.shields.io/badge/03-f4efe6?style=flat-square&labelColor=12100e)](03-projects.md) | Projects, groups, items | One board: groups and tickets (status, due, markdown body). | [Read](03-projects.md) |
| [![04](https://img.shields.io/badge/04-c9844a?style=flat-square)](04-assign.md) | People + assign | Assignees on the same item. | [Read](04-assign.md) |
| [![05](https://img.shields.io/badge/05-64748b?style=flat-square)](#) | Four views | Ledger / Flow / Orbit / Pulse on the same rows. | Soon |
| [![06](https://img.shields.io/badge/06-64748b?style=flat-square)](#) | Filter lenses | Saved chips per user per team. | Soon |
| [![07](https://img.shields.io/badge/07-64748b?style=flat-square)](#) | Focus stage + comments | Desktop stage, mobile drawer. | Soon |
| [![08](https://img.shields.io/badge/08-64748b?style=flat-square)](#) | In-app bell | Notification rows. No email. | Soon |
| [![09](https://img.shields.io/badge/09-64748b?style=flat-square)](#) | Lens AI | Ollama on loopback + `/kb`. | Soon |
| [![10](https://img.shields.io/badge/10-64748b?style=flat-square)](#) | Ship chrome | Keyboard, Playwright, empty/error. | Soon |

**Gallery:** [index.html](index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases)

| Also | Open |
|------|------|
| Architecture | [PLAN.md](../../PLAN.md) |
| Product README | [../../README.md](../../README.md) |

Unit pack: `npm test` (100% on the Prisma-free files). Playwright waits until the product is complete.

Not in this product: cloud sign-in, SMTP, paid LLM APIs, Gantt, automations, file hosting, billing.
