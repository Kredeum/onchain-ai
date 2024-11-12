import { createContract, createReadContract } from "$lib/wagmi/runes/";

const createReadOnchainAI = ({ functionName, args = [] }: { functionName: string; args?: string[] }) => {
  const { chainId, address, abi } = $derived.by(() => createContract("OnChainAIv1"));

  return createReadContract({ chainId, address, abi, functionName, args });
};

export { createReadOnchainAI };
