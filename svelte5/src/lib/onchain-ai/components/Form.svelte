<script lang="ts">
  import { InputBase } from "$lib/components/scaffold-eth/inputs";
  import { createDeployedContractInfo } from "$lib/runes/deployedContractInfo.svelte";
  import { createTransactor, type TransactionFunc } from "$lib/runes/transactor.svelte";
  import { createWriteContract } from "wagmi-svelte";

  let { tx = $bindable("") } = $props();

  const responses: string[] = [];

  let prompt: string = $state("");

  const { data: deployedContractData } = $derived.by(createDeployedContractInfo("OnChainAIv1"));

  let contractWrite = $derived.by(createWriteContract());
  let writeTxn: TransactionFunc = $derived.by(createTransactor());

  const handleSend = async () => {
    try {
      console.log("handleSend ~ deployedContractData:", deployedContractData);
      const makeWriteWithParams = () =>
        contractWrite!.writeContractAsync({
          address: deployedContractData!.address,
          abi: deployedContractData!.abi,
          functionName: "sendRequest",
          args: [prompt],
          value: 10n ** 14n
        });
      tx = await writeTxn?.(makeWriteWithParams);
    } catch (e: unknown) {
      console.error("⚡️ handleSend ~ error", e);
    }
    responses.push();
  };
</script>

<div class="flex justify-center">
  <div class="w-full">
    <InputBase
      name="Prompt"
      placeholder="Enter your prompt"
      onchange={(input) => (prompt = input)}
      value={prompt}
    />
  </div>

  <button class="btn btn-primary btn-sm h-10 rounded-full ml-4" onclick={handleSend}>
    <span class="text-lg">Send</span>
  </button>
</div>
