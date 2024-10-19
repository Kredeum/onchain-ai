<script lang="ts">
  import Explorer from "./Explorer.svelte";
  import ReadOnChainAI from "./Read.svelte";
  import Events from "$lib/onchain-ai/components/Events.svelte";
  import { createDarkMode } from "$lib/runes/darkMode.svelte.js";

  const { isDarkMode } = $derived.by(createDarkMode());
  const bgBlue = $derived(isDarkMode ? "dark:bg-blue-800" : "bg-blue-100");
  const bgGray = $derived(isDarkMode ? "dark:bg-gray-500" : "bg-gray-100");
  const bgGreen = $derived(isDarkMode ? "dark:bg-green-600" : "bg-green-100");

  type InteractionType = { requestId: string; prompt: string; response: string };
  let { refresh = 0 }: { refresh: number } = $props();

  let interactions: InteractionType[] = $state([]);
  let lastInteraction: InteractionType = $state({ requestId: "", prompt: "", response: "" });

  $inspect("chat lastInteraction:", lastInteraction);
  $inspect("chat interactions:", interactions);
</script>

<ReadOnChainAI {refresh} bind:lastInteraction />

<div class="flex flex-col p-4 rounded-lg shadow-md {bgBlue} border border-blue-200">
  {#if interactions?.length === 0}
    <div class="{bgGray} p-4 m-4 text-center rounded-lg">
      <em> No interactions yet </em>
    </div>
  {/if}

  {#each interactions as interaction}
    <div class="{bgGreen} p-2 m-2 rounded-lg inline-block max-w-xs self-end">
      {interaction.prompt}
    </div>
    <div class="{bgGray} p-2 m-2 rounded-lg inline-block max-w-xs self-start">
      {interaction.response}
    </div>

    <div class="pl-2 text-center">
      <Explorer requestId={interaction.requestId} />
    </div>
  {/each}
</div>

<div class="p-2">
  <Events {refresh} bind:interactions />
</div>
