import { type Address, type Abi } from "abitype";
import {
  type WriteContractReturnType,
  readContract,
  waitForTransactionReceipt,
  writeContract
} from "@wagmi/core";
import { createTransactor, type TransactionFunc } from "$lib/runes/transactor.svelte";
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
  let lastHash: `0x${string}` | undefined = $state();

  const config = $derived.by(createConfig());

  const send = async () => {
    let hash: `0x${string}` | undefined;

    try {
      hash = await writeContract(config, {
        abi,
        address,
        functionName,
        args,
        value
      });
      lastHash = hash;
    } catch (e: unknown) {
      console.error("⚡️ send ~ error", e);
    }

    if (!hash) throw Error("writeContract error: no hash");

    let receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  };

  return {
    send,
    get lastHash() {
      return lastHash;
    }
  };
};

export { createWriteContract };
