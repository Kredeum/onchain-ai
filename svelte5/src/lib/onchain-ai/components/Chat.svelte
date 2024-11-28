<script lang="ts">
  import { createInteractions, createWriteOnchainAI } from "$lib/onchain-ai/runes";
  import { createContract, createWriteContract } from "$lib/wagmi/runes";
  import { Interaction } from "$lib/onchain-ai/components";

  const lim = 3;
  let all: boolean = $state(true);
  let limit: number = $state(lim);

  const { account, chainId, address, abi } = $derived.by(() => createContract("MockRouter"));

  const { interactions, interactionsMax } = $derived(createInteractions({ all, limit }));

  let noMore = $derived(limit >= interactionsMax);
  let interactionsCount = $derived(interactions.length);

  let disabled = $derived(all && !account);

  const lastInteraction = $derived(interactions?.[0]);
  const missingResponse = $derived(!lastInteraction.response);

  let hash = $state<`0x${string}`>();
  let txReceipt = $state();
  const { send, wait } = $derived(
    createWriteContract({
      chainId,
      address,
      abi,
      functionName: "fulfillRequest",
      args: [lastInteraction.requestId, "0x32" /*`Response to ${lastInteraction.prompt}`*/, ""]
    })
  );

  const handleSend = async () => {
    try {
      console.log("handleSend");

      hash = await send();
      if (!hash) return;

      console.log("handleSend ~ hash:", hash);

      txReceipt = await wait(hash);
      console.log("handleSend ~ txReceipt:", txReceipt);
    } catch (e) {
      console.error(`Transaction KO ${e}`);
    }
  };

  // let done = false;
  // $effect(() => {
  //   if (done) return;
  //   if (!lastInteraction) return;
  //   if (missingResponse) {
  //     done = true;
  //     handleSend();
  //     // alert(`I wait for some response to '${lastInteraction.prompt}' ${lastInteraction.requestId}`);
  //   }
  // });

  $inspect("ABI", chainId, abi);
</script>

<div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
  {#if interactionsCount === 0}
    <div class="p-6 m-12 text-center rounded-lg bg-base-200">
      <em> No questions yet </em>
    </div>
  {/if}

  {#each interactions as interaction, index}
    <Interaction {interaction} {index} />
  {/each}
</div>

<div class="flex py-4 justify-center">
  <button
    class="btn btn-sm h-10 rounded-full mx-4"
    {disabled}
    onclick={() => {
      all = !all;
    }}
  >
    {all ? "My" : "All"} questions
  </button>

  <button
    class="btn btn-sm h-10 rounded-full mx-4"
    disabled={noMore}
    onclick={() => {
      limit += lim;
    }}
  >
    More questions
    <div>{interactionsCount}/{interactionsMax}</div>
  </button>
</div>
