import { type Abi } from "abitype";
import { type Address } from "viem";
import { type DeploymentContractName, readDeploymentContract } from "@onchain-ai/common";
import { targetNetwork } from "$lib/scaffold-eth/classes";
import { Account, wagmi } from "$lib/wagmi/classes";

const createContract = (name: DeploymentContractName) => {
  const client = wagmi.publicClient;
  const { address, abi } = $derived(readDeploymentContract(targetNetwork.id, name));
  const account = new Account();

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
      return account.address;
    }
  };
};

export { createContract };
