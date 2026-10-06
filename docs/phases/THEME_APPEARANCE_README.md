# Theming & icon sets (TH1+)

**Goal:** Let each **signed-in user** choose a **global appearance** — color mode, visual theme preset, and **whole-app icon set** — that follows them across every studio and device. No per-team skins; no anonymous theming on auth routes beyond a fixed light default.

**Principles**

| Lens | Rule |
|------|------|
| **UX** | One **Appearance** surface (“Your account”); changes apply instantly; same choices on phone and desktop. |
| **UI** | Presets swap **CSS variables** only (no per-page hex). Icons go through **one** `<AppIcon />` API. |
| **Architecture** | `User.appearance` JSON is source of truth; localStorage is a **cache** for boot (like `agily-theme` today). Teams never store appearance. |

## Current baseline

| Piece | Today |
|-------|--------|
| Light / dark / system | `src/lib/theme/theme.ts`, `ThemeProvider`, `agily-theme` in localStorage |
| Tokens | `html.light` / `html.dark` + shadcn `--primary`, `--sidebar`, Agily `--copper`, `--paper` in `globals.css` |
| Icons | ~15 components import **Lucide** directly (`lucide-react`) |
| User model | No appearance field on `User` |

## Target appearance model (per user)

```ts
type UserAppearance = {
  version: 1;
  colorMode: "light" | "dark" | "system";
  themePreset: "jira" | "editorial" | "graphite" | "forest";
  iconSet: "lucide" | "tabler" | "phosphor" | "heroicons";
  density?: "comfortable" | "compact"; // optional phase TH7+
};
```

Stored as JSON on `User.appearance` (string column, default `{}`). Parsed with the same style as `parseTeamSettings` / `parseNoticePrefs`.

## Free icon sets (v1 shortlist)

All MIT or equivalent; npm packages tree-shake per icon.

| ID | Package | License | Notes |
|----|---------|---------|--------|
| `lucide` | `lucide-react` | ISC | **Default**; already in repo |
| `tabler` | `@tabler/icons-react` | MIT | Stroke 2; close to Lucide |
| `phosphor` | `@phosphor-icons/react` | MIT | Weights; use `regular` for UI chrome |
| `heroicons` | `@heroicons/react/24/outline` | MIT | Outline 24px; slightly different grid |

**Out of v1:** Material Symbols (license/attribution friction), Font Awesome (mixed licenses), emoji sets.

**Semantic icon registry** (examples):

| Semantic `name` | Lucide | Tabler | Phosphor | Heroicons |
|-----------------|--------|--------|----------|-----------|
| `nav.board` | `LayoutGrid` | `IconLayoutGrid` | `SquaresFour` | `Squares2X2Icon` |
| `nav.notices` | `Bell` | `IconBell` | `Bell` | `BellIcon` |
| `action.close` | `X` | `IconX` | `X` | `XMarkIcon` |
| `action.filter` | `SlidersHorizontal` | `IconAdjustmentsHorizontal` | `FadersHorizontal` | `AdjustmentsHorizontalIcon` |
| `action.more` | `MoreHorizontal` | `IconDots` | `DotsThree` | `EllipsisHorizontalIcon` |

Full matrix lives in `src/lib/appearance/icon-registry.ts` (created in TH4).

## Theme presets (v1)

Presets are **`data-theme="<id>"` on `<html>`** alongside existing `light` / `dark` classes. Each preset overrides Agily + shadcn variables inside `globals.css` (or `appearance-presets.css`).

| Preset | Character | Light | Dark |
|--------|-----------|-------|------|
| `jira` | Blue sidebar, neutral canvas | **Default today** | Tuned blue-gray |
| `editorial` | Warm paper / copper (legacy Agily dark) | Soft cream + copper accent | Current `html.dark` copper feel |
| `graphite` | Neutral SaaS, low chroma | Gray + violet primary | Charcoal + violet |
| `forest` | Green accent, calm boards | Mint-gray + green primary | Deep green-gray |

Color mode still toggles **light vs dark**; preset picks **palette within** that mode.

## Phase map

| Phase | Focus | Status | Doc |
|-------|--------|--------|-----|
| **TH1** | `User.appearance` + server read/write | **complete** | [theme-appearance-01-model.md](./theme-appearance-01-model.md) |
| **TH2** | Theme preset CSS + boot script | **complete** | [theme-appearance-02-presets.md](./theme-appearance-02-presets.md) |
| **TH3** | Icon registry + `<AppIcon />` | **complete** | [theme-appearance-03-icons.md](./theme-appearance-03-icons.md) |
| **TH4** | `AppearanceProvider` (merge ThemeProvider) | **complete** | [theme-appearance-04-provider.md](./theme-appearance-04-provider.md) |
| **TH5** | Account appearance UI + sync | **complete** | [theme-appearance-05-settings-ui.md](./theme-appearance-05-settings-ui.md) |
| **TH6** | Lucide → `AppIcon` migration sweep | **complete** | [theme-appearance-06-migration.md](./theme-appearance-06-migration.md) |
| **TH7** | QA, a11y, bundle budget | **complete** (unit + e2e smoke) | [theme-appearance-07-qa.md](./theme-appearance-07-qa.md) |

## Execution loop

1. Branch `theme/th{N}-…` from `main`.
2. `npx prisma migrate dev` only in TH1.
3. `npm test` + `npm run build`; spot-check **signin**, **board**, **mobile nav** per phase doc.
4. PR → merge (protected `main`).

## Shared code (to add)

| Path | Role |
|------|------|
| `src/lib/appearance/appearance.ts` | Types, parse, defaults, labels |
| `src/lib/appearance/icon-registry.ts` | Semantic → per-set components |
| `src/components/appearance/app-icon.tsx` | Single icon entry |
| `src/components/appearance/appearance-provider.tsx` | Context + DOM apply |
| `src/lib/appearance/actions.ts` | `updateAppearanceAction` |
| `src/app/(studio)/account/appearance/page.tsx` or `/home` section | User-facing picker |

## Out of scope (v1)

- Per-studio branding (logos, custom colors).
- User-uploaded themes.
- Icon **size** per component beyond `sm | md | lg` prop on `AppIcon`.
- Runtime download of third-party icon fonts (npm-only).

## Relation to other docs

- **UI layout** (`UI_LAYOUT_README.md`): layout classes unchanged; appearance only touches tokens and icons.
- **UI revamp** (`UI_REVAMP_PLAN.md`): Phase A “theme light/dark” extends into TH2+TH4, not a duplicate effort.
- **Notifications prefs**: stay **localStorage** (device); **appearance** is **account** (server).
