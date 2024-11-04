<script lang="ts">
  import { createLastInteraction } from "$lib/onchain-ai/runes";
  import { Interaction } from "$lib/onchain-ai/components";
  import type { Address } from "viem";

  const { account }: { account: Address } = $props();

  let { lastInteraction: interaction } = $derived(createLastInteraction(account));

  // $inspect("LastInteraction interaction", interaction);
</script>

<div class="flex flex-col p-4 m-12 max-w-lg rounded-lg shadow-md bg-base-300">
  <Interaction {interaction} />
</div>
