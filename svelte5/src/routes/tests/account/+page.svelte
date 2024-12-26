<script lang="ts">
  import { Account } from "@kredeum/wagmi-svelte5";
  const account = new Account({ watchBalance: true, ens: true });

  $inspect("PAGE account", account.chainId, account.address);
</script>

{#if account.address}
  <div class="p-4">
    chainId = {account.chainId}
  </div>

  <div class="p-4">
    balance =
    {account.balance}
    {account.symbol} ({account.decimals})
  </div>

  <div class="p-4">
    address = {account.address} / {account.ensName} / {account.ensAvatar}
  </div>
{/if}
