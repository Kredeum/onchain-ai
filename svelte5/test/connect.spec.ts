// import { test, expect } from "./fixtures";
// import { metamask } from "./synthetixio";

// test.only("connect wallet using default metamask account", async ({ page }) => {
//   await page.goto("/");
//   await page.click("#metamaskConnect");
//   await metamask.acceptAccess();
//   await expect(page.locator("#metamaskAccount")).toContainText("0xf39Fd6e5");
// });

///////////////////////////////////////////////////////////
// import { expect, test } from "@playwright/test";
// test.beforeEach(async ({ page }) => {
//   await page.goto("/", { waitUntil: "networkidle" });
// });

// test("should be able to connect", async ({ page }) => {
//   await page.click("#connect-button");

//   const connectStatus = page.getByTestId("connect-status");
//   expect(connectStatus).toHaveValue("connected");

//   await page.click("#switch-network-button");

//   const networkStatus = page.getByTestId("network-status");
//   expect(networkStatus).toHaveValue("31337");
// });

///////////////////////////////////////////////////////////
// import { type BrowserContext, expect, test as baseTest } from "@playwright/test";
// import { type BrowserContext, test as baseTest } from "@playwright/test";

import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
// import { MetaMask, unlockForFixture } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";
import basicSetup from "./wallet-setup/basic.setup";

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;
////////////////////////////////////////
// const fixtures = {
//   basicSetup: () => BasicSetup,
//   unlockFixture: () => unlockForFixture
// };

// export const extendedTest = baseTest.extend<{
//   context: BrowserContext;
// }>(fixtures);

// // Utiliser test.extend() pour ajouter les fixtures
// // const extendedTest = baseTest.extend(fixtures);

// // Maintenant, appeler testWithSynpress avec l'objet de fixtures
// const testInstance = testWithSynpress(extendedTest);

// // Extraire la fonction expect du test
// const { expect } = testInstance;

// Define a basic test case
test("should connect wallet to the MetaMask Test Dapp", async ({ context, page, extensionId }) => {
  // Create a new MetaMask instance
  const metamask = new MetaMask(context, page, basicSetup.walletPassword, extensionId);

  // Navigate to the homepage
  await page.goto("/");

  // Click the connect button
  await page.locator("#connect-button").click();

  // Connect MetaMask to the dapp
  await metamask.connectToDapp();

  // Verify the connected account address
  await expect(page.locator("#accounts")).toHaveText("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

  // Additional test steps can be added here, such as:
  // - Sending transactions
  // - Interacting with smart contracts
  // - Testing dapp-specific functionality
});
