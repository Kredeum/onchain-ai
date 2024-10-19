import type { Address } from "viem";
import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { readDeployments } from "@onchain-ai/common/lib/readJson";
import {  readConfig } from "@onchain-ai/common/lib/readJson";

const createOnchainAI = () => {
  const { targetNetworkId  } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(targetNetworkId).OnChainAIv1);
  const config = $derived(readConfig(targetNetworkId));

  return {
    get chainId() { return targetNetworkId; },
    get address() { return address as Address; },
    get config() { return config; },
    get abi() { return abi; }
  };
};

export { createOnchainAI };
