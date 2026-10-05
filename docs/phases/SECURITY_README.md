# Security & hardening track (S1+)

**Foundation 1–10**, **Revamp R1–R12**, **Mobile MF1–MF12**, and **Growth G1–G3** are on `main`. Baseline hardening is summarized in [HARDENING.md](../HARDENING.md).

This track turns that baseline into a **repeatable, phase-by-phase** program: each slice is one branch, one PR, same quality bar as Growth (`npm test`, `npm run test:coverage`, `npm run build`).

## Principles (local-first Agily)

| Principle | Meaning |
|-----------|---------|
| **Local-first** | SQLite on disk, loopback Lens API, no mandatory cloud. Hardening focuses on self-hosted / dev-machine threat models, not SOC2 checkbox theater. |
| **Defense in depth** | Headers + env + auth + RBAC + validation + API limits stack; no single control is “enough.” |
| **Fail closed** | Unknown role, missing team scope, or bad env → deny or refuse to boot. |
| **Observable** | Security-relevant events should be loggable without storing passwords or session tokens. |
| **Testable** | Pack tests for pure security helpers; Playwright smoke where UI matters. |

## Current baseline (already on `main`)

| Area | Today |
|------|--------|
| HTTP headers | `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` via `next.config.ts` |
| Env | `assertServerEnv()` — `DATABASE_URL`, `SESSION_SECRET` (32+ chars in production) |
| Sign-in | In-memory throttle (10 failures / 15 min per email), generic errors |
| Sessions | httpOnly cookie, `SameSite=lax`, `Secure` in production |
| RBAC | `owner` / `admin` / `member` / `viewer` on team actions |
| Downloads | `safeDownloadFilename` / `contentDispositionAttachment` |
| Lens | Loopback Ollama URL; Lens API requires session + team membership for `/ask` |
| KB static | `path.basename` on KB file names |

## Progress

| Phase | Focus | Status | Branch |
|:-----:|-------|--------|--------|
| S1 | CSP + security headers v2 | **complete** | `security/s1-s2-hardening` |
| S2 | Session lifecycle & cookie hardening | **complete** | `security/s1-s2-hardening` |
| S3 | CSRF, origin, and Server Action guards | **complete** | `security/s3-csrf-actions` |
| S4 | Auth abuse (throttle v2, lockout UX) | planned | `security/s4-auth-abuse` |
| S5 | Authorization matrix & IDOR tests | planned | `security/s5-idor-rbac` |
| S6 | Input validation & output encoding | planned | `security/s6-validation-xss` |
| S7 | Lens API & proxy hardening | planned | `security/s7-lens-api` |
| S8 | Secrets, env templates, prod checklist | planned | `security/s8-secrets-env` |
| S9 | Dependency & CI supply chain | planned | `security/s9-supply-chain` |
| S10 | Security audit log (minimal) | planned | `security/s10-audit-log` |
| S11 | Data at rest & invites/tokens | planned | `security/s11-data-invites` |
| S12 | Ship: smoke tests + runbook | planned | `security/s12-ship` |

**Stories:** one file per phase under `docs/phases/security-*.md`.

## Loop

Same as [GROWTH_README.md](GROWTH_README.md):

```text
git checkout main && git pull
git checkout -b security/s{N}-short-name
# implement + tests
npm test && npm run test:coverage && npm run build
gh pr create … → merge
```

Urgent fixes between phases: small `chore/security-*` PRs are fine; fold recurring work into the next `S*` phase when possible.

## How to run the track

1. Say **“S1”** (or **“next security phase”**) — we implement that phase only, then stop for review.
2. After **S12**, update [HARDENING.md](../HARDENING.md) and close the track (or open **S13+** for new findings).

## Out of scope (unless product rules change)

- Cloud SSO (OAuth/SAML), SMTP email auth, WAF/CDN, multi-tenant isolation beyond team RBAC, HSM/KMS, formal pen-test vendor, bug bounty.

## Related docs

| Doc | Purpose |
|-----|---------|
| [HARDENING.md](../HARDENING.md) | Short “what we do today” |
| [COVERAGE.md](../COVERAGE.md) | Unit pack thresholds |
| [FEATURE_GAP.md](../FEATURE_GAP.md) | Product gaps (not security) |
| [SECURITY_GIT_LOOP.md](SECURITY_GIT_LOOP.md) | Branch naming + PR checklist |
