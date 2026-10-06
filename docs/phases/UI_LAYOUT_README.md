# UI layout remediation (UL1+)

**Goal:** Ultra-consistent studio UX on **mobile, tablet, and desktop** — no dead whitespace, no clipped tables, predictable scroll — **without changing product behavior** (URLs, actions, permissions, data).

**Principles (UI / UX / architecture)**

| Lens | Rule |
|------|------|
| **UX** | One obvious scroll region per viewport; never reserve empty panes. |
| **UI** | Content uses available width; dense data truncates with tooltips before horizontal scroll. |
| **Architecture** | Shared layout contract in `src/lib/ui/layout-contract.ts`; pages compose, don’t invent breakpoints. |

## Viewport contract

| Tier | Tailwind | Width (approx) | Shell behavior |
|------|----------|----------------|----------------|
| Mobile | `< md` | &lt; 768px | Bottom nav; overlays for focus; page scroll in `main`. |
| Tablet | `md`–`lg` | 768–1023px | Sidebar + top bar; stacked or full-width panels. |
| Desktop | `lg`–`xl` | 1024–1279px | Full chrome; **no split pane** on list (detail stacked below). |
| Wide | `xl+` | ≥ 1280px | List **split pane** when `focus` is set and ticket loads. |

## Root causes (current bugs)

1. **Empty half-pane** — `lg:grid-cols-2` reserved a column with “Pick a ticket…” even when list should be full width.
2. **Clipped ticket titles** — table `min-width` + horizontal scroll position left titles off-screen.
3. **Bottom clipped / no scroll** — studio column filled viewport without a scrolling `main` (fixed in UL1).

## Phase map

| Phase | Focus | Status | Doc |
|-------|--------|--------|-----|
| **UL1** | Shell scroll + sidebar height | **complete** | [ui-layout-01-shell-scroll.md](./ui-layout-01-shell-scroll.md) |
| **UL2** | List view split / stack / table | **complete** | [ui-layout-02-list-detail.md](./ui-layout-02-list-detail.md) |
| **UL3** | Filter bar density (mobile + desktop) | **complete** | [ui-layout-03-filters.md](./ui-layout-03-filters.md) |
| **UL4** | Board (Flow) horizontal scroll + column min-width | **complete** | [ui-layout-04-board.md](./ui-layout-04-board.md) |
| **UL5** | Summary, Calendar, Timeline charts | **complete** | [ui-layout-05-other-views.md](./ui-layout-05-other-views.md) |
| **UL6** | Pulse hub, People, Notices, Settings | **complete** | [ui-layout-06-studio-pages.md](./ui-layout-06-studio-pages.md) |
| **UL7** | Auth, join, KB, empty/error states | **complete** | [ui-layout-07-public.md](./ui-layout-07-public.md) |
| **UL8** | QA matrix + Playwright layout smoke | **complete** | [ui-layout-08-qa.md](./ui-layout-08-qa.md) |

## Execution loop (same as growth/security)

1. Branch `ui-layout/ul{N}-…` from `main`.
2. Touch only layout/classes unless a phase doc says otherwise.
3. `npm test` + `npm run build`.
4. Manual pass: 390×844, 768×1024, 1280×800, 1440×900 per affected routes.
5. PR → merge.

## Shared code

- `src/lib/ui/layout-contract.ts` — breakpoint helpers, `studioMainScrollClass`, `studioProjectCanvasClass`, `listViewCanvasClass`.
- `src/components/views/list-ticket-detail.tsx` — single detail body for list focus (split / stack / mobile).

## Out of scope

- New features, API changes, workflow/status logic.
- Replacing design tokens or rebranding (see `UI_REVAMP_PLAN.md`).
