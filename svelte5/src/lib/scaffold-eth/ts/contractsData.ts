import { contracts } from "$lib/scaffold-eth/ts";
import { createChainId } from "$lib/scaffold-eth/runes";

const getAllContracts = () => {
  const { chainIdCurrent } = $derived.by(createChainId);
  const contractsData = contracts?.[chainIdCurrent];

  return contractsData ? contractsData : {};
};

export { getAllContracts };
