import { getBalance as getBalanceWagmi } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";
import { type Address, isAddress } from "viem";
import { BlockChain } from "$lib/wagmi/classes";
import { untrack } from "svelte";

class Balance {
  config = $derived.by(createConfig());

  address = $state<Address>();
  value = $state<bigint | undefined>();
  getBalance = () =>
    untrack(async () => ({ value: this.value } = await getBalanceWagmi(this.config, { address: this.address! })));

  watchingBalance = $state();
  watchBalance = () => (this.watchingBalance = true);
  unwatchBalance = () => (this.watchingBalance = false);

  constructor({ address, watchBalance = true }: { address?: Address; watchBalance?: boolean }) {
    if (!(address && isAddress(address))) throw new Error("Invalid address");

    this.address = address;
    this.getBalance();

    let watchingBalance = watchBalance;
    const blockChain = untrack(() => new BlockChain());
    $effect(() => {
      if (!watchingBalance) return;
      blockChain.blockNumber;
      this.getBalance();
    });

    // $inspect("Balance", this.value);
  }
}
export { Balance };
