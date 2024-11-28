import fs from "fs";
import type { ChainLinkConfigChainId, ChainLinkConfigChainKey } from "@onchain-ai/common";
import jsonConfig from "../config.json";
import { readChainLinkConfig } from "@onchain-ai/common";

const readJavascript = (name = "OnChainAI.js"): string => {
  return fs.readFileSync(`${__dirname}/../source/${name}`, "utf-8");
};

const writeConfig = (
  chainId: number | string,
  key: ChainLinkConfigChainKey,
  value: string | number
) => {
  const chainIds = Object.keys(jsonConfig);
  const chainIdString = String(chainId) as ChainLinkConfigChainId;

  if (!chainIds.includes(chainIdString)) throw new Error("No config for this network!");

  jsonConfig[chainIdString][key] = value as never;
  fs.writeFileSync(`${__dirname}/../config.json`, JSON.stringify(jsonConfig, null, 2));
};

export { readJavascript, readChainLinkConfig, writeConfig };
