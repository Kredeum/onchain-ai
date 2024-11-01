import { createWriteContract } from "$lib/wagmi/runes";
import { createOnchainAI } from "./contract.svelte";
import { createTransactor, type TransactionFunc } from "$lib/runes/transactor.svelte";

const createWriteOnchainAI = ({
  functionName,
  args = [],
  value = 0n
}: {
  functionName: string;
  args?: string[];
  value?: bigint;
}) => {
  const { address, abi } = $derived.by(createOnchainAI);

  return createWriteContract({ address, abi, functionName, args, value });
};

export { createWriteOnchainAI };
