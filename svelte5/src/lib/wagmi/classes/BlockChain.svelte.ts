import type { WatchBlockNumberReturnType, GetPublicClientReturnType as WagmiPublicClient } from "@wagmi/core";
import {
  getBlockNumber as getBlockNumberWagmi,
  switchChain as switchChainWagmi,
  watchBlockNumber as watchBlockNumberWagmi
} from "@wagmi/core";
import { disconnect as disconnectWagmi } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/ts";
import type { TargetNetworkId } from "$lib/scaffold-eth/classes";

class BlockChain {
  blockNumber: number | undefined = $state();
  getBlockNumber = async () => (this.blockNumber = Number(await getBlockNumberWagmi(wagmiConfig)));

  watchingBlockNumber = $state(false);
  unwatchBlockNumber: WatchBlockNumberReturnType | undefined;
  watchBlockNumber = () => {
    if (this.watchingBlockNumber) return;

    this.watchingBlockNumber = true;
    const unwatch = watchBlockNumberWagmi(wagmiConfig, {
      emitOnBegin: true,
      onBlockNumber: (blockNumber) => (this.blockNumber = Number(blockNumber))
    });

    this.unwatchBlockNumber = () => {
      this.watchingBlockNumber = false;
      unwatch?.();
    };
  };

  switchChain = async (chainId: TargetNetworkId) => {
    await switchChainWagmi(wagmiConfig, { chainId });
  };

  disconnect = async () => {
    await disconnectWagmi(wagmiConfig);
  };

  constructor({ watch = true }: { watch?: boolean } = {}) {
    this.getBlockNumber();

    if (watch) this.watchBlockNumber();
  }
}

export { BlockChain };
