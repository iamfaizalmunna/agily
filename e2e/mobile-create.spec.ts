import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile quick create", () => {
  test("creates a ticket from bottom nav sheet", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=flow`);
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByPlaceholder("What needs doing?").fill("Mobile quick create e2e");
    await page.getByRole("button", { name: "Create ticket" }).click();
    await expect(page).toHaveURL(/focus=/);
    await expect(page.getByRole("dialog", { name: "Ticket detail" })).toBeVisible();
  });
});
