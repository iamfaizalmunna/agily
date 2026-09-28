import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:43123";
/** Next.js resolves this from repo root → `prisma/e2e.db` (Prisma CLI uses `file:./e2e.db` in `db:e2e`). */
const e2eDatabaseUrl =
  process.env.DATABASE_URL ?? "file:./prisma/e2e.db";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: !process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/, retries: 2 },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/owner.json",
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev:api",
      url: "http://127.0.0.1:43124/v1/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: e2eDatabaseUrl,
        NODE_ENV: "development",
      },
    },
    {
      command: "npm run dev:web",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: e2eDatabaseUrl,
        NODE_ENV: "development",
      },
    },
  ],
});
