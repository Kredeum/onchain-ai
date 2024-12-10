import type { Address, Log } from "viem";
import { isAddress } from "$lib/scaffold-eth/ts";
import { SmartContract } from "$lib/wagmi/classes";

class OnChainAI extends SmartContract {
  get owner() {
    return this.call("owner") as string;
  }
  get price() {
    return this.call("price") as bigint;
  }
  lastInteraction(address: Address): InteractionType | undefined {
    if (!isAddress(address)) return;

    const lastInteractionTuple = this.call("lastInteraction", [address]) as InteractionTypeTuple;
    if (!(lastInteractionTuple && lastInteractionTuple.length === 4)) return;

    const [requestId, sender, prompt, response] = lastInteractionTuple;
    return { requestId, sender, prompt, response, isResponse: Boolean(response) };
  }

  constructor() {
    super("OnChainAIv1");
  }
}

type InteractionTypeTuple = [string, Address, string, string];
type InteractionType = {
  requestId: string;
  sender: Address;
  prompt: string;
  response: string;
  isResponse?: boolean;
};

type InteractionLogWithArgs = Log & { args: InteractionType; index: number };
type InteractionLogsParamsType = {
  address: Address;
  abi: any;
  eventName: string;
  args?: { sender: Address };
};

export { OnChainAI };
export type { InteractionType, InteractionTypeTuple, InteractionLogWithArgs, InteractionLogsParamsType };
