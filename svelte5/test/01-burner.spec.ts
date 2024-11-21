import { test, expect } from "@playwright/test";

async function switchToAnvil(page) {
  const connectedNetwork = await page.getByTestId("connected-network");
  if ((await connectedNetwork.textContent()) != "Anvil") {
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
  test("should connect BurnerWallet to Dapp", async ({ page }) => {
    await expect(await page.getByRole("button", { name: "Connect Wallet" })).not.toBeVisible();
  });

  test("should disconnect BurnerWallet from Dapp", async ({ page }) => {
    const connectButton = await page.getByRole("button", { name: "Connect Wallet" });
    await expect(connectButton).not.toBeVisible();

    await page.getByTestId("address-info-dropdown").click();
    await page.getByRole("button", { name: "Disconnect" }).click();

    await expect(connectButton).toBeVisible();
  });
});

test.describe("Burner wallet interactions", () => {
  test("should have 0.0000 ETH on Anvil at connexion", async ({ page }) => {
    await switchToAnvil(page);
    //** This works
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).toBeVisible();

    //  This works if no switch chain
    // await expect(await page.getByTestId("user-balance")).toHaveText("0.0000 ETH");
    //** If switch chain get this error :
    //** Error: expect.toHaveText: Error: strict mode violation: getByTestId('user-balance') resolved to 2 elements:
    //** 1) <div data-testid="user-balance" class="flex w-full items-center justify-center">…</div> aka getByRole('button', { name: '0.0000 ETH' })
    //** 2) <div data-testid="user-balance" class="flex w-full items-center justify-center">…</div> aka getByRole('button', { name: '9919.9998 ETH' })
    //**
    //** Same thing in next test we avoid this selector :
    //** await expect(page.getByTestId("user-balance"))
  });

  test("should get 2.0000 ETH at Faucet claim on Anvil", async ({ page }) => {
    await switchToAnvil(page);

    // const userBalance = await page.getByTestId("user-balance");
    // await expect(userBalance).toHaveText("0.0000 ETH");
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).toBeVisible();

    await page.locator("#faucet-button").click();

    // await expect(userBalance).toHaveText("1.0000 ETH");
    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();

    await page.locator("#faucet-button").click();

    await expect(await page.getByRole("button", { name: /2.0000 ETH/ })).toBeVisible();
    await expect(await page.getByRole("button", { name: /0.0000 ETH/ })).not.toBeVisible();
    await expect(await page.getByRole("button", { name: /1.0000 ETH/ })).not.toBeVisible();
  });
});
