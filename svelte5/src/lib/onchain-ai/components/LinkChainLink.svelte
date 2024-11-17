<script lang="ts">
  import { readConfig } from "@onchain-ai/common";
  import { createChainId } from "$lib/scaffold-eth/runes";
  import { Link } from "$lib/wagmi/components";

  const { requestId }: { requestId?: `0x${string}` } = $props();

  const { chainIdCurrent } = $derived.by(createChainId);
  const config = $derived(readConfig(chainIdCurrent));

  const href = $derived(
    `https://functions.chain.link/${config.chainName}/${config.subscriptionId}` +
      (requestId ? `#/side-drawer/request/${requestId}` : "")
  );
</script>

<Link {href} description="chainlink" />
