# UL4 — Flow board (kanban)

**Branch:** `ui-layout/ul4-board`  
**Status:** complete

## Changes

- `kanbanColumnStripClass`: keeps `overflow-x-auto` on desktop (removed `md:overflow-visible`).
- `kanban-board.tsx`: dropped nested `ScrollArea`; vertical scroll stays in studio `main`.
- `boardSettingsBarStickyClass`: sticky board controls on flow view.
- `data-testid="kanban-column-strip"` for e2e.

## Verify

- [x] Board scrolls horizontally when columns overflow.
- [x] No double-scroll fight with `main`.
