# UL2 — List view layout

**Branch:** `ui-layout/ul2-list-detail`  
**Status:** complete

## Problem

- Split grid at `lg` left half empty when no focus or narrow desktop.
- Table horizontal overflow hid **Ticket** column.
- Detail pane duplicated across split / mobile.

## Changes

- Split pane only when `focus` resolves **and** `xl+` (`listViewGridClass`).
- Tablet/desktop (`md`–`lg`): detail **stacked** full width below list.
- Mobile: sheet via `MobileFocusDetail` (`md:hidden`).
- `ticket-list-bulk-table`: `table-fixed`, responsive columns, scroll reset, truncate titles.
- `list-ticket-detail.tsx`: shared detail body.
- `listDetailSplitPanelClass`, `listDetailStackedPanelClass`, `listTableScrollClass` in layout contract.

## Verify

- [x] No focus: list **full width** at all breakpoints ≥ `md`.
- [x] Focus at 1100px: list full width + detail card below.
- [x] Focus at 1400px: 50/50 split; detail scrolls inside pane.
- [x] Ticket titles visible without horizontal scroll at 1280px.
