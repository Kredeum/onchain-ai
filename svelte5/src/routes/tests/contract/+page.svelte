<script lang="ts">
  import { OnChainAI } from "$lib/onchain-ai/classes";
  import { MockRouter } from "$lib/onchain-ai/classes";

  const onChainAI = new OnChainAI();
  const mockRouter = new MockRouter();
</script>

<div class="p-4">
  owner = {onChainAI.owner}
</div>
<div class="p-4">
  price = {onChainAI.price}
</div>

{#if mockRouter.addressOnChainAI}
  <div class="p-4">
    counter = {mockRouter.counter}
  </div>
  <div class="p-4">
    addressOnChainAI = {mockRouter.addressOnChainAI}
  </div>
  <div class="p-4">
    consumer.allowed = {mockRouter.getConsumer(mockRouter.addressOnChainAI)?.allowed}
  </div>
{/if}
