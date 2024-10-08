import configJson from "../config.json";
import fs from "fs-extra";

type ConfigChain = typeof configJson;
type ChainKey = keyof ConfigChain;
type ChainValue = ConfigChain[ChainKey];
type ChainValueKey = keyof ChainValue;

const writeConfig = (
  chainId: number | string,
  key: ChainValueKey,
  value: string | number,
) => {
  const chainIds = Object.keys(configJson);
  const chainKey = String(chainId) as ChainKey;

  if (!chainIds.includes(chainKey)) throw Error("No config for this network!");

  const config = configJson;
  config[chainKey][key] = value as never;
  fs.writeJsonSync(`${__dirname}/../config.json`, config, { spaces: 2 });
};

export { writeConfig };
