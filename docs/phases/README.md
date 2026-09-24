# Phases 1–10

Agily is built one exit at a time. Do not start phase N+1 until phase N is done.

| | Phase | In one sentence | Story |
|:--:|:------|:----------------|:------|
| 01 | Own-DB auth | Email + password in our SQLite; httpOnly session cookie. | [Read](01-auth.md) |
| 02 | Teams + copy-link invites | Create a team; invite by email identity + `/join/[token]`. | [Read](02-teams.md) |
| 03 | Projects, groups, items | One board: groups and tickets (status, due, markdown body). | — |
| 04 | People + assign | Assignees, People rail, RBAC on writes. | — |
| 05 | Four views | Ledger / Flow / Orbit / Pulse on the same `Item` rows. | — |
| 06 | Filter lenses | Built-in chips + saved `FilterLens` per user per team. | — |
| 07 | Focus stage + comments | Desktop stage, mobile drawer, `ItemUpdate` thread. | — |
| 08 | In-app bell | `Notification` rows. No email. | — |
| 09 | Lens AI | Ollama on loopback + bundled `/kb`; extractive if daemon down. | — |
| 10 | Ship chrome | Keyboard, empty/error, gitignore, README. | — |

Architecture: [README.md](../../README.md)

Not in this product: cloud sign-in, SMTP, paid LLM APIs, Gantt, automations, file hosting, billing, a Notion wiki as a second app.
