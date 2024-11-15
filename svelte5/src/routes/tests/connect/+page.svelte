<script lang="ts">
  import { Connect } from "$lib/wagmi/components";
  import { createAccount } from "$lib/wagmi/runes";

  let chainId = $state(undefined);
  let address = $state(undefined);

  let account = createAccount();

  $inspect("<Connect account:", account);
  $inspect("<Connect address:", address);
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
  account: {account?.account.address}
</div>

<div class="px-8">
  account: {account?.account.chainId}
</div>
