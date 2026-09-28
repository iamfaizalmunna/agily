import { test as setup } from "@playwright/test";
import { signIn } from "./helpers";

const authFile = "e2e/.auth/owner.json";

setup("owner session", async ({ page }) => {
  await signIn(page);
  await page.waitForURL((url) => url.pathname === "/home" || url.pathname.startsWith("/t/"), {
    timeout: 30_000,
    waitUntil: "commit",
  });
  await page.context().storageState({ path: authFile });
});
