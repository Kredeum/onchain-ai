import { getBalance as getBalanceWagmi } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/classes";
import { type Address, isAddress } from "viem";
import { BlockChain } from "$lib/wagmi/classes";
import { untrack } from "svelte";

class Balance {
  address = $state<Address>();
  value = $state<bigint | undefined>();
  getBalance = () =>
    untrack(async () => ({ value: this.value } = await getBalanceWagmi(wagmiConfig, { address: this.address! })));

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
