import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.describe("keyboard chrome", () => {
  test("opens the shortcut sheet with ?", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page.getByRole("heading", { name: "Northwind" })).toBeVisible();
    await page.locator("body").click();
    await page.keyboard.press("Shift+/");
    await expect(page.getByTestId("shortcut-help")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("shortcut-help")).toBeHidden();
  });
});
