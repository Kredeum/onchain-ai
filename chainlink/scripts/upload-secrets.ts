import { ethers } from "ethers";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { readConfig } from "../lib/utils";

const main = async (chainId = 84532, expiration = 60) => {
  const { rpc, router, donId, OnChainAI, explorer } = readConfig(chainId);

  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const slotIdNumber = 0;
  const secrets = { openaiKey: process.env.OPENAI_API_KEY || "" };

  const rpcUrl = `${rpc}/${process.env.ALCHEMY_API_KEY}`;
  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables",
    );

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
    `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}. Expiration in minutes: ${expiration}`,
  );

  // Upload secrets to the DON
  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: slotIdNumber,
    minutesUntilExpiration: expiration,
  });
  if (!uploadResult.success)
    throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

  console.log(
    `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
    uploadResult,
  );

  if (uploadResult.success) {

    const onChainAI = new ethers.Contract(OnChainAI, [
      "function setDonHostedSecretsVersion(uint64) external",
    ], signer);

    // update onchain `donHostedSecretsVersion`
    const tx = await onChainAI.setDonHostedSecretsVersion(uploadResult.version);
    console.log("setDonHostedSecretsVersion Request", uploadResult.version, `${explorer}/tx/${tx.hash}`);
    const res = await tx.wait();
    console.log("setDonHostedSecretsVersion Result", res?.status || "no status");
  }
};

main().catch(console.error);
