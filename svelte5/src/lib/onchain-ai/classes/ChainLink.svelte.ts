import { readChainLinkConfig } from "@onchain-ai/common";
import { targetNetwork } from "$lib/wagmi/classes";

class ChainLink {
  href = $state<string>("");
  chainId = $state<number>(0);

  constructor({ requestId }: { requestId?: `0x${string}` } = {}) {
    const config = $derived(readChainLinkConfig(targetNetwork.id));
    const href = $derived(
      targetNetwork.id === 31337
        ? "/chainLink"
        : `https://functions.chain.link/${config.chainName}/${config.subscriptionId}` +
            (requestId ? `#/side-drawer/request/${requestId}` : "")
    );

    $effect(() => {
      this.chainId = targetNetwork.id;
      this.href = href;
    });

    // $inspect("ChainLink", targetNetwork.id, this.href, config);
  }
}

export { ChainLink };
