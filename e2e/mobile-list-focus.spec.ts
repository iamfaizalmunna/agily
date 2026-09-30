import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile list focus", () => {
  test("opens full-screen ticket detail from list feed", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=list`);
    const feedLink = page.locator("main ul.md\\:hidden a").first();
    await expect(feedLink).toBeVisible({ timeout: 15_000 });
    await feedLink.click();
    await expect(page).toHaveURL(/focus=/);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Comments" })).toBeVisible();
  });
});
