import {
  getPublicClient,
  type GetPublicClientReturnType as WagmiPublicType,
  watchPublicClient,
  type WatchPublicClientReturnType
} from "@wagmi/core";
import { wagmiConfig } from "@kredeum/wagmi-svelte5";

const createPublicClient = () => {
  let publicClient = $state(getPublicClient(wagmiConfig));

  let unsubscribe: WatchPublicClientReturnType;
  $effect(() => {
    unsubscribe?.();
    unsubscribe = watchPublicClient(wagmiConfig, {
      onChange(newPublicClient) {
        publicClient = newPublicClient;
      }
    });
  });

  return () => publicClient;
};

export { createPublicClient };
