<script lang="ts">
  import { targetNetwork } from "$lib/wagmi/classes";
  import { ChainLink, Interactions, MockRouter, type InteractionType } from "$lib/onchain-ai/classes";
  import { Link } from "$lib/wagmi/components";

  import { Interaction } from "$lib/onchain-ai/components";
  import { encodeAbiParameters, stringToBytes, toBytes, toHex } from "viem";
  import Form from "./Form.svelte";

  const chainLink = new ChainLink({});
  const interactions = new Interactions();

  const lastInteraction = $derived(interactions.last) as InteractionType;
  new MockRouter();

  $inspect("lastInteraction:", lastInteraction);
</script>

<div class="flex flex-col text-2xl">
  <div class="flex flex-col w-full p-6">Chain {targetNetwork.name} ({targetNetwork.id})</div>

  <div class="p-2 w-full max-w-lg">
    <Form />
  </div>

  {#if targetNetwork.id == 31337}
    <div class="flex flex-row w-full p-6 space-x-2">
      <span>Simulatation</span>
      <span>ChainLink Response '{lastInteraction?.prompt}' =&gt; '{lastInteraction?.response}'</span>
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
    {#if lastInteraction}
      <div class="pb-2 text-xl">Last Interaction:</div>
      <Interaction interaction={lastInteraction} />
    {:else}
      <div class="pb-2 text-xl">No Interaction found!</div>
    {/if}
  </div>
</div>
