import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

const boardBase = `/t/${E2E.teamSlug}/p/${E2E.projectSlug}`;

test.describe("revamp ship paths", () => {
  test("list view applies a quick lens filter", async ({ page }) => {
    await page.goto(`${boardBase}?view=list`);
    await expect(page.getByRole("navigation", { name: "Board views" })).toBeVisible();
    await page.getByRole("link", { name: "Mine", exact: true }).click();
    await expect(page).toHaveURL(/q=mine/);
    await expect(page.getByRole("link", { name: "Mine", exact: true })).toBeVisible();
  });

  test("timeline view loads the gantt chart", async ({ page }) => {
    await page.goto(`${boardBase}?view=timeline`);
    await expect(page.getByRole("link", { name: "Timeline" })).toBeVisible();
    await expect(page.getByText("Redesign sprint board filters").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("project board settings render workflow section", async ({ page }) => {
    await page.goto(`${boardBase}/settings`);
    await expect(page.getByRole("heading", { name: "Atlas", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Settings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Workflow & fields" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Import & export" })).toBeVisible();
  });

  test("flow board stays usable with 100+ seeded tickets", async ({ page }) => {
    await page.goto(`${boardBase}?view=flow`);
    const backlog = page.getByTestId("kanban-column-backlog");
    await expect(backlog).toBeVisible({ timeout: 15_000 });
    const doing = page.getByTestId("kanban-column-doing");
    await expect(doing).toBeVisible();
    const backlogCount = Number(
      (await backlog.locator("header span").last().textContent()) ?? "0",
    );
    expect(backlogCount).toBeGreaterThan(0);
  });
});
