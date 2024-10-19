<script lang="ts">
  import { untrack } from "svelte";
  import { createReadContract } from "wagmi-svelte";
  import { createOnchainAI } from "../runes/contract.svelte";

  let { functionName = "lastInteraction", refresh = 0, interaction = $bindable() } = $props();

  const { chainId, address, abi } = $derived.by(createOnchainAI);

  const readContract = $derived.by(
    createReadContract(() => ({
      address,
      abi,
      functionName,
      chainId
    }))
  );

  $effect(() => {
    console.log("<Read $effect ~ reRead");
    interaction = readContract?.data as [string, string, string];
  });

  $effect(() => {
    refresh;
    console.log("<Read $effect ~ refetch");
    untrack(() => readContract?.refetch());
  });
</script>
