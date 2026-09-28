import { test, expect } from "@playwright/test";
import { E2E, openBoard } from "./helpers";

test.describe("studio smoke", () => {
  test("pulse and open a board", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page.getByRole("heading", { name: "Northwind" })).toBeVisible();
    await openBoard(page);
    await expect(page.getByRole("navigation", { name: "Board views" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summary" })).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Board views" })
        .getByRole("link", { name: "Board", exact: true }),
    ).toBeVisible();
  });
});
