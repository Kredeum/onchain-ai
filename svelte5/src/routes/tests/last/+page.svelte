<script lang="ts">
  import { createOnchainAI } from "$lib/onchain-ai/runes/contract.svelte";
  import { createReadOnchainAI } from "$lib/onchain-ai/runes/read.svelte";
  import type { InteractionType } from "$lib/onchain-ai/types";

  const { account } = $derived.by(createOnchainAI) as { account: string };

  let { data: lastInteraction } = $derived(
    account
      ? createReadOnchainAI({ functionName: "lastInteraction", args: [account] })
      : { data: null }
  ) as unknown as { data: InteractionType | null };
</script>

<div class="p-4">
  {#if lastInteraction}
    `{lastInteraction.prompt}` => `{lastInteraction.response}`
  {/if}
</div>
