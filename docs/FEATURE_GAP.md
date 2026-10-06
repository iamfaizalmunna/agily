# Agily vs Monday · Notion · Jira · GitHub

Legend: **Have** = shipped · **Partial** = basic version · **Missing** = not built

Agily is intentionally **local SQLite, no cloud APIs** — some enterprise items stay out of scope unless you relax that rule.

---

## Work items (core)

| # | Feature | Mon | Notion | Jira | GH | Agily |
|---|---------|-----|--------|------|-----|-------|
| 1 | Tasks / issues | ✓ | ✓ | ✓ | ✓ | **Have** |
| 2 | Title + description | ✓ | ✓ | ✓ | ✓ | **Have** (body text) |
| 3 | Status workflow | ✓ | ✓ | ✓ | ✓ | **Have** (per-project workflow, R9) |
| 4 | Priority | ✓ | ○ | ✓ | ○ | **Have** |
| 5 | Due date | ✓ | ✓ | ✓ | ○ | **Have** |
| 6 | Assignees (multi) | ✓ | ✓ | ✓ | ✓ | **Have** |
| 7 | Subtasks / checklists | ✓ | ✓ | ✓ | ○ | **Have** (R3) |
| 8 | Parent / child (epic → story) | ✓ | ✓ | ✓ | ○ | **Have** (R4) |
| 9 | Issue keys (PROJ-123) | ○ | ○ | ✓ | ✓ | **Partial** (display only) |
| 10 | Issue types (bug, story, epic) | ○ | ○ | ✓ | ○ | **Have** (R4) |
| 11 | Labels / tags | ✓ | ✓ | ✓ | ✓ | **Have** (R2) |
| 12 | Custom fields | ✓ | ✓ | ✓ | ○ | **Have** (R9) |
| 13 | Story points / estimates | ○ | ○ | ✓ | ○ | **Have** (G2) |
| 14 | Time tracking / timers | ✓ | ○ | ✓ | ○ | **Missing** |
| 15 | Attachments / files | ✓ | ✓ | ✓ | ✓ | **Missing** |
| 16 | @mentions in description | ✓ | ✓ | ✓ | ✓ | **Missing** |
| 17 | Rich markdown / WYSIWYG | ✓ | ✓ | ✓ | ✓ | **Partial** (plain + textarea) |
| 18 | Templates for new items | ✓ | ✓ | ✓ | ○ | **Have** (R10 team templates) |
| 19 | Recurring tasks | ✓ | ○ | ○ | ○ | **Missing** |
| 20 | Dependencies (blocks / blocked by) | ✓ | ○ | ✓ | ○ | **Missing** |
| 21 | Watchers / subscribers | ○ | ○ | ✓ | ✓ | **Partial** (assignees get notices) |
| 22 | Voting / reactions | ○ | ○ | ○ | ✓ | **Missing** |
| 23 | Archive / trash | ✓ | ✓ | ✓ | ○ | **Partial** (project archive) |
| 24 | Bulk edit | ✓ | ○ | ✓ | ○ | **Have** (G1 list bulk) |
| 25 | Import / export CSV | ✓ | ✓ | ✓ | ○ | **Have** (R10) |

---

## Views & visualization

| # | Feature | Agily |
|---|---------|-------|
| 26 | Kanban board | **Have** (+ DnD) |
| 27 | List / table | **Have** |
| 28 | Calendar | **Have** (orbit month) |
| 29 | Timeline / Gantt | **Have** (gantt-task-react) |
| 30 | Summary / dashboard | **Have** |
| 31 | Swimlanes (by assignee / epic) | **Have** (assignee / priority, R1) |
| 32 | Group by / sort in list | **Partial** (groups + lens sort) |
| 33 | Column reorder on board | **Have** (R1 DnD ordering) |
| 34 | WIP limits per column | **Have** (R1 soft limits) |
| 35 | Card cover / color | **Missing** |
| 36 | Compact vs comfortable density | **Missing** |
| 37 | Full-screen focus mode | **Partial** (focus panel) |
| 38 | Split pane list + detail | **Have** (desktop) |
| 39 | Personal “My work” across boards | **Partial** (Pulse) |
| 40 | Roadmap across projects | **Missing** |
| 41 | Burndown / burnup charts | **Partial** (Summary burndown, R6) |
| 42 | Cumulative flow diagram | **Missing** |
| 43 | Velocity chart | **Missing** |
| 44 | Cycle / lead time analytics | **Missing** |
| 45 | Workload / capacity view | **Missing** |

---

## Filters, search, automation

