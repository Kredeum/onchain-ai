import { test, expect } from "@playwright/test";

test.describe("Burner wallet connection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should connect wallet to the BurnerWallet Test Dapp", async ({ page }) => {
    await page.locator("#connect-button").click();
    await page.locator("#burner-wallet").click();

    await expect(page.locator("#connect-button")).not.toBeVisible();
  });
});

test.describe("Burner wallet interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#connect-button").click();
    await page.locator("#burner-wallet").click();
  });

  test("should have 0.0000 ETH at connexion", async ({ page }) => {
    const text = await page.locator("#user-balance").textContent();
    // console.log("test ~ text:", text);
    // const balance = Number(text);
    // console.log("test ~ balance:", balance);

    // expect(balance).toBe(0);
    await expect(page.locator("#user-balance")).toHaveText("0.0000 ETH");
  });

  test("should get 1.0000 ETH at Faucet claim", async ({ page }) => {
    const text = await page.locator("#user-balance").textContent();
    await expect(page.locator("#user-balance")).toHaveText("0.0000 ETH");

    await page.locator("#faucet-button").click();
    // console.log("test ~ text:", text);
    // const balance = Number(text);
    // console.log("test ~ balance:", balance);

    // expect(balance).toBe(0);
  });
});
