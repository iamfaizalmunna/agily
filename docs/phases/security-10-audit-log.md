# S10 — Security audit log (minimal)

**Status:** complete  
**Branch:** `security/s10-audit-log`

## Goal

Append-only record of security-sensitive events for forensics on a single machine.

## Deliverables

- [ ] **Prisma model** `SecurityEvent` (or reuse `ItemEvent` pattern): `kind`, `actorUserId`, `teamId?`, `meta` JSON, `createdAt`.
- [ ] **Kinds:** `sign_in_success`, `sign_in_failure`, `sign_out`, `role_change`, `invite_created`, `invite_accepted`, `team_deleted`, `csv_export`, `bulk_update` (subset — start with auth + RBAC).
- [ ] **Writer helper** — never log password, token, or session id.
- [ ] **Owner-only UI** or settings page “Recent security activity” (last 50) — optional if timeboxed; else CLI/script query.
- [ ] Tests for writer + redaction.

## Acceptance

- Failed sign-in creates row without storing plaintext password.
- Role change records actor + target + old/new role in `meta`.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
