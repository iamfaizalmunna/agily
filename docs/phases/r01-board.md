# R1 — Board & drag

**Status:** in progress  
**Branch:** `revamp/r01-board`  
**Who:** anyone moving work on the Flow board  
**Goal:** Kanban that feels like Jira/Monday — smooth DnD, stable order, demo-ready.

## Done already

- [x] @dnd-kit kanban with overlay + touch
- [x] Cross-column drag with optimistic UI
- [x] Live preview while dragging (`onDragOver`)
- [x] Ticket cards (issue key, priority, assignees)
- [x] Status change persisted via `moveItemStatusQuickAction`

## Still to do (R1 acceptance)

- [ ] **Persist card order** within a column (`position` + `reorderItemAction`)
- [ ] **Column drop** saves order when reordering in same column
- [ ] **WIP limit** optional per status (studio setting, soft warning on column header)
- [ ] **Board empty states** + “Add ticket” quick action on column
- [ ] Playwright: drag card from Doing → Review
- [ ] Update seed so every column has ≥1 card

## Acceptance

1. Drag between columns updates status without page flash.
2. Reorder within column survives refresh.
3. Viewer role cannot drag.
4. `npm test` + `npm run build` green.

## Not in R1

Swimlanes, custom columns, automations.

## Code touchpoints

`kanban-board.tsx` · `items/actions.ts` (reorder) · `prisma` (position already exists)
