<script lang="ts">
  import Explorer from "./Explorer.svelte";
  import { createInteractions } from "$lib/onchain-ai/runes/interactions.svelte";
  import { createDarkMode } from "$lib/runes/darkMode.svelte.js";

  const { isDarkMode } = $derived.by(createDarkMode());

  const { interactions } = $derived.by(createInteractions);
  let interactionsCount = $derived(interactions.length);
</script>

{#if interactionsCount != 0}
  <div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
    {#each interactions as interaction}
      <div
        class="p-2 m-2 rounded-lg inline-block max-w-xs self-end bg-green-ai"
      >
        {interaction.prompt}
      </div>
      <div class="p-2 m-2 rounded-lg inline-block max-w-xs self-start bg-base-100">
        {#if interaction.response}
          {interaction.response}
        {:else}
          <div class="loader">...</div>
        {/if}
      </div>

      <div class="pl-4 pb-4 text-left">
        <Explorer requestId={interaction.requestId} />
      </div>
    {/each}
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
