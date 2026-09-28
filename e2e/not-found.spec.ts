import { test, expect } from "@playwright/test";
test.describe("empty and error chrome", () => {
  test("shows a friendly 404", async ({ page }) => {
    await page.goto("/t/not-a-real-studio");
    await expect(page.getByRole("heading", { name: "Not here" })).toBeVisible();
    await expect(page.getByTestId("not-found-home")).toBeVisible();
  });

  test("kb index lists bundled notes", async ({ page }) => {
    await page.goto("/kb");
    await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Roles" })).toBeVisible();
  });
});
