# Revamp phases (v2) — one at a time

**Foundation (phases 1–10)** is done and stays on `main`. We do **not** rewrite auth, teams, or the ticket model from scratch.

This track is **Revamp v2**: Jira / Monday / Notion / GitHub parity on top of the same SQLite + session app.

## How we work

1. Pick **one** revamp phase (start at **R1** unless noted).
2. Branch: `revamp/r{N}-{short-name}` (example: `revamp/r1-board`).
3. Ship: code + tests + update the phase file **Status** to `complete`.
4. Merge to `main`, then open the next phase only.

**Rule:** Do not start R3 while R2 is in progress.

## Progress

| Phase | Name | Status | Doc |
|:-----:|------|--------|-----|
| R1 | Board excellence | **complete** | [revamp-01-board.md](revamp-01-board.md) |
| R2 | Labels & taxonomy | **complete** | [revamp-02-labels.md](revamp-02-labels.md) |
| R3 | Subtasks & checklists | **complete** | [revamp-03-subtasks.md](revamp-03-subtasks.md) |
| R4 | Hierarchy & issue types | planned | [revamp-04-hierarchy.md](revamp-04-hierarchy.md) |
| R5 | Comments & activity | planned | [revamp-05-activity.md](revamp-05-activity.md) |
| R6 | Analytics & charts | planned | [revamp-06-analytics.md](revamp-06-analytics.md) |
| R7 | Timeline & dependencies | planned | [revamp-07-timeline.md](revamp-07-timeline.md) |
| R8 | Search & command palette | planned | [revamp-08-search.md](revamp-08-search.md) |
| R9 | Custom fields & workflows | planned | [revamp-09-custom.md](revamp-09-custom.md) |
| R10 | Import / export & templates | planned | [revamp-10-data.md](revamp-10-data.md) |
| R11 | Shell & visual parity | planned | [revamp-11-shell.md](revamp-11-shell.md) |
| R12 | Ship revamp (QA + e2e) | planned | [revamp-12-ship.md](revamp-12-ship.md) |

## References

| Doc | Purpose |
|-----|---------|
| [FEATURE_GAP.md](../FEATURE_GAP.md) | Full 100-feature matrix vs Monday / Notion / Jira / GitHub |
| [UI_REVAMP_PLAN.md](../UI_REVAMP_PLAN.md) | Earlier UI sprint notes (superseded by R1–R12 for execution) |
| [README.md](README.md) | Original phases 1–10 (foundation) |

## Still out of scope (unless product rule changes)

Cloud OAuth, SMTP, paid LLM APIs, multi-tenant hosting, real-time sync across machines, billing.
