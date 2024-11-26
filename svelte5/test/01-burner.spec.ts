import { type Page, test, expect } from "@playwright/test";

const connectBurnerWallet = async (page: Page) => {
  await page.locator("#connect-wallet").click();
  await page.locator("#connect-burnerwallet").click();
};

const switchToAnvil = async (page: Page) => {
  const connectedNetwork = await page.locator("#connected-network");
  if ((await connectedNetwork.textContent()) !== "Anvil") {
    await page.locator("#address-info-dropdown").click();
    await page.locator("#switch-network").click();
    await page.locator("#switch-anvil").click();
  }

  await expect(connectedNetwork).toHaveText("Anvil");
};

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/void");
});

test.describe("Wallet connection, deconnection", () => {
  test("should connect BurnerWallet to Dapp", async ({ page }) => {
    const connectWallet = await page.locator("#connect-wallet");
    const faucetButton = await page.locator("#faucet-button");

    await expect(connectWallet).toBeVisible();
    await expect(faucetButton).not.toBeVisible();
    await connectBurnerWallet(page);
    await expect(connectWallet).not.toBeVisible();
    await expect(faucetButton).toBeVisible();
  });

  test("should disconnect BurnerWallet from Dapp", async ({ page }) => {
    let connectWallet = await page.locator("#connect-wallet");
    await connectBurnerWallet(page);

    await expect(connectWallet).not.toBeVisible();
    await page.locator("#address-info-dropdown").click();
    await page.locator("#disconnect-wallet").click();
    connectWallet = await page.locator("#connect-wallet");
    await expect(connectWallet).toBeVisible();
  });
});

test.describe("Connected wallet interactions", () => {
  test.beforeEach(async ({ page }) => {
    await connectBurnerWallet(page);
    await switchToAnvil(page);
  });

  test("should have 0.0000 ETH on Anvil at connexion", async ({ page }) => {
    const userbalance = await page.locator(".navbar-end .user-balance");
    await expect(userbalance).toHaveText("0.0000 ETH");
  });

  test.only("should get some ETH at Faucet claim on Anvil", async ({ page }) => {
    const userbalance = await page.locator(".navbar-end .user-balance");

    await page.locator("#faucet-button").click();
    await expect(userbalance).toHaveText("1.0000 ETH");
    await page.locator(".notification-close").click();

    await page.locator("#faucet-button").click();
    await expect(userbalance).toHaveText("2.0000 ETH");
    await page.locator(".notification-close").click();
  });
});
