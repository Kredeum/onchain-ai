import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { readDeployments } from "@onchain-ai/common/lib/readJson";
import type { Address } from "viem";

const createOnchainAI = () => {
  const { targetNetworkId  } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(targetNetworkId).OnChainAIv1);

  return {
    get chainId() { return targetNetworkId; },
    get address() { return address as Address; },
    get abi() { return abi; }
  };
};

export { createOnchainAI };
