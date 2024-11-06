import { type Abi } from "abitype";
import { type Address } from "viem";
import { readDeployments, readConfig } from "@onchain-ai/common";
import { createTargetNetworkId } from "$lib/scaffold-eth/runes";
import { createPublicClient, createAccount } from "$lib/wagmi/runes";

const createOnchainAI = () => {
  const client = $derived.by(createPublicClient());
  const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
  const { address, abi } = $derived(readDeployments(chainId)?.OnChainAIv1);
  const { account } = $derived(createAccount());
  const { address: acountAddress } = $derived(account);
  const config = $derived(readConfig(chainId));

  // $inspect("createOnchainAI chainId", chainId)

  return {
    get client() {
      return client;
    },
    get chainId() {
      return chainId;
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
