import { test, expect } from "@playwright/test";

test.describe("profile appearance", () => {
  test("saves theme preset and icon set on the account", async ({ page }) => {
    await page.goto("/home/profile");
    await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();

    const form = page.getByTestId("profile-appearance-form");
    await form.locator('select[name="themePreset"]').selectOption("graphite");
    await form.locator('select[name="iconSet"]').selectOption("tabler");

    await Promise.all([
      page.waitForURL(/saved=appearance/, { timeout: 30_000 }),
      form.getByRole("button", { name: "Save appearance" }).click(),
    ]);

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.theme);
    }).toBe("graphite");

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.iconSet);
    }).toBe("tabler");

    const cached = await page.evaluate(() => localStorage.getItem("agily-appearance"));
    expect(cached).toContain("graphite");
    expect(cached).toContain("tabler");
  });
});
