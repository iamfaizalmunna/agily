# MF12 — Ship mobile (QA + e2e)

**Status:** planned  
**Branch:** `mobile/mf12-ship`

## Goal

Lock mobile quality the way R12 did for revamp.

## Deliverables

- [ ] Playwright project **mobile-chromium** (e.g. iPhone 14 viewport) covering: nav, hub, board move, filter sheet, create, ticket detail.
- [ ] README + MOBILE_README status **complete**; short `docs/MOBILE_CHANGELOG.md`.
- [ ] Optional: document manual QA checklist (rotation, safe area, dark mode).
- [ ] `npm run test:coverage` still 100% lines on pack.

## Acceptance

- CI runs unit pack; e2e documented for local/optional CI job (match R12 pattern).
