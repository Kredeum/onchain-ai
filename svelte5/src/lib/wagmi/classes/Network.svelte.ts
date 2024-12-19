import {
  type WatchBlockNumberReturnType,
  getBlockNumber as getBlockNumberWagmi,
  switchChain,
  watchBlockNumber as watchBlockNumberWagmi,
  disconnect as disconnectWagmi,
  getChainId
} from "@wagmi/core";
import { Account, wagmiConfig } from "$lib/wagmi/classes";
import * as chains from "viem/chains";
import type { Chain } from "viem/chains";

type ChainIdType = (typeof wagmiConfig)["chains"][number]["id"];

// Network Class, reactive on chainId
class Network {
  static findChain = (chainId: number | undefined): Chain | undefined =>
    chainId ? Object.values(chains).find((chain) => chain.id === chainId) : undefined;
  static getExplorer = (chainId: number) => Network.findChain(chainId)?.blockExplorers?.default.url || "";

  static chainIdLocal = 31337 as const;

  #chainId: ChainIdType = $state(31337);
  chainIdDefault: ChainIdType = Network.chainIdLocal;
  get chainId() {
    return this.#chainId;
  }
  get chain() {
    return Network.findChain(this.chainId) || Network.findChain(this.chainIdDefault) || chains.mainnet;
  }
  set chain(chain: Chain) {
    this.#chainId = chain.id as ChainIdType;
  }

  get explorer() {
    return Network.getExplorer(this.chainId);
  }
  get name() {
    return this.chain.name;
  }
  get nativeCurrency() {
    return this.chain.nativeCurrency;
  }

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

  switch = async (chainId: number | undefined) => {
    if (!chainId) return;

    this.#chainId = chainId as ChainIdType;

    if (chainId !== wagmiConfig.state.chainId) await switchChain(wagmiConfig, { chainId: chainId as ChainIdType });

    console.log("<Network switch", chainId, "=>", wagmiConfig.state.chainId);
    this.getBlockNumber();
  };

  disconnect = async () => {
    await disconnectWagmi(wagmiConfig);
  };

  constructor(chainId?: ChainIdType) {
    this.#chainId = chainId || this.chainIdDefault;

    const account = new Account();

    $effect(() => {
      console.log("Network $effect:", account.chainId, this.chainId);
      if (account.chainId == this.chainId) return;
      if (!Network.findChain(account.chainId)) return;

      this.switch(account.chainId);
    });

    // $inspect("BLOCKCHAIN", this.chainId, this.blockNumber);
  }
}

export { Network };
