import type { WatchBlockNumberReturnType, GetPublicClientReturnType as WagmiPublicClient } from "@wagmi/core";
import {
  getBlockNumber as getBlockNumberWagmi,
  switchChain as switchChainWagmi,
  watchBlockNumber as watchBlockNumberWagmi
} from "@wagmi/core";
import { disconnect as disconnectWagmi } from "@wagmi/core";

import { createConfig } from "$lib/wagmi/runes";

class BlockChain {
  configWagmi = $derived.by(createConfig());

  blockNumber: number | undefined = $state();
  getBlockNumber = async () => (this.blockNumber = Number(await getBlockNumberWagmi(this.configWagmi)));

  watchingBlockNumber = $state(false);
  unwatchBlockNumber: WatchBlockNumberReturnType | undefined;
  watchBlockNumber = () => {
    if (this.watchingBlockNumber) return;

    this.watchingBlockNumber = true;
    const unwatch = watchBlockNumberWagmi(this.configWagmi, {
      emitOnBegin: true,
      onBlockNumber: (blockNumber) => (this.blockNumber = Number(blockNumber))
    });

    this.unwatchBlockNumber = () => {
      this.watchingBlockNumber = false;
      unwatch?.();
    };
  };

  switchChain = async (chainId: number) => {
    await switchChainWagmi(this.configWagmi, { chainId });
  };

  disconnect = async () => {
    await disconnectWagmi(this.configWagmi);
  };

  constructor({ watch = true }: { watch?: boolean } = {}) {
    this.getBlockNumber();

    if (watch) this.watchBlockNumber();
  }
}

export { BlockChain };
