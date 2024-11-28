import { type Page, test, expect } from "@playwright/test";
import { connectWallet, switchChain } from "./common";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await connectWallet(page);
  await switchChain(page, "base-sepolia");
  // await switchChain(page, "anvil");
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
