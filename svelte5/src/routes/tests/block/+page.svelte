<script lang="ts">
  import { targetNetwork } from "$lib/wagmi/classes";
  import { BlockChain, Watcher } from "$lib/wagmi/classes";

  const blockChain = new BlockChain();

  $inspect("PAGE BLOCK blockNumber:", targetNetwork.id, blockChain.blockNumber);
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
