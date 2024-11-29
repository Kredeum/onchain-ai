<script lang="ts">
  import { SmartContract } from "$lib/wagmi/classes";
  import { createReadOnchainAI } from "$lib/onchain-ai/runes/read.svelte";
  import { OnChainAI } from "$lib/onchain-ai/classes";

  // 1. Simple way, using specific OnChainAI class
  const onChainAI = new OnChainAI();

  // 2. Complex way, using generic SmartContract class and IFFE for async effect
  const smartContract = new SmartContract("OnChainAIv1");
  let dataOwner = $state();
  $effect(() => {
    (async () => (dataOwner = await smartContract.call("owner")))();
  });

  // 3. Old way, using createRead...
  let { data: owner } = $derived(createReadOnchainAI({ functionName: "owner" }));
</script>

<div class="p-4">
  owner = {onChainAI.owner}
</div>

<div class="p-4">
  owner = {owner}
</div>

<div class="p-4">
  dataOwner = {dataOwner}
</div>
