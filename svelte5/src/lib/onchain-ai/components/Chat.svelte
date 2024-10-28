<script lang="ts">
  import Explorer from "./Explorer.svelte";
  import { createInteractions } from "$lib/onchain-ai/runes/interactions.svelte";
  import { createOnchainAI } from "../runes/contract.svelte";

  const lim = 3;
  let all: boolean = $state(true);
  let limit: number = $state(lim);

  const { account } = $derived.by(createOnchainAI);
  const { interactions, interactionsMax } = $derived(createInteractions({ all, limit }));

  let noMore = $derived(limit >= interactionsMax);
  let interactionsCount = $derived(interactions.length);

  let disabled = $derived(all && !account);
</script>

<div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
  {#if interactionsCount === 0}
    <div class="p-6 m-12 text-center rounded-lg bg-base-200">
      <em> No questions yet </em>
    </div>
  {/if}

  {#each interactions as interaction}
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
  {/each}
</div>

<div class="flex py-4 justify-center">
  <button
    class="btn btn-sm h-10 rounded-full mx-4"
    {disabled}
    onclick={() => {
      all = !all;
    }}
  >
    {all ? "My" : "All"} questions
  </button>

  <button
    class="btn btn-sm h-10 rounded-full mx-4"
    disabled={noMore}
    onclick={() => {
      limit += lim;
    }}
  >
    More questions
    <div>{interactionsCount}/{interactionsMax}</div>
  </button>
</div>

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
