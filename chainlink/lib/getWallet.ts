import { type Wallet, ethers } from "ethers";
import { readConfig } from "../lib/readFile";

const getWallet = async (chainId: number): Promise<Wallet> => {
  const { rpc } = readConfig(chainId);

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "❌ private key not provided - check your environment variables",
    );
  }

  const rpcUrl = `${rpc}/${process.env.ALCHEMY_API_KEY}`;
  if (!rpcUrl) {
    throw new Error(
      `❌ rpcUrl not provided  - check your environment variables`,
    );
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  return signer;
};

export { getWallet };
