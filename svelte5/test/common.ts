import { type Page } from "@playwright/test";

const connectWallet = async (page: Page, walletName = "burnerwallet") => {
  await page.locator("#connect-wallet").click();
  await page.locator(`#connect-${walletName}`).click();
};

const switchChain = async (page: Page, chainName: string) => {
  const connectedNetwork = await page.locator("#connected-network");
  if ((await connectedNetwork.getAttribute("data-chain-name")) !== chainName) {
    await page.locator("#address-info-dropdown").click();
    await page.locator("#switch-network").click();
    await page.locator(`#switch-${chainName}`).click();
  }
};

export { connectWallet, switchChain };