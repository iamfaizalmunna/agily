# Mobile-first & solid UI (MF1–MF12)

**Progress on `main`:** MF1 **complete** · MF2 **next** (merge `mobile/mf1-touch-tokens` when PR lands).

**Goal:** Site-wide UI that feels **solid on phone first** — Jira-mobile patterns (clear nav, one-hand use, fast ticket access) — while **desktop stays the power layout** you have today.

**Not in scope unless we change the rules:** native iOS/Android store apps, cloud sync, push notifications from a vendor.

---

## How we work (same as revamp)

1. One phase at a time — **do not open MF3 while MF2 is in review.**
2. Branch: `mobile/mf{N}-{short-name}` (example: `mobile/mf1-touch-tokens`).
3. Each PR: code + **unit tests** (coverage pack where logic lives) + **Playwright mobile viewport** when UI changes + update phase doc **Status** → `complete`.
4. Merge to `main`, then cut the next branch.

Git loop: [REVAMP_GIT_LOOP.md](REVAMP_GIT_LOOP.md) (same PR discipline).

---

## Design principles (Jira-like, mobile-first)

| Principle | What it means in Agily |
|-----------|-------------------------|
| **Thumb zone** | Primary actions in bottom nav / FAB / sticky footers — not only top-right. |
| **One screen, one job** | Ticket detail = full-screen sheet on small viewports; filters = drawer, not a wall of chips. |
| **Progressive disclosure** | Summary stats → tap for detail; board columns scroll horizontally. |
| **Touch-safe** | Min **44×44px** tap targets; no hover-only controls on touch devices. |
| **Stable chrome** | Same header + bottom nav on every studio route; safe-area on notched phones. |
| **Solid feedback** | Loading skeletons, clear errors, disabled states — no “blank flash”. |
| **Desktop unchanged in spirit** | Sidebar + topbar remain from `md:` up; mobile improvements must not regress wide layouts. |

---

## Current baseline (honest)

| Area | Today | Gap |
|------|--------|-----|
| Shell | Sidebar desktop; **text-only bottom nav** on mobile | No icons, no “Boards”, no Create in nav; top bar crowded |
| Board | Kanban with DnD | Columns tight on phone; drag hard without long-press |
| List / focus | Split pane desktop | Mobile needs full-screen ticket flow |
| Filters | Full `FilterBar` always visible | Overwhelming on narrow screens |
| Auth | Responsive forms | OK; keep 48px+ inputs on mobile |
| Tests | Desktop Playwright | Need **390×844** (or similar) suite per phase |

---

## Progress

| Phase | Name | Status | Doc |
|:-----:|------|--------|-----|
| MF1 | Touch tokens & layout primitives | **complete** | [mobile-01-tokens.md](mobile-01-tokens.md) |
| MF2 | Mobile shell (Jira-like nav) | **next** | [mobile-02-shell.md](mobile-02-shell.md) |
| MF3 | Projects & board hub | planned | [mobile-03-hub.md](mobile-03-hub.md) |
| MF4 | Board (flow) mobile | planned | [mobile-04-board.md](mobile-04-board.md) |
| MF5 | List & ticket detail | planned | [mobile-05-ticket.md](mobile-05-ticket.md) |
| MF6 | Filters & search sheets | planned | [mobile-06-filters.md](mobile-06-filters.md) |
| MF7 | Create & quick actions | planned | [mobile-07-create.md](mobile-07-create.md) |
| MF8 | Settings, people, notices | planned | [mobile-08-settings.md](mobile-08-settings.md) |
| MF9 | Summary & analytics | planned | [mobile-09-summary.md](mobile-09-summary.md) |
| MF10 | Timeline & calendar | planned | [mobile-10-timeline.md](mobile-10-timeline.md) |
| MF11 | PWA & installable shell | planned | [mobile-11-pwa.md](mobile-11-pwa.md) |
| MF12 | Ship mobile (QA + e2e) | planned | [mobile-12-ship.md](mobile-12-ship.md) |

---

## Cross-cutting “solid UI” (every phase)

Check these when you touch a surface:

- [ ] Works at **320px** width without horizontal page scroll (except intentional board scroll).
- [ ] Focus visible; `aria-current` on nav; labels on icon-only buttons.
- [ ] `prefers-reduced-motion` respected for animations.
- [ ] Empty and error states use shared `EmptyState` patterns.
- [ ] No new hardcoded colors — use theme tokens (`bg-card`, `border-border`, etc.).

---

## References

| Doc | Purpose |
|-----|---------|
| [HARDENING.md](../HARDENING.md) | Security baseline (headers, auth throttle) |
| [FEATURE_GAP.md](../FEATURE_GAP.md) | Feature matrix |
| [REVAMP_CHANGELOG.md](../REVAMP_CHANGELOG.md) | What R1–R12 already shipped |
| `src/components/chrome/studio-shell.tsx` | Today’s mobile header + bottom nav |

**Say `next` in chat to start MF1** (`mobile/mf1-touch-tokens`).
