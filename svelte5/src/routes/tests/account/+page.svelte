<script lang="ts">
  import { Balance, Account } from "$lib/wagmi/classes";

  const account = new Account("acc");
  const balance = new Balance();

  $effect(() => {
    balance.address = account.address;
  });

  $inspect("PAGE account", account.chainId, account.address);
</script>

<div class="p-4">
  chainId = {account.chainId}
</div>

<div class="p-4">
  address = {account.address}
</div>

<div class="p-4">
  balance = {balance?.value}
</div>
