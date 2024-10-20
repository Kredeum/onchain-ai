<script lang="ts">
  import Chat from "$lib/onchain-ai/components/Chat.svelte";
  import Explorer from "$lib/onchain-ai/components/Explorer.svelte";
  import Form from "$lib/onchain-ai/components/Form.svelte";
  import { createOnchainAI } from "$lib/onchain-ai/runes/contract.svelte";
  import { untrack } from "svelte";

  const { address } = $derived.by(createOnchainAI);

  let refresh: number = $state(0);
  let tx: string = $state("");

  $effect(() => {
    tx;
    untrack(() => {
      refresh++;
    });
  });
</script>

<div class="flex flex-col items-center p-4">
  <div class="text-center">
    <h1>
      <span class="block text-4xl font-bold">OnChainAI</span>
    </h1>
  </div>

  <div class="p-6 w-full max-w-md">
    <Form bind:tx />
  </div>

  <div class="text-center">
    <Explorer {tx} {address} />
  </div>

  <div class="p-4 w-full max-w-lg">
    <Chat {refresh} />
  </div>

    <div class="pt-4 text-center">
      <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>
    </div>
</div>
