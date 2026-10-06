# S7 — Lens API & proxy hardening

**Status:** complete  
**Branch:** `security/s7-lens-api`

## Goal

Treat `apps/api` and `/lens-api` rewrite as a trust boundary, not an open sidecar.

## Deliverables

- [ ] **Rate limit** `POST /v1/lens/ask` per user (and per IP in memory).
- [ ] **Body size** already 32kb — document; add tests for oversize rejection.
- [ ] **KB routes:** confirm path traversal blocked (`..`, absolute paths); optional disable KB HTTP in production via env.
- [ ] **CORS:** default deny; only if browser must call API directly, allow explicit origin list (prefer same-origin rewrite only).
- [ ] **Health endpoints:** no sensitive data in JSON; no stack traces to client.
- [ ] **Timeouts** on Ollama fetch (already present) — document max question length + token policy.
- [ ] Tests in `packages/lens` + API route tests if added.

## Acceptance

- Unauthenticated `ask` → 401.
- User not in team for `slug` → 404/403.
- Burst ask requests throttled with 429.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
