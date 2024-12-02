import { type Abi } from "abitype";
import { type Address } from "viem";
import { type DeploymentContractName, readDeployment } from "@onchain-ai/common";
import { targetNetwork } from "$lib/scaffold-eth/classes";
import { Account, wagmi } from "$lib/wagmi/classes";

const createContract = (name: DeploymentContractName) => {
  if (!name) throw new Error("No contract name provided!");

  const client = wagmi.publicClient;
  const deployment = $derived(readDeployment(targetNetwork.id, name));
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
      return deployment?.address as Address;
    },
    get abi() {
      return deployment?.abi as Abi;
    },
    get account() {
      return account.address;
    }
  };
};

export { createContract };
