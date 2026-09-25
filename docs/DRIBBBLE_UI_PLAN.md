# Dribbble UI synthesis plan

References (cherry-picked patterns, no duplicate widgets):

| Shot | Take |
|------|------|
| [Project Roadmap UI](https://dribbble.com/shots/19604239-Project-Roadmap-UI) | Timeline bars, milestone feel |
| [Kanban Boards](https://dribbble.com/shots/26625085-Project-Page-Kanban-Boards) | **Draggable columns**, card density |
| [PM Dashboard](https://dribbble.com/shots/26589140-Dashboard-for-Project-Management) | Stat cards, progress bars |
| [PM Application](https://dribbble.com/shots/10071908-Project-Management-Application) | Sidebar + top bar (done) |
| [Task Management](https://dribbble.com/shots/7127024-Task-Management) | Priority chips, assignee avatars |
| [ToDo App UI](https://dribbble.com/shots/14100356-ToDo-App-UI) | Clean list rows, due dates |
| [Task Management App](https://dribbble.com/shots/19752197-Task-Management-App) | Filter chips (done) |
| [PM Dashboard 2](https://dribbble.com/shots/23771553-Project-Management-Dashboard) | Activity feed, completion metrics |

## Common theme

- **Shell:** Jira blue sidebar, light workspace, card surfaces (`--card`, soft shadow)
- **Tickets:** Issue key (`ATL-3`), priority dot, status accent, assignee stack
- **Board:** 5 columns, drag card → column updates status
- **Summary:** KPI row + status bars + priority breakdown + activity
- **Data:** Northwind studio, Atlas + Platform + Mobile boards, 20+ tickets

## Execution (done)

1. Priority tones + issue key helper (`ATL-1` style keys)
2. `TicketCard` — shared across list, pulse, board
3. `KanbanBoard` — **@dnd-kit** drag between columns
4. `ProjectGantt` — **gantt-task-react** roadmap timeline
5. Summary dashboard — KPI cards + status/priority bars
6. Seed — Atlas, Platform, **Mobile** boards with 19+ tickets

## Libraries

| Feature | Library |
|---------|---------|
| Kanban drag | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Timeline / roadmap | `gantt-task-react` |
| Icons | `lucide-react` |
