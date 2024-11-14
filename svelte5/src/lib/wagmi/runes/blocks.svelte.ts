import { getBlockNumber, watchBlockNumber } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createChainId } from "$lib/scaffold-eth/runes/global.svelte";

const createLatestBlock = ({ chainId: chainIdParam, watch = true }: { chainId?: number; watch?: boolean } = {}) => {
  const config = $derived.by(createConfig());

  const { chainIdCurrent } = $derived.by(createChainId);
  const chainId = $derived(chainIdParam || chainIdCurrent);

  let blockNumber = $state();
  const fetch = async () => {
    blockNumber = await getBlockNumber(config, { chainId });

    return blockNumber;
  };
  fetch();

  let unwatch = (): void => {};
  $effect(() => {
    if (!watch) return;

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

export { createLatestBlock };
