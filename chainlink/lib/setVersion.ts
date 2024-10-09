import { ethers } from "ethers";
import { readConfig } from "./readConfig";
import { getWallet } from "./getWallet";

const setVersion = async (chainId: number, version: number) => {
  const OnChainAIAbi = ["function setDonHostedSecretsVersion(uint64) external"];
  const { OnChainAI: OnChainAIAddress, explorer } = readConfig(chainId);
  const signer = await getWallet(chainId);

  const onChainAI = new ethers.Contract(OnChainAIAddress, OnChainAIAbi, signer);

  // update onchain `donHostedSecretsVersion`
  const tx = await onChainAI.setDonHostedSecretsVersion(version);
  console.log(
    "setDonHostedSecretsVersion Request",
    version,
    `${explorer}/tx/${tx.hash}`,
  );
  const res = await tx.wait();
  console.log("setDonHostedSecretsVersion Result ", res?.status || "no status");
};

export { setVersion };
