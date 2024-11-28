<script lang="ts">
  import { SmartContract } from "$lib/wagmi/classes";
  import { createReadOnchainAI } from "$lib/onchain-ai/runes/read.svelte";

  let { data: owner } = $derived(createReadOnchainAI({ functionName: "owner" }));
  $inspect("owner", JSON.stringify(owner, null, 2));

  const smartContract = new SmartContract("OnChainAIv1");

  let refresh = $state<number>();
  let data = $state();

  const smartContractCall = async () => (data = await smartContract.call({ functionName: "owner" }));

  $effect(() => {
    refresh;
    smartContractCall();
  });

  $inspect("data", data);
</script>

<div class="p-4">
  data = {smartContract.dataRead}
</div>

<div class="p-4">
  owner = {owner}
</div>

<div class="p-4">
  <button class="btn btn-primary" onclick={smartContractCall}>Refresh</button>
</div>
