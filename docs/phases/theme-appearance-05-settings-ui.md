# TH5 — Account appearance UI

**Status:** complete  
**Depends on:** TH4

## Route (pick one in PR)

**Recommended:** `/home/appearance` — global, not buried in studio settings.

Alternative: section on `/home` + link from studio topbar “Account”.

**Not** under `/t/[slug]/settings` (that’s team config); optional link text: “Team settings ≠ your appearance”.

## Sections

1. **Color mode** — Light / Dark / System (same as today’s toggle, larger controls).
2. **Theme preset** — 4 cards with live preview.
3. **Icon set** — 4 tiles showing the same 6 icons (board, bell, filter, close, chevron, plus).
4. **Reset** — “Restore defaults” (`jira` + `lucide` + `system`).

## Persistence

- On change: optimistic UI + debounced `updateAppearanceAction` (300ms) or Save button for slow networks.
- Toast on failure; revert to last server snapshot.

## Mobile

- Full-width cards; sticky Save not required if auto-save works.

## Testing (TH5)

| Layer | What |
|-------|------|
| E2E | `profile-appearance.spec.ts` — save preset, reload, assert `data-theme` |
| E2E | Upload avatar, assert `img` src 200 |
| A11y | axe on `/home/profile` |

## Acceptance

- [ ] Demo user A vs B: different icon sets visible simultaneously on same studio URL.
- [ ] Keyboard: preset cards focusable; visible focus ring.
- [ ] Screen reader: each control has accessible name (“Icon set: Tabler”).
