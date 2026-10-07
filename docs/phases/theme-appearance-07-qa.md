# TH7 — QA & bundle budget

**Status:** complete  
**Depends on:** TH6

## Manual matrix

| Route | Check |
|-------|--------|
| `/signin` | Fixed light + jira; no user picker |
| `/home` | Appearance page; all presets |
| `/t/*/p/*?view=flow` | Board columns, status colors per preset |
| `/t/*/notices` | Icons + unread bell |
| Mobile 390px | Bottom nav icons per set |

## Automated

- Unit: `parseUserAppearance`, registry completeness, boot script snippet includes `data-theme`.
- Optional Playwright: `appearance-smoke.spec.ts` — set preset via API/cookie fixture, assert `data-theme` on `html`.

## Bundle

- Record `next build` First Load JS before/after adding 3 icon packs.
- Target: **≤ +80kb gzip** vs baseline; if over, lazy-load non-default packs (dynamic `import()` per `iconSet` in `AppIcon`).

## Accessibility

- Icons decorative: `aria-hidden` unless sole label.
- Preset cards: contrast check with axe on light+dark × jira+editorial.

## Testing (TH7) — rollup

All phases must pass their unit tests before TH7 sign-off. TH7 adds:

| Layer | What |
|-------|------|
| E2E | `appearance-smoke.spec.ts` + avatar upload |
| Perf | Build size budget note in PR |
| Security | Avatar route: 401 unsigned, 403 non-studio peer |

## Acceptance

- [ ] Matrix signed off in PR description.
- [ ] `npm run test:coverage` green.
- [ ] `FEATURE_GAP.md` updated: “User theme / icon preference” → done.
