<script lang="ts">
  import { createTargetNetwork } from "$lib/scaffold-eth/runes";
  import { ChainLink } from "$lib/onchain-ai/runes";
  import { Link } from "$lib/wagmi/components";

  import { createInteractions } from "$lib/onchain-ai/runes";
  import { Interaction } from "$lib/onchain-ai/components";

  const { lastInteraction } = $derived(createInteractions({ all: true, limit: 1 }));

  const chainLink = new ChainLink({});

  const targetNetwork = $derived.by(createTargetNetwork());

  const lastResponseSimulation = $derived(eval(lastInteraction.prompt));
</script>

<div class="flex flex-col text-2xl">
  <div class="flex flex-col w-full p-6">Chain {targetNetwork.name} ({targetNetwork.id})</div>

  {#if targetNetwork.id == 31337}
    <div class="flex flex-row w-full p-6 space-x-2">
      <span class="link">Simulate</span> <span>ChainLink Response =&gt; '{lastResponseSimulation}'</span>
    </div>
  {:else}
    <div class="flex flex-row w-full p-6 space-x-2">
      <Link href={chainLink?.href} description="Go To" /> <span>ChainLink DashBoard</span>
    </div>

    <div class="flex flex-row w-full p-6 space-x-2">
      <span class="">Upload Secrets</span> <span>to ChainLink DON</span>
    </div>
  {/if}
</div>

<div class="flex flex-col pl-6 pt-12">
  <div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
    {#if lastInteraction?.prompt}
      <div class="pb-2 text-xl">Last Interaction:</div>
      <Interaction interaction={lastInteraction} />
    {:else}
      <div class="pb-2 text-xl">No Interaction found!</div>
    {/if}
  </div>
</div>
