import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile filter sheet", () => {
  test("applies Mine and Critical from filter sheet", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=list`);
    await page.getByRole("button", { name: /^Filter/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("link", { name: "Mine", exact: true }).click();
    await expect(page).toHaveURL(/q=mine/);
    await page.getByRole("button", { name: /^Filter/ }).click();
    await page.getByRole("link", { name: "Critical", exact: true }).click();
    await expect(page).toHaveURL(/priority=critical/);
    await expect(page.getByText(/Filter · 2 active/)).toBeVisible();
  });
});
