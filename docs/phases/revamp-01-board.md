# R1 — Board excellence

**Status:** complete  
**Branch:** `revamp/r1-board`  
**Who it is for:** anyone using the Flow (kanban) view daily.

## Goal

Kanban feels as smooth as Jira/Monday: drag across columns, reorder within a column, optional swimlanes, demo data that shows it off.

## Done already (baseline)

- [x] @dnd-kit kanban with overlay + touch
- [x] Live column preview while dragging
- [x] Optimistic status change (no full page reload)
- [x] Priority + issue keys on cards
- [x] Summary / list / timeline / calendar tabs

## Deliverables (finish R1)

- [x] **Persist order** — `position` updates when reordering inside a column (`reorderKanbanColumnAction`)
- [x] **Swimlanes** — toggle: group board by assignee or priority (horizontal lanes)
- [x] **WIP hint** — soft limit per column (amber header when over limit; studio setting optional)
- [x] **Board settings** chip — column visibility (hide Done), compact card density
- [x] **E2E** — Playwright: drag card from Doing → Review, assert URL/status
- [x] **Seed** — at least one lane-friendly dataset (mixed assignees per column)

## Not in R1

Labels (R2), subtasks (R3), custom statuses (R9).

## Code touchpoints

`src/components/views/kanban-board.tsx` · `src/lib/items/actions.ts` · `prisma/schema.prisma` (only if WIP limits need storage) · `e2e/`

## Acceptance

1. Drag between columns updates status and survives refresh.
2. Reorder within column survives refresh.
3. Swimlane mode readable on desktop; usable on mobile (stack lanes vertically).
4. `npm test` + `npm run build` green.
