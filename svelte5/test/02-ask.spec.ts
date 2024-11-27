import { type Page, test, expect } from "@playwright/test";

const connectWallet = async (page: Page, walletName = "burnerwallet") => {
  await page.locator("#connect-wallet").click();
  await page.locator(`#connect-${walletName}`).click();
};

const switchTo = async (page: Page, chainName: string) => {
  const connectedNetwork = await page.locator("#connected-network");
  if ((await connectedNetwork.getAttribute("data-chain-name")) !== chainName) {
    await page.locator("#address-info-dropdown").click();
    await page.locator("#switch-network").click();
    await page.locator(`#switch-${chainName}`).click();
  }
  await expect(connectedNetwork).toHaveAttribute("data-chain-name", chainName);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await connectWallet(page);
  await switchTo(page, "base-sepolia");
  // await switchTo(page, "anvil");
  // await page.locator("#faucet-button").click();
});

test.describe("Ask!", () => {
  test("Should display OnChainAI and Scaffold-ETH Svelte5", async ({ page }) => {
    expect(await page.title()).toBe("OnChainAI");
    await expect(page.locator("body")).toContainText("Scaffold-ETH Svelte5");
    await expect(page.locator("text=Ask? OnChainAI")).toBeVisible();
  });

  test("Should answer correctly to simple calculation", async ({ page }) => {
    const a: number = Math.floor(Math.random() * 50);
    const b: number = Math.floor(Math.random() * 50);
    const prompt = `${a}+${b}`;
    const response = `${a + b}`;
    await page.locator("#ask-input .input").fill(prompt);
    await page.locator("#ask-button").click();
    await expect(page.locator(".notification-loading")).toContainText("Sending transaction...");
    await expect(page.locator(".notification-success")).toContainText("Transaction validated!");
    await expect(page.locator("#interaction-0 .prompt")).toHaveText(prompt);
    await expect(page.locator("#interaction-0 .response")).toContainText(response, { timeout: 30000 });
  });
});
