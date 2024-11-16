<script lang="ts">
  import { Connect } from "$lib/wagmi/components";
  import { createAccount } from "$lib/wagmi/runes";

  let chainId = $state(undefined);
  let address = $state(undefined);

  let { account } = $derived(createAccount());

  $inspect("PAGE connect bind:", chainId, address);
  $inspect("PAGE connect account:", account?.chainId, account?.address);
</script>

<div class="p-8">
  <Connect bind:chainId bind:address />
</div>

<div class="px-8">
  address: {address}
</div>
<div class="px-8">
  chainId: {chainId}
</div>

<div class="px-8">
  account: {account?.address}
</div>

<div class="px-8">
  account: {account?.chainId}
</div>
