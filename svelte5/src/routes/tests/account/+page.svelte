<script lang="ts">
  import { Account } from "$lib/wagmi/classes";
  const account = new Account();

  $inspect("PAGE account", account.chainId, account.address);
</script>

<div class="p-4">
  chainId = {account.chainId}
</div>

<div class="p-4">
  balance = {account.balance}
  {account.symbol} ({account.decimals})
</div>

<div class="p-4">
  address = {account.address} / {account.ensName} / {account.ensAvatar}
</div>
