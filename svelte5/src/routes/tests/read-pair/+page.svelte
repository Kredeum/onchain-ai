<script lang="ts">
  import { createTargetNetworkId } from "$lib/runes/global.svelte";
  import { readDeployments } from "@onchain-ai/common/lib/readJson";
  import { createReadContract } from "wagmi-svelte";

  const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(chainId).OnChainAIv1);
  const functionNamePair = ["lastPrompt", "lastResponse"];

  let functionName = $state(functionNamePair[0]);

  const readContract = $derived.by(
    createReadContract(() => ({
      address,
      abi,
      functionName,
      chainId
    }))
  );

  const readLastResponse = { data: "LR" }; // $derived.by(createReadOnChainAI);

  const functionNameToggle = () => {
    return functionName === functionNamePair[0] ? functionNamePair[1] : functionNamePair[0];
  };

  const handleRefresh = async () => {
    functionName = functionNameToggle();
  };
</script>

<div class="px-12 py-12">
  <h1 class="text-4xl">
    {readContract?.data}
  </h1>
  <h1 class="text-4xl">
    {readLastResponse?.data}
  </h1>
  <button
    class="btn btn-secondary btn-sm"
    onclick={handleRefresh}
    disabled={readContract?.isFetching}
  >
    {functionNameToggle()}
  </button>
</div>
