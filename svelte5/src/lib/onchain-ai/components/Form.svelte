<script lang="ts">
  import { InputBase } from "$lib/scaffold-eth/components";
  import { createWriteOnchainAI } from "$lib/onchain-ai/runes";

  let { txHash = $bindable() }: { txHash?: `0x${string}` } = $props();

  let txReceipt = $state();
  let prompt: string = $state("");

  const { send, wait, lastTxHash } = $derived(
    createWriteOnchainAI({ functionName: "sendRequest", args: [prompt], value: 10n ** 14n })
  );

  const handleSend = async () => {
    txHash = await send();
    if (!txHash) return;
    console.log("handleSend ~ txHash:", txHash);

    txReceipt = await wait(txHash);
    console.log("handleSend ~ txReceipt:", txReceipt);
  };
</script>

<div class="flex justify-center">
  <div class="w-full max-w-xl">
    <InputBase name="Prompt" placeholder="Enter your question" onchange={(input) => (prompt = input)} value={prompt} />
  </div>

  <button class="btn btn-primary btn-sm h-10 rounded-full ml-4" onclick={handleSend}>
    <span class="text-lg">Send</span>
  </button>
</div>
