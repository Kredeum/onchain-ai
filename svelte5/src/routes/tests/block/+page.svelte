<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { Network, Watcher } from "$lib/wagmi/classes";

  const blockChain = new Network(targetNetwork.id);

  $inspect("PAGE BLOCK blockNumber:", blockChain.chainId, blockChain.blockNumber);
</script>

<div class="p-4">
  blockNumber = {blockChain.blockNumber}
</div>

<div class="p-4">
  <button
    class="btn btn-info"
    onclick={() => (blockChain.watchingBlockNumber ? blockChain.unwatchBlockNumber?.() : blockChain.watchBlockNumber())}
  >
    {blockChain.watchingBlockNumber ? "Unwatch" : "Watch"}
  </button>
</div>
