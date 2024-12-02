import {
  type WatchBlockNumberReturnType,
  getBlockNumber as getBlockNumberWagmi,
  switchChain as switchChainWagmi,
  watchBlockNumber as watchBlockNumberWagmi,
  disconnect as disconnectWagmi
} from "@wagmi/core";
import { Watcher, wagmiConfig } from "$lib/wagmi/classes";
import { targetNetwork, type TargetNetworkId } from "$lib/scaffold-eth/classes";

// BlockChain Singleton Class, reactive on chainId
class BlockChain {
  static instance: BlockChain;

  blockNumber: number | undefined = $state();
  getBlockNumber = async () => {
    console.log("BLOCKCHAIN getBlockNumber", targetNetwork.id);
    const blockNumber = Number(await getBlockNumberWagmi(wagmiConfig));
    console.log("BLOCKCHAIN getBlockNumber", blockNumber);

    if (this.blockNumber !== blockNumber) this.blockNumber = blockNumber;

    return blockNumber;
  };

  watchingBlockNumber = $state(false);
  unwatchBlockNumber: WatchBlockNumberReturnType | undefined;
  watchBlockNumber = () => {
    if (this.watchingBlockNumber) return;
    console.log("BLOCKCHAIN watchBlockNumber", targetNetwork.id);

    this.watchingBlockNumber = true;
    const unwatch = watchBlockNumberWagmi(wagmiConfig, {
      emitOnBegin: false,
      onBlockNumber: (blockNumber) => (this.blockNumber = Number(blockNumber))
    });

    this.unwatchBlockNumber = () => {
      this.watchingBlockNumber = false;
      unwatch?.();
    };
  };

  #chainId: number = 0;
  get chainId() {
    return this.#chainId;
  }
  set chainId(chainId: number) {
    if (this.#chainId !== chainId) {
      this.#chainId = chainId;
      this.getBlockNumber();
    }
  }

  switchChain = async (chainId: TargetNetworkId) => {
    await switchChainWagmi(wagmiConfig, { chainId });
    this.chainId = chainId;
  };

  disconnect = async () => {
    await disconnectWagmi(wagmiConfig);
  };

  constructor({ watch = true }: { watch?: boolean } = {}) {
    if (BlockChain.instance) return BlockChain.instance;
    BlockChain.instance = this;

    this.chainId = targetNetwork.id;

    if (watch) this.watchBlockNumber();

    $inspect("BLOCKCHAIN", targetNetwork.id, this.chainId, this.blockNumber);
  }
}

export { BlockChain };
