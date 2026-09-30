# MF4 — Board (flow) mobile

**Status:** complete  
**Branch:** `mobile/mf4-board`

## Goal

Kanban that **works on a phone**: readable cards, scrollable columns, reliable status changes.

## Deliverables

- [x] Column strip: horizontal scroll, snap, column headers sticky.
- [x] **Compact cards** default on `< md`; density toggle in board prefs.
- [x] Move ticket: keep DnD for pointer devices; add **“Move to…”** menu on mobile (status picker).
- [x] WIP / swimlane UI collapsed behind “Board options” sheet on mobile.
- [x] Playwright: change status via menu; optional drag on desktop project only.

## Acceptance

- 100-ticket seed board remains scrollable; one status change succeeds on 390px viewport.
