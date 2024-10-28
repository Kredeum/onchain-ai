<script lang="ts">
  import { createAccount } from "$lib/wagmi/runes/account.svelte";

  const { address, chainId } = $derived.by(createAccount());
</script>

<div class="p-4">
  address = {address}
</div>
<div class="p-4">
  chainId = {chainId}
</div>
