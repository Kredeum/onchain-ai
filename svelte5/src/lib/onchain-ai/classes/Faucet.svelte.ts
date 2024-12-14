import { SmartContract } from "$lib/wagmi/classes";
import type { Address } from "viem";
import { isAddress } from "$lib/wagmi/ts";

class Faucet extends SmartContract {
  get owner() {
    return this.call("owner") as Address;
  }
  get someAmount() {
    return this.call("someAmount") as bigint;
  }
  allowedRequester(address: Address) {
    if (!isAddress(address)) return;

    const allowed = this.call("allowedRequester", [address]) as boolean;

    return allowed;
  }

  constructor() {
    super("Faucet");
  }
}

export { Faucet };
