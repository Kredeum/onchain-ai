import { SecretsManager } from "@chainlink/functions-toolkit";
import { readConfig } from "./readJson";
import { getWallet } from "./getWallet";

const uploadSecrets = async (chainId: number, expiration: number) => {
  const { router, donId, gatewayUrls } = readConfig(chainId);

  const slotIdNumber = 0;
  const secrets = { openaiApiKey: process.env.OPENAI_API_KEY || "" };

  const signer = await getWallet(chainId);

  // Encrypt secrets
  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: router,
    donId: donId,
  });
  await secretsManager.initialize();
  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

  console.log(
    `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}`,
  );
  console.log(`Expiration in minutes: ${expiration}`);

  // Upload secrets to the DON
  const result = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: slotIdNumber,
    minutesUntilExpiration: expiration,
  });
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log(`✅ Secrets uploaded properly to gateways !`);
  } else {
    throw new Error(`❌ Encrypted secrets not uploaded to gateways`);
  }

  return result;
};

export { uploadSecrets };
