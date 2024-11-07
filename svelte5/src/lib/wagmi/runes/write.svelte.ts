import { type Abi } from "abitype";
import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes/config.svelte";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes";

const createWriteContract = ({ chainId: paramChainId,
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

  const { targetNetworkId } = $derived.by(createTargetNetworkId);
  const chainId = $derived(paramChainId || targetNetworkId);

  const send = async () => {
    waitingTxHash = true;

    let hash: `0x${string}` | undefined;
    try {
      hash = await writeContract(config, { chainId, address, functionName, args, value, abi });
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
