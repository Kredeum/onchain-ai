import { getBalance } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";
import { type Address, zeroAddress, isAddress } from "viem";
import { BlockChain } from "$lib/wagmi/classes";
import { untrack } from "svelte";

class Balance {
  config = $derived.by(createConfig());
  address = $state<Address>();
  value = $state<bigint | undefined>();
  fetch = () =>
    untrack(async () => ({ value: this.value } = await getBalance(this.config, { address: this.address! })));

  watching = $state();
  watch = () => (this.watching = true);
  unwatch = () => (this.watching = false);

  constructor({ address, watch = true }: { address?: Address; watch?: boolean }) {
    if (!(address && isAddress(address))) throw new Error("Invalid address");

    this.address = address;
    this.fetch();

    let watching = watch;
    const blockChain = untrack(() => new BlockChain());
    $effect(() => {
      if (!watching) return;
      blockChain.blockNumber;
      this.fetch();
    });

    $inspect("Balance", this.value);
  }
}
export { Balance };
