# R4 — Hierarchy & issue types

**Status:** planned  
**Branch:** `revamp/r4-hierarchy`

## Goal

Jira-shaped epics and children; types Bug / Story / Task / Epic.

## Deliverables

- [ ] `parentId` on Item (optional) + `type` enum
- [ ] Epic panel or filter: “children of PROJ-12”
- [ ] Breadcrumb on focus: Epic › Story
- [ ] Block creating cycles in parent chain
- [ ] Summary: roll-up count of open children per epic
- [ ] Seed: 1 epic with 4 children on Atlas
