<script lang="ts">
  import { LinkAddress, LinkTx } from "$lib/wagmi/components";
  import { LinkChainLink } from "$lib/onchain-ai/components";

  const { hash, address, requestId }: { hash?: `0x${string}`; address?: `0x${string}`; requestId?: `0x${string}` } =
    $props();
</script>

<div class="text-gray-300">
  view
  {#if address}
    <LinkAddress {address} description="contract" />,
  {/if}
  {#if hash}
    <LinkTx {hash} description="last transaction" />,
  {/if}
  {#if requestId}
    <LinkChainLink {requestId} />
  {/if}
</div>
