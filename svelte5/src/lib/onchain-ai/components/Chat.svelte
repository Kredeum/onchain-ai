<script lang="ts">
  import Explorer from "./Explorer.svelte";
  import { createInteractions } from "$lib/onchain-ai/runes/interactions.svelte";
  import { createDarkMode } from "$lib/runes/darkMode.svelte.js";

  const { isDarkMode } = $derived.by(createDarkMode());
  const bgBlue = $derived(isDarkMode ? "dark:bg-blue-800" : "bg-blue-100");
  const bgGray = $derived(isDarkMode ? "dark:bg-gray-500" : "bg-gray-100");
  const bgGreen = $derived(isDarkMode ? "dark:bg-green-600" : "bg-green-100");

  let { refresh = 0 }: { refresh: number } = $props();

  const { interactions } = $derived.by(createInteractions);
  let interactionsCount = $derived(interactions.length);
</script>

{#if interactionsCount != 0}
  <div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md {bgBlue} border border-blue-200">
    {#each interactions as interaction}
      <div class="{bgGreen} p-2 m-2 rounded-lg inline-block max-w-xs self-end">
        {interaction.prompt}
      </div>
      <div class="{bgGray} p-2 m-2 rounded-lg inline-block max-w-xs self-start">
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

  <div class="pt-4 text-center">
    <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>
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
