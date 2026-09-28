import { test, expect } from "@playwright/test";
import { dragKanbanCard, E2E, openBoard } from "./helpers";

test.describe("kanban board", () => {
  test.describe.configure({ retries: 2 });
  test.beforeEach(async ({ page }) => {
    await openBoard(page);
    await page.goto(
      `/t/${E2E.teamSlug}/p/${E2E.projectSlug}?view=flow`,
    );
    await expect(page.getByText("Board", { exact: true }).first()).toBeVisible();
  });

  test("drags a card from Doing to Review", async ({ page }) => {
    const doing = page.getByTestId("kanban-column-doing");
    const review = page.getByTestId("kanban-column-review");
    const card = doing.locator('[data-testid^="kanban-card-"]').first();
    await expect(card).toBeVisible();
    const title = (await card.getByRole("link").locator("p").first().textContent())?.trim();
    expect(title).toBeTruthy();
    const handle = card.getByRole("button", { name: "Drag ticket" });
    await dragKanbanCard(page, handle, review);
    await expect(review.getByText(title!, { exact: false })).toBeVisible({
      timeout: 20_000,
    });
    await page.reload();
    await expect(
      page.getByTestId("kanban-column-review").getByText(title!, { exact: false }),
    ).toBeVisible();
  });
});
