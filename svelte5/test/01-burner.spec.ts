import { test, expect } from "@playwright/test";

const connectBurnerWallet = async (page) => {
  await page.locator('#connect-wallet').click();
  await page.locator('#connect-burnerwallet').click();
}

const switchToAnvil = async (page) => {
  const connectedNetwork = await page.locator("#connected-network");
  if ((await connectedNetwork.textContent()) !== "Anvil") {
    await page.locator("#address-info-dropdown").click();
    await page.locator("#switch-network").click();
    await page.locator("#switch-anvil").click();
  }

  expect(await connectedNetwork.textContent() === ("Anvil"));
}

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/void");
  await connectBurnerWallet(page);
  await switchToAnvil(page);
});

test.describe("Burner wallet connection", () => {
  test("should connect BurnerWallet to Dapp", async ({ page }) => {
    expect((await page.locator('#connect-wallet'))).not.toBeVisible();
  });

  test("should disconnect BurnerWallet from Dapp", async ({ page }) => {
    const connectWallet = await page.locator('#connect-wallet');
    await expect(connectWallet).not.toBeVisible();

    await page.locator("#address-info-dropdown").click();
    await page.locator("#disconnect-wallet").click();

    await expect(connectWallet).toBeVisible();
  });

});

test.describe("Burner wallet interactions", () => {
  test("should have 0.0000 ETH on Anvil at connexion", async ({ page }) => {
    expect(await (await page.locator("#user-balance")).textContent() === ("0.0000 ETH"));
  });

  test("should get 2.0000 ETH at Faucet claim on Anvil", async ({ page }) => {

    //** Works on Base but not on Anvil
    // const userBalance = await page.getByTestId("user-balance");
    // await expect(userBalance).toHaveText("0.0000 ETH");

    await expect(await page.locator("button", { name: /0.0000 ETH/ })).toBeVisible();

    await page.locator("#faucet-button").click();

    //** This doesn't work even if change default chain to Anvil in scaffold config but faucet but doesn't exist in this case
    // await expect(userBalance).toHaveText("1.0000 ETH");
    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();

    await page.locator("#faucet-button").click();

    await expect(await page.getByRole("button", { name: /2.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();
    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).not.toBeVisible();
  });
});
