import { type Abi } from "abitype";
import { type Address } from "viem";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes/global.svelte";
import { readDeployments } from "@onchain-ai/common/lib/readJson";
import { readConfig } from "@onchain-ai/common/lib/readJson";
import { createPublicClient, createAccount } from "$lib/wagmi/runes";

const createOnchainAI = () => {
  const client = $derived.by(createPublicClient());
  const { targetNetworkId } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(targetNetworkId)?.OnChainAIv1);
  const { account } = $derived(createAccount());
  const { address: acountAddress } = $derived(account);
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
      return acountAddress;
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
