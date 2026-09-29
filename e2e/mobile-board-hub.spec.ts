import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile board hub", () => {
  test("opens Atlas from hub in three taps", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}`);
    await page.getByRole("searchbox", { name: "Search boards" }).fill("atlas");
    await page.getByRole("link", { name: /Atlas/i }).first().click();
    await expect(page.getByRole("heading", { name: "Atlas", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "All boards" })).toBeVisible();
  });
});
