<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  import { OnChainAI } from "$lib/onchain-ai/classes";
  import { MockRouter } from "$lib/onchain-ai/classes";
  import { SmartContract } from "$lib/wagmi/classes";

  // const onChainAI = new SmartContract("OnChainAIv1");
  // const owner = $derived(onChainAI.call("owner"));
  // const price = $derived(onChainAI.call("price"));

  const mockRouter = new SmartContract("MockRouter");
  const counter = $derived(mockRouter.call("counter"));
  const addressOnChainAI = $derived(mockRouter.call("onChainAI"));
</script>

<!--
<div class="p-4">
  owner = {owner}
</div>
<div class="p-4">
  price = {price}
</div> -->

{#if mockRouter}
  <div class="p-4">
    counter = {counter}
  </div>
  <div class="p-4">
    addressOnChainAI = {addressOnChainAI}
  </div>
{/if}
