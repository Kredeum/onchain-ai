<script lang="ts">
  import { Interaction } from "$lib/onchain-ai/components";
  import { type Address } from "viem";
  import { OnChainAI } from "../classes";

  const { account }: { account: Address } = $props();

  const onChainAI = new OnChainAI();

  // $inspect("<LastInteraction", onChainAI.lastInteraction(account));
</script>

{#if onChainAI && account}
  <div class="flex flex-col p-4 m-12 max-w-lg rounded-lg shadow-md bg-base-300">
    <Interaction interaction={onChainAI.lastInteraction(account)} />
  </div>
{:else}
  <p class="p-4">No onChainAI or account address found</p>
{/if}
