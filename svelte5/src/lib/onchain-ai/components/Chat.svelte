<script lang="ts">
  import { Interactions, MockRouter, type InteractionType } from "$lib/onchain-ai/classes";
  import { Interaction } from "$lib/onchain-ai/components";
  import { Account } from "$lib/wagmi/classes";

  const account = new Account();
  const sender = $derived(account.address);

  const limit = 3;
  const interactions = new Interactions({ limit });

  const noMore = $derived(interactions.count >= interactions.max);
  const more = () => (interactions.limit += limit);

  const all = $derived(!interactions.sender);
  const toggleAll = () => (interactions.sender = all ? account.address : null);

  const disabled = $derived(all && !account.address);

  new MockRouter();

  // $inspect("interactions:", interactions);
</script>

<div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
  {#each interactions.list as interaction, index}
    <Interaction interaction={interaction as unknown as InteractionType} {index} />
  {:else}
    <div class="p-6 m-12 text-center rounded-lg bg-base-200">
      <em> No questions yet </em>
    </div>
  {/each}
</div>

<div class="flex py-4 justify-center">
  <button class="btn btn-sm h-10 rounded-full mx-4" {disabled} onclick={toggleAll}>
    {all ? "My" : "All"} questions
  </button>

  <button class="btn btn-sm h-10 rounded-full mx-4" disabled={noMore} onclick={more}>
    More questions
    <div>{interactions.count}/{interactions.max}</div>
  </button>
</div>
