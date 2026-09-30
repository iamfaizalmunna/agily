import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile flow board", () => {
  test("moves a ticket via Move menu", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=flow`);
    const backlog = page.getByTestId("kanban-column-backlog");
    await expect(backlog).toBeVisible({ timeout: 15_000 });
    const card = backlog.locator("[data-testid^='kanban-card-']").first();
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: /^Move / }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Doing", exact: true }).click();
    await expect(page.getByTestId("kanban-column-doing")).toBeVisible();
    await expect(
      page.getByTestId("kanban-column-doing").locator("[data-testid^='kanban-card-']"),
    ).not.toHaveCount(0);
  });
});
