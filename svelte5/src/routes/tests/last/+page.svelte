<script lang="ts">
  import { OnChainAI } from "$lib/onchain-ai/classes";
  import { LastInteraction } from "$lib/onchain-ai/components";
  import { Account, SmartContract } from "$lib/wagmi/classes";
  import { onMount } from "svelte";

  const counter = $state(0);

  const account = new Account();
  const contract = new SmartContract("OnChainAIv1");
  const owner = $derived(contract.call("owner"));
  const lastInteraction = $derived(contract.call("lastInteraction", [account?.address]));

</script>

{#if account.address}
  <div class="p-4">
    owner: {owner}<br />
    counter: {counter}<br />
    {JSON.stringify(lastInteraction, null, 2)}
  </div>

  <LastInteraction account={account.address} />
{:else}
  <p class="p-4">No account address found</p>
{/if}
