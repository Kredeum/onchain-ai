import { type GetBalanceReturnType, getBalance } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { type Address, zeroAddress, isAddress } from "viem";
import { BlockNumber } from "$lib/wagmi/runes";
import { untrack } from "svelte";

const createBalance = ({ address }: { address?: Address }) => {
  address = address && isAddress(address) ? address : zeroAddress;

  const config = $derived.by(createConfig());

  let balance: GetBalanceReturnType | undefined = $state();
  const fetch = async () => {
    balance = await getBalance(config, { address });
    return balance;
  };

  // const block = untrack(() => new BlockNumber());
  // $effect(() => {
  //   block.latest;
  //   fetch();
  // });

  // $inspect("createBalance ~ balance:", balance);

  return {
    fetch,
    get balance() {
      return balance;
    }
  };
};

export { createBalance };
