# Agily UI + Feature Revamp Plan

Target: Jira / ZenFlow-quality studio — solid shell, filterable views, one ticket model.

## Phase A — Design system (done / in progress)

| Item | Status |
|------|--------|
| shadcn + Tailwind tokens | Done |
| Light default (Jira blue) | Done |
| Status colors for board | Done |
| Theme light/dark/system | Done |

## Phase B — Project views (done)

| Tab | Route | Component |
|-----|-------|-----------|
| Summary | default | `summary-dashboard.tsx` |
| List | `?view=list` | `ticket-list.tsx` |
| Board | `?view=flow` | `flow-river.tsx` |
| Calendar | `?view=orbit` | `orbit-month.tsx` |
| Timeline | `?view=timeline` | `timeline-chart.tsx` |

## Phase C — Filters (this sprint)

| Filter | URL param | Status |
|--------|-----------|--------|
| Quick presets | `q` | Done |
| Status | `status` | Done |
| Assignee | `who` | Done |
| **Priority** | `priority` | **Execute** |
| **Text search** | `find` | **Execute** |
| Saved lenses | `lens` | Done |

## Phase D — App shell (this sprint)

| Piece | Status |
|-------|--------|
| Jira dark sidebar + project list | **Execute** |
| Top bar: breadcrumbs, search, create | **Execute** |
| Mobile: keep bottom nav | **Execute** |

## Phase E — Ticket model (this sprint)

| Field | Status |
|-------|--------|
| `priority` on Item | Schema done → wire UI + actions |

## Phase F — Settings (this sprint)

| Feature | Status |
|---------|--------|
| `/t/[slug]/settings` | **Execute** |
| `membersCanCreateProjects` toggle | **Execute** |
| `membersCanInvite` toggle | **Execute** |
| `defaultInviteRole` select | **Execute** |

## Phase G — List + detail (this sprint)

| Feature | Status |
|---------|--------|
| Split pane: list + inline detail | **Execute** |
| Slide-over for mobile | Keep `focus-stage` |

## Phase H — Later (out of scope this sprint)

- Drag-and-drop board
- Issue keys (PROJ-123)
- Issue types / epics
- Gantt dependencies
- Time tracking / attachments
- Global command palette
- Burndown charts

## Execution order

1. Priority + search in lenses + filter bar
2. Item create/update + list/board display
3. Studio shell (sidebar + topbar)
4. Settings page
5. List split-pane detail
6. Tests + migrate
