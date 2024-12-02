<script lang="ts">
  import { OnChainAI } from "$lib/onchain-ai/classes";
  import { SmartContract } from "$lib/wagmi/classes";
  import { onMount } from "svelte";

  // const onChainAI = new OnChainAI();
  const contract = new SmartContract("OnChainAIv1");
  const owner = $derived(contract.call("owner"));

  // $inspect("OnChainAI onChainAI.owner", onChainAI.owner);
  // $inspect("OnChainAI owner", owner);
</script>

<!-- <div class="p-4">
  owner = {onChainAI.owner}
</div> -->

<div class="p-4">
  owner = {owner}
</div>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => contract.asyncCall("owner")}>Get Owner</button>
</div>
