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

type DeploymentType = { address: Address; abi: Abi; name?: string };

const readDeploymentByAddress = (
  chainId: string | number,
  address: string
): DeploymentType | undefined => {
  const deployments: DeploymentsChain = readDeploymentsChain(chainId);
  const deploymentsContractName = Object.keys(deployments) as DeploymentContractKey[];
  const contractName = deploymentsContractName.find(
    (contractName) => deployments[contractName].address === address
  );
  if (!contractName) return;

  const deployment = deployments[contractName] as DeploymentType;
  deployment.name = contractName;
  return deployment;
};

const readDeploymentByName = (
  chainId: string | number,
  contractName: DeploymentContractName
): DeploymentType | undefined => {
  const chainDeployment = readDeploymentsChain(chainId);

  if (!(contractName in chainDeployment)) return;

  const deployment = chainDeployment[contractName as DeploymentContractKey] as DeploymentType;
  deployment.name = contractName;
  return deployment;
};

const readDeployment = (
  chainId: string | number,
  param: DeploymentContractName | Address
): DeploymentType | undefined => {
  const paramIsAddress = param.slice(0, 2) === "0x";

  return paramIsAddress
    ? readDeploymentByAddress(chainId, param as Address)
    : readDeploymentByName(chainId, param as DeploymentContractName);
};

export {
  readChainLinkConfig,
  readAddresses,
  readDeploymentsChain,
  readDeploymentByAddress,
  readDeploymentByName,
  readDeployment
};
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
  DeploymentType,
  DeploymentContractName,
  DeploymentContractKey
};
