import { type GetBalanceReturnType, getBalance } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createChainId } from "$lib/scaffold-eth/runes";
import { type Address, zeroAddress, isAddress } from "viem";
import { createLatestBlock } from "$lib/wagmi/runes";

const createBalance = ({ chainId: chainIdParam, address }: { chainId?: number; address?: Address }) => {
  const { chainIdCurrent } = $derived.by(createChainId);
  const chainId = $derived(chainIdParam || chainIdCurrent);

  address = address && isAddress(address) ? address : zeroAddress;

  const config = $derived.by(createConfig());

  let balance: GetBalanceReturnType | undefined = $state();
  const fetch = async () => {
    balance = await getBalance(config, { chainId, address });
    return balance;
  };

  const { blockNumber } = $derived(createLatestBlock({ chainId }));
  $effect(() => {
    blockNumber;
    fetch();
  });

  // $inspect("createBalance ~ balance:", balance);

  return {
    fetch,
    get balance() {
      return balance;
    }
  };
};

export { createBalance };
