# Lens API trust boundary

Next rewrites `/lens-api/*` → `LENS_API_URL` (default `http://127.0.0.1:43124`). Prefer this same-origin path; do not expose the API publicly without a proxy.

## Controls (S7)

| Control | Implementation |
|---------|----------------|
| Auth | Session cookie on `POST /v1/lens/ask` |
| Team scope | `slug` must match `teamMember` |
| Rate limit | In-memory per user + IP (`packages/lens/src/api-security.ts`) → **429** |
| Body size | Express JSON **32kb** (`LENS_ASK_BODY_LIMIT`) |
| Question length | Zod max **500** chars |
| KB HTTP | Off in production unless `LENS_KB_HTTP=true`; `safeKbBasename` blocks traversal |
| CORS | Deny by default; optional `LENS_CORS_ORIGINS` comma list |
| Health | Production omits Ollama base URL from JSON |
| Ollama fetch | **12s** timeout (`lensAskTimeoutMs`) |

## Verify

```bash
npm test
# Unauthenticated ask → 401 (manual or e2e)
```
