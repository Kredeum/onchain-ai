import { getBlockNumber, watchBlockNumber } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes/global.svelte";

const createLatestBlock = ({ chainId: paramChainId, watch = true }: { chainId?: number; watch?: boolean } = {}) => {
  const config = $derived.by(createConfig());

  const { targetNetworkId } = $derived.by(createTargetNetworkId);
  const chainId = $derived(paramChainId || targetNetworkId);

  let blockNumber = $state();
  const fetch = async () => {
    blockNumber = await getBlockNumber(config, { chainId });

    return blockNumber;
  };
  fetch();

  let unwatch = (): void => { };
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
