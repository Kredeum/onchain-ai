import { readChainLinkConfig } from "@onchain-ai/common";
import { wagmi } from "@kredeum/wagmi-svelte5";

class ChainLink {
  href = $state<string>("");
  chainId = $state<number>(0);

  constructor({ requestId }: { requestId?: `0x${string}` } = {}) {
    const config = $derived(readChainLinkConfig(wagmi.chainId));
    const href = $derived(
      wagmi.chainId === 31337
        ? "/chainLink"
        : `https://functions.chain.link/${config.chainName}/${config.subscriptionId}` +
            (requestId ? `#/side-drawer/request/${requestId}` : "")
    );

    $effect(() => {
      this.chainId = wagmi.chainId;
      this.href = href;
    });

    // $inspect("ChainLink", wagmi.chainId, this.href, config);
  }
}

export { ChainLink };
