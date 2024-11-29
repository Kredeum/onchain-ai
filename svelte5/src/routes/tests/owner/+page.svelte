<script lang="ts">
  import { createReadOnchainAI } from "$lib/onchain-ai/runes/read.svelte";
  import { Account, wagmiConfig } from "$lib/wagmi/classes";

  const account = new Account();

  let { data: owner } = $derived(createReadOnchainAI({ functionName: "owner" }));

  $inspect("owner", JSON.stringify(owner, null, 2));
</script>

<div class="p-4">
  owner = {owner} / {account.address}
</div>
