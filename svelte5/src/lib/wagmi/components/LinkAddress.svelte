<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { createChainId } from "$lib/scaffold-eth/runes";
  import { readConfig } from "@onchain-ai/common";

  const { address, description = "address" }: { address?: `0x${string}`; description?: string } = $props();

  const { chainIdCurrent } = $derived.by(createChainId);
  const config = $derived(readConfig(chainIdCurrent));

  const href = $derived(address ? `${config.explorer}/address/${address}` : "");
</script>

<Link {href} {description} />
