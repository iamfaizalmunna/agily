# 06 — Project & board routes

Pattern: `/t/{slug}/p/{projectSlug}` (demo: **northwind** / **atlas**).

**Gate:** Studio membership + project exists and not archived.

**File:** `src/app/(studio)/t/[slug]/p/[projectSlug]/page.tsx` (large server component orchestrating all views).

---

## Board URL & views

| View | URL | Query |
|------|-----|--------|
| **Summary** (default) | `/t/{slug}/p/{project}` | (no `view` or `view=summary`) |
| **List** | same | `?view=list` |
| **Board (Kanban)** | same | `?view=flow` |
| **Calendar** | same | `?view=orbit` (+ optional `ym=YYYY-MM`) |
| **Timeline (Gantt)** | same | `?view=timeline` |

Legacy alias: `view=ledger` → List.

Tabs: `ProjectTabs` / `Board views` navigation preserves filter query params when switching views.

---

## Filter & lens query parameters

Applied on top of the current view (same filtered ticket set everywhere).

| Param | Meaning |
|-------|---------|
| `q` | Built-in lens kind: `mine`, `overdue`, `unassigned`, `week`, `checklist`, `blocked` |
| `lens` | ID of a **saved lens** (per user, per studio) |
| `status` | Filter by workflow status id |
| `who` | Assignee user id |
| `priority` | `critical`, `major`, `minor`, … |
| `find` | Text search in title/body |
| `labels` | Comma-separated label ids |
| `epic` | Parent epic item id (hierarchy filter) |

**Filter bar** (desktop + mobile sheet) sets these via links. Chips show active filters.

### Board display params

| Param | Meaning |
|-------|---------|
| `focus` | Item id — opens **focus** UI for that ticket |
| `lane` | Swimlane grouping key (board view) |
| `hideDone` | Hide done column/cards when `true` |
| `compact` | Denser kanban cards |
| `sort` / `sortDir` | List view sorting |

---

## View-by-view behavior

### Summary (`view` default)

- **SummaryDashboard** — counts, priority breakdown, burndown-style charts, links into filtered views.
- Entry point after opening a project.

### List (`view=list`)

- **TicketList** / bulk table — sort bar, multi-select, bulk actions (where growth features apply).
- **ListFocusDrawer** + **ListTicketDetail** on desktop (master–detail).
- Mobile: tap row → full-screen focus dialog.

### Board (`view=flow`)

- **FlowRiver** / **KanbanBoard** — columns from project **workflow**; drag-and-drop reorder (dnd-kit).
- **Move** menu on mobile when drag is awkward.
- **Board settings bar** — WIP, swimlanes, display prefs (`parseBoardDisplayPrefs`).
- Create group / create ticket forms when `canWriteBoard`.

### Calendar (`view=orbit`)

- **OrbitMonth** — month grid; tickets on due dates.
- `ym` selects year-month.

### Timeline (`view=timeline`)

- **TimelineChart** / Gantt — dependencies, milestones, due dates.
- **Blocked** lens integrates with dependency graph.

---

## Focus (ticket detail)

| Surface | How opened |
|---------|------------|
| **Desktop stage** | `?focus={itemId}` — **FocusStage** beside list or over board |
| **Mobile drawer** | Same param — **MobileFocusDetail** / dialog |

Includes:

- Title, body (markdown), status, priority, due date, assignees, labels, custom fields
- **Comments** / **Activity** tabs (`FocusDiscussion`, activity feed from `ItemEvent`)
- Subtasks / checklists where present

Closing focus removes or clears `focus` from URL.

---

## Project settings

### `/t/{slug}/p/{projectSlug}/settings`

| | |
|---|---|
| **Access** | Member+ to view; edits need write role |
| **File** | `src/app/(studio)/t/[slug]/p/[projectSlug]/settings/page.tsx` |

| Section | Contents |
|---------|----------|
| **Workflow & fields** | Custom statuses, colors, `fieldSchema` for custom fields |
| **Import & export** | CSV import/export, duplicate board, templates (`ProjectDataTools`) |

### `/t/{slug}/p/{projectSlug}/export`

- Route handler for CSV download (GET).

---

## Create & archive

- **Create ticket / group** — forms on board when permitted.
- **Archive project** — owner/admin via action on board (hidden for viewers).

---

## Mobile-specific flows

- **All boards** back link from project header.
- **Boards** tab → search projects → open Atlas.
- **Create** bottom sheet — quick ticket create.
- **Filter** sheet — same lens params as desktop.

See [APP_TOUR.md](../APP_TOUR.md) mobile screenshots.
