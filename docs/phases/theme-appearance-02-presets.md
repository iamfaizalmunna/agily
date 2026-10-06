# TH2 — Theme presets (CSS)

**Status:** complete  
**Depends on:** TH1

## DOM contract

```html
<html class="light|dark" data-theme="jira|editorial|graphite|forest">
```

Boot script (`THEME_BOOT_SCRIPT` → `APPEARANCE_BOOT_SCRIPT`):

1. Auth routes → `class="light"` `data-theme="jira"` (fixed).
2. Else read cache → apply `class` + `data-theme` before paint.
3. Keep `meta[name="theme-color"]` in sync (reuse `themeColor()` per preset).

## CSS structure

Option A (recommended): `src/app/appearance-presets.css` imported after base tokens in `globals.css`:

```css
html[data-theme="editorial"].light { --primary: ...; --sidebar: ...; }
html[data-theme="editorial"].dark { ... }
```

Map **every** token the shell uses: `--background`, `--primary`, `--sidebar`, `--copper`, `--paper`, `--ink`, status columns (`--status-*`), chart tokens if visible on summary.

## Preset previews

Settings UI shows 4 mini cards (sidebar strip + primary button mock) — static screenshots or live `div` using same variables.

## Testing (TH2)

| Layer | What |
|-------|------|
| Unit | Preset id validation in `appearance.test.ts` (extend) |
| Unit | Boot script fixture — `data-theme` present in `APPEARANCE_BOOT_SCRIPT` |
| Manual | Each preset × light/dark on board + settings |
| Visual | Optional Playwright screenshot diff per preset |

## Acceptance

- [ ] Toggle preset: no layout shift beyond colors.
- [ ] Dark + light each have readable contrast (WCAG AA on primary button text).
- [ ] `theme.test.ts` extended or sibling `appearance.test.ts` for preset id validation.
