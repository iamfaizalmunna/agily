import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { E2E, openBoard } from "./helpers";

const DESKTOP_DIR = path.join(process.cwd(), "docs/screenshots/desktop");
const MOBILE_DIR = path.join(process.cwd(), "docs/screenshots/mobile");

function ensureDirs() {
  fs.mkdirSync(DESKTOP_DIR, { recursive: true });
  fs.mkdirSync(MOBILE_DIR, { recursive: true });
}

async function capture(
  page: import("@playwright/test").Page,
  filePath: string,
  opts?: { fullPage?: boolean },
) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.screenshot({
    path: filePath,
    fullPage: opts?.fullPage ?? false,
    animations: "disabled",
  });
}

test.describe.configure({ mode: "serial" });

test.describe("app tour screenshots @screenshots", () => {
  test.beforeAll(() => {
    ensureDirs();
  });

  test.beforeEach(({ }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "desktop captures run on chromium only",
    );
  });

  test("desktop — sign-in", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto("/signin");
    await expect(page.getByTestId("signin-email")).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "01-signin.png"));
    await context.close();
  });

  test("desktop — studio & views", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto("/home");
    await expect(
      page.getByRole("heading", { name: "Your studios" }),
    ).toBeVisible({ timeout: 15_000 });
    await capture(page, path.join(DESKTOP_DIR, "02-home.png"));

    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page.getByRole("heading", { name: "Northwind" })).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "03-studio-hub.png"));

    await openBoard(page);
    await capture(page, path.join(DESKTOP_DIR, "04-summary.png"));

    const boardViews = page.getByRole("navigation", { name: "Board views" });
    await boardViews.getByRole("link", { name: "Board", exact: true }).click();
    await expect(page).toHaveURL(/view=flow/);
    await capture(page, path.join(DESKTOP_DIR, "05-kanban-board.png"));

    await boardViews.getByRole("link", { name: "List" }).click();
    await expect(page).toHaveURL(/view=list/);
    await capture(page, path.join(DESKTOP_DIR, "06-list.png"), { fullPage: true });

    await boardViews.getByRole("link", { name: "Calendar" }).click();
    await expect(page).toHaveURL(/view=orbit/);
    await capture(page, path.join(DESKTOP_DIR, "07-calendar.png"));

    await boardViews.getByRole("link", { name: "Timeline" }).click();
    await expect(page).toHaveURL(/view=timeline/);
    await capture(page, path.join(DESKTOP_DIR, "08-timeline.png"));

    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=list`);
    await page.getByRole("link", { name: "Mine", exact: true }).click();
    await capture(page, path.join(DESKTOP_DIR, "09-filters-mine.png"));

    await page.goto(`/t/${E2E.teamSlug}`);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(
      page.getByRole("dialog", { name: "Command palette" }),
    ).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "10-command-palette.png"));
    await page.keyboard.press("Escape");

    await page.locator("body").click();
    await page.keyboard.press("Shift+/");
    await expect(page.getByTestId("shortcut-help")).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "11-shortcuts.png"));
    await page.keyboard.press("Escape");

    await page.goto("/home/profile");
    await expect(page.getByRole("heading", { name: "Your profile" })).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "12-profile-appearance.png"), {
      fullPage: true,
    });

    await page.goto(`/t/${E2E.teamSlug}/settings`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "13-studio-settings.png"));

    await page.goto(`/t/${E2E.teamSlug}/notices`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await capture(page, path.join(DESKTOP_DIR, "14-inbox.png"));
  });
});

test.describe("app tour mobile screenshots @screenshots", () => {
  test.beforeAll(() => {
    ensureDirs();
  });

  test.beforeEach(({ }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "mobile captures run on mobile-chromium only",
    );
  });

  test("mobile — shell & board", async ({ page }) => {
    await page.goto(`/t/${E2E.teamSlug}`);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await capture(page, path.join(MOBILE_DIR, "01-studio-hub.png"));

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Boards" }).click();
    await expect(page.getByRole("searchbox", { name: "Search boards" })).toBeVisible();
    await capture(page, path.join(MOBILE_DIR, "02-board-picker.png"));

    await page.getByRole("searchbox", { name: "Search boards" }).fill("atlas");
    await page.getByRole("link", { name: /Atlas/i }).first().click();
    await expect(page.getByRole("heading", { name: "Atlas", level: 1 })).toBeVisible();
    await capture(page, path.join(MOBILE_DIR, "03-board-summary.png"));

    await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=flow`);
    await capture(page, path.join(MOBILE_DIR, "04-kanban.png"));

    await page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "More" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await capture(page, path.join(MOBILE_DIR, "05-more-sheet.png"));
  });
});
