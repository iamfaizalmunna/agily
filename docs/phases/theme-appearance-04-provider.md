# TH4 — AppearanceProvider

**Status:** complete  
**Depends on:** TH1, TH2, TH3

## Merge with theme today

| Today | After |
|-------|--------|
| `ThemeProvider` + `useTheme()` | `AppearanceProvider` + `useAppearance()` |
| `ThemeToggle` cycles color mode | Same; optionally move under Appearance page only |
| `THEME_STORAGE_KEY` | Sub-key inside `agily-appearance` or dual-write during migration |

`useAppearance()` returns:

```ts
{
  colorMode, setColorMode,
  themePreset, setThemePreset,
  iconSet, setIconSet,
  resolvedDark: boolean,
  persist: () => Promise<void>, // server + cache
}
```

## Apply to DOM

On any change:

1. `document.documentElement.classList` light/dark
2. `document.documentElement.dataset.theme = preset`
3. `document.documentElement.dataset.iconSet = iconSet` (optional; mostly for debugging)
4. Update `theme-color` meta

## Wiring

- `src/app/layout.tsx`: wrap children with `AppearanceProvider` + pass `initialAppearance` from server when session exists.
- `src/app/(studio)/layout.tsx`: fetch appearance once with user (same query as TH1).

## Deprecation

- Keep `useTheme()` as thin alias → `useAppearance()` for one release, then remove.

## Testing (TH4)

| Layer | What |
|-------|------|
| Unit | Merge logic for localStorage cache + server snapshot |
| Integration | Logged-in layout passes `initialAppearance` |
| Manual | Sign out / sign in — appearance reapplies |

## Acceptance

- [ ] Hard refresh on board: correct preset + mode (no flash to wrong sidebar color).
- [ ] Sign out → sign in as other user → other user’s appearance.
- [ ] `npm test` green.
