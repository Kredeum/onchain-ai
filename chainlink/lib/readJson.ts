import jsonConfig from "../config.json";
import jsonAddresses from "../../foundry/addresses.json";

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
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as AddressesChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonAddresses[chainKey];
};

export { readConfig, readAddresses };
