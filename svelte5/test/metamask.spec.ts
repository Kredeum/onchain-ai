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

  // page.on("console", (message) => {
  //   console.log(`Log de la page : [${message.type()}] ${message.text()}`);
  // });

  // page.on("console", async (message) => {
  //   const args = await Promise.all(message.args().map((arg) => arg.jsonValue()));
  //   console.log(`[${message.type()}] ${message.text()}`, ...args);
  // });

  // page.on("console", (message) => {
  //   const location = message.location();
  //   console.log(
  //     `Log de la page : [${message.type()}] ${message.text()} (${location.url}:${location.lineNumber}:${location.columnNumber})`
  //   );
  // });

  //////////////////////////////////////////////////////////
  // const ethereumExists = await page.evaluate(() => {
  //   return typeof window.ethereum !== "undefined";
  // });

  // expect(ethereumExists).toBe(true);

  //////////////////////////////////////////////////////////
  // Disconnect from auto connected burner wallet
  await page.locator("#address-dropdown").click();
  await page.locator("#disconnect-button").click();

  // Click the connect buttons
  await page.locator("#connect-button").click();
  // await page.waitForSelector("#metamask", { state: "attached" });
  await page.locator("#metamask").click();

  // Connect MetaMask to the dapp
  await metamask.connectToDapp();

  const address = "0xf39Fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const addressEllipsis = address?.slice(0, 6) + "..." + address?.slice(-4);

  // Verify the connected account address
  await expect(page.locator("#eth-address")).toHaveText(addressEllipsis);
});
