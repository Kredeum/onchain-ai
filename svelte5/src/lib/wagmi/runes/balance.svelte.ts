import { type GetBalanceReturnType, getBalance } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { type Address, zeroAddress, isAddress } from "viem";
import { BlockNumber } from "$lib/wagmi/runes";
import { untrack } from "svelte";

const createBalance = ({ address }: { address?: Address }) => {
  const config = $derived.by(createConfig());

  let balance: GetBalanceReturnType | undefined = $state();
  const fetch = async () => {
    if (!(address && isAddress(address))) return;
    balance = await getBalance(config, { address });
    return balance;
  };
  fetch();

  const block = untrack(() => new BlockNumber());
  $effect(() => {
    block.latest;
    fetch();
  });

  $inspect("createBalance ~ balance:", balance);

  return {
    fetch,
    get balance() {
      return balance;
    }
  };
};

export { createBalance };
