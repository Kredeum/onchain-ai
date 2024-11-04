import { getBlockNumber, watchBlockNumber } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes/global.svelte";

const createBlockNumber = (params?: { chainId?: number; watch?: boolean }) => {
  let { chainId, watch } = params || {}
  watch ??= true;

  const config = $derived.by(createConfig());
  if (!chainId) {
    const { targetNetworkId } = $derived.by(createTargetNetworkId);
    chainId = targetNetworkId;
  }

  let blockNumber = $state();
  const fetch = async () => {
    blockNumber = await getBlockNumber(config, { chainId });

    return blockNumber;
  };
  fetch();

  let unwatch = (): void => { };
  $effect(() => {
    unwatch();
    unwatch = watchBlockNumber(config, {
      onBlockNumber(newBlockNumber) {
        blockNumber = newBlockNumber;
      }
    });
  });

  return {
    fetch,
    get blockNumber() {
      return blockNumber;
    }
  };
};

export { createBlockNumber };
