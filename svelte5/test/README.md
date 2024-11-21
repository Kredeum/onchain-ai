# E2E tests

See: https://synpress.io/docs/setupPlaywright

## Becarefull dependecies bugs

Synpress Doc don't mention to intall @synthetixio/synpress-cache and Synpress peer dependencies seems not install:

```bash
pnpm i -D @synthetixio/synpress-cache
```

Have perhaps to install sub dependencies manually too:

```bash
pnpm i -D @synthetixio/ethereum-wallet-mock
pnpm i -D @synthetixio/synpress-core
pnpm i -D @synthetixio/synpress-metamask

# for cache wallet
pnpm i -D playwright-core
pnpm i -D esbuild
pnpm i -D tsup
```

## Doc is wrong correct test is

See : https://github.com/Synthetixio/synpress/blob/dev/examples/metamask/test/playwright/01_basic.spec.ts

```typescript
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "../wallet-setup/basic.setup";

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test("should connect wallet to the MetaMask Test Dapp", async ({ context, page, metamaskPage, extensionId }) => {
  // Create a new MetaMask instance with the provided context, page, password, and extension ID
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);

  // Navigate to the root page
  await page.goto("/");

  // Click the connect button to initiate the wallet connection
  await page.locator("#connectButton").click();

  // Connect dApp to MetaMask
  await metamask.connectToDapp();

  // Verify that the correct account address is displayed
  await expect(page.locator("#accounts")).toHaveText("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

  // Click the button to get all connected accounts
  await page.locator("#getAccounts").click();

  // Verify that the correct account address is returned and displayed
  await expect(page.locator("#getAccountsResult")).toHaveText("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
});
```

## Doc discretly says about Metamask cache

Before to run any test with Metamask, Metamask cahe must be build :  
See https://synpress.io/docs/guides/wallet-cache

```bash
npx synpress
```