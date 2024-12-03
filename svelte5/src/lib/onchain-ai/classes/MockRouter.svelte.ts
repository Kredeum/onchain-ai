import { SmartContract } from "$lib/wagmi/classes";
import { type Address } from "viem";
import { isAddress } from "$lib/scaffold-eth/ts";

type getConsumerReturnType = {
  allowed: boolean;
  completedRequests: bigint;
  initiatedRequests: bigint;
};

class MockRouter extends SmartContract {
  get addressOnChainAI() {
    return this.call("onChainAI") as Address;
  }
  get counter() {
    return this.call("counter") as number;
  }
  getConsumer(address: Address, subscriptionId = 0): getConsumerReturnType | undefined {
    if (!isAddress(address)) return;

    return this.call("getConsumer", [address, subscriptionId]) as getConsumerReturnType;
  }

  constructor() {
    super("MockRouter");
  }
}

export { MockRouter };
