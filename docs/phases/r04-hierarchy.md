# R4 — Epics, parents & issue types

**Status:** planned  
**Branch:** `revamp/r04-hierarchy`  
**Goal:** Jira-shaped hierarchy without breaking flat boards.

## Deliverables

- `parentId` optional on Item
- `type`: task | bug | story | epic
- Breadcrumb on focus: Epic → Story
- Filter: “children of epic”
- Epic-only row on timeline (rollup optional)

## Acceptance

Cannot nest deeper than 2 levels (epic → task). Orphan tasks allowed.
