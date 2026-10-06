# S5 — Authorization matrix & IDOR tests

**Status:** complete  
**Branch:** `security/s5-idor-rbac`

## Goal

Prove every mutation checks **team** and **role** before touching `projectId` / `itemId` / `userId`.

## Deliverables

- [ ] Spreadsheet or markdown **matrix**: action × required role × resource scope (generate from code audit).
- [ ] Fix gaps: viewer cannot mutate; member cannot change settings; cross-team item access returns generic 404/403.
- [ ] **IDOR tests** (unit or integration with Prisma test DB): user A cannot update team B’s item by ID guessing.
- [ ] Shared guard: `requireTeamMember(slug, minRole)` used consistently in actions.
- [ ] Lens API: same membership check pattern documented and tested.

## Acceptance

- Matrix checked off; at least one automated test per high-risk action (delete project, bulk update, role change, export CSV).

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
