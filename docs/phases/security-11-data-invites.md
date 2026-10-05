# S11 — Data at rest & invite tokens

**Status:** planned  
**Branch:** `security/s11-data-invites`

## Goal

Protect SQLite files and high-entropy join links.

## Deliverables

- [ ] **Invite tokens:** verify length/entropy (`teams/tokens`); single-use or expiry enforced on accept; revoke on role removal.
- [ ] **Password storage:** bcrypt cost factor documented; no plaintext in DB seed except documented demo accounts in dev.
- [ ] **SQLite:** document OS permissions (`chmod 600`), backup location, not committing `*.db` to git (`.gitignore` audit).
- [ ] **Session token:** cryptographically random (CSPRNG); length ≥ 32 bytes.
- [ ] Optional: encrypt SQLite at rest via OS (FileVault/LUKS) — doc only.
- [ ] Tests for token parsing, expired invite, reused invite.

## Acceptance

- Expired invite link shows safe error.
- Session token format validated on create.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
