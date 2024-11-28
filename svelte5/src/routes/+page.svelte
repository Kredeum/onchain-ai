<script lang="ts">
  import { Chat, Form, LinksInteraction } from "$lib/onchain-ai/components";
  import { createContract } from "$lib/wagmi/runes/";

  const { address } = $derived.by(() => createContract("OnChainAIv1"));
  let hash: `0x${string}` | undefined = $state();
</script>

<div class="flex flex-col items-center">
  <h1>
    <span class="block text-4xl font-bold p-4">Ask? OnChainAI</span>
  </h1>

  <div class="p-2 w-full max-w-lg">
    <Form bind:hash />
  </div>

  <div class="text-center">
    <LinksInteraction {hash} {address} />
  </div>

  <div class="pt-4 w-full max-w-lg">
    <Chat />
  </div>

  <div class="flex-grow bg-base-300 w-full mt-12 px-8 py-12">
    <div class="flex justify-center gap-12 flex-col sm:flex-row">
      <div class="flex flex-col bg-base-100 px-6 py-6 text-gray-400 max-w-md rounded-3xl">
        <em> Keep your question simple and request for short answers unless ChainLink consensus will fail </em>
      </div>
      <div class="flex flex-col bg-base-100 px-6 py-6 text-gray-400 max-w-md rounded-3xl">
        <em> Costs 0.0001 Eth (~$0.30) per question, in order to cover ChainLink LINK and OpenAI API costs </em>
      </div>
    </div>
    <div class="flex justify-center gap-12 flex-col sm:flex-row pt-6">
      <div class="flex flex-col bg-base-100 px-6 py-6 text-gray-400 max-w-md rounded-3xl">
        <em>
          OpenAI key needed to make OnChainAI working is stored securely on ChainLink Decentralized Oracle Network
          (DON).
        </em>
      </div>
      <div class="flex flex-col bg-base-100 px-6 py-6 text-gray-400 max-w-md rounded-3xl">
        <em>
          Use mainnet BASE network to get valid OpenAI key. On testnets availability is not garanted, so OnChainAI may
          not work.
        </em>
      </div>
    </div>
  </div>
</div>
