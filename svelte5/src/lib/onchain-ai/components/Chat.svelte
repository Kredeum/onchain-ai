<script lang="ts">
  import { Interactions, type InteractionType } from "$lib/onchain-ai/classes";
  import { Interaction } from "$lib/onchain-ai/components";
  import { Account } from "$lib/wagmi/classes";

  const account = new Account();
  const sender = $derived(account.address);

  const limit = 3;
  const interactions = new Interactions({ limit });

  const noMore = $derived(interactions.count >= interactions.max);
  const more = () => (interactions.limit += limit);

  const all = $derived(!interactions.sender);
  const toggleAll = () => (interactions.sender = all ? account.address : null);

  const disabled = $derived(all && !account.address);

  $inspect("interactions:", interactions);

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
  {#each interactions.list as interaction, index}
    <Interaction interaction={interaction as unknown as InteractionType} {index} />
  {:else}
    <div class="p-6 m-12 text-center rounded-lg bg-base-200">
      <em> No questions yet </em>
    </div>
  {/each}
</div>

<div class="flex py-4 justify-center">
  <button class="btn btn-sm h-10 rounded-full mx-4" {disabled} onclick={toggleAll}>
    {all ? "My" : "All"} questions
  </button>

  <button class="btn btn-sm h-10 rounded-full mx-4" disabled={noMore} onclick={more}>
    More questions
    <div>{interactions.count}/{interactions.max}</div>
  </button>
</div>
