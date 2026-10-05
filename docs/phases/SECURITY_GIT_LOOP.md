# Security track — git loop

Mirrors Growth/Revamp: **one phase = one branch = one PR**.

## Branch names

```text
security/s1-csp-headers
security/s2-sessions
…
security/s12-ship
```

## PR checklist

- [ ] Scope matches single `security-NN-*.md` deliverables only
- [ ] `npm test` / `npm run test:coverage` / `npm run build` green
- [ ] No secrets in diff (`.env`, tokens, real `SESSION_SECRET`)
- [ ] User-visible security behavior noted in PR body (what attackers gain less of)
- [ ] [HARDENING.md](../HARDENING.md) updated if baseline table changes

## Merge

Merge to `main` when CI is green and acceptance criteria in the phase doc are met.
