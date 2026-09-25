import { test, expect } from "@playwright/test";
import { E2E, openBoard, signIn } from "./helpers";

test.describe("studio smoke", () => {
  test("sign in, pulse, and open a board", async ({ page }) => {
    await signIn(page);
    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page.getByRole("heading", { name: "Northwind" })).toBeVisible();
    await openBoard(page);
    await expect(page.getByRole("navigation", { name: "Board views" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Board" })).toBeVisible();
  });
});
