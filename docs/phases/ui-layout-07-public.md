# UL7 — Auth & public routes

**Branch:** `ui-layout/ul7-public`  
**Status:** complete

## Changes

- `auth-shell.tsx`: `min-w-0` on card grid.
- `join/[token]`: `publicViewportPageClass` + `publicContentWidthClass`.
- `kb/*`: `publicDocumentPageClass`.
- `ErrorPanel`: safe-area padding + `overflow-x-hidden`.

## Verify

- [x] Safe-area padding on error/join flows.
- [x] No horizontal overflow on 320px (e2e).
