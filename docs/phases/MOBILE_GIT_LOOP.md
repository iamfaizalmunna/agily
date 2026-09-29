# Mobile phase loop (MF1–MF12)

Same rhythm as revamp: **one phase → one branch → one PR → merge → next.**

## Every phase (repeat)

| Step | Action |
|:----:|--------|
| 1 | `git checkout main && git pull origin main` |
| 2 | `git checkout -b mobile/mf{N}-{short-name}` |
| 3 | Build what the phase doc says |
| 4 | **Unit tests** — `npm test` and `npm run test:coverage` (100% lines on `.c8rc.json` pack) |
| 5 | **Hardening** — no secrets in diff; touch auth/export paths carefully; follow [HARDENING.md](../HARDENING.md) when relevant |
| 6 | **UI check** — `npm run dev`, spot-check **390px** + desktop `md:`; no content under bottom nav |
| 7 | Update phase file + [MOBILE_README.md](MOBILE_README.md) progress |
| 8 | `git push -u origin mobile/mf{N}-…` → open PR → wait for **Unit pack** CI |
| 9 | **Merge** to `main` |
| 10 | Say **next** → start MF{N+1} from step 1 |

## PR checklist (copy into description)

```markdown
## Test plan
- [ ] npm test
- [ ] npm run test:coverage
- [ ] npm run build
- [ ] Mobile UI (~390px): …
- [ ] Desktop smoke: …
```

Add **Playwright** mobile viewport tests when the phase changes navigation or critical flows (required by MF12 for full suite).

## Rules

- **One open mobile PR** at a time.
- Do not start MF{N+1} until MF{N} is merged on `main`.
- Security tweaks that belong in a phase go in that phase’s PR; urgent fixes can be a small `chore/hardening-*` PR between phases.

## Branch naming

`mobile/mf1-touch-tokens` · `mobile/mf2-shell` · … · `mobile/mf12-ship`
