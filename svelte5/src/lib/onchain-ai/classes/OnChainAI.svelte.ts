import { SmartContract } from "$lib/wagmi/classes";
import type { Address } from "viem";
import type { InteractionType, InteractionTypeTuple } from "../ts";

class OnChainAI {
  contract: SmartContract;

  get owner() {
    return this.contract.call("owner") as string;
  }
  get price() {
    return this.contract.call("price") as bigint;
  }
  lastInteraction(address: Address): InteractionType | undefined {
    const lastInteractionTuple = this.contract.call("lastInteraction", [address]) as InteractionTypeTuple;
    if (!(lastInteractionTuple && lastInteractionTuple.length === 4)) return;

    const [requestId, sender, prompt, response] = lastInteractionTuple;
    return { requestId, sender, prompt, response, isResponse: Boolean(response) };
  }

  constructor() {
    this.contract = new SmartContract("OnChainAIv1");
  }
}

export { OnChainAI };
