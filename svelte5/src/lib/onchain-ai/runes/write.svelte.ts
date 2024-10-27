import { createWriteContract } from "wagmi-svelte";
import { createOnchainAI } from "./contract.svelte";
import { createTransactor, type TransactionFunc } from "$lib/runes/transactor.svelte";

const createOnchainAIWrite = ({
  functionName,
  args = [],
  value = 0n
}: {
  functionName: string;
  args?: string[];
  value?: bigint;
}) => {
  const lastResponse: string | undefined = $state();

  let lastTxHash: string | undefined = $state();

  const { chainId, address, abi } = $derived.by(createOnchainAI);

  let contractWrite = $derived.by(createWriteContract());
  let writeTx: TransactionFunc = $derived.by(createTransactor());

  const send = async () => {
    try {
      const makeWriteWithParams = () =>
        contractWrite.writeContractAsync({
          chainId,
          address,
          abi,
          functionName,
          args,
          value
        });
      lastTxHash = await writeTx?.(makeWriteWithParams);
    } catch (e: unknown) {
      console.error("⚡️ send ~ error", e);
    }

    return lastTxHash;
  };

  return {
    get lastTxHash() {
      return lastTxHash;
    },
    send
  };
};

export { createOnchainAIWrite };
