# UL1 — Studio shell scroll

**Branch:** `ui-layout/ul1-shell-scroll`  
**Status:** complete

## Problem

Desktop shell grew past the viewport; `main` did not scroll, so board footers (Save, create forms) were unreachable.

## Changes

- `layout-contract.ts`: `studioShellClass`, `studioContentColumnClass`, `studioMainScrollClass`.
- `studio-shell.tsx`: uses contract helpers; top bar `shrink-0`.
- `studio-sidebar.tsx`: `h-dvh max-h-dvh overflow-hidden` + nav `overflow-y-auto`.

## Verify

- [x] `/t/*/p/*?view=list` — scroll `main` to bottom create forms.
- [x] Sidebar boards list scrolls when many projects.
- [x] Mobile: body/main still scrolls (no `md:` trap on small screens).
