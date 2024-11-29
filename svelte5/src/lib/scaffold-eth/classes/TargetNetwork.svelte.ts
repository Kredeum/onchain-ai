import scaffoldConfig from "$lib/scaffold.config";
import { NETWORKS_EXTRA_DATA, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
import { Account } from "$lib/wagmi/classes";
import { createNativeCurrencyPrice } from "../runes";

type TargetNetworkChain = (typeof scaffoldConfig.targetNetworks)[number];
type TargetNetworkId = TargetNetworkChain["id"];
type TargetNetworkName = TargetNetworkChain["name"];
type TargetNetworkNativeCurrency = TargetNetworkChain["nativeCurrency"];

class TargetNetwork {
  chain: ChainWithAttributes = $state(scaffoldConfig.targetNetworks[0]);

  id: TargetNetworkId = $derived(this.chain.id as TargetNetworkId);
  idLocal: TargetNetworkId = 31337;
  idDefault: TargetNetworkId = scaffoldConfig.targetNetworks[0].id;

  explorer: string = $derived(this.chain.blockExplorers?.default.url || "");

  name: TargetNetworkName = $derived(this.chain.name as TargetNetworkName);
  nativeCurrency: TargetNetworkNativeCurrency = $derived(this.chain.nativeCurrency as TargetNetworkNativeCurrency);

  nativeCurrencyPrice: number = $state(0);

  constructor() {
    const account = new Account();
    const price = createNativeCurrencyPrice();

    $effect(() => {
      const newNetwork = scaffoldConfig.targetNetworks.find((nw) => nw.id === account.chainId && nw.id !== this.id);

      if (newNetwork && account.chainId) this.chain = { ...newNetwork, ...NETWORKS_EXTRA_DATA[account.chainId] };
    });

    $effect(() => {
      this.nativeCurrencyPrice = price.nativeCurrencyPrice;
    });

    $inspect("TargetNetwork", this.id, this.name);
  }
}

let targetNetwork: TargetNetwork;
// Should only be instantiate once, by main app `ScaffoldEthApp.svelte`
const newTargetNetwork = () => (targetNetwork ||= new TargetNetwork());

export type { TargetNetworkChain, TargetNetworkId, TargetNetworkName, TargetNetworkNativeCurrency };
export { targetNetwork, newTargetNetwork };