| # | Feature | Agily |
|---|---------|-------|
| 46 | Quick filters (mine, overdue, week) | **Have** |
| 47 | Filter by status / assignee / priority | **Have** |
| 48 | Text search | **Have** |
| 49 | Saved filters (lenses) | **Have** |
| 50 | JQL / advanced query language | **Missing** |
| 51 | Global search across studio | **Have** (R8 team search) |
| 52 | Command palette (⌘K) | **Have** (R8) |
| 53 | Automation rules (when → then) | **Missing** |
| 54 | Webhooks | **Missing** |
| 55 | Email notifications | **Missing** (local-only) |
| 56 | Slack / Teams integration | **Missing** |
| 57 | Scheduled reports | **Missing** |
| 58 | Default filter per user | **Missing** |

---

## Collaboration & comments

| # | Feature | Agily |
|---|---------|-------|
| 59 | Comments on items | **Have** |
| 60 | Comment threads / replies | **Have** (R5) |
| 61 | Activity log / history | **Have** (R5 `ItemEvent` feed) |
| 62 | Real-time presence | **Missing** |
| 63 | Real-time multi-user sync | **Missing** |
| 64 | In-app notifications | **Have** |
| 65 | Notification preferences | **Missing** |
| 66 | @mention in comments | **Have** (R5) |

---

## Teams, access, settings

| # | Feature | Agily |
|---|---------|-------|
| 67 | Workspaces / studios | **Have** |
| 68 | Roles (owner/admin/member/viewer) | **Have** |
| 69 | Invite links | **Have** |
| 70 | Team settings toggles | **Have** |
| 71 | Per-project permissions | **Missing** |
| 72 | Custom roles | **Missing** |
| 73 | SSO / SAML | **Missing** |
| 74 | 2FA | **Missing** |
| 75 | Audit log (admin) | **Missing** |
| 76 | API keys / REST API | **Missing** |
| 77 | Guest / external collaborators | **Partial** (viewer) |

---

## Sprints & agile (Jira-shaped)

| # | Feature | Agily |
|---|---------|-------|
| 78 | Sprints / iterations | **Missing** |
| 79 | Backlog grooming | **Partial** (groups Now/Next/Later) |
| 80 | Sprint planning board | **Missing** |
| 81 | Sprint goals | **Missing** |
| 82 | Release versions | **Missing** |
| 83 | Components / modules | **Missing** |
| 84 | Retrospective board | **Missing** |

---

## GitHub / dev integration

| # | Feature | Agily |
|---|---------|-------|
| 85 | Link commits / PRs to issues | **Missing** |
| 86 | Branch name from issue key | **Missing** |
| 87 | PR status on board card | **Missing** |
| 88 | GitHub Actions deployment info | **Missing** |
| 89 | Code review assignment sync | **Missing** |

---

## Notion-shaped (docs + PM)

| # | Feature | Agily |
|---|---------|-------|
| 90 | Wiki / doc pages per project | **Missing** |
| 91 | Databases with custom views | **Partial** (views on tickets only) |
| 92 | Linked databases | **Missing** |
| 93 | Embeds (Figma, Loom) | **Missing** |
| 94 | Inline databases in docs | **Missing** |

---

## Monday-shaped (work OS)

| # | Feature | Agily |
|---|---------|-------|
| 95 | Multiple board types per item | **Missing** |
| 96 | Formula columns | **Missing** |
| 97 | Dashboard widgets (drag-drop) | **Missing** |
| 98 | Workforms (intake) | **Missing** |
| 99 | Guest board sharing (public link) | **Missing** |

---

## Agily differentiators (keep)

| # | Feature | Agily |
|---|---------|-------|
| 100 | Fully local SQLite, no cloud | **Have** |
| — | Keyboard shortcuts (g p, views 1–5) | **Have** |
| — | Local AI lens (Ollama) | **Have** |
| — | Light/dark theme | **Have** |
| — | Per-user theme presets + icon set (global account) | **Have** — [THEME_APPEARANCE_README.md](./phases/THEME_APPEARANCE_README.md) |
| — | Profile photo (per user, DB + disk) | **Have** — `/home/profile` |

---

## Suggested next 10 (high impact, fits local app)

1. **Persist card order** within column (position on drag reorder)
2. **Subtasks** (checkbox list on item)
3. **Labels** (multi-tag filter)
4. **Dependencies** on timeline (Gantt links)
5. **Burndown** on Summary (done per day)
6. **Global ⌘K** search + jump to ticket
7. **Activity tab** on item (status/assignee history)
8. **Custom statuses** per project (settings)
9. **CSV export** of board
10. **Swimlanes** on kanban (by assignee or priority)

---

## DnD polish (just shipped)

- Live preview while dragging across columns (`onDragOver`)
- Touch-friendly drag (120ms delay)
- Smooth drop animation + floating overlay
- No full page refresh after drop (optimistic UI)
