# MF11 — PWA & installable shell

**Status:** planned  
**Branch:** `mobile/mf11-pwa`

## Goal

**Add to Home Screen** feels like an app — without building native binaries.

## Deliverables

- [ ] `manifest.webmanifest` (name, icons, theme_color, display: standalone).
- [ ] Apple meta tags + icons in `app/layout.tsx`.
- [ ] Optional: light service worker — offline **static** shell + “you’re offline” for API routes (no fake sync).
- [ ] Hardening: CSP review doc note (what we allow for PWA).

## Acceptance

- Chrome “Install app” works on localhost/staging; launched app hides browser URL bar.

## Out of scope

- Background sync, push from FCM/APNs, biometric lock (unless added later).
