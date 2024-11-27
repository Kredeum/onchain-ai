import { readChainLinkConfig } from "@onchain-ai/common";
import { createChainId } from "$lib/scaffold-eth/runes";

class ChainLink {
  href = $state<string>("");
  chainId = $state<number>(0);

  constructor({ requestId }: { requestId?: `0x${string}` } = {}) {
    const { chainIdCurrent } = $derived.by(createChainId);
    const config = $derived(readChainLinkConfig(chainIdCurrent));
    const href = $derived(
      chainIdCurrent === 31337
        ? "/chainLink"
        : `https://functions.chain.link/${config.chainName}/${config.subscriptionId}` +
            (requestId ? `#/side-drawer/request/${requestId}` : "")
    );

    $effect(() => {
      this.chainId = chainIdCurrent;
      this.href = href;
    });

    $inspect("ChainLink", chainIdCurrent, this.href, config);
  }
}

export { ChainLink };
