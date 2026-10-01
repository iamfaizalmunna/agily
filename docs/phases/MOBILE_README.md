# Mobile-first & solid UI (MF1–MF12)

**Progress on `main`:** MF1–MF12 **complete**.

**Goal:** Site-wide UI that feels **solid on phone first** — Jira-mobile patterns (clear nav, one-hand use, fast ticket access) — while **desktop stays the power layout** you have today.

**Not in scope unless we change the rules:** native iOS/Android store apps, cloud sync, push notifications from a vendor.

---

## How we work — the loop

**Branch → push → PR → merge → `main` → next phase.** Repeat for MF1…MF12.

Each phase must pass:

1. **Unit tests** — `npm test` + `npm run test:coverage` (100% lines on the pack).
2. **Hardening** — sensible defaults per [HARDENING.md](../HARDENING.md) (auth, exports, env) when that phase touches those areas.
3. **UI check** — run `npm run dev`; verify phone (~390px) and desktop; no broken nav or clipped content.

Details: **[MOBILE_GIT_LOOP.md](MOBILE_GIT_LOOP.md)** · Revamp equivalent: [REVAMP_GIT_LOOP.md](REVAMP_GIT_LOOP.md).

**Rules:** one mobile PR at a time; do not start MF{N+1} until MF{N} is merged on `main`.

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

## Progress

| Phase | Name | Status | Doc |
|:-----:|------|--------|-----|
| MF1 | Touch tokens & layout primitives | **complete** | [mobile-01-tokens.md](mobile-01-tokens.md) |
| MF2 | Mobile shell (Jira-like nav) | **complete** | [mobile-02-shell.md](mobile-02-shell.md) |
| MF3 | Projects & board hub | **complete** | [mobile-03-hub.md](mobile-03-hub.md) |
| MF4 | Board (flow) mobile | **complete** | [mobile-04-board.md](mobile-04-board.md) |
| MF5 | List & ticket detail | **complete** | [mobile-05-ticket.md](mobile-05-ticket.md) |
| MF6 | Filters & search sheets | **complete** | [mobile-06-filters.md](mobile-06-filters.md) |
| MF7 | Create & quick actions | **complete** | [mobile-07-create.md](mobile-07-create.md) |
| MF8 | Settings, people, notices | **complete** | [mobile-08-settings.md](mobile-08-settings.md) |
| MF9 | Summary & analytics | **complete** | [mobile-09-summary.md](mobile-09-summary.md) |
| MF10 | Timeline & calendar | **complete** | [mobile-10-timeline.md](mobile-10-timeline.md) |
| MF11 | PWA & installable shell | **complete** | [mobile-11-pwa.md](mobile-11-pwa.md) |
| MF12 | Ship mobile (QA + e2e) | **complete** | [mobile-12-ship.md](mobile-12-ship.md) |

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
| [MOBILE_CHANGELOG.md](../MOBILE_CHANGELOG.md) | MF7–MF12 batch notes |
| `src/components/chrome/studio-shell.tsx` | Today’s mobile header + bottom nav |
