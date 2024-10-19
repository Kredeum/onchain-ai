<script lang="ts">
  import { untrack } from "svelte";
  import { createReadContract } from "wagmi-svelte";
  import { createOnchainAI } from "../runes/contract.svelte";

  type InteractionType = { requestId: string; prompt: string; response: string };
  type ReadType = [string, string, string];

  let {
    lastInteraction = $bindable({ requestId: "", prompt: "", response: "" }),
    functionName = "lastInteraction",
    refresh = 0
  }: {
    lastInteraction: InteractionType;
    functionName?: string;
    refresh?: number;
  } = $props();

  const { chainId, address, abi } = $derived.by(createOnchainAI);

  const readContract = $derived.by(
    createReadContract(() => ({
      chainId,
      address,
      abi,
      functionName
    }))
  );

  $effect(() => {
    console.log("<Read $effect ~ reRead");
    [lastInteraction.requestId, lastInteraction.prompt, lastInteraction.response] =
      readContract?.data as ReadType;
  });

  $effect(() => {
    refresh;
    console.log("<Read $effect ~ refetch");
    untrack(() => readContract?.refetch());
  });
</script>
