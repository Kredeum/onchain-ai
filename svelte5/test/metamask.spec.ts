import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";
import basicSetup from "./wallet-setup/basic.setup";

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

// Define a basic test case with Metamask
test("should connect wallet to the MetaMask Test Dapp", async ({ context, page, extensionId }) => {
  // Create a new MetaMask instance
  const metamask = new MetaMask(context, page, basicSetup.walletPassword, extensionId);

  // Navigate to the homepage
  await page.goto("/");

  // Click the connect buttons
  await page.locator("#connect-button").click();
  await page.locator("#metaMask").click();

  // Connect MetaMask to the dapp
  await metamask.connectToDapp();

  const address = "0xf39Fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const addressEllipsis = address?.slice(0, 6) + "..." + address?.slice(-4);

  // Verify the connected account address
  await expect(page.locator("#ethAdress")).toHaveText(addressEllipsis);
});
