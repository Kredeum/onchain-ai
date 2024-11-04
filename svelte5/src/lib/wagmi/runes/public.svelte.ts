import { getPublicClient, watchPublicClient, type WatchPublicClientReturnType } from "@wagmi/core";
import { createConfig } from "./config.svelte";

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
