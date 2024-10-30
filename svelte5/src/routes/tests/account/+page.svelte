<script lang="ts">
  import {
    createAccount,
    createBalance,
    createEnsName,
    createEnsAvatar,
    createEnsAddress
  } from "$lib/wagmi/runes";
  import type { GetBalanceReturnType } from "@wagmi/core";

  const { account } = $derived(createAccount());
  const { chainId, address } = $derived(account);

  const { balance } = $derived(createBalance({ chainId, address }));
  const { ensName } = $derived(createEnsName({ address }));
  const { ensAvatar } = $derived(createEnsAvatar({ name: ensName }));
  const { ensAddress } = $derived(createEnsAddress({ name: ensName }));

  $inspect("PAGE account", account);
  $inspect("PAGE balance", balance);
  $inspect("PAGE ensName", ensName);
</script>

<div class="p-4">
  chainId = {chainId}
</div>
<div class="p-4">
  address = {address}
  {ensAddress}
  {ensName}
  <img src={ensAvatar} width="64" alt={ensName} />
</div>
<div class="p-4">
  balance = {(balance as GetBalanceReturnType)?.value}
</div>
