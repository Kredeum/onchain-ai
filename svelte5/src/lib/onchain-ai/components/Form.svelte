<script lang="ts">
  import { InputBase } from "$lib/scaffold-eth/components";
  import { createWriteOnchainAI } from "$lib/onchain-ai/runes";
  import { notification } from "$lib/scaffold-eth/ts";
  import { createChainId } from "$lib/scaffold-eth/runes";
  import { readConfig } from "@onchain-ai/common";
  import { Explorer } from "$lib/onchain-ai/components";

  let { txHash = $bindable() }: { txHash?: `0x${string}` } = $props();

  const { chainIdCurrent } = $derived.by(createChainId);
  const config = $derived(readConfig(chainIdCurrent));

  let txReceipt = $state();
  let prompt: string = $state("");

  const { send, wait } = $derived(
    createWriteOnchainAI({ functionName: "sendRequest", args: [prompt], value: 10n ** 14n })
  );

  const handleSend = async () => {
    try {
      txHash = await send();
      if (!txHash) return;

      console.log("handleSend ~ txHash:", txHash);
      let notificationId = notification.info(`Transaction in progress...`);

      txReceipt = await wait(txHash);
      console.log("handleSend ~ txReceipt:", txReceipt);

      notification.remove(notificationId);
      notification.success(`Transaction OK`);
    } catch (e) {
      notification.error(`Transaction ${e}`);
    }
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
