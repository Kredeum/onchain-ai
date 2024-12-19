import scaffoldConfig from "$lib/scaffold.config";
import { fetchPriceFromUniswap, NETWORKS_EXTRA_DATA, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
import { Account, Network } from "$lib/wagmi/classes";
import type { Chain } from "viem/chains";

type TargetNetworkChain = (typeof scaffoldConfig.targetNetworks)[number];
type TargetNetworkId = TargetNetworkChain["id"];
type TargetNetworkName = TargetNetworkChain["name"];
type TargetNetworkNativeCurrency = TargetNetworkChain["nativeCurrency"];

class TargetNetwork extends Network {
  get id() {
    return this.chainId;
  }

  nativeCurrencyPrice: number = $state(0);
  getNativeCurrencyPrice = async () => {
    this.nativeCurrencyPrice = await fetchPriceFromUniswap(this.chainExtra);
  };

  get chainExtra() {
    const network = this.findNetwork(this.chainId);
    return { ...network, ...NETWORKS_EXTRA_DATA[this.chainId] } as ChainWithAttributes;
  }

  findNetwork = (chainId: number | undefined): ChainWithAttributes | undefined =>
    chainId ? scaffoldConfig.targetNetworks.find((nw) => nw.id == chainId) : undefined;

  constructor(chainId?: TargetNetworkId) {
    chainId ||= scaffoldConfig.targetNetworks[0].id;
    super(chainId);
    this.chainIdDefault = chainId;

    $effect(() => {
      this.chainId;
      this.getNativeCurrencyPrice();
    });

    // $inspect("TargetNetwork", this.id, this.name);
  }
}

let targetNetwork: TargetNetwork;
// Should only be instantiate once, by main app `ScaffoldEthApp.svelte`
const newTargetNetwork = () => (targetNetwork ||= new TargetNetwork());

export type { TargetNetworkChain, TargetNetworkId, TargetNetworkName, TargetNetworkNativeCurrency };
export { targetNetwork, newTargetNetwork };
