import { test, expect } from "@playwright/test";
import { E2E, openBoard, signIn } from "./helpers";

test.describe("kanban board", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await openBoard(page);
    await page.goto(
      `/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=flow`,
    );
    await expect(page.getByText("Board", { exact: true }).first()).toBeVisible();
  });

  test("drags a card from Doing to Review", async ({ page }) => {
    const doing = page.getByTestId("kanban-column-doing");
    const review = page.getByTestId("kanban-column-review");
    const card = doing.getByText("Redesign sprint board filters");
    await expect(card).toBeVisible();
    await card.dragTo(review);
    await expect(review.getByText("Redesign sprint board filters")).toBeVisible({
      timeout: 15_000,
    });
    await page.reload();
    await expect(
      page.getByTestId("kanban-column-review").getByText(
        "Redesign sprint board filters",
      ),
    ).toBeVisible();
  });
});
