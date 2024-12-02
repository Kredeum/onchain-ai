<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { BlockChain, Watcher } from "$lib/wagmi/classes";

  const blockChain = new BlockChain();
  const watcher = new Watcher(blockChain.getBlockNumber);

  $inspect("PAGE BLOCK chainId", targetNetwork.id);
  $inspect("PAGE BLOCK blockNumber:", blockChain.blockNumber);
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

<div class="p-4">
  <button class="btn btn-info" onclick={() => (watcher.id ? watcher.unwatch() : watcher.watch())}>
    {watcher.id ? `Unwatch ${watcher.id}` : "Watch"}
  </button>
</div>
