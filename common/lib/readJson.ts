import jsonConfig from "../../chainlink/config.json";
import jsonAddresses from "../../foundry/addresses.json";
import jsonDeployments from "../../foundry/deployments.json";

type ConfigChain = typeof jsonConfig;
type ConfigChainKey = keyof ConfigChain;
type ConfigChainValue = ConfigChain[ConfigChainKey];

const readConfig = (chainId: number | string): ConfigChainValue => {
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as ConfigChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonConfig[chainKey];
};

type AddressesChain = typeof jsonAddresses;
type AddressesChainKey = keyof AddressesChain;
type AddressesChainValue = AddressesChain[AddressesChainKey];

const readAddresses = (chainId: number | string): AddressesChainValue => {
  const chainIds = Object.keys(jsonAddresses);
  const chainKey = String(chainId) as AddressesChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonAddresses[chainKey];
};

type DeploymentsChain = typeof jsonDeployments;
type DeploymentsChainKey = keyof DeploymentsChain;
type DeploymentsChainValue = DeploymentsChain[DeploymentsChainKey];

const readDeployments = (chainId: number | string): DeploymentsChainValue => {
  const chainIds = Object.keys(jsonDeployments);
  const chainKey = String(chainId) as DeploymentsChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonDeployments[chainKey];
};

export { readConfig, readAddresses, readDeployments };
