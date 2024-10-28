<script lang="ts">
  import { createOnchainAI } from "$lib/onchain-ai/runes/contract.svelte";
  import { createOnchainAIRead } from "$lib/onchain-ai/runes/read.svelte";
  import type { InteractionType } from "$lib/onchain-ai/types";

  const { account } = $derived.by(createOnchainAI) as { account: string };

  const { data: lastInteraction } = $derived(
    createOnchainAIRead({ functionName: "lastInteraction", args: [account] })
  ) as { data: InteractionType };
</script>

<div class="p-4">
  {#if lastInteraction}
    `{lastInteraction.prompt}` => `{lastInteraction.response}`
  {/if}
</div>
