# Agily — plan

Local agile planner. **Phases 1–5 are complete.** Phase 5 merged from `phase-5-four-views`. No cloud host, email SaaS, or paid LLM.

| Document | Open |
|----------|------|
| Product README | [README.md](README.md) |
| Phase stories | [docs/phases](docs/phases/README.md) |
| Phase gallery | [docs/phases/index.html](docs/phases/index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases) |
| Unit pack | `npm test` — 100% lines on the Prisma-free pack |

---

## Product

One person starts a **studio**, invites by **email identity + copyable join link**, and plans work on **one ticket model**. Pulse, Ledger, Flow, and Orbit read those same rows.

**Out of scope.** SMTP, OAuth, S3, paid OpenAI, Gantt, automations, a Notion wiki as a second product.

## Roles

Owner → Admin → Member → Viewer. Team-scoped. Admin is never a signup pick.

## Auth

Opaque session token in SQLite + httpOnly `agily_session`. Not JWT in localStorage.

## Tests

`src/lib/**/*.test.ts` via `node:test` + c8. Playwright is **not** in this pack — we add it when the product is complete.
