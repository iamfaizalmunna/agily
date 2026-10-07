# TH3 — Icon registry & AppIcon

**Status:** complete  
**Depends on:** TH1

## API

```tsx
<AppIcon name="nav.board" className="size-4" aria-hidden />
```

- `name`: keyof `IconName` union (~40–60 entries for v1).
- `size`: optional `sm | md | lg` → `size-3.5 | size-4 | size-5`.
- Forwards `className`, `aria-label` when not decorative.

## Registry implementation

```ts
// icon-registry.ts
export type IconSetId = "lucide" | "tabler" | "phosphor" | "heroicons";

export const ICON_REGISTRY: Record<
  IconSetId,
  Record<IconName, ComponentType<IconProps>>
> = { ... };
```

- One file per set: `icons-lucide.ts`, `icons-tabler.ts`, … imports only icons in the matrix.
- **Do not** dynamic-import entire packs (bundle explosion).

## Dependencies (add in TH3)

```bash
npm i @tabler/icons-react @phosphor-icons/react @heroicons/react
```

Lucide already present.

## Context

`useIconSet()` from `AppearanceProvider` — default `lucide` until TH4 wires server state.

## Testing (TH3)

| Layer | What |
|-------|------|
| Unit | `icon-registry.test.ts` — every `IconName` × 4 sets |
| Unit | `AppIcon` renders without throw (RTL smoke optional) |
| Manual | Swap icon set on profile → chrome icons update |

## Acceptance

- [ ] Switch icon set in devtools context: mobile nav + sidebar icons all change.
- [ ] No direct `lucide-react` imports in migrated files (enforced in TH6).
- [ ] `icon-registry.test.ts`: every `IconName` has 4 implementations.
