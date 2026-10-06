# TH6 — Migrate components to AppIcon

**Status:** complete  
**Depends on:** TH3, TH4

## Inventory (direct `lucide-react` today)

| File | Icons to map |
|------|----------------|
| `studio-sidebar.tsx` | nav.* |
| `mobile-bottom-nav.tsx` | nav.* |
| `mobile-shell-header.tsx` | bell, menu |
| `mobile-nav-item.tsx` | per-item |
| `filter-bar-desktop.tsx` | filter, chevron |
| `filter-bar-mobile.tsx` | filter |
| `notification-toast-stack.tsx` | close |
| `ticket-card.tsx` | priority/type |
| `kanban-move-menu.tsx` | arrows |
| `board-options-sheet.tsx` | settings/sliders |
| `mobile-board-hub.tsx` | chevrons |
| `mobile-board-back.tsx` | arrow |
| `studio-create-menu.tsx` | plus |
| `command-palette-trigger.tsx` | search |
| `focus-mobile-footer.tsx` | comment/send |

Add any new files found via `rg 'lucide-react' src`.

## Process

1. Define semantic names in registry **before** editing component.
2. Replace `import { X } from "lucide-react"` → `import { AppIcon } from "@/components/appearance/app-icon"`.
3. PR in 2 chunks if large: chrome first, views second.

## ESLint (optional follow-up)

`no-restricted-imports` for `lucide-react` outside `icons-lucide.ts`.

## Testing (TH6)

| Layer | What |
|-------|------|
| CI | ESLint `no-restricted-imports` on `lucide-react` |
| Manual | Matrix: 4 icon sets × sidebar + mobile nav |
| Regression | `npm test` + layout smoke e2e |

## Acceptance

- [ ] `rg lucide-react src/components` → only `icons-lucide.ts` (and registry).
- [ ] Visual pass: all 4 icon sets on mobile nav + sidebar.
