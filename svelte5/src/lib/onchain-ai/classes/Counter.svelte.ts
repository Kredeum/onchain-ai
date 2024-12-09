import { SmartContract } from "$lib/wagmi/classes";
import type { Address } from "viem";
import { isAddress } from "$lib/scaffold-eth/ts";

class Counter extends SmartContract {
  get number() {
    return this.call("number") as bigint;
  }
  balanceOf(address: Address) {
    if (!isAddress(address)) return;

    const balance = this.call("balanceOf", [address]) as bigint;

    return balance;
  }

  constructor() {
    super("Counter");
  }
}

export { Counter };
