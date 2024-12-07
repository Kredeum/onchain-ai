<script lang="ts">
  import { Interaction } from "$lib/onchain-ai/components";
  import { type Address } from "viem";
  import { OnChainAI } from "../classes";

  const { address }: { address: Address } = $props();

  const onChainAI = new OnChainAI();

  // $inspect("<LastInteraction", onChainAI.lastInteraction(address));
</script>

{#if onChainAI && address}
  <div class="flex flex-col p-4 m-12 max-w-lg rounded-lg shadow-md bg-base-300">
    <Interaction interaction={onChainAI.lastInteraction(address)} />
  </div>
{:else}
  <p class="p-4">No onChainAI or address found</p>
{/if}
