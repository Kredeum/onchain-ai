import {
  type WatchBlockNumberReturnType,
  getBlockNumber as getBlockNumberWagmi,
  switchChain as switchChainWagmi,
  watchBlockNumber as watchBlockNumberWagmi,
  disconnect as disconnectWagmi
} from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/classes";

type WagmiChainId = (typeof wagmiConfig)["chains"][number]["id"];

// Network Singleton Class, reactive on chainId
class Network {
  blockNumber: number | undefined = $state();
  getBlockNumber = async () => {
    const blockNumber = Number(await getBlockNumberWagmi(wagmiConfig));

    if (this.blockNumber !== blockNumber) this.blockNumber = blockNumber;

    return blockNumber;
  };

  watchingBlockNumber = $state(false);
  unwatchBlockNumber: WatchBlockNumberReturnType | undefined;
  watchBlockNumber = () => {
    if (this.watchingBlockNumber) return;

    this.watchingBlockNumber = true;
    const stop = watchBlockNumberWagmi(wagmiConfig, {
      emitOnBegin: false,
      onBlockNumber: (blockNumber) => (this.blockNumber = Number(blockNumber))
    });

    this.unwatchBlockNumber = () => {
      this.watchingBlockNumber = false;
      stop?.();
    };
  };

  #chainId: WagmiChainId;
  get chainId() {
    return this.#chainId;
  }
  set chainId(chainId: WagmiChainId) {
    if (this.#chainId !== chainId) {
      this.#chainId = chainId;
      this.getBlockNumber();
    }
  }

  switchChain = async (chainId: WagmiChainId) => {
    await switchChainWagmi(wagmiConfig, { chainId });
    this.chainId = chainId;
  };

  disconnect = async () => {
    await disconnectWagmi(wagmiConfig);
  };

  constructor(chainId: WagmiChainId) {
    this.#chainId = chainId;

    // $inspect("BLOCKCHAIN", this.chainId, this.blockNumber);
  }
}

export { Network };
