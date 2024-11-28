import { type Page, test, expect } from "@playwright/test";
import { connectWallet, switchChain } from "./common";

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/void");
});

test.describe("Wallet connection, deconnection", () => {
  test("should connect BurnerWallet to Dapp", async ({ page }) => {
    const connectWalletButton = await page.locator("#connect-wallet");

    await expect(connectWalletButton).toBeVisible();
    await connectWallet(page);
    await expect(connectWalletButton).not.toBeVisible();
  });

  test("Should disconnect BurnerWallet from Dapp", async ({ page }) => {
    let connectWalletButton = await page.locator("#connect-wallet");
    await connectWallet(page);

    await expect(connectWalletButton).not.toBeVisible();
    await page.locator("#address-info-dropdown").click();
    await page.locator("#disconnect-wallet").click();
    connectWalletButton = await page.locator("#connect-wallet");
    await expect(connectWalletButton).toBeVisible();
  });

  test("Should switch network", async ({ page }) => {
    await connectWallet(page);
    const connectedNetwork = await page.locator("#connected-network");

    await switchChain(page, "anvil");
    await expect(connectedNetwork).toHaveAttribute("data-chain-name", "anvil");

    await switchChain(page, "base-sepolia");
    await expect(connectedNetwork).toHaveAttribute("data-chain-name", "base-sepolia");
  });
});

test.describe("Connected wallet interactions", () => {
  test.beforeEach(async ({ page }) => {
    await connectWallet(page);
    await switchChain(page, "anvil");
  });

  test("Should have ETH balance displayed", async ({ page }) => {
    const userbalance = await page.locator(".navbar-end .user-balance");
    await expect(userbalance).toContainText("ETH");
  });

  test("Should get 2 ETH from Faucet on Anvil", async ({ page }) => {
    const faucetButton = await page.locator("#faucet-button");
    await expect(faucetButton).toBeVisible();

    let userbalance = await page.locator(".navbar-end .user-balance");
    const bal0 = BigInt((await userbalance.getAttribute("data-balance")) || "0");

    const bal1 = bal0 + 10n ** 18n;
    faucetButton.click();
    await expect(userbalance).toHaveAttribute("data-balance", String(bal1));
    await page.locator(".notification-close").click();

    const bal2 = bal1 + 10n ** 18n;
    faucetButton.click();
    await expect(userbalance).toHaveAttribute("data-balance", String(bal2));
    await page.locator(".notification-close").click();
  });
});
