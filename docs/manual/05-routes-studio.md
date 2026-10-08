# 05 — Studio routes

Pattern: `/t/{slug}/…` where `{slug}` is the studio’s unique slug (demo: **northwind**).

**Gate:** `requireUser()` + `getMembership(userId, slug)` or `notFound()`.

**Chrome:** Desktop — collapsible **sidebar**, **top bar** (search, bell, profile). Mobile — **header**, **bottom nav** (Home, Boards, Inbox, More), sheets for filters and create.

## `/t/{slug}` — Studio hub (Pulse)

| | |
|---|---|
| **Access** | Member+ (any role) |
| **File** | `src/app/(studio)/t/[slug]/page.tsx` |

**Purpose:** Landing page for a studio after you pick it from `/home`.

**Desktop highlights:**

- Studio name heading (e.g. **Northwind**).
- **Pulse** buckets — overdue, due soon, recently updated (team-wide ticket sample).
- **Projects** list with links to `/t/{slug}/p/{projectSlug}`.
- **Create project** if `canCreateProject(role, settings)`.

**Mobile:** `PulseBoardHub`, board search, sticky footer patterns; bottom nav active on **Home**.

---

## `/t/{slug}/people` — People & invites

| | |
|---|---|
| **Access** | Member+ to view; invite/role changes need permission |
| **File** | `src/app/(studio)/t/[slug]/people/page.tsx` |

**Sections:**

- **Members** — name, email, role, assignment counts; admins/owners can change role or remove (rules in `canChangeMemberRole`, `canRemoveMember`).
- **Pending invites** — revoke link.
- **Invite** — email + role (`admin` / `member` / `viewer` per `inviteRolesFor`); generates token URL `/join/{token}` with **Copy link** (no email send).

Viewers see the list but cannot invite or edit roles.

---

## `/t/{slug}/notices` — Inbox

| | |
|---|---|
| **Access** | Member+ |
| **File** | `src/app/(studio)/t/[slug]/notices/page.tsx` |

**Purpose:** Full-page notification list (`Notification` rows for current user + team).

- Mark read / open linked ticket.
- **Mark all read** action.
- Bell in sidebar shows unread count; **live toasts** may appear when SSE connects (`/api/notices/live`).

Notification **preferences** (sound, types) live under studio **Settings → Notifications** (per user prefs stored in notice prefs module).

---

## `/t/{slug}/settings` — Studio settings

| | |
|---|---|
| **Access** | Member+ view; **edit** requires owner or admin |
| **File** | `src/app/(studio)/t/[slug]/settings/page.tsx` |

Anchor sections via hash navigation (`#general`, `#notifications`, …):

| Section | Contents |
|---------|----------|
| **General** | Studio name, toggles: members can create projects, members can invite, default invite role |
| **Notifications** | `NotificationPrefsPanel` — how inbox/toasts behave |
| **Labels** | Team-wide label CRUD (`LabelsSettings`) |
| **Templates** | Ticket templates info tied to team settings |
| **Security** | **Owners only** — recent `SecurityEvent` audit list |

Read-only users see forms disabled or explanatory copy when `!canEditSettings(role)`.

---

## Sidebar navigation (desktop)

From `StudioSidebar`:

- Studio mark / name → hub
- **Projects** quick links with ticket counts
- **People**, **Inbox** (badge), **Settings**
- Collapse toggle (persisted in localStorage)

**Command palette** (Search button or ⌘K / Ctrl+K) is available in top bar while inside a studio.

---

## Mobile “More” sheet

Links typically include People, Settings, Lens/KB shortcuts, theme-related actions, sign out—see `mobile-more-sheet.tsx`.
