<script lang="ts">
  import { Balance, Account } from "$lib/wagmi/classes";
  import { onMount, untrack } from "svelte";

  const account = new Account();
  let balance = new Balance();

  $effect(() => {
    balance.address = account.address;
  });

  // $inspect("PAGE account", account.chainId, account.address);
  // $inspect("PAGE BALANCE", balance?.value, balance?.address);
</script>

<div class="p-4">
  chainId = {account.chainId}
</div>

<div class="p-4">
  address = {account.address}
</div>

<div class="p-4">
  balance = {balance.value}
</div>
