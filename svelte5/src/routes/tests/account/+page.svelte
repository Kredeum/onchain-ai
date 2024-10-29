<script lang="ts">
  import { createAccount } from "$lib/wagmi/runes/account.svelte";
  import { createBalance } from "$lib/wagmi/runes/balance.svelte";
  import type { GetBalanceReturnType } from "@wagmi/core";

  const { account } = $derived(createAccount());
  const { chainId, address } = $derived(account);

  const { balance } = $derived(createBalance({ chainId, address }));

  $inspect("PAGE account", account);
  $inspect("PAGE balance", balance);
</script>

<div class="p-4">
  chainId = {chainId}
</div>
<div class="p-4">
  address = {address}
</div>
<div class="p-4">
  balance = {(balance as GetBalanceReturnType)?.value}
</div>
