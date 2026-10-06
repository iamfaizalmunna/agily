# UL8 — QA matrix

**Branch:** `ui-layout/ul8-qa`  
**Status:** complete

## Automation

`e2e/layout-smoke.spec.ts`:

- List at 1100px — no empty “Pick a ticket” split column.
- Flow board — `kanban-column-strip` visible at 1280px.
- Settings — mobile section select at 390px.
- Not-found — no horizontal overflow at 320px.

## Manual matrix

| Device | Size | Routes |
|--------|------|--------|
| Phone | 390×844 | List, Board, mobile focus |
| Tablet | 768×1024 | List stacked detail, filters |
| Laptop | 1280×800 | Split list, shell scroll |
| Desktop | 1440×900 | Board columns, settings |

## Per route smoke

1. Scroll to bottom — primary action visible.
2. No unexplained empty column > 30% width.
3. Focus open/close — URL `focus` param unchanged.
4. Keyboard: Tab reaches Save / primary CTA.
