import { type GetBalanceReturnType, getBalance } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes";
import { type Address, zeroAddress } from "viem";
import { createBlockNumber } from "$lib/wagmi/runes";

const createBalance = (params: { chainId?: number; address?: Address }) => {
  let { chainId, address } = params;
  address ||= zeroAddress;

  const config = $derived.by(createConfig());
  if (!chainId) {
    const { targetNetworkId } = $derived.by(createTargetNetworkId);
    chainId = targetNetworkId;
  }

  let balance: GetBalanceReturnType | undefined = $state();
  const fetch = async () => {
    balance = await getBalance(config, { chainId, address });
    return balance;
  };

  const { blockNumber } = $derived(createBlockNumber({ chainId }));
  $effect(() => {
    blockNumber;
    fetch();
  });

  return {
    fetch,
    get balance() {
      return balance;
    }
  };
};

export { createBalance };
