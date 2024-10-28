<script lang="ts">
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createInteractions } from "$lib/onchain-ai/runes/interactions.svelte";

  let all: boolean = $state(false);
  let limit: number = $state(3);

  const { interactions, interactionsMax } = $derived(createInteractions({ all, limit }));

  let noMore: boolean = $derived(limit >= interactionsMax);
</script>

<div class="flex flex-col w-full p-4 items-center">
  <div class="font-bold">
    {#if all}All{:else}My{/if}
    {interactions.length}/{interactionsMax} events
  </div>
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each interactions as interaction, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(interaction, replacer, 2)}</pre>
      {/each}
    </div>
  </div>

  <div class="flex py-4 w-2/3 justify-center">
    <button
      class="btn btn-primary btn-sm h-10 rounded-full mx-4"
      onclick={() => {
        all = false;
      }}>My events</button
    >

    <button
      class="btn btn-primary btn-sm h-10 rounded-full mx-4"
      onclick={() => {
        all = true;
      }}>All events</button
    >
    <button
      class="btn btn-secondary btn-sm h-10 rounded-full mx-24"
      disabled={noMore}
      onclick={() => {
        limit += 1;
      }}>More events</button
    >
  </div>
</div>
