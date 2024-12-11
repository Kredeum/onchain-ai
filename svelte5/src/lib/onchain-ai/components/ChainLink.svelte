<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { ChainLink, Interactions, type InteractionType } from "$lib/onchain-ai/classes";
  import { Link } from "$lib/wagmi/components";

  import { Events } from "$lib/wagmi/classes";
  import { Interaction } from "$lib/onchain-ai/components";

  const interactions = new Interactions({ limit: 1 });
  const interactionLast = $derived(interactions.list?.[0]) as InteractionType;

  const chainLink = new ChainLink({});

  const lastResponseSimulation = $derived(eval(interactionLast.prompt));
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
    {#if interactionLast.prompt}
      <div class="pb-2 text-xl">Last Interaction:</div>
      <Interaction interaction={interactionLast} />
    {:else}
      <div class="pb-2 text-xl">No Interaction found!</div>
    {/if}
  </div>
</div>
