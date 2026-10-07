# Per-user UI customization (CU1+)

**Goal:** Each signed-in user controls a **global** studio look: color mode, theme preset, **icon set**, **typeface**, **density**, and **corner radius** — synced via `User.appearance` and applied on every route (except fixed light auth pages).

## Phase map

| Phase | Focus | Status |
|-------|--------|--------|
| **CU1** | Appearance model v2 (`fontFamily`, `density`, `cornerRadius`) + parse/serialize | **complete** |
| **CU2** | `appearance-ui.css` tokens + boot script + `applyUserAppearanceToDocument` | **complete** |
| **CU3** | Profile appearance form + server actions | **complete** |
| **CU4** | Icon coverage audit (`AppIcon` + `NavIconRow`; sheets, more menu, home) | **complete** |
| **CU5** | ESLint `no-restricted-imports` for icon packages outside registry | **complete** |
| **CU6** | E2e profile (font/density/radius), FEATURE_GAP, `agily-stack-gap` density | **complete** |
| **CU7** | Settings nav + desktop chrome icons (topbar profile, sign-out, shortcuts) | **complete** |
| **CU8** | Live `AppearancePreview` + theme toggle icons (sun/moon/monitor) | **complete** |
| **CU9** | `resetAppearanceAction` + Restore defaults on profile | **complete** |
| **CU10** | Board view tabs use `BOARD_VIEW_ICON` + `view.*` registry entries | **complete** |
| **CU11** | Command palette actions show `AppIcon`; theme syncs account prefs | **complete** |
| **CU12** | E2e restore defaults + `BOARD_VIEW_ICON` pack smoke | **complete** |
| **CU13** | Lens panel + trigger icons | **complete** |
| **CU14** | Board hub list icons + empty state | **complete** |
| **CU15** | `highContrast` account pref + notification prefs chrome | **complete** |
| **CU16** | `sidebarTone` brand vs neutral sidebar tokens | **complete** |
| **CU17** | `motion` reduced-motion account override | **complete** |
| **CU18** | `iconSize` large + auth shell appearance hint | **complete** |

**Track status:** CU1–CU18 shipped on `main` via PR #45 (studio + per-user appearance).

## Principles

- **One API:** `<AppIcon name="…" />` + semantic names in `icon-names.ts`.
- **One apply path:** `AppearanceProvider` + `THEME_BOOT_SCRIPT` read the same JSON shape.
- **No per-team skins** — only per-user account prefs.

## Related

- [THEME_APPEARANCE_README.md](./THEME_APPEARANCE_README.md) — TH1–TH7 baseline (presets, icons v1).
