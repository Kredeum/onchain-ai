<script lang="ts">
  import { InputBase } from "$lib/scaffold-eth/components";
  import { createOnchainAI, createWriteOnchainAI } from "$lib/onchain-ai/runes";
  import { createConfig, createWriteContract } from "$lib/wagmi/runes";

  let { tx = $bindable() } = $props();

  let prompt: string = $state("");

  const writeContract = $derived(
    createWriteOnchainAI({ functionName: "sendRequest", args: [prompt], value: 10n ** 14n })
  );

  const handleSend = async () => {
    if (!writeContract) return;

    tx = await writeContract.send();
  };
</script>

<div class="flex justify-center">
  <div class="w-full max-w-xl">
    <InputBase
      name="Prompt"
      placeholder="Enter your question"
      onchange={(input) => (prompt = input)}
      value={prompt}
    />
  </div>

  <button class="btn btn-primary btn-sm h-10 rounded-full ml-4" onclick={handleSend}>
    <span class="text-lg">Send</span>
  </button>
</div>
