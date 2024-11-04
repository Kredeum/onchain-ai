<script lang="ts">
  import deployments from "$lib/deployments.json";

  console.log("deployments:", deployments);
</script>

<div class="p-8">
  {#each Object.entries(deployments) as [chainId, chain]}
    <p>{chain.OnChainAIv1.address} {chainId}</p>
  {/each}
</div>
