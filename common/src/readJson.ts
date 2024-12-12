import jsonChainLinkConfig from "../../chainlink/config.json";
import jsonAddresses from "../../foundry/addresses.json";

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

export { readChainLinkConfig, readAddresses };
export type {
  ChainLinkConfigChains,
  ChainLinkConfigChainId,
  ChainLinkConfigChain,
  ChainLinkConfigChainKey,
  AddressesChains,
  AddressesChainId,
  AddressesChain,
  AddressesChainKey
};
