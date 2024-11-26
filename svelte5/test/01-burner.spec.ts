import { type Page, test, expect } from "@playwright/test";

const connectBurnerWallet = async (page: Page) => {
  await page.locator("#connect-wallet").click();
  await page.locator("#connect-burnerwallet").click();
};

const switchToAnvil = async (page: Page) => {
  const connectedNetwork = await page.locator("#connected-network");
  if ((await connectedNetwork.getAttribute("data-chain-name")) !== "anvil") {
    await page.locator("#address-info-dropdown").click();
    await page.locator("#switch-network").click();
    await page.locator("#switch-anvil").click();
  }
  await expect(connectedNetwork).toHaveAttribute("data-chain-name", "anvil");
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

  test("Should disconnect BurnerWallet from Dapp", async ({ page }) => {
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

  test("Should have ETH balance displayed", async ({ page }) => {
    const userbalance = await page.locator(".navbar-end .user-balance");
    await expect(userbalance).toContainText("ETH");
  });

  test("Should get 2 ETH from Faucet on Anvil", async ({ page }) => {
    let userbalance = await page.locator(".navbar-end .user-balance");
    const bal0 = BigInt((await userbalance.getAttribute("data-balance")) || "0");

    const bal1 = bal0 + 10n ** 18n;
    await page.locator("#faucet-button").click();
    await expect(userbalance).toHaveAttribute("data-balance", String(bal1));
    await page.locator(".notification-close").click();

    const bal2 = bal1 + 10n ** 18n;
    await page.locator("#faucet-button").click();
    await expect(userbalance).toHaveAttribute("data-balance", String(bal2));
    await page.locator(".notification-close").click();
  });
});
