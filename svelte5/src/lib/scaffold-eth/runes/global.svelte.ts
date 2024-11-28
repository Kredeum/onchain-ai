import type { ChainWithAttributes } from "$lib/scaffold-eth/ts";
import scaffoldConfig from "$lib/scaffold.config";

type TargetNetworkId = (typeof scaffoldConfig.targetNetworks)[number]["id"];
type TargetNetworkName = (typeof scaffoldConfig.targetNetworks)[number]["name"];
type TargetNetworkNativeCurrency = (typeof scaffoldConfig.targetNetworks)[number]["nativeCurrency"];

class TargetNetwork {
  chain: ChainWithAttributes = $state(scaffoldConfig.targetNetworks[0]);

  id: TargetNetworkId = $derived(this.chain.id as TargetNetworkId);
  idLocal: TargetNetworkId = 31337;
  idDefault: TargetNetworkId = scaffoldConfig.targetNetworks[0].id;

  name: TargetNetworkName = $derived(this.chain.name as TargetNetworkName);
  nativeCurrency: TargetNetworkNativeCurrency = $derived(this.chain.nativeCurrency as TargetNetworkNativeCurrency);

  nativeCurrencyPrice: number = $state(0);
}

const targetNetwork = new TargetNetwork();

export { targetNetwork };
