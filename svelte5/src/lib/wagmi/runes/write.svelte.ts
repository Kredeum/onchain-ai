import { type Abi } from "abitype";
import type { Address } from "viem";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/ts";
import { targetNetwork, type TargetNetworkId } from "$lib/scaffold-eth/classes";
import { notification } from "$lib/scaffold-eth/ts";
import { LinkTx } from "$lib/wagmi/components";

const createWriteContract = ({
  chainId: chainIdParam,
  address,
  functionName,
  args = [],
  value = 0n,
  abi
}: {
  chainId?: TargetNetworkId;
  address: Address;
  functionName: string;
  args?: unknown[];
  value?: bigint;
  abi: Abi;
}) => {
  let lastTxHash: `0x${string}` | undefined = $state();
  let waitingTxHash = $state(false);
  let waitingTxReceipt = $state(false);
  let notifs = new Map();

  const chainId = $derived(chainIdParam || targetNetwork.id);

  const send = async () => {
    waitingTxHash = true;

    let hash: `0x${string}` | undefined;
    let idSend: string = "";
    try {
      idSend = notification.loading("Sending transaction...");

      hash = await writeContract(wagmiConfig, { chainId, address, functionName, args, value, abi });
      lastTxHash = hash;

      const idHash = notification.info(LinkTx as any, { props: { hash, message: "Transaction sent!" } });
      notifs.set(hash, idHash);
    } catch (e: unknown) {
      notification.error(LinkTx as any, { props: { hash, message: "Transaction call failed!" } });
      throw new Error(`writeContract error: ${e}`);
    } finally {
      notification.remove(idSend);
    }
    waitingTxHash = false;
    if (!hash) {
      notification.error(`Transaction failed, no hash!`);
      throw new Error("writeContract no hash");
    }
    return hash;
  };

  const wait = async (hash: `0x${string}`) => {
    waitingTxReceipt = true;
    let receipt = await waitForTransactionReceipt(wagmiConfig, { chainId, hash });

    notification.remove(notifs.get(hash));
    notification.success(LinkTx as any, {
      props: { hash, message: "Transaction validated!" }
    });

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
