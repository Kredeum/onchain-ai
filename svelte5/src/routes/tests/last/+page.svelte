<script lang="ts">
  import { createOnchainAI } from "$lib/onchain-ai/runes";
  import { LastInteraction } from "$lib/onchain-ai/components";
  import type { Address } from "viem";

  const { account } = $derived.by(createOnchainAI) as { account: Address };
</script>

<LastInteraction {account} />
