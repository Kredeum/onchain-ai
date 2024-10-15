import { type Wallet, ethers } from "ethers";
import { readConfig } from "../../common/lib/readJson";
import promptSync from "prompt-sync";
import fs from "fs";

const prompt = promptSync({ sigint: true });

const getWallet = async (chainId: number): Promise<Wallet> => {
  let wallet: Wallet;
  const rpcApiKey = process.env.ALCHEMY_API_KEY;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const keystoreDir = process.env.KEYSTORE_DIR;

  const { rpc } = readConfig(chainId);
  if (!rpc)
    throw new Error(
      `❌ rpc not provided for chainId: ${chainId} - check your config`,
    );

  if (!rpcApiKey)
    throw new Error("❌ rpcApiKey not provided - check your ENV variables");

  if (!(privateKey || keystoreDir))
    throw Error(
      "❌ No DEPLOYER_PRIVATE_KEY nor KEYSTORE_DIR found in your ENV variables",
    );

  const rpcUrl = `${rpc}/${process.env.ALCHEMY_API_KEY}`;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  if (privateKey) wallet = new ethers.Wallet(privateKey);
  else {
    console.log("Enter your Keystore account and password");
    const account = prompt("Account: ");
    const jsonAccount = `${keystoreDir}/${account}`;
    if (!fs.existsSync(jsonAccount))
      throw new Error(`❌ Keystore file not found for account: ${account}`);

    const password = prompt("Password: ", { echo: "*" });
    const json = fs.readFileSync(jsonAccount, "utf8");
    wallet = await ethers.Wallet.fromEncryptedJson(json, password);
  }
  console.log("Account address:", wallet.address);

  const signer = wallet.connect(provider);
  return signer;
};

export { getWallet };
