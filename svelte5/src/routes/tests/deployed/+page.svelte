<script lang="ts">
  import deployments from "$lib/deployments.json";

  console.log("deployments:", deployments);
</script>

<div class="p-8">
  {#each Object.entries(deployments) as [chainId, chain]}
    <strong>{chainId}</strong>
    <p><code>{chain.OnChainAIv1.address}</code> <strong>OnChainAI</strong></p>
    {#if "MockRouter" in chain}
      <p><code>{chain.MockRouter.address}</code> <strong>MockRouter</strong></p>
    {/if}
    {#if "Faucet" in chain}
      <p><code>{chain.Faucet.address}</code> <strong>Faucet</strong></p>
    {/if}
  {/each}
</div>
