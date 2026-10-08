# Agily — visual tour & project status

**For visitors:** this page shows what Agily is today, how the demo works, and real UI captured by **Playwright** from the seeded **Northwind / Atlas** studio.

**Try it yourself:** `npm run dev` → [http://127.0.0.1:43123](http://127.0.0.1:43123) · demo login `owner@agily.com` / `password123` (or **Demo owner** on sign-in).

**Refresh screenshots:** `npm run screenshots` (starts web + API, seeds `prisma/e2e.db`, writes PNGs under `docs/screenshots/`).

---

## Where we are (conclusion)

Agily is a **local-first** agile planner: one SQLite database on your machine, no vendor cloud required for the demo. On **`main`**, the product includes:

| Track | Status | What you get |
|-------|--------|----------------|
| **Foundation (1–10)** | Complete | Auth, studios, projects, tickets, lenses, focus drawer, in-app inbox, Lens API + `/kb`, Playwright smoke |
| **Revamp (R1–R12)** | Complete | Kanban DnD, labels, epics, comments, analytics, Gantt timeline, ⌘K search, custom fields, CSV import/export, polished shell |
| **Mobile (MF1–MF12)** | Complete | Bottom nav, board hub, filter sheets, list focus drawer, touch-friendly kanban |
| **Studio + UI (PR #45)** | Complete | Live notification toasts, profile avatars, layout contracts, filter bar desktop/mobile |
| **Per-user appearance (CU1–CU18)** | Complete | Theme presets, four icon sets, fonts, density, radius, high contrast, sidebar tone, reduced motion, larger icons — synced on `User.appearance` |

**Quality bar:** 268 unit tests (100% pack coverage), Playwright e2e for core flows, GitHub Actions `test` on every push. Optional **Ollama** powers Lens on loopback; otherwise built-in help text.

**Not a “finished SaaS”:** Growth items (bulk edit, story points, etc.) remain in [FEATURE_GAP.md](./FEATURE_GAP.md). Agily is a **shippable local product** with room to grow.

**Deeper docs:** [phases/README.md](./phases/README.md) · [REVAMP_README.md](./phases/REVAMP_README.md) · [CUSTOM_UI_README.md](./phases/CUSTOM_UI_README.md) · [HARDENING.md](./HARDENING.md)

---

## How the app fits together

```mermaid
flowchart LR
  subgraph account
    SignIn[Sign in]
    Home[Your studios]
    Profile[Profile & appearance]
  end
  subgraph studio
    Hub[Studio hub]
    Board[Project board]
    Inbox[Inbox]
    Settings[Studio settings]
  end
  subgraph views
    Summary[Summary]
    List[List]
    Kanban[Kanban]
    Cal[Calendar]
    Time[Timeline]
  end
  SignIn --> Home
  Home --> Hub
  Hub --> Board
  Board --> Summary
  Board --> List
  Board --> Kanban
  Board --> Cal
  Board --> Time
  Hub --> Inbox
  Hub --> Settings
  Home --> Profile
```

1. **Sign in** — session cookie; auth pages stay light-themed.
2. **Pick a studio** (team) — Northwind in the demo.
3. **Open a board** (project) — Atlas has ~100 seeded tickets across views.
4. **Same tickets everywhere** — Summary stats, List bulk table, Kanban columns, Calendar month, Timeline Gantt share one dataset.
5. **Lenses & filters** — chips like **Mine**, **Overdue**, labels, epics narrow the board without duplicating rows.
6. **Account prefs** — appearance and avatar follow you across studios (not per-team skins).

---

## Desktop tour (1280×900)

### Sign in & home

| | |
|---|---|
| ![Sign in](./screenshots/desktop/01-signin.png) | **Sign in** — email/password or one-click demo owner. |
| ![Your studios](./screenshots/desktop/02-home.png) | **Home** — studios list, avatar, link to profile. |

### Studio & Atlas board

| | |
|---|---|
| ![Studio hub](./screenshots/desktop/03-studio-hub.png) | **Northwind hub** — pulse, projects, sidebar navigation. |
| ![Summary](./screenshots/desktop/04-summary.png) | **Summary** — dashboard stats and priority breakdown. |

### Five views on one board

| | |
|---|---|
| ![Kanban](./screenshots/desktop/05-kanban-board.png) | **Board** — drag cards, columns, WIP-friendly layout. |
| ![List](./screenshots/desktop/06-list.png) | **List** — dense table, bulk selection, open focus drawer. |
| ![Calendar](./screenshots/desktop/07-calendar.png) | **Calendar** — due dates on a month grid. |
| ![Timeline](./screenshots/desktop/08-timeline.png) | **Timeline** — Gantt-style schedule and dependencies. |

### Filters & chrome

| | |
|---|---|
| ![Mine lens](./screenshots/desktop/09-filters-mine.png) | **Lens: Mine** — personal filter chip on the filter bar. |
| ![Command palette](./screenshots/desktop/10-command-palette.png) | **Command palette** — search tickets, jump views, theme actions. |
| ![Shortcuts](./screenshots/desktop/11-shortcuts.png) | **Keyboard help** — press `?` for shortcuts. |

### Account & studio admin

| | |
|---|---|
| ![Profile](./screenshots/desktop/12-profile-appearance.png) | **Profile** — avatar upload, appearance presets, live preview. |
| ![Settings](./screenshots/desktop/13-studio-settings.png) | **Studio settings** — members, workflow, import/export. |
| ![Inbox](./screenshots/desktop/14-inbox.png) | **Inbox** — assignment and mention notifications. |

---

## Mobile tour (Pixel 7)

| | |
|---|---|
| ![Mobile hub](./screenshots/mobile/01-studio-hub.png) | **Studio home** — bottom nav: Home, Boards, Inbox, More. |
| ![Board picker](./screenshots/mobile/02-board-picker.png) | **Boards** — search and open a project. |
| ![Mobile summary](./screenshots/mobile/03-board-summary.png) | **Atlas** — summary with back link to all boards. |
| ![Mobile kanban](./screenshots/mobile/04-kanban.png) | **Kanban** — move menu per card when drag is awkward. |
| ![More sheet](./screenshots/mobile/05-more-sheet.png) | **More** — settings, Lens, sign out, extras. |

---

## What to tell someone interested

- **Runs on your laptop** — SQLite file + Next.js UI + small Express Lens API.
- **Feels like a modern PM tool** — multiple views, command palette, notifications, customizable UI.
- **Honest scope** — no multi-tenant cloud; great for demos, learning, and extending (see gap matrix).
- **Tests prove the walkthrough** — the images on this page are regenerated by `e2e/app-tour.spec.ts`, not hand-picked mocks.

---

## Related

- [README.md](../README.md) — install, env, demo logins
- [FEATURE_GAP.md](./FEATURE_GAP.md) — Monday / Jira / Notion comparison
- [qa/phases](http://127.0.0.1:43123/qa/phases) — phase completion gallery (when dev server is running)
