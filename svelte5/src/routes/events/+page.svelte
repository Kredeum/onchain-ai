<script lang="ts">
  import { createOnchainAI } from "$lib/onchain-ai/runes";
  import { replacer } from "$lib/scaffold-eth/ts";
  import { createEvents } from "$lib/wagmi/runes";

  const { address, abi } = $derived.by(createOnchainAI);

  const { events, eventsMax } = $derived(createEvents(address, abi));

  let noMore: boolean = true; // $derived(limit >= eventsMax);
</script>

<div class="flex flex-col w-full p-4 items-center">
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each events as event, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(event, replacer, 2)}</pre>
      {/each}
    </div>
  </div>
</div>
