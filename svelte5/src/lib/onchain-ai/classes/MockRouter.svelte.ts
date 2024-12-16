import { SmartContract, targetNetwork } from "$lib/wagmi/classes";
import { toBytes, toHex, type Address } from "viem";
import { isAddress } from "$lib/wagmi/ts";
import { Interactions } from "./Interactions.svelte";
import { type InteractionType } from "$lib/onchain-ai/classes";

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
  // function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err)

  getConsumer(address: Address, subscriptionId = 0): getConsumerReturnType | undefined {
    if (!isAddress(address)) return;

    return this.call("getConsumer", [address, subscriptionId]) as getConsumerReturnType;
  }

  constructor() {
    if (targetNetwork.id != 31337) return;
    super("MockRouter");

    const interactions = new Interactions({ limit: 1 });
    const done: Map<string, boolean> = new Map();

    $effect(() => {
      const lastInteraction = interactions.last;
      if (!(lastInteraction && lastInteraction.prompt && !lastInteraction.response)) return;

      if (done.get(lastInteraction.requestId)) return;

      this.send("fulfillRequest", [
        lastInteraction.requestId,
        toHex(toBytes(String(eval(lastInteraction.prompt)))),
        ""
      ]);

      done.set(lastInteraction.requestId, true);
    });
  }
}

export { MockRouter };
