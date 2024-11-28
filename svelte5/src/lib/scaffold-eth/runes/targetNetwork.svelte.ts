import scaffoldConfig from "$lib/scaffold.config";
import { NETWORKS_EXTRA_DATA, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
import { targetNetwork } from "$lib/scaffold-eth/runes";
import { createAccount } from "$lib/wagmi/runes";

export const createTargetNetwork = (): (() => ChainWithAttributes) => {
  const { account } = $derived(createAccount());
  const { chain } = $derived(account);

  $effect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find((targetNetwork) => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      targetNetwork.chain = newSelectedNetwork;
    }
  });

  // $inspect("createTargetNetwork", account);

  return () => ({
    ...targetNetwork.chain,
    ...NETWORKS_EXTRA_DATA[targetNetwork.id]
  });
};
