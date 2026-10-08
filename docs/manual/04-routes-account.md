# 04 — Account routes

Signed-in **user** scope—not tied to a single studio. Layout: `src/app/(studio)/layout.tsx` wraps `/home` and all `/t/...` routes with `AppearanceProvider`, theme, and optional notification live provider.

## `/home` — Your studios

| | |
|---|---|
| **Access** | Signed-in |
| **Purpose** | List studios you belong to; create a new studio |
| **File** | `src/app/(studio)/home/page.tsx` |

**What you see:**

- Heading **Your studios** (or prompt to create first studio).
- **Avatar** + “Signed in as …” with link to profile.
- Cards per studio: name, slug link to `/t/{slug}`.
- **Create studio** form (name → generates slug, you become **owner**).

**Mobile:** Same content; studio chrome appears after you enter a studio.

---

## `/home/profile` — Profile & appearance

| | |
|---|---|
| **Access** | Signed-in |
| **Purpose** | Avatar upload + global UI preferences |
| **File** | `src/app/(studio)/home/profile/page.tsx` |

### Profile section

- Display name context (from session).
- **Avatar** — upload/remove; served from `/api/profile/avatar/[userId]` when set.
- Stored on `User.avatarPath`.

### Appearance section (`ProfileAppearanceForm`)

Synced to `User.appearance` JSON (version **2**). Applied instantly via `AppearanceProvider` and persisted to localStorage cache for boot.

| Field | Values | Effect |
|-------|--------|--------|
| Color mode | light / dark / system | `ThemeProvider` + boot script |
| Theme preset | jira, editorial, graphite, forest | CSS variables (`data-theme`) |
| Icon set | lucide, tabler, phosphor, heroicons | `AppIcon` registry |
| Font family | geist, outfit, fraunces, system | `data-font` |
| Density | comfortable, compact | spacing tokens |
| Corner radius | default, sharp, soft | `data-radius` |
| High contrast | on/off | `data-contrast` |
| Sidebar tone | brand, neutral | sidebar colors |
| Motion | default, reduced | `prefers-reduced-motion` override |
| Icon size | default, large | icon scale |

**Live preview** (`AppearancePreview`) updates as you change selects before save.

**Restore defaults** — `resetAppearanceAction` resets to `DEFAULT_USER_APPEARANCE`.

**Auth pages** do not use these prefs (fixed light auth shell).

---

## Sign out

Available from studio **top bar** / mobile **More** sheet. Calls `destroySession` and redirects to sign-in. Not a separate route.

---

## Related server actions

| Area | Module |
|------|--------|
| Appearance save / reset | `src/lib/profile/actions.ts` |
| Avatar upload | `src/lib/profile/actions.ts` |
| Parse / serialize appearance | `src/lib/appearance/appearance.ts` |
