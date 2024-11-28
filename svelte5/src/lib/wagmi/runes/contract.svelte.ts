import { type Abi } from "abitype";
import { type Address } from "viem";
import { type DeploymentContractName, readDeploymentContract } from "@onchain-ai/common";
import { targetNetwork } from "$lib/scaffold-eth/runes";
import { createPublicClient, createAccount } from "$lib/wagmi/runes";

const createContract = (name: DeploymentContractName) => {
  const client = $derived.by(createPublicClient());
  const { address, abi } = $derived(readDeploymentContract(targetNetwork.id, name));
  const { account } = $derived(createAccount());
  const { address: acountAddress } = $derived(account);

  // $inspect("createContract chainId", chainId)

  return {
    get client() {
      return client;
    },
    get chainId() {
      return targetNetwork.id;
    },
    get address() {
      return address as Address;
    },
    get abi() {
      return abi as Abi;
    },
    get account() {
      return acountAddress;
    }
  };
};

export { createContract };
