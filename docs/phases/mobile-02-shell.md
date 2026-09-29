# MF2 — Mobile shell (Jira-like nav)

**Status:** planned  
**Branch:** `mobile/mf2-shell`

## Goal

Replace the minimal text bottom bar with a **Jira-style mobile chrome**: icons, clear sections, room for “current board”.

## Deliverables

- [ ] Bottom nav (mobile only): **Home (Pulse)** · **Boards** · **Create** · **Inbox (Notices)** · **More** (settings, theme, sign out, Lens).
- [ ] Lucide icons + `aria-label` on every item; active state matches route.
- [ ] Compact mobile header: studio mark, title, search, bell — **no duplicate sign-out** if in More.
- [ ] Studio switcher sheet when user has multiple teams.
- [ ] Desktop: no change to sidebar/topbar behavior.
- [ ] Playwright: mobile viewport smoke for nav taps.

## Acceptance

- User can reach Pulse, a project board, notices, and create entry without horizontal scrolling the nav.
