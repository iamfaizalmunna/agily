# Test results

Prisma-free unit pack plus Playwright smoke.

```bash
npm test
npm run test:coverage
npm run test:e2e
```

CI: `.github/workflows/test.yml` (unit) and `.github/workflows/e2e.yml` (Playwright on `prisma/e2e.db`).
