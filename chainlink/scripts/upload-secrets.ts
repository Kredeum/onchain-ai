import { setVersion, uploadSecrets } from "../lib";

const main = async (chainId = 84532, expiration = 60) => {
  const result = await uploadSecrets(chainId, expiration);
  await setVersion(chainId, result.version);
};

main().catch(console.error);
