# Screenshot assets

PNG files here are produced by Playwright:

```bash
npm run screenshots
```

Sources: `e2e/app-tour.spec.ts` · output: `desktop/` and `mobile/`.

Used in [APP_TOUR.md](../APP_TOUR.md). CI does **not** run `@screenshots` tests (see `grepInvert` in `playwright.config.ts`).
