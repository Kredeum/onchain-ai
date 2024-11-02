import { getBalance } from "@wagmi/core";
import { createConfig } from "./config.svelte";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes/global.svelte";
import { type Address, zeroAddress } from "viem";

const createBalance = (params: { chainId?: number; address?: Address }) => {
  let { chainId, address } = params;
  address ||= zeroAddress;

  const config = $derived.by(createConfig());
  if (!chainId) {
    const { targetNetworkId } = $derived.by(createTargetNetworkId);
    chainId = targetNetworkId;
  }

  let balance = $state();
  (async () => {
    balance = await getBalance(config, { chainId, address });
  })();

  $inspect("RUNE createBalance chainId", chainId);
  $inspect("RUNE createBalance address", address);
  $inspect("RUNE createBalance balance", balance);

  return {
    get balance() {
      return balance;
    }
  };
};

export { createBalance };
