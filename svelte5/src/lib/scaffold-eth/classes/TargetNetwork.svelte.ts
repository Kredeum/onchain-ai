import scaffoldConfig from "$lib/scaffold.config";
import { fetchPriceFromUniswap, NETWORKS_EXTRA_DATA, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
import { Account, Network } from "$lib/wagmi/classes";

type TargetNetworkChain = (typeof scaffoldConfig.targetNetworks)[number];
type TargetNetworkId = TargetNetworkChain["id"];
type TargetNetworkName = TargetNetworkChain["name"];
type TargetNetworkNativeCurrency = TargetNetworkChain["nativeCurrency"];

class TargetNetwork extends Network {
  chain: ChainWithAttributes = $state(scaffoldConfig.targetNetworks[0]);

  get id() {
    return this.chainId;
  }

  idLocal: TargetNetworkId = 31337;
  idDefault: TargetNetworkId = scaffoldConfig.targetNetworks[0].id;

  explorer: string = $derived(this.chain.blockExplorers?.default.url || "");

  name: TargetNetworkName = $derived(this.chain.name as TargetNetworkName);
  nativeCurrency: TargetNetworkNativeCurrency = $derived(this.chain.nativeCurrency as TargetNetworkNativeCurrency);

  nativeCurrencyPrice: number = $state(0);
  getNativeCurrencyPrice = async () => {
    this.nativeCurrencyPrice = await fetchPriceFromUniswap(this.chain);
  };

  constructor(chainId?: TargetNetworkId) {
    chainId ||= scaffoldConfig.targetNetworks[0].id;
    super(chainId);

    const account = new Account();

    $effect(() => {
      if (!account.chainId) return;

      const newNetwork = scaffoldConfig.targetNetworks.find((nw) => nw.id === account.chainId && nw.id !== this.id);
      if (!newNetwork) return;

      this.chain = { ...newNetwork, ...NETWORKS_EXTRA_DATA[account.chainId] };

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
