<script lang="ts">
  import { onMount } from "svelte";
  import { Counter } from "$lib/onchain-ai/classes";
  import { Account } from "$lib/wagmi/classes";

  const contract = new Counter();
  const account = new Account();

  const refresh = async () => await contract.fetch("number");

  const inc = async () => {
    await contract.sendAsync("increment");
    await refresh();
  };
</script>

<div class="p-4">
  counter = {contract.isFetching ? "??" : contract.number}
</div>

<div class="p-4">
  {contract.balanceOf(account.address)}
</div>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => refresh()}> Refresh </button>
  <button class="btn btn-primary" onclick={() => inc()}> Increment </button>
</div>
