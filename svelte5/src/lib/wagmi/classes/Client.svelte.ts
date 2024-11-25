import {
  getPublicClient,
  type GetPublicClientReturnType as WagmiPublicType,
  watchPublicClient,
  type WatchPublicClientReturnType
} from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";
import type { Config as WagmiConfigType } from "@wagmi/core";

class Client {
  config: WagmiConfigType = $derived.by(createConfig());

  publicClient: WagmiPublicType = $state(getPublicClient(this.config));

  onChange(publicClient: WagmiPublicType) {
    this.publicClient = publicClient;
  }

  unsubscribe: WatchPublicClientReturnType = $derived.by(() => {
    this.unsubscribe?.();
    return watchPublicClient(this.config, { onChange: this.onChange });
  });
}

export { Client };
