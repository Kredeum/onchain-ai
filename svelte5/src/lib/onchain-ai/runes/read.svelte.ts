import { createReadContract } from "$lib/wagmi/runes/";
import { createOnchainAI } from "$lib/onchain-ai/runes";

const createReadOnchainAI = ({
  functionName,
  args = []
}: {
  functionName: string;
  args?: string[];
}) => {
  const { address, abi } = $derived.by(createOnchainAI);

  return createReadContract({ address, abi, functionName, args });
};

export { createReadOnchainAI };
