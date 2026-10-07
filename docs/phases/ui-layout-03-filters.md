# UL3 — Filter bar density

**Branch:** `ui-layout/ul3-filters`  
**Status:** complete

## Scope

- `filter-bar-desktop.tsx` — collapsible header, active count, Clear all, session preference.
- `filter-bar-panels.tsx` — `compact` mode; label/chip grid on `xl`.
- `filter-bar-mobile.tsx` — horizontal scroll for active filter pills (no clipping).

## Behavior

| Viewport | Filters |
|----------|---------|
| `< md` | Bottom sheet + pill strip |
| `md`–`1279px` | Collapsed by default; expand on tap; auto-open when filters active |
| `≥ 1280px` | Expanded by default (overridable via session preference) |

## Acceptance

- [x] All lens chips reachable without horizontal trap on 768px.
- [x] Desktop panel collapses to reclaim vertical space for list/board.
- [x] Active filters always expand panel and mobile sheet context.
