import { test, expect } from "@playwright/test";

test.describe("profile appearance", () => {
  test("saves theme, icons, typeface, and radius on the account", async ({
    page,
  }) => {
    await page.goto("/home/profile");
    await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();
    await expect(page.getByTestId("appearance-preview")).toBeVisible();

    const form = page.getByTestId("profile-appearance-form");
    await form.locator('select[name="themePreset"]').selectOption("graphite");
    await form.locator('select[name="iconSet"]').selectOption("tabler");
    await form.locator('select[name="fontFamily"]').selectOption("outfit");
    await form.locator('select[name="density"]').selectOption("compact");
    await form.locator('select[name="cornerRadius"]').selectOption("soft");

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

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.font);
    }).toBe("outfit");

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.density);
    }).toBe("compact");

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.radius);
    }).toBe("soft");

    const cached = await page.evaluate(() =>
      localStorage.getItem("agily-appearance"),
    );
    expect(cached).toContain("graphite");
    expect(cached).toContain("tabler");
    expect(cached).toContain("outfit");
    expect(cached).toContain("compact");
    expect(cached).toContain("soft");
  });

  test("restore defaults resets appearance tokens", async ({ page }) => {
    await page.goto("/home/profile");
    const form = page.getByTestId("profile-appearance-form");
    await form.locator('select[name="themePreset"]').selectOption("forest");
    await form.locator('select[name="iconSet"]').selectOption("phosphor");
    await Promise.all([
      page.waitForURL(/saved=appearance/, { timeout: 30_000 }),
      form.getByRole("button", { name: "Save appearance" }).click(),
    ]);

    await page.getByTestId("restore-appearance-defaults").click();
    await page.waitForURL(/saved=appearance/, { timeout: 30_000 });

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.theme);
    }).toBe("jira");

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.iconSet);
    }).toBe("lucide");

    await expect.poll(async () => {
      return page.evaluate(() => document.documentElement.dataset.font);
    }).toBe("geist");
  });
});
