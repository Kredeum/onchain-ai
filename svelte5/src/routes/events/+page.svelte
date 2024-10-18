<script>
  // import Events from "$lib/onchain-ai/components/Events.svelte";
  import Logs from "$lib/onchain-ai/components/Logs.svelte";
  import { createOnchainAI } from "$lib/onchain-ai/runes/contract.svelte";

  const { address } = $derived.by(createOnchainAI);

  let refresh = $state(0);
</script>

<div class="m-10">
  <!-- <Events {refresh} /> -->
  <Logs {address} />

  <div class="pt-4">
    <button class="btn" onclick={() => refresh++}>Refresh</button>
  </div>
</div>
