# R4 — Hierarchy & issue types

**Status:** complete  
**Branch:** `revamp/r4-hierarchy`

## Goal

Jira-shaped epics and children; types Bug / Story / Task / Epic.

## Deliverables

- [x] `parentId` on Item (optional) + `type` enum
- [x] Epic filter: children of epic (`?epic=`)
- [x] Breadcrumb on focus: Epic › Story
- [x] Block creating cycles in parent chain
- [x] Summary: roll-up count of open children per epic
- [x] Seed: 1 epic with 4 children on Atlas
