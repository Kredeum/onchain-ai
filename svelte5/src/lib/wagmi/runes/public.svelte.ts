import {
  getPublicClient,
  type GetPublicClientReturnType as WagmiPublicType,
  watchPublicClient,
  type WatchPublicClientReturnType
} from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/classes";

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
