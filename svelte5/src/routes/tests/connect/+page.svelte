<script lang="ts">
  import { Account } from "$lib/wagmi/classes";

  const account = new Account();
  let { chainId, address } = $derived(account);

  $inspect("PAGE connect bind:", chainId, address);
</script>

<div class="px-8">
  chainId: {chainId}
</div>

<div class="px-8">
  address: {address}
</div>
