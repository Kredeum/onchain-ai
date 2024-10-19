<script lang="ts">
  import { createDarkMode } from "$lib/runes/darkMode.svelte.js";
  import { createOnchainAIRead } from "../runes/read.svelte.js";
  import Explorer from "./Explorer.svelte";
  import ReadOnChainAI from "./Read.svelte";
  import { untrack } from "svelte";

  let { refresh = 0 } = $props();

  type interactionType = [string, string, string];
  const zeroBytes32 = "0x" + "00".repeat(32);

  const { isDarkMode } = $derived.by(createDarkMode());
  $inspect("isDarkMode:", isDarkMode);
  const bgBlue = $derived(isDarkMode ? "dark:bg-blue-800" : "bg-blue-100");
  const bgGray = $derived(isDarkMode ? "dark:bg-gray-500" : "bg-gray-100");
  const bgGreen = $derived(isDarkMode ? "dark:bg-green-600" : "bg-green-100");

  const onChainAIRead = $derived.by(() => createOnchainAIRead("lastInteraction"));
  // const interaction: interactionType = $derived(onChainAIRead.value) as interactionType;
  let interaction: [string, string, string] = $state(["", "", ""]);
  const interactions: interactionType[] = $state([]);

  $effect(() => {
    if (!interaction) return;

    const requestId = interaction[0];
    if (!(requestId && requestId !== zeroBytes32)) return;

    untrack(() => {
      const index = interactions.findIndex((id) => id[0] === requestId);
      if (index >= 0) {
        interactions[index] = interaction;
      } else {
        interactions.push(interaction);
      }
    });
  });

  $inspect("chat interactions:", interactions);
</script>

<ReadOnChainAI {refresh} bind:interaction />

<div class="flex flex-col p-4 rounded-lg shadow-md {bgBlue} border border-blue-200">
  {#if interactions.length === 0}
    <div class="{bgGray} p-4 m-4 text-center rounded-lg">
      <em> No interactions yet </em>
    </div>
  {/if}

  {#each interactions as [requestId, prompt, response]}
    <div class="{bgGreen} p-2 m-2 rounded-lg inline-block max-w-xs self-end">
      {prompt}
    </div>
    <div class="{bgGray} p-2 m-2 rounded-lg inline-block max-w-xs self-start">
      {response}
    </div>

    <div class="pl-2 text-center">
      <Explorer {requestId} />
    </div>
  {/each}
</div>
