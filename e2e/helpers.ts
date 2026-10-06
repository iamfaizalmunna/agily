import { expect, type Locator, type Page } from "@playwright/test";

export const E2E = {
  email: "owner@agily.com",
  password: "password123",
  teamSlug: "northwind",
  projectSlug: "atlas",
} as const;

async function waitForSignedIn(page: Page) {
  await page.waitForURL(
    (url) => !url.pathname.startsWith("/signin"),
    { timeout: 30_000 },
  );
}

export async function signIn(page: Page) {
  await page.goto("/signin");
  const demoOwner = page.getByTestId("demo-owner");
  const demoVisible = await demoOwner
    .waitFor({ state: "visible", timeout: 8_000 })
    .then(() => true)
    .catch(() => false);
  if (demoVisible) {
    await Promise.all([waitForSignedIn(page), demoOwner.click()]);
    return;
  }
  const email = page.getByTestId("signin-email");
  const password = page.getByTestId("signin-password");
  await email.click();
  await email.fill(E2E.email);
  await password.click();
  await password.fill(E2E.password);
  await Promise.all([
    waitForSignedIn(page),
    page.getByTestId("signin-submit").click(),
  ]);
}

export async function openBoard(page: Page) {
  await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}`);
  await expect(page.getByRole("heading", { name: "Atlas" })).toBeVisible();
}

/** dnd-kit cards respond to pointer moves, not HTML5 dragTo. */
export async function dragKanbanCard(
  page: Page,
  card: Locator,
  targetColumn: Locator,
) {
  const handleBox = await card.boundingBox();
  const targetBox = await targetColumn.boundingBox();
  if (!handleBox || !targetBox) {
    throw new Error("Could not resolve drag source or drop target");
  }
  const fromX = handleBox.x + handleBox.width / 2;
  const fromY = handleBox.y + handleBox.height / 2;
  const toX = targetBox.x + targetBox.width / 2;
  const toY = targetBox.y + Math.min(targetBox.height / 2, 120);
  await handle.hover();
  await page.mouse.down();
  await page.waitForTimeout(80);
  await page.mouse.move(toX, toY, { steps: 24 });
  await page.waitForTimeout(80);
  await page.mouse.up();
}
