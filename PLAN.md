# Agily — plan

Local agile planner. **Foundation phases 1–10 are complete.** We are now on **Revamp v2 (R1–R12)** — one phase at a time. No cloud host, email SaaS, or paid LLM.

| Document | Open |
|----------|------|
| Product README | [README.md](README.md) |
| Foundation (1–10) | [docs/phases](docs/phases/README.md) |
| **Revamp track (R1–R12)** | **[docs/phases/REVAMP_README.md](docs/phases/REVAMP_README.md)** ← start here |
| Feature gap matrix | [docs/FEATURE_GAP.md](docs/FEATURE_GAP.md) |
| Phase gallery | [docs/phases/index.html](docs/phases/index.html) · [http://127.0.0.1:43123/qa/phases](http://127.0.0.1:43123/qa/phases) |
| Unit pack | `npm test` |

---

## Product

One person starts a **studio**, invites by **email identity + copyable join link**, and plans work on **one ticket model**. Summary, List, Board, Calendar, and Timeline read the same rows. Filter lenses are chips. A focus stage opens one ticket with notes. The bell is rows in our DB.

**Current work:** [R1 Board excellence](docs/phases/revamp-01-board.md) (kanban polish, swimlanes, persist order).

**Out of scope (revamp track).** SMTP, OAuth, S3, paid OpenAI, cloud sync, billing. Lens stays Ollama on loopback plus `/kb`.

## Roles

Owner → Admin → Member → Viewer. Team-scoped. Admin is never a signup pick.

## Auth

Opaque session token in SQLite + httpOnly `agily_session`. Express Lens reads the same cookie. Not JWT in localStorage.

## Tests

`src/lib/**/*.test.ts` and `packages/lens` via `node:test` + c8. Playwright smoke in `e2e/` on `prisma/e2e.db`.
