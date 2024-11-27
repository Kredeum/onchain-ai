<script lang="ts">
  import { InputBase } from "$lib/scaffold-eth/components";
  import { createWriteOnchainAI } from "$lib/onchain-ai/runes";

  let { hash = $bindable() }: { hash?: `0x${string}` } = $props();

  let txReceipt = $state();
  let prompt: string = $state("");

  const { send, wait } = $derived(
    createWriteOnchainAI({ functionName: "sendRequest", args: [prompt], value: 10n ** 14n })
  );

  const handleSend = async () => {
    try {
      hash = await send();
      if (!hash) return;

      console.log("handleSend ~ hash:", hash);

      txReceipt = await wait(hash);
      console.log("handleSend ~ txReceipt:", txReceipt);
    } catch (e) {
      console.error(`Transaction KO ${e}`);
    }
  };
</script>

<div class="flex justify-center">
  <div id="ask-input" class="w-full max-w-xl">
    <InputBase name="Prompt" placeholder="Enter your question" onchange={(input) => (prompt = input)} value={prompt} />
  </div>

  <button id="ask-button" class="btn btn-primary btn-sm h-10 rounded-full ml-4" onclick={handleSend}>
    <span class="text-lg">Send</span>
  </button>
</div>
