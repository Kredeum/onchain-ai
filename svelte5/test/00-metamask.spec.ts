import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";
import basicSetup from "./wallet-setup/basic.setup";

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test.describe("Metamask wallet connection", () => {
  test("should connect wallet to the MetaMask Test Dapp", async ({ context, page, extensionId }) => {
    // Create a new MetaMask instance
    const metamask = new MetaMask(context, page, basicSetup.walletPassword, extensionId);

    await page.goto("/");

    //////////////////////////////////////////////////////////
    // Check if window.ethereum is injected
    const ethereumExists = await page.evaluate(() => {
      return "ethereum" in window;
    });

    expect(ethereumExists).toBe(true);

    //////////////////////////////////////////////////////////
    const addressInfoDropdown = await page.getByTestId("address-info-dropdown");
    const ethAddress = addressInfoDropdown.locator("summary > span");

    // Disconnect from auto connected burner wallet
    addressInfoDropdown.click();
    await page.getByRole("button", { name: "Disconnect" }).click();

    // Click the connect buttons
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    await page.getByRole("button", { name: "MetaMask" }).click();

    // Connect MetaMask to the dapp
    await metamask.connectToDapp();

    const address = "0xf39Fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const addressEllipsis = address?.slice(0, 6) + "..." + address?.slice(-4);

    // Verify the connected account address
    await expect(ethAddress).toHaveText(addressEllipsis);
  });
});
