import jsonConfig from "../../chainlink/config.json";
import jsonAddresses from "../../foundry/addresses.json";
import jsonDeployments from "../../svelte5/src/lib/deployments.json";

type ConfigChains = typeof jsonConfig;
type ConfigChainKey = keyof ConfigChains;
type ConfigChain = ConfigChains[ConfigChainKey];

const readConfig = (chainId: number | string): ConfigChain => {
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as ConfigChainKey;

  if (!chainIds.includes(chainKey)) throw new Error(`No config for chainId ${chainId}!`);

  return jsonConfig[chainKey];
};

type AddressesChains = typeof jsonAddresses;
type AddressesChainKey = keyof AddressesChains;
type AddressesChain = AddressesChains[AddressesChainKey];

const readAddresses = (chainId: number | string): AddressesChain => {
  const chainIds = Object.keys(jsonAddresses);
  const chainKey = String(chainId) as AddressesChainKey;

  if (!chainIds.includes(chainKey)) throw new Error(`No config for chainId ${chainId}!`);

  return jsonAddresses[chainKey];
};

type DeploymentsChains = typeof jsonDeployments;
type DeploymentsChainKey = keyof DeploymentsChains;
type DeploymentsChain = DeploymentsChains[DeploymentsChainKey];

const readDeploymentsChain = (chainId: number | string): DeploymentsChain => {
  const chainIds = Object.keys(jsonDeployments);
  const chainKey = String(chainId) as DeploymentsChainKey;

  if (!chainIds.includes(chainKey)) throw new Error(`No config for chainId ${chainId}!`);

  return jsonDeployments[chainKey];
};

type DeploymentContractName = keyof DeploymentsChain;
type DeploymentContract = DeploymentsChain[DeploymentContractName];

const readDeploymentContract = (
  chainId: number | string,
  contractName: DeploymentContractName
): DeploymentContract => {
  const chainDeployments = readDeploymentsChain(chainId);

  if (!chainDeployments[contractName])
    throw new Error(`No deployment found for ${contractName} for chainId ${chainId}!`);

  return chainDeployments[contractName];
};

export { readConfig, readAddresses, readDeploymentsChain, readDeploymentContract };
export type {
  ConfigChains,
  ConfigChain,
  ConfigChainKey,
  AddressesChains,
  AddressesChain,
  AddressesChainKey,
  DeploymentsChains,
  DeploymentsChain,
  DeploymentsChainKey,
  DeploymentContract,
  DeploymentContractName
};
