import { type Abi } from "abitype";
import type { Address } from "viem";
import {
  type WriteContractReturnType,
  readContract,
  waitForTransactionReceipt,
  writeContract
} from "@wagmi/core";
import { createTransactor, type TransactionFunc } from "$lib/scaffold-eth/runes/transactor.svelte";
import { createConfig } from "$lib/wagmi/runes/config.svelte";

const createWriteContract = ({
  address,
  abi,
  functionName,
  args = [],
  value = 0n
}: {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: unknown[];
  value?: bigint;
}) => {
  let lastTxHash: `0x${string}` | undefined = $state();
  let waitingTxHash = $state(false);
  let waitingTxReceipt = $state(false);

  const config = $derived.by(createConfig());

  const send = async () => {
    waitingTxHash = true;

    let hash: `0x${string}` | undefined;

    try {
      hash = await writeContract(config, {
        abi,
        address,
        functionName,
        args,
        value
      });
      lastTxHash = hash;
    } catch (e: unknown) {
      console.error("⚡️ send ~ error", e);
    }
    waitingTxHash = false;

    if (!hash) {
      throw Error("writeContract error: no hash");
    }
    return hash;
  };
  const wait = async (hash: `0x${string}`) => {
    waitingTxReceipt = true;
    let receipt = await waitForTransactionReceipt(config, { hash });

    waitingTxReceipt = false;
    return receipt;
  };

  return {
    send,
    wait,
    get lastTxHash() {
      return lastTxHash;
    },
    get waitingTxHash() {
      return waitingTxHash;
    },
    get waitingTxReceipt() {
      return waitingTxReceipt;
    }
  };
};

export { createWriteContract };
