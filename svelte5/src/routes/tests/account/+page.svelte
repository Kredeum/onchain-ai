<script lang="ts">
  import { createAccount, createEnsName, createEnsAvatar, createEnsAddress } from "$lib/wagmi/runes";
  import { Balance, BlockChain } from "$lib/wagmi/classes";
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  const { account } = $derived(createAccount());
  const { chainId, address } = $derived(account);

  const balance = $derived(address && new Balance({ address }));
  const { ensName } = $derived(createEnsName(address));
  const { ensAvatar } = $derived(createEnsAvatar(ensName));
  const { ensAddress } = $derived(createEnsAddress(ensName));
  const blockChain = new BlockChain();

  $inspect("PAGE account", account);
  $inspect("PAGE balance", balance);
  // $inspect("PAGE ensName", ensName);
</script>

<div class="p-4">
  chainId = {targetNetwork.id}
  {chainId} #{blockChain?.blockNumber}
</div>
<div class="p-4">
  address = {address}
  {ensAddress}
  {ensName}
  <img src={ensAvatar} width="64" alt={ensName} />
</div>
<div class="p-4">
  balance = {balance?.value}
</div>
