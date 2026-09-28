# R9 — Custom fields & workflows

**Status:** done  
**Branch:** `revamp/r9-custom`

## Goal

Per-project statuses and optional custom fields (Monday/Jira admin).

## Deliverables

- [x] Project `workflow` JSON: ordered statuses + colors
- [x] Migrate Flow columns from global `ITEM_STATUSES` to project workflow
- [x] Custom fields: text, number, select (stored JSON on Item)
- [x] Settings UI per board (`/t/[slug]/p/[projectSlug]/settings`)
- [x] Default workflow = current 5 statuses for backward compat
