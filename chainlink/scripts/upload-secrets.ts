import { getWallet, setVersion, uploadSecrets } from "../lib";
import { readAddresses } from "../../common/lib/readJson";

const uploadSecretsAndSetVersion = async (chainId: number, expiration: number) => {
  console.log("uploadSecretsAndSetVersion chainId:", chainId, "expiration:", expiration);

  const signer = await getWallet(chainId);

  const version = await uploadSecrets(chainId, expiration, signer);

  if (!version) throw new Error(`❌ Secrets not uploaded to Chainlink gateways`);
  console.log("✅ Secrets uploaded to Chainlink gateways, version:", version);

  const { OnChainAIv1: address } = readAddresses(chainId);

  const status = await setVersion(chainId, address, version, signer);

  if (!status) throw new Error(`❌ Version secrets not set on smartcontract`);
  console.log(`✅ Version secrets set on ${address}, status:`, status);
};

const expirationMaxMainnet = 129600; // Mainnet: 3 months (2160 hours)
const expirationMaxTestnet = 4320; // Testnets: 3 days (72 hours)
const isMainnet = (chainId: number) => chainId === 10 || chainId === 8453; // Base or Optimism

const chainId = Number(process.argv[2]) || 84532;
const expiration =
  Number(process.argv[3]) || (isMainnet(chainId) ? expirationMaxMainnet : expirationMaxTestnet);

uploadSecretsAndSetVersion(chainId, expiration).catch(console.error);
