import { SmartContract } from "$lib/wagmi/classes";
import type { Address } from "viem";
import type { InteractionType, InteractionTypeTuple } from "../ts";

class OnChainAI extends SmartContract {
  get owner() {
    return this.call("owner") as string;
  }
  get price() {
    return this.call("price") as bigint;
  }
  lastInteraction(address: Address): InteractionType {
    const lastInteractionTuple = this.call("lastInteraction", [address]) as InteractionTypeTuple;
    // if (!(lastInteractionTuple && lastInteractionTuple.length === 4)) return;

    const [requestId, sender, prompt, response] = lastInteractionTuple;
    return { requestId, sender, prompt, response, isResponse: Boolean(response) };
  }

  constructor() {
    super("OnChainAIv1");
  }
}

export { OnChainAI };
