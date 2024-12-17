import { SmartContract, targetNetwork } from "$lib/wagmi/classes";
import { toBytes, toHex, type Address } from "viem";
import { isAddress } from "$lib/wagmi/ts";
import { Interactions } from "./Interactions.svelte";
import { type InteractionType } from "$lib/onchain-ai/classes";
import { simulateFunction } from "$lib/onchain-ai/ts";

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

  interactions = $state<Interactions>();
  #done: Map<string, boolean> = new Map();
  mockResponse = async () => {
    const lastInteraction = this.interactions?.last;

    if (!(lastInteraction && lastInteraction.prompt && !lastInteraction.response)) return;
    if (this.#done.get(lastInteraction.requestId)) return;

    const response = await simulateFunction(lastInteraction.prompt);
    console.log("mockResponse", lastInteraction.prompt, "=>", response);
    this.send("fulfillRequest", [lastInteraction.requestId, toHex(toBytes(String(response))), ""]);

    this.#done.set(lastInteraction.requestId, true);
  };

  constructor() {
    super("MockRouter");

    this.interactions = new Interactions({ limit: 1 });

    $effect(() => {
      if (targetNetwork.id != 31337) return;
      this.mockResponse();
    });
  }
}

export { MockRouter };
