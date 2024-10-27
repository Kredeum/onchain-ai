<script lang="ts">
  import { createOnchainAIRead } from "$lib/onchain-ai/runes/read.svelte";

  let { value: owner } = $derived(createOnchainAIRead({ functionName: "owner" }));

  $inspect({ owner });
</script>

<div class="p-4">
  owner = {owner}
</div>
