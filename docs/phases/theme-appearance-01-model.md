# TH1 — User appearance data model

**Status:** complete

## Testing (TH1)

| Layer | What |
|-------|------|
| Unit | `appearance.test.ts` — parse, serialize, defaults, labels |
| Unit | `avatar.test.ts` — magic bytes, size cap, filenames |
| Manual | `/home/profile` upload → refresh → photo persists; second user in same studio can load `/api/profile/avatar/:id` |
| Manual | Save appearance → new session / browser → color mode from DB via `AppearanceProvider` |

## Schema

```prisma
model User {
  // ...
  appearance String @default("{}")
  avatarPath String?   // filename under data/avatars/
}
```

Migration name suggestion: `user_appearance`.

## JSON contract

- `version`: must be `1` (bump when breaking).
- Unknown keys ignored on read; missing keys filled from `DEFAULT_USER_APPEARANCE`.
- Invalid `iconSet` / `themePreset` → fall back to default, never 500.

## Server

| Piece | Detail |
|-------|--------|
| `parseUserAppearance(raw: string)` | Pure function + unit tests (`.c8rc` include) |
| `getUserAppearance(userId)` | Used in studio layout + `/home` |
| `updateAppearanceAction(formData)` | CSRF-guarded like other mutations; only self |

## Client cache

- Key: `agily-appearance`
- Shape: `{ userId, appearance, savedAt }` — if `userId` ≠ session user, ignore cache.
- Written after successful server save and on layout hydrate.

## Acceptance

- [ ] Two browsers, same user: change preset in A → refresh B → same preset.
- [ ] Different users on same machine: caches do not leak.
- [ ] `npm run test:coverage` still 100% on included libs.
