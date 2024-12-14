import TxnNotification from "./TxnNotification.svelte";
import { getPublicClient, getWalletClient } from "@wagmi/core";
import type { Hash, SendTransactionParameters, TransactionReceipt, WalletClient } from "viem";
import { getParsedError } from "$lib/scaffold-eth/ts";
import { notification } from "$lib/wagmi/ts";
import { wagmiConfig } from "$lib/wagmi/classes";
import { LinkTx } from "$lib/wagmi/components";

export type TransactionFunc = (
  tx: (() => Promise<Hash>) | SendTransactionParameters,
  options?: {
    onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
    blockConfirmations?: number;
  }
) => Promise<Hash | undefined>;

export const createTransactor = (_walletClient?: () => WalletClient): (() => TransactionFunc) => {
  const result: TransactionFunc = async (tx, options) => {
    let walletClient = _walletClient?.();
    // TODO: Why does createWalletClient not work?
    if (!walletClient) {
      const defaultWalletClient = await getWalletClient(wagmiConfig);
      walletClient = defaultWalletClient;
    }

    if (!walletClient) {
      notification.error("Cannot access account");
      console.error("⚡️ ~ file: useTransactor.tsx ~ error");
      return;
    }

    let notificationId = null;
    let hash: Hash | undefined = undefined;
    try {
      const network = await walletClient.getChainId();
      // Get full transaction from public client
      const publicClient = getPublicClient(wagmiConfig);

      notificationId = notification.loading("Awaiting for user confirmation");
      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        hash = result;
      } else if (tx != null) {
        hash = await walletClient.sendTransaction(tx);
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      notification.remove(notificationId);

      notificationId = notification.info(LinkTx as any, { props: { hash, message: "Transaction sent!" } });

      const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: hash,
        confirmations: options?.blockConfirmations
      });
      notification.remove(notificationId);

      notification.success(LinkTx as any, {
        props: { hash, message: "Transaction validated!" }
      });

      if (options?.onBlockConfirmation) options.onBlockConfirmation(transactionReceipt);
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
      const message = getParsedError(error);
      notification.error(message);
      throw error;
    }

    return hash;
  };

  return () => result;
};
