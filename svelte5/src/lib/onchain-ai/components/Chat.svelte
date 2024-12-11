<script lang="ts">
  import { Interactions, type InteractionType } from "$lib/onchain-ai/classes";
  import { Interaction } from "$lib/onchain-ai/components";
  import { Account } from "$lib/wagmi/classes";

  const limit = 3;
  const interactions = new Interactions({ limit });
  const noMore = $derived(interactions.count >= interactions.max);
  const disabled = false;
  const toggleAll = () => {};
  const all = true;
  $inspect("interactions:", interactions);

  // const account = new Account();
  // const all = $derived(!interactions.sender);
  // const disabled = $derived(all && !account.address);
  // const toggleAll = () => (interactions.sender = all ? account.address : null);

  // const missingResponse = $derived(!interactions.last.response);
  // let hash = $state<`0x${string}`>();
  // let txReceipt = $state();
  // const { send, wait } = $derived(
  //   createWriteContract({
  //     chainId,
  //     address,
  //     abi,
  //     functionName: "fulfillRequest",
  //     args: [interactions.last.requestId, "0x32" /*`Response to ${interactions.last.prompt}`*/, ""]
  //   })
  // );

  // const handleSend = async () => {
  //   try {
  //     console.log("handleSend");

  //     hash = await send();
  //     if (!hash) return;

  //     console.log("handleSend ~ hash:", hash);

  //     txReceipt = await wait(hash);
  //     console.log("handleSend ~ txReceipt:", txReceipt);
  //   } catch (e) {
  //     console.error(`Transaction KO ${e}`);
  //   }
  // };

  // let done = false;
  // $effect(() => {
  //   if (done) return;
  //   if (!interactions.last) return;
  //   if (missingResponse) {
  //     done = true;
  //     handleSend();
  //     // alert(`I wait for some response to '${interactions.last.prompt}' ${interactions.last.requestId}`);
  //   }
  // });

  // $inspect("ABI", chainId, abi);
</script>

<div class="flex flex-col p-4 max-w-lg rounded-lg shadow-md bg-base-300">
  {#if interactions.count === 0}
    <div class="p-6 m-12 text-center rounded-lg bg-base-200">
      <em> No questions yet </em>
    </div>
  {/if}

  {#each interactions.list as interaction, index}
    <Interaction interaction={interaction as unknown as InteractionType} {index} />
  {/each}
</div>

<div class="flex py-4 justify-center">
  <button class="btn btn-sm h-10 rounded-full mx-4" {disabled} onclick={toggleAll}>
    {all ? "My" : "All"} questions
  </button>

  <button
    class="btn btn-sm h-10 rounded-full mx-4"
    disabled={noMore}
    onclick={() => {
      interactions.limit += limit;
    }}
  >
    More questions
    <div>{interactions.count}/{interactions.max}</div>
  </button>
</div>
