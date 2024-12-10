<script lang="ts">
  import { InputBase } from "$lib/scaffold-eth/components";
  import { OnChainAI } from "../classes";

  let { hash = $bindable() }: { hash?: `0x${string}` } = $props();

  let prompt: string = $state("");

  const onChainAI = new OnChainAI();

  const sendRequest = async () => {
    try {
      hash = await onChainAI.send("sendRequest", [prompt], 10n ** 14n);
      if (!hash) return;

      console.log("handleSend ~ hash:", hash);

      const txReceipt = await onChainAI.wait(hash);
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

  <button id="ask-button" class="btn btn-primary btn-sm h-10 rounded-full ml-4" onclick={sendRequest}>
    <span class="text-lg">Send</span>
  </button>
</div>
