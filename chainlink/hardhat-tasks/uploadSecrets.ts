// Use env-enc from chainlink to encrypt secrets on hard disk
// import { config as decodeConfig } from "@chainlink/env-enc";
// decodeConfig();

import { types } from "hardhat/config";
import { onChainScope } from "./scope";
import { setVersion, uploadSecrets } from "../lib";

onChainScope
  .task("secrets", "Upload OnChainAI secrets to Chainlink")
  .addOptionalParam(
    "expiration",
    "Expiration time in minutes of uploaded secrets ",
    60,
    types.int,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .setAction(async (taskArgs: any, hre: any) => {
    const chainId = await hre.getChainId();

    const result = await uploadSecrets(chainId, taskArgs.expiration);

    await setVersion(chainId, result.version);
  });
