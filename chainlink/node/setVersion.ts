import { ethers, type Wallet } from "ethers";
import { readAddresses, readConfig } from "../lib/readJson";
import { getWallet } from "./getWallet";

const setVersion = async (
  chainId: number,
  version: number,
  signer?: Wallet,
): Promise<number> => {
  signer ||= await getWallet(chainId);

  const OnChainAIAbi = ["function setDonHostedSecretsVersion(uint64) external"];
  const { explorer } = readConfig(chainId);
  const { OnChainAI: OnChainAIAddress } = readAddresses(chainId);

  const onChainAI = new ethers.Contract(OnChainAIAddress, OnChainAIAbi, signer);

  // update onchain `donHostedSecretsVersion`
  const tx = await onChainAI.setDonHostedSecretsVersion(version);
  console.log(`setDonHostedSecretsVersion ${explorer}/tx/${tx.hash}`);

  const res = await tx.wait();
  return res?.status || 0;
};

export { setVersion };
