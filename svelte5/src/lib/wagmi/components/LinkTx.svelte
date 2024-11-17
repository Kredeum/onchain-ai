<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { createChainId } from "$lib/scaffold-eth/runes";
  import { readConfig } from "@onchain-ai/common";

  const short = (addr: `0x${string}`) => addr?.slice(0, 8) + "..." + addr?.slice(-6);

  const {
    hash,
    description = short(hash),
    message
  }: { hash: `0x${string}`; description?: string; message?: string } = $props();

  const { chainIdCurrent } = $derived.by(createChainId);
  const config = $derived(readConfig(chainIdCurrent));

  const href = $derived(hash ? `${config.explorer}/tx/${hash}` : "");
</script>

{#if message}
  <div class="flex flex-col">
    <div>{message}</div>
    <div class="pl-1">
      <Link {href} {description} />
    </div>
  </div>
{:else}
  <Link {href} {description} />
{/if}
