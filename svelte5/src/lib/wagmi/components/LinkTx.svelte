<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  const short = (addr: `0x${string}`) => addr?.slice(0, 8) + "..." + addr?.slice(-6);

  const {
    hash,
    description = short(hash),
    message
  }: { hash: `0x${string}`; description?: string; message?: string } = $props();

  const href = $derived(hash && targetNetwork.explorer ? `${targetNetwork.explorer}/tx/${hash}` : "");
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
