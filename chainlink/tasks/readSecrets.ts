// Use env-enc from chainlink to encrypt secrets on hard disk
import { config as decodeConfig } from "@chainlink/env-enc";
decodeConfig();

import { ethers } from "ethers-v5";
import { types } from "hardhat/config";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { readConfig } from "../lib/utils";
import { onChainScope } from "./scope";
import { OnChainAI } from "../../typechain-types";
import AbiOnChainAI from "../abis/OnChainAI.json";

onChainScope
  .task("secret", "Read OnChainAI secrets to Chainlink")
  .addOptionalParam("expiration", "Expiration time in minutes of uploaded secrets ", 60, types.int)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const { rpc, router, donId } = readConfig(chainId);

    const gatewayUrls = [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ];

    const slotIdNumber = 0;
    const expiration = taskArgs.expiration;
    const secrets = { openaiKey: process.env.OPENAI_API_KEY || "" };

    const rpcUrl = `${rpc}/${process.env.ALCHEMY_API_KEY}`;
    if (!rpcUrl) throw new Error(`rpcUrl not provided  - check your environment variables`);

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) throw new Error("private key not provided - check your environment variables");

    // cannot use v6 hre.ethers.provider, because scaffold-eth-2 is in ethers v6,
    // incompatible with Chainlink that requires ethers v5
    // so recreate v5 provider with rpc url
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);

    // Encrypt secrets
    const secretsManager = new SecretsManager({
      signer: signer,
      functionsRouterAddress: router,
      donId: donId,
    });
    await secretsManager.initialize();
    const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

    console.log(
      `Read encrypted secret from gateways ${gatewayUrls}`,
    );

    const secretsEntriesForGateway = await secretsManager.listDONHostedEncryptedSecrets(gatewayUrls);
    console.log(".setAction ~ secretsEntriesForGateway2:", secretsEntriesForGateway);
    console.log(".setAction ~ secretsEntriesForGateway.result.nodeResponses:", JSON.stringify(secretsEntriesForGateway.result.nodeResponses, null, 2));


  });
