import scaffoldConfig from "$lib/scaffold.config";
import { contracts } from "$lib/utils/scaffold-eth/contract";

export function getAllContracts() {
  const chainId = scaffoldConfig.targetNetworks[0].id;
  const contractsData = contracts?.[chainId];

  return contractsData ? contractsData : {};
}
