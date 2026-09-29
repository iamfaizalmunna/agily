# MF1 — Touch tokens & layout primitives

**Status:** complete  
**Branch:** `mobile/mf1-touch-tokens`

## Goal

Shared mobile layout rules so every later phase uses the same spacing, tap sizes, and safe areas.

## Deliverables

- [x] Document tokens in `src/lib/ui/mobile.ts`: min touch height, page padding, bottom nav clearance (`pb` for `main`).
- [x] `MobilePage` / `MobileStickyFooter` on Pulse, project board, sign-in touch classes.
- [x] Global: `min-h-dvh`, safe-area on auth shell + bottom nav via `mobileBottomNavClass`.
- [x] Unit tests in `src/lib/ui/mobile.test.ts`.
- [x] Pilots: sign-in (`AuthShell`), Pulse, project board page.

## Acceptance

- All primary buttons on mobile pilot screens ≥ **44px** tall.
- Main content never hidden behind bottom nav (padding accounted for).
