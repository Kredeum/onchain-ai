<script lang="ts">
  import { createInteractions } from "$lib/onchain-ai/runes";
  import { createContract } from "$lib/wagmi/runes";
  import { Interaction } from "$lib/onchain-ai/components";

  const lim = 3;
  let all: boolean = $state(true);
  let limit: number = $state(lim);

  const { account } = $derived.by(() => createContract("OnChainAIv1"));
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

  {#each interactions as interaction, index}
    <Interaction {interaction} {index} />
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
