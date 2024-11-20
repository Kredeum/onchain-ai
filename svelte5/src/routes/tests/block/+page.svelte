<script lang="ts">
  import { BlockNumber } from "$lib/wagmi/runes";

  const block = new BlockNumber();
  $inspect("block:", block.latest);
</script>

<div class="p-4">
  blockNumber = {block.latest} ...
</div>

<div class="p-4">
  <button class="btn btn-info" onclick={() => (block.watching ? block.unwatch?.() : block.watch())}>
    {block.watching ? "Unwatch" : "Watch"}
  </button>
</div>
