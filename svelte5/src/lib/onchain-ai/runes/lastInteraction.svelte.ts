import { type Address, isAddress } from "viem";
import { createReadOnchainAI } from "$lib/onchain-ai/runes";
import type { InteractionType, InteractionTypeTuple } from "$lib/onchain-ai/ts";
import { createLatestBlock } from "$lib/wagmi/runes";

class LastInteraction {
  lastInteraction: InteractionType | undefined = $derived.by(() => {
    if (!this.readOnchainAI?.data) return;
    const [requestId, sender, prompt, response] = this.readOnchainAI.data as InteractionTypeTuple;
    return { requestId, sender, prompt, response };
  });

  account: Address | undefined = $state();
  blockReader: ReturnType<typeof createLatestBlock> = $derived(createLatestBlock());
  readOnchainAI: ReturnType<typeof createReadOnchainAI> | undefined = $derived.by(() => {
    if (!(this.account && isAddress(this.account))) return;
    return createReadOnchainAI({ functionName: "lastInteraction", args: [this.account] });
  });

  constructor(account: Address) {
    this.account = account;

    $effect(() => {
      this.blockReader?.blockNumber;
      this.readOnchainAI?.fetch && this.readOnchainAI.fetch();
    });

    // $inspect("blockNumber", this.blockReader?.blockNumber);
    $inspect("account", this.account);
    $inspect("lastInteraction", this.lastInteraction);
  }
}

export { LastInteraction };
