import {
  getPublicClient,
  type GetPublicClientReturnType as WagmiPublicType,
  watchPublicClient,
  type WatchPublicClientReturnType
} from "@wagmi/core";
import { createConfig } from "./config.svelte";
import type { Config as WagmiConfigType } from "@wagmi/core";

const createPublicClient = () => {
  const config = $derived.by(createConfig());
  let publicClient = $state(getPublicClient(config));

  let unsubscribe: WatchPublicClientReturnType;
  $effect(() => {
    unsubscribe?.();
    unsubscribe = watchPublicClient(config, {
      onChange(newPublicClient) {
        publicClient = newPublicClient;
      }
    });
  });

  return () => publicClient;
};

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

export { createPublicClient, Client };
