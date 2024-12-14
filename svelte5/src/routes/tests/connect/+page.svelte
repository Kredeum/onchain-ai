<script lang="ts">
  import { Connect } from "$lib/wagmi/components";
  import { Account } from "$lib/wagmi/classes";

  let chainId = $state(undefined);
  let address = $state(undefined);

  const account = new Account();
  let { chainId: chainIdAccount, address: addressAccount } = $derived(account);

  $inspect("PAGE connect bind:", chainId, address);
  $inspect("PAGE connect account:", chainIdAccount, addressAccount);
</script>

<div class="p-8">
  <Connect bind:chainId bind:address />
</div>

<div class="px-8">
  chainId: {chainId}
</div>

<div class="px-8">
  address: {address}
</div>

<div class="px-8">
  chainIdAccount: {chainIdAccount}
</div>

<div class="px-8">
  addressAccount: {addressAccount}
</div>
