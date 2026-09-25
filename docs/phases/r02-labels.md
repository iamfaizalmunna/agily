# R2 — Labels & tags

**Status:** planned  
**Branch:** `revamp/r02-labels`  
**Goal:** Jira/GitHub-style colored labels, filter chips, lens support.

## Deliverables

- `Label` model (team-scoped, name + color)
- Many-to-many `ItemLabel`
- Label picker on item form + filter bar row
- Lens spec: `label` query param + saved lenses
- Seed: 6–8 labels on Northwind tickets

## Acceptance

Filter “bug + critical” shows correct subset; labels visible on board cards and list.

## Not in R2

Custom fields beyond labels.
