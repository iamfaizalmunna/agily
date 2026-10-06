import { test, expect } from "@playwright/test";
import { E2E, openBoard } from "./helpers";

test.describe("layout smoke", () => {
  test("list view uses full width without empty split column at laptop width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await openBoard(page);
    await page.getByRole("link", { name: "List" }).click();
    await expect(page.getByLabel("Ticket list")).toBeVisible();
    const pickPane = page.getByText("Pick a ticket from the list");
    await expect(pickPane).toHaveCount(0);
  });

  test("flow board exposes horizontal column strip", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openBoard(page);
    await page
      .getByRole("navigation", { name: "Board views" })
      .getByRole("link", { name: "Board", exact: true })
      .click();
    await expect(page.getByTestId("kanban-column-strip")).toBeVisible();
    await expect(page.getByTestId(/^kanban-column-/)).not.toHaveCount(0);
  });

  test("settings layout loads on mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/t/${E2E.teamSlug}/settings`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByLabel("Settings section")).toBeVisible();
  });

  test("not-found page fits narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByTestId("not-found-home")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
  });
});
