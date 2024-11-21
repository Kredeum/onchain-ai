<script lang="ts">
  import {
    createAccount,
    createBalance,
    createEnsName,
    createEnsAvatar,
    createEnsAddress,
    BlockNumber
  } from "$lib/wagmi/runes";
  import { Balance } from "$lib/scaffold-eth/components";

  import type { GetBalanceReturnType } from "@wagmi/core";

  const { account } = $derived(createAccount());
  const { chainId, address } = $derived(account);

  const { balance } = $derived(createBalance({ address }));
  const { ensName } = $derived(createEnsName(address));
  const { ensAvatar } = $derived(createEnsAvatar(ensName));
  const { ensAddress } = $derived(createEnsAddress(ensName));
  const { latest: blockNumber } = new BlockNumber();

  $inspect("PAGE account", account);
  $inspect("PAGE balance", balance);
  // $inspect("PAGE ensName", ensName);
</script>

<Balance {address} />

<div class="p-4">
  chainId = {chainId} #{blockNumber}
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
