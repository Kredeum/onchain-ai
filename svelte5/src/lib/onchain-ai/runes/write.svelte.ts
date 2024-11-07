import { createWriteContract } from "$lib/wagmi/runes";
import { createOnchainAI } from "./contract.svelte";
import { createTransactor, type TransactionFunc } from "$lib/scaffold-eth/runes/transactor.svelte";

const createWriteOnchainAI = ({
  functionName,
  args = [],
  value = 0n
}: {
  functionName: string;
  args?: string[];
  value?: bigint;
}) => {
  const { chainId, address, abi } = $derived.by(createOnchainAI);

  return createWriteContract({ chainId, address, abi, functionName, args, value });
};

export { createWriteOnchainAI };
