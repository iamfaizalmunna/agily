import { expect, type Page } from "@playwright/test";

export const E2E = {
  email: "owner@studio.local",
  password: "password123",
  teamSlug: "northwind-e2e",
  projectSlug: "atlas",
} as const;

export async function signIn(page: Page) {
  await page.goto("/signin");
  await page.getByTestId("signin-email").fill(E2E.email);
  await page.getByTestId("signin-password").fill(E2E.password);
  await page.getByTestId("signin-submit").click();
  await page.waitForURL((url) => !url.pathname.startsWith("/signin"), {
    timeout: 20_000,
  });
}

export async function openBoard(page: Page) {
  await page.goto(`/t/${E2E.teamSlug}/p/${E2E.projectSlug}`);
  await expect(page.getByRole("heading", { name: "Atlas" })).toBeVisible();
}
