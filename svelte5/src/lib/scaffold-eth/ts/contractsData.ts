import scaffoldConfig from "$lib/scaffold.config";
import { contracts } from "$lib/scaffold-eth/ts";

export function getAllContracts() {
  const chainId = scaffoldConfig.targetNetworks[0].id;
  const contractsData = contracts?.[chainId];

  return contractsData ? contractsData : {};
}
