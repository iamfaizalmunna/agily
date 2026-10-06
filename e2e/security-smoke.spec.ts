import { test, expect } from "@playwright/test";
import { E2E, signIn } from "./helpers";

test.describe("security smoke", () => {
  test("redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}`);
    await expect(page).toHaveURL(/\/signin/);
  });

  test("viewer sees read-only studio settings", async ({ page }) => {
    await page.goto("/signin");
    const demoViewer = page.getByTestId("demo-viewer");
    await expect(demoViewer).toBeVisible();
    await Promise.all([
      page.waitForURL((url) => !url.pathname.startsWith("/signin"), {
        timeout: 30_000,
      }),
      demoViewer.click(),
    ]);
    await page.goto(`/t/${E2E.teamSlug}/settings`);
    await expect(page.getByText("Read only")).toBeVisible();
  });

  test("sign-out returns to sign-in", async ({ page }) => {
    await signIn(page);
    await page.goto("/home");
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/signin/);
    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page).toHaveURL(/\/signin/);
  });
});
