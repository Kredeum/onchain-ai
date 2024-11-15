<script lang="ts">
  import { replacer } from "$lib/scaffold-eth/ts";
  import type { DeploymentContractName } from "@onchain-ai/common";
  import { createContract, createEvents } from "$lib/wagmi/runes";

  const { contractName, hidden }: { contractName: string; hidden: boolean } = $props();

  const { address, abi } = $derived.by(() => createContract(contractName as DeploymentContractName));

  const { events, eventsMax } = $derived(createEvents(address, abi));

  let noMore: boolean = true; // $derived(limit >= eventsMax);
</script>

{#if !hidden}
  <div class="flex flex-col w-full p-4 items-center">
    <div class="flex flex-col max-w-6xl gap-3 p-4">
      <div class="mockup-code max-h-[900px] overflow-auto">
        {#if events.length > 0}
          {#each events as event, i (i)}
            <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(event, replacer, 2)}</pre>
          {/each}
        {:else}
          <p class="p-14 text-2xl">No Events found!</p>
        {/if}
      </div>
    </div>
  </div>
{/if}
