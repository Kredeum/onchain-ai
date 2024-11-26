<script lang="ts">
  import type { InteractionType } from "$lib/onchain-ai/ts";
  import { LinksInteraction } from "$lib/onchain-ai/components";

  let { interaction, index = 0 }: { interaction?: InteractionType; index?: number } = $props();

  // $inspect("<Interaction", interaction);
</script>

{#if interaction}
  <div id="interaction-{index}" class="flex flex-col">
    <div class="prompt p-2 m-2 rounded-lg inline-block max-w-xs self-end bg-green-ai">
      {interaction.prompt}
    </div>
    <div class="response p-2 m-2 rounded-lg inline-block max-w-xs self-start bg-base-200">
      {#if interaction.response}
        {interaction.response}
      {:else}
        <div class="loader">...</div>
      {/if}
    </div>

    <div class="pl-4 pb-4 text-left">
      <LinksInteraction requestId="{interaction.requestId as `0x${string}`}}" />
    </div>
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
