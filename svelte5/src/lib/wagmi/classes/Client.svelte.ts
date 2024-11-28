import { getPublicClient, watchPublicClient, type GetPublicClientReturnType } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/ts";

type PublicClientType = typeof Client.prototype.publicClient;

class Client {
  publicClient = $state(getPublicClient(wagmiConfig));

  onChange(publicClient: PublicClientType) {
    this.publicClient = publicClient;
  }

  unsubscribe = $derived.by(() => {
    this.unsubscribe?.();
    return watchPublicClient(wagmiConfig, { onChange: this.onChange });
  });
}

export { Client };
