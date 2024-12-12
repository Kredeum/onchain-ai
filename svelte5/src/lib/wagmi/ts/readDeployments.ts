import jsonDeployments from "$lib/deployments.json";
import { type Abi, type Address } from "viem";
import { isAddress } from "$lib/wagmi/ts";

type KeysOfUnion<ObjectType> = ObjectType extends unknown ? keyof ObjectType : never;

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

const readDeploymentContractsName = (chainId: string | number): DeploymentContractName[] => {
  const chainDeployment = readDeploymentsChain(chainId);

  return Object.keys(chainDeployment) as DeploymentContractName[];
};

const readDeploymentByAddress = (chainId: string | number, address: string): DeploymentType | undefined => {
  const deployments: DeploymentsChain = readDeploymentsChain(chainId);
  const deploymentsContractName = Object.keys(deployments) as DeploymentContractKey[];
  const contractName = deploymentsContractName.find((contractName) => deployments[contractName].address === address);
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
  if (!(chainId && param)) return;

  return isAddress(param)
    ? readDeploymentByAddress(chainId, param as Address)
    : readDeploymentByName(chainId, param as DeploymentContractName);
};

export {
  readDeploymentContractsName,
  readDeploymentsChain,
  readDeploymentByAddress,
  readDeploymentByName,
  readDeployment
};
export type {
  DeploymentsChains,
  DeploymentsChainId,
  DeploymentsChain,
  DeploymentType,
  DeploymentContractName,
  DeploymentContractKey
};
