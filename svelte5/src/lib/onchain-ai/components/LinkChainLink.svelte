<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { ChainLink } from "$lib/onchain-ai/runes";

  const { requestId }: { requestId?: `0x${string}` } = $props();

  const chainLink = new ChainLink({ requestId });
</script>

<span class="text-gray-400 italic">
  <Link href={chainLink?.href} description="ChainLink" />
</span>
