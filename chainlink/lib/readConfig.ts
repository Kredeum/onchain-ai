import jsonConfig from "../config.json";

type ConfigChain = typeof jsonConfig;
type ChainKey = keyof ConfigChain;
type ChainValue = ConfigChain[ChainKey];

const readConfig = (chainId: number | string): ChainValue => {
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as ChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonConfig[chainKey];
};

export { readConfig };
