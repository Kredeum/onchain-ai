import { test, expect } from "@playwright/test";

async function switchToAnvil(page) {
  const connectedNetwork = page.getByTestId("connected-network");
  if (connectedNetwork.textContent() !== "Anvil") {
    await page.getByTestId("address-info-dropdown").click();
    await page.getByRole("button", { name: "Switch Network" }).click();
    await page.getByRole("button", { name: "Switch to Anvil" }).click();
  } else {
    console.log("Already on Anvil network.");
  }

  await expect(page.getByTestId("connected-network")).toHaveText("Anvil");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  // Connect to Burner Wallet
  await page.getByRole("button", { name: "Connect Wallet" }).click();
  await page.getByRole("button", { name: "Burner Wallet" }).click();
});

test.describe("Burner wallet connection", () => {
  test("should be connected with BurnerWallet", async ({ page }) => {
    await expect(await page.getByRole("button", { name: "Connect Wallet" })).not.toBeVisible();
  });

  test("should disconnect BurnerWallet", async ({ page }) => {
    const connectButton = await page.getByRole("button", { name: "Connect Wallet" });
    await expect(connectButton).not.toBeVisible();

    await page.getByTestId("address-info-dropdown").click();
    await page.getByRole("button", { name: "Disconnect" }).click();

    await expect(connectButton).toBeVisible();
  });
});

test.describe("Burner wallet interactions", () => {
  test("should have 0.0000 ETH at connexion", async ({ page }) => {
    await switchToAnvil(page);
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).toBeVisible();

    // await expect(page.getByTestId("user-balance")).toHaveText("0.0000 ETH");
  });

  test("should get 2.0000 ETH at Faucet claim", async ({ page }) => {
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).toBeVisible();

    await switchToAnvil(page);

    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).toBeVisible();

    await page.locator("#faucet-button").click();

    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();

    await page.locator("#faucet-button").click();

    await expect(await page.getByRole("button", { name: /2.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();
    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).not.toBeVisible();
  });
});
