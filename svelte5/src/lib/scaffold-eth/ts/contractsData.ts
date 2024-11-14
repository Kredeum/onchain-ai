import { contracts } from "$lib/scaffold-eth/ts";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes";

const getAllContracts = () => {
  const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
  const contractsData = contracts?.[chainId];

  return contractsData ? contractsData : {};
}

export { getAllContracts }