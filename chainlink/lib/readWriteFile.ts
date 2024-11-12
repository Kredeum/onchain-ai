import fs from "fs";
import jsonConfig from "../config.json";
import { readConfig } from "@onchain-ai/common";

type ConfigChains = typeof jsonConfig;
type ChainKey = keyof ConfigChains;
type ChainValue = ConfigChains[ChainKey];
type ChainValueKey = keyof ChainValue;

const readJavascript = (name = "OnChainAI.js"): string => {
  return fs.readFileSync(`${__dirname}/../source/${name}`, "utf-8");
};

const writeConfig = (chainId: number | string, key: ChainValueKey, value: string | number) => {
  const chainIds = Object.keys(jsonConfig);
  const chainKey = String(chainId) as ChainKey;

  if (!chainIds.includes(chainKey)) throw new Error("No config for this network!");

  jsonConfig[chainKey][key] = value as never;
  fs.writeFileSync(`${__dirname}/../config.json`, JSON.stringify(jsonConfig, null, 2));
};

export { readJavascript, readConfig, writeConfig };
