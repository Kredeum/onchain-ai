import jsonChainLinkConfig from "../../chainlink/config.json";
import jsonAddresses from "../../foundry/addresses.json";
import jsonDeployments from "../../svelte5/src/lib/deployments.json";
import type { Abi, Address } from "viem";

type KeysOfUnion<ObjectType> = ObjectType extends unknown ? keyof ObjectType : never;

type ChainLinkConfigChains = typeof jsonChainLinkConfig;
type ChainLinkConfigChainId = keyof ChainLinkConfigChains;
type ChainLinkConfigChain = ChainLinkConfigChains[ChainLinkConfigChainId];
type ChainLinkConfigChainKey = KeysOfUnion<ChainLinkConfigChain>;

const readChainLinkConfig = (chainId: number | string): ChainLinkConfigChain => {
  const chainIds = Object.keys(jsonChainLinkConfig);
  const chainIdString = String(chainId) as ChainLinkConfigChainId;

  if (!chainIds.includes(chainIdString)) throw new Error(`No Config for chainId ${chainId}!`);

  return jsonChainLinkConfig[chainIdString];
};

type AddressesChains = typeof jsonAddresses;
type AddressesChainId = keyof AddressesChains;
type AddressesChain = AddressesChains[AddressesChainId];
type AddressesChainKey = KeysOfUnion<AddressesChain>;

const readAddresses = (chainId: number | string): AddressesChain => {
  const chainIds = Object.keys(jsonAddresses);
  const chainIdString = String(chainId) as AddressesChainId;

  if (!chainIds.includes(chainIdString)) throw new Error(`No Addresses for chainId ${chainId}!`);

  return jsonAddresses[chainIdString];
};

type DeploymentsChains = typeof jsonDeployments;
type DeploymentsChainId = keyof DeploymentsChains;
type DeploymentsChain = DeploymentsChains[DeploymentsChainId];
type DeploymentContractName = KeysOfUnion<DeploymentsChain>;
type DeploymentContractKey = keyof DeploymentsChain;

const readDeploymentsChain = (chainId: number | string): DeploymentsChain => {
  const chainIds = Object.keys(jsonDeployments);
  const chainIdString = String(chainId) as DeploymentsChainId;

  if (!chainIds.includes(chainIdString)) throw new Error(`No Deployments for chainId ${chainId}!`);

  return jsonDeployments[chainIdString];
};

type DeploymentContract = { address: Address; abi: Abi };

const readDeploymentContract = (
  chainId: number | string,
  name: DeploymentContractName
): DeploymentContract => {
  const chainDeployment = readDeploymentsChain(chainId);

  if (!(name in chainDeployment))
    throw new Error(`No deployment found for ${name} for chainId ${chainId}!`);

  return chainDeployment[name as DeploymentContractKey] as DeploymentContract;
};

export { readChainLinkConfig, readAddresses, readDeploymentsChain, readDeploymentContract };
export type {
  ChainLinkConfigChains,
  ChainLinkConfigChainId,
  ChainLinkConfigChain,
  ChainLinkConfigChainKey,
  AddressesChains,
  AddressesChainId,
  AddressesChain,
  AddressesChainKey,
  DeploymentsChains,
  DeploymentsChainId,
  DeploymentsChain,
  DeploymentContract,
  DeploymentContractName,
  DeploymentContractKey
};
