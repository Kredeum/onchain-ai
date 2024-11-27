<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { createTargetNetwork } from "$lib/scaffold-eth/runes";

  const { address, description = "address" }: { address?: `0x${string}`; description?: string } = $props();

  const targetNetwork = $derived.by(createTargetNetwork());

  const explorer = $derived(targetNetwork.blockExplorers?.default);
  const href = $derived(address && explorer ? `${explorer}/address/${address}` : "");
</script>

<Link {href} {description} />
