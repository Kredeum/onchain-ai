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
    // const balanceText = await page.locator("#user-balance");
    // await expect(balanceText).toHaveText("0.0000 ETH");

    const locator = await page.getByTestId("user-balance").first();
    // const locator = await page.getByRole("button", { name: /ETH/ });

    // const elementBefore = await page.getByTestId("user-balance");
    console.log("Texte avant changement : ", locator);

    await expect(locator).toHaveText("0.0000 ETH");

    await page.locator("#address-dropdown").click();
    await page.locator("#switch-network-button").click();
    await page.locator("#Anvil").click();

    await page.locator("#faucet-button").click();

    // await page.waitForFunction(async (balanceText) => (await balanceText.textContent()) !== "0.0000 ETH", balanceText);

    // await page.waitForFunction(
    //   (selector) => {
    //     const element = document.querySelector(selector);
    //     return element?.textContent?.trim() !== "0.0000 ETH";
    //   },
    //   "#user-balance" // Sélecteur de l'élément à surveiller
    // );

    // await page.waitForTimeout(5000);

    locator.waitFor({ state: "attached" });
    console.log("Texte apres changement : ", locator);

    await expect(locator).toHaveText("1.0000 ETH");
  });
});
