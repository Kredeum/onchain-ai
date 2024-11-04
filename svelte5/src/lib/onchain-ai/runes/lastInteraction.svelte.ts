import type { Address } from "viem";
import { createReadOnchainAI } from "$lib/onchain-ai/runes";
import type { InteractionType, InteractionTypeTuple } from "$lib/onchain-ai/ts";
import { createBlockNumber } from "$lib/wagmi/runes";

const createLastInteraction = (account: Address) => {
  const { blockNumber } = $derived(createBlockNumber());
  $effect(() => {
    blockNumber;
    fetch && fetch();
  });

  const { data: interactionTuple, fetch } = $derived.by(() => {
    if (!account) return { data: null, fetch: null };

    return createReadOnchainAI({ functionName: "lastInteraction", args: [account] });
  });

  const lastInteraction = $derived.by(() => {
    if (!interactionTuple) return null;

    const [requestId, sender, prompt, response] = interactionTuple as InteractionTypeTuple;
    return { requestId, sender, prompt, response };
  }) as InteractionType | null;

  return {
    get lastInteraction() {
      return lastInteraction;
    }
  };
};

export { createLastInteraction };
