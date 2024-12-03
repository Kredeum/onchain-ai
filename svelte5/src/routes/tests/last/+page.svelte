<script lang="ts">
  import { OnChainAI } from "$lib/onchain-ai/classes";
  import { LastInteraction } from "$lib/onchain-ai/components";
  import { Account } from "$lib/wagmi/classes";

  const account = new Account();
  const onChainAI = new OnChainAI();
</script>

{#if account.address}
  <div class="p-4">
    owner: {onChainAI.owner}<br />
  </div>

  <div class="p-4">
    {JSON.stringify(onChainAI.lastInteraction(account?.address), null, 2)}
  </div>

  <LastInteraction account={account.address} />
{:else}
  <p class="p-4">No account address found</p>
{/if}
