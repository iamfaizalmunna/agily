# 03 — Public & auth routes

Routes that do **not** require a studio membership. Signed-in users may still visit most of these (e.g. `/kb`).

## `/` — Root

| | |
|---|---|
| **Access** | Guest or signed-in |
| **Behavior** | Server redirect: session → `/home`, else → `/signin` |
| **File** | `src/app/page.tsx` |

No UI at `/`; it only routes you.

---

## `/signin` — Sign in

| | |
|---|---|
| **Access** | Guest (signed-in users are typically redirected away by middleware/layout) |
| **Purpose** | Email + password login; optional **Demo owner** one-click for local demo |
| **File** | `src/app/(auth)/signin/page.tsx` |
| **Shell** | `AuthShell` — marketing column + form; light theme only |
| **Session** | On success: `createSession`, httpOnly cookie, redirect to `/home` or `next` param |

**Demo:** `owner@agily.com` / `password123` (seeded). Test IDs: `signin-email`, `signin-password`, `signin-submit`, `demo-owner`.

**Security:** Rate limiting and audit events are documented in [HARDENING.md](../HARDENING.md).

---

## `/signup` — Create account

| | |
|---|---|
| **Access** | Guest |
| **Purpose** | Register name, email, password; creates `User` row and session |
| **File** | `src/app/(auth)/signup/page.tsx` |
| **Shell** | Same auth shell as sign-in |

New users land on `/home` with no studios until they create one.

---

## `/join/[token]` — Accept invite

| | |
|---|---|
| **Access** | Guest or signed-in (email must match invite) |
| **Purpose** | Consume a **copy-link invite** created from studio **People** |
| **File** | `src/app/join/[token]/page.tsx` |

**States:**

- **Valid token** — Shows studio name and role; `JoinForm` adds `TeamMember` or prompts sign-up if no account.
- **Expired / unknown** — “Link expired” with link back to sign-in.

Invites are rows in `Invite` with `email`, `role` (not `owner`), and `expiresAt`. No email is sent—URL is copied manually.

---

## `/kb` — Knowledge index

| | |
|---|---|
| **Access** | **Public** (no login required) |
| **Purpose** | Lists markdown files from repo folder `kb/` |
| **File** | `src/app/kb/page.tsx` |

Used by humans and by **Lens** for grounded answers. Content is **local files only**.

---

## `/kb/[name]` — Knowledge article

| | |
|---|---|
| **Access** | Public |
| **Purpose** | Renders one `kb/{name}.md` as HTML |
| **File** | `src/app/kb/[name]/page.tsx` |

---

## Error & static pages

| Route / file | Access | Purpose |
|--------------|--------|---------|
| `not-found.tsx` | Any | “Not here” for unknown routes |
| `error.tsx` / `global-error.tsx` | Any | Error boundaries |

Studio-specific **404** uses `notFound()` when slug or project is invalid or user is not a member.

---

## `/qa/phases` — Phase gallery (static)

| | |
|---|---|
| **Access** | Public static file |
| **Path** | `public/qa/phases/index.html` |
| **URL** | http://127.0.0.1:43123/qa/phases |

Engineering **phase completion** gallery—not part of the product UI for end users.
