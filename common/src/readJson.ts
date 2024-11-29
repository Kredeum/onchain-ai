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
  contractName: string
): DeploymentContract => {
  const chainDeployment = readDeploymentsChain(chainId);

  if (!(contractName in chainDeployment)) {
    console.log("ERROR readDeploymentContract |", contractName, "|", chainDeployment);
    throw new Error(`No deployment found for ${contractName} for chainId ${chainId}!`);
  }

  return chainDeployment[contractName as DeploymentContractKey] as DeploymentContract;
};

// search contract name when contract is referenced by its address
const findDeploymentContractName = (chainId: number, address: Address) => {
  const deployments: DeploymentsChain = readDeploymentsChain(chainId);
  const deploymentsContractName = Object.keys(deployments) as DeploymentContractKey[];
  const name = deploymentsContractName.find(
    (contractName) => deployments[contractName].address === address
  );

  if (!name) throw new Error("No contract found, address mismatch");

  return name;
};

export {
  readChainLinkConfig,
  readAddresses,
  readDeploymentsChain,
  readDeploymentContract,
  findDeploymentContractName
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
  DeploymentContract,
  DeploymentContractName,
  DeploymentContractKey
};
