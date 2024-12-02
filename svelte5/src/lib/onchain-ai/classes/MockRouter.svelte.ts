import { SmartContract } from "$lib/wagmi/classes";
import type { Address } from "viem";

class MockRouter {
  contract: SmartContract;

  get addressOnChainAI() {
    return this.contract.call("onChainAI") as Address;
  }
  get counter() {
    return this.contract.call("counter") as number;
  }
  getCounsumer(address: Address, subscriptionId = 0) {
    return this.contract.call("getConsumer", [address]) as boolean;
  }

  constructor() {
    this.contract = new SmartContract("MockRouter");
  }
}

export { MockRouter };
