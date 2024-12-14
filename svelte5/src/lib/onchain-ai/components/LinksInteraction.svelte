<script lang="ts">
  import { LinkAddress, LinkTx } from "$lib/wagmi/components";
  import { LinkChainLink } from "$lib/onchain-ai/components";
  import type { Nullable } from "$lib/wagmi/ts";
  import type { Address } from "viem";

  const { hash, address, requestId }: { hash?: `0x${string}`; address?: Nullable<Address>; requestId?: `0x${string}` } =
    $props();
</script>

<div class="flex flex-row text-gray-300 space-x-2">
  {#if address}
    <span>| view</span>
    <LinkAddress {address} description="contract" />
  {/if}

  {#if hash}
    <span>| view</span> <LinkTx {hash} description="last transaction" />
  {/if}

  {#if requestId}
    <span>| view on</span>
    <LinkChainLink {requestId} />
  {/if}

  <span>|</span>
</div>
