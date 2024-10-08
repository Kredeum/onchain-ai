import jsonConfig from "../config.json";
// @ts-expect-error - This is a JS file read as string
import jsOnChainAI from "../openai/OnChainAI.js";

type ConfigChain = typeof jsonConfig;
type ChainKey = keyof ConfigChain;
type ChainValue = ConfigChain[ChainKey];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const readJavascript = (name?: string): string => jsOnChainAI;

const readConfig = (chainId: number | string): ChainValue => {
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as ChainKey;

  if (!chainIds.includes(chainKey))
    throw Error(`No config for chainId ${chainId}!`);

  return jsonConfig[chainKey];
};

export { readJavascript, readConfig };
