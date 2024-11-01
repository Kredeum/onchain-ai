<script lang="ts">
  import { createReadOnchainAI } from "$lib/onchain-ai/runes/read.svelte";

  let { data: owner } = $derived(createReadOnchainAI({ functionName: "owner" }));

  $inspect("owner", JSON.stringify(owner, null, 2));
</script>

<div class="p-4">
  owner = {owner}
</div>
