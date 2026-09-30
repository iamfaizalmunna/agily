import { test, expect } from "@playwright/test";
import { E2E } from "./helpers";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("mobile shell", () => {
  test("bottom nav reaches pulse, boards, inbox, and more", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}`);
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();

    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await nav.getByRole("link", { name: "Boards" }).click();
    await expect(page).toHaveURL(/#studio-boards/);
    await expect(page.locator("#studio-boards")).toBeVisible();

    await nav.getByRole("link", { name: "Inbox" }).click();
    await expect(page).toHaveURL(new RegExp(`/t/${E2E.teamSlug}/notices`));

    await nav.getByRole("button", { name: "More" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "More" })).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();

    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}`);
    await nav.getByRole("button", { name: "Create" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(nav.getByRole("link", { name: "Boards" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
