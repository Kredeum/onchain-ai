import { createWriteContract } from "$lib/wagmi/runes";
import { createContract } from "$lib/wagmi/runes";

const createWriteOnchainAI = ({
  functionName,
  args = [],
  value = 0n
}: {
  functionName: string;
  args?: string[];
  value?: bigint;
}) => {
  const { chainId, address, abi } = $derived.by(() => createContract("OnChainAIv1"));

  return createWriteContract({ chainId, address, abi, functionName, args, value });
};

export { createWriteOnchainAI };
