import {
  getPublicClient,
  type GetPublicClientReturnType as WagmiPublicType,
  watchPublicClient,
  type WatchPublicClientReturnType
} from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";
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

export { createPublicClient };
