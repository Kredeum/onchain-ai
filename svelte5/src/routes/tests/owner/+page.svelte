<script lang="ts">
  import { OnChainAI } from "$lib/onchain-ai/classes";

  const onChainAI = new OnChainAI();

  $inspect("OnChainAI owner", onChainAI.owner);
</script>

<div class="p-4">
  owner = {onChainAI.owner}
</div>
