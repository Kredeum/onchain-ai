<script lang="ts">
  import type { InteractionType } from "$lib/onchain-ai/ts";
  import { Explorer } from "$lib/onchain-ai/components";

  let { interaction }: { interaction: InteractionType | null } = $props();

  // $inspect("Interaction interaction", interaction);
</script>

{#if interaction}
  <div class="p-2 m-2 rounded-lg inline-block max-w-xs self-end bg-green-ai">
    {interaction.prompt}
  </div>
  <div class="p-2 m-2 rounded-lg inline-block max-w-xs self-start bg-base-200">
    {#if interaction.response}
      {interaction.response}
    {:else}
      <div class="loader">...</div>
    {/if}
  </div>

  <div class="pl-4 pb-4 text-left">
    <Explorer requestId={interaction.requestId} />
  </div>
{/if}

<style>
  .loader {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
