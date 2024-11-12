<script lang="ts">
  import type { Address } from "viem";
  import { createContract } from "$lib/wagmi/runes/";
  import { LastInteraction } from "$lib/onchain-ai/components";

  const { account } = $derived.by(() => createContract("OnChainAIv1")) as { account: Address };
</script>

<LastInteraction {account} />
