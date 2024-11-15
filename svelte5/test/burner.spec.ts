import { test, expect } from "@playwright/test";

test("should connect wallet to the BurnerWallet Test Dapp", async ({ page }) => {
  await page.goto("/");

  await page.locator("#connect-button").click();
  await page.locator("#burner").click();

  await expect(page.locator("#connect-button")).not.toBeVisible();
});
