import { SecretsManager } from "@chainlink/functions-toolkit";
import { readConfig } from "../../common/lib/readJson";
import { getWallet } from "./getWallet";
import { type Wallet } from "ethers";

const uploadSecrets = async (
  chainId: number,
  expiration: number,
  signer?: Wallet,
): Promise<number> => {
  signer ||= await getWallet(chainId);

  const { router, donId, gatewayUrls } = readConfig(chainId);

  const slotIdNumber = 0;
  const secrets = { openaiApiKey: process.env.OPENAI_API_KEY || "" };

  // Encrypt secrets
  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: router,
    donId: donId,
  });
  await secretsManager.initialize();
  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

  // console.log(`Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}`);

  // Upload secrets to the DON
  const result = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: slotIdNumber,
    minutesUntilExpiration: expiration,
  });
  // console.log(JSON.stringify(result, null, 2));

  return result.success ? result.version : 0;
};

export { uploadSecrets };
