# R10 — Custom workflow per board

**Status:** planned  
**Branch:** `revamp/r10-workflow`  
**Goal:** Jira-like configurable columns (within reason).

## Deliverables

- `Project.workflow` JSON: ordered statuses, optional rename
- Board columns driven by workflow (not hardcoded 5)
- Transition rules: optional (e.g. cannot skip Review)
- Settings UI on `/t/[slug]/settings` + per-project board settings

## Acceptance

One board can use 4 columns; another keeps default 5.
