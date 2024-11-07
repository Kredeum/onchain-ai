<script lang="ts">
  import { isAddress, type Address } from "viem";
  import { type InteractionType } from "$lib/onchain-ai/ts";
  import { Interaction } from "$lib/onchain-ai/components";
  import { LastInteraction } from "$lib/onchain-ai/runes/lastInteraction.svelte";

  const { account }: { account: Address } = $props();

  let data = $derived(new LastInteraction(account));

  // $inspect("<LastInteraction", data.lastInteraction);
</script>

<div class="flex flex-col p-4 m-12 max-w-lg rounded-lg shadow-md bg-base-300">
  <Interaction interaction={data.lastInteraction} />
</div>
