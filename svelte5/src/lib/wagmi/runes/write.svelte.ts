import { type Abi } from "abitype";
import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes/config.svelte";
import { createChainId } from "$lib/scaffold-eth/runes";

const createWriteContract = ({
  chainId: chainIdParam,
  address,
  functionName,
  args = [],
  value = 0n,
  abi
}: {
  chainId?: number;
  address: Address;
  functionName: string;
  args?: unknown[];
  value?: bigint;
  abi: Abi;
}) => {
  let lastTxHash: `0x${string}` | undefined = $state();
  let waitingTxHash = $state(false);
  let waitingTxReceipt = $state(false);

  const config = $derived.by(createConfig());

  const { chainIdCurrent } = $derived.by(createChainId);
  const chainId = $derived(chainIdParam || chainIdCurrent);

  const send = async () => {
    waitingTxHash = true;

    let hash: `0x${string}` | undefined;
    try {
      hash = await writeContract(config, { chainId, address, functionName, args, value, abi });
      lastTxHash = hash;
    } catch (e: unknown) {
      console.error("writeContract error:", e);
      throw new Error("\nwriteContract call failed");
    }
    waitingTxHash = false;

    if (!hash) {
      throw new Error("\nwriteContract no hash");
    }
    return hash;
  };

  const wait = async (hash: `0x${string}`) => {
    waitingTxReceipt = true;
    let receipt = await waitForTransactionReceipt(config, { chainId, hash });

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
