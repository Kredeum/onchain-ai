<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  $inspect("PAGE BLOCK blockNumber:", targetNetwork.chainId, targetNetwork.blockNumber);
</script>

<div class="p-4">
  blockNumber = {targetNetwork.blockNumber}
</div>

<div class="p-4">
  <button
    class="btn btn-info"
    onclick={() => (targetNetwork.watchingBlockNumber ? targetNetwork.unwatchBlockNumber?.() : targetNetwork.watchBlockNumber())}
  >
    {targetNetwork.watchingBlockNumber ? "Unwatch" : "Watch"}
  </button>
</div>
