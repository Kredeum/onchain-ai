import { createReadContract } from "$lib/wagmi/runes/";
import { createOnchainAI } from "$lib/onchain-ai/runes";

const createReadOnchainAI = ({ functionName, args = [] }: { functionName: string; args?: string[] }) => {
  const { chainId, address, abi } = $derived.by(createOnchainAI);

  return createReadContract({ chainId, address, abi, functionName, args });
};

export { createReadOnchainAI };
