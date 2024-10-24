import { type Address, type Abi } from "viem";
import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { readDeployments } from "@onchain-ai/common/lib/readJson";
import { readConfig } from "@onchain-ai/common/lib/readJson";
import { createAccount } from "wagmi-svelte";
import { createPublicClient } from "wagmi-svelte";

const createOnchainAI = () => {
  const client = $derived.by(createPublicClient());
  const { targetNetworkId } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(targetNetworkId).OnChainAIv1);
  const { address: account } = $derived.by(createAccount());
  const config = $derived(readConfig(targetNetworkId));

  return {
    get client() {
      return client;
    },
    get chainId() {
      return targetNetworkId;
    },
    get address() {
      return address as Address;
    },
    get account() {
      return account;
    },
    get config() {
      return config;
    },
    get abi() {
      return abi as Abi;
    }
  };
};

export { createOnchainAI };
