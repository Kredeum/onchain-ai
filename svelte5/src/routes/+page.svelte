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

<div class="flex flex-col items-center">
  <h1>
    <span class="block text-4xl font-bold p-4">Ask OnChainAI</span>
  </h1>

  <div class="p-2 w-full max-w-lg">
    <Form bind:tx />
  </div>

  <div class="text-center">
    <Explorer {tx} {address} />
  </div>

  <div class="pt-4 w-full max-w-lg">
    <Chat {refresh} />
  </div>

  <div class="flex-grow bg-base-300 w-full mt-12 px-8 py-12">
    <div class="flex justify-center gap-12 flex-col sm:flex-row">
      <div class="flex flex-col bg-base-100 px-10 py-10 text-gray-300 max-w-md rounded-3xl">
        <em>
          Keep your question simple and request for short answers unless Chainlink consensus will
          fail
        </em>
      </div>
      <div class="flex flex-col bg-base-100 px-10 py-10 items-center max-w-md rounded-3xl">
        <div class="text-gray-300">
          <em>
            Costs 0.0001 Eth (~$0.30) per question, in order to cover Chainlink LINK and OpenAI API costs
          </em>
        </div>
      </div>
    </div>
  </div>
</div>
