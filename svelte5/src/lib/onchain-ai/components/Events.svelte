<script lang="ts">
  import type { Address } from "viem";
  import { createContractLogs } from "$lib/onchain-ai/runes/logs.svelte";
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createOnchainAIEvents } from "../runes/events.svelte";
  import { createOnchainAI } from "../runes/contract.svelte";

  const { address } = $derived.by(createOnchainAI);
  $inspect("address", address);

  // const contractLogs = $derived.by(() => createOnchainAIEvents(address as Address));
  const contractLogs = $derived.by(() => createContractLogs(address as Address));

  let { refresh = 0 } = $props();

  // const contractLogs = $derived.by(() => createOnchainLogs(address as Address));

  // const contractLogsSorted = $derived.by(() =>
  //   contractLogs().sort((a, b) => Number((a.blockNumber || 0n) - (b.blockNumber || 0n)))
  // );
  // const events = $derived.by(() => contractLogs());
</script>

<div class="flex flex-col gap-3">
  <div class="mockup-code max-h-[500px] overflow-auto">
    <pre
      class="whitespace-pre-wrap break-words px-5">{#each contractLogs as event, i (i)}<div><strong
            >Log:</strong
          > {JSON.stringify(event, replacer, 2)}</div>{/each}</pre>
  </div>
</div>

<!-- {#if events?.length > 0}
  {events.length} Events
  {#each events as event, i (i)}
    <pre>{JSON.stringify(event, replacer, 2)}</pre>
  {/each}
{:else}
  <div class="bg-gray-100 p-4 m-4 rounded-lg">
    <em> No contract Events yet </em>
  </div>
{/if} -->
