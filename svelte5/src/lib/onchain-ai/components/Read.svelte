<script lang="ts">
  import { untrack } from "svelte";
  import { createReadContract } from "wagmi-svelte";
  import { createOnchainAI } from "../runes/contract.svelte";

  type InteractionType = { requestId: string; prompt?: string; response: string };
  type ReadType = [string, string, string];

  let {
    lastInteraction = $bindable(),
    functionName = "lastInteraction",
    refresh = 0,
    display = false
  }: {
    lastInteraction?: InteractionType;
    functionName?: string;
    refresh?: number;
    display?: boolean;
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
    if (!(readContract && readContract.data)) return;

    console.log("<Read $effect ~ reRead");
    const [requestId, prompt, response] = readContract.data as ReadType;
    lastInteraction = { requestId, prompt, response };
  });

  $effect(() => {
    refresh;
    console.log("<Read $effect ~ refetch");
    untrack(() => readContract?.refetch());
  });
</script>

{#if display}
  <div class="flex flex-col gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(lastInteraction, null, 2)}</pre>
    </div>
  </div>
{/if}
