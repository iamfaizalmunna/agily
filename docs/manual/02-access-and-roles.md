# 02 — Access levels & roles

Agily uses **two layers** of access: **whether you are signed in**, and **your role inside a studio**.

## Access level 1 — Session (global)

| Level | Who | Can reach |
|-------|-----|-----------|
| **Guest** | No valid `agily_session` cookie | `/signin`, `/signup`, `/join/[token]`, `/kb`, `/kb/[name]`, static assets. Root `/` redirects to sign-in. |
| **Signed-in user** | Valid session in SQLite | `/home`, `/home/profile`, any `/t/{slug}/…` where they are a **member**, plus public `/kb`. |

Sessions are **opaque tokens** stored server-side with expiry. The cookie is **httpOnly** (not readable from JS). See `src/lib/auth/session.ts`.

**Appearance:** Auth pages use a fixed **light** shell. Signed-in studio chrome respects **per-user** theme, icons, density, etc. (`User.appearance`).

## Access level 2 — Studio role (per team)

Roles are stored on `TeamMember.role`. Rank (highest wins for capability checks):

| Role | Rank | Typical use |
|------|------|-------------|
| **owner** | 4 | Created the studio; full control including delete team |
| **admin** | 3 | Settings, people, labels; cannot delete team or demote owners (unless owner) |
| **member** | 2 | Create/edit tickets, comment, assign (if allowed) |
| **viewer** | 1 | Read boards and inbox; no writes |

**You cannot self-select `owner` on invite** — owners are created when the studio is created or promoted by an existing owner.

Studio **settings JSON** (`Team.settings`) can allow members to create projects or send invites without being admin. See `parseTeamSettings` in `src/lib/rbac/roles.ts`.

## Permission matrix (common actions)

| Action | owner | admin | member | viewer |
|--------|:-----:|:-----:|:------:|:------:|
| View studio hub, boards, inbox | ✓ | ✓ | ✓ | ✓ |
| Create / edit / move tickets | ✓ | ✓ | ✓ | — |
| Comment on tickets | ✓ | ✓ | ✓ | — |
| Assign people | ✓ | ✓ | ✓ | — |
| Create project | ✓ | ✓ | ✓* | — |
| Invite people (copy link) | ✓ | ✓ | ✓* | — |
| Studio settings (general, labels, templates) | ✓ | ✓ | — | — |
| Change member roles / remove members | ✓ | ✓** | — | — |
| Archive project | ✓ | ✓ | — | — |
| Security audit log (studio) | ✓ | — | — | — |
| Delete studio | ✓ | — | — | — |

\* Only if `membersCanCreateProjects` / `membersCanInvite` is enabled in studio settings.  
\** Admins cannot change owners or other admins; owners can change anyone except last owner.

Board-level **project settings** (workflow, custom fields, import/export) require **member+** write access; viewers see read-only messaging.

## How enforcement works in code

- **Page load:** `requireUser()` redirects to `/signin` if no session.
- **Studio pages:** `getMembership(userId, slug)` → `notFound()` if not a member.
- **Mutations:** Server actions call `requireTeamMember(userId, slug, minRole)` or check `canWriteBoard`, `canEditSettings`, etc. (`src/lib/items/permissions.ts`, `src/lib/rbac/roles.ts`).

## Account vs studio data

| Data | Scope | Examples |
|------|--------|----------|
| **Account** | One user, all studios | Email, password hash, `appearance`, avatar, saved filter lenses (per team still keyed by user+team) |
| **Studio** | Team | Projects, tickets, labels, invites, team settings, notifications for that team |

There are **no per-team skins**—only per-user appearance prefs.
