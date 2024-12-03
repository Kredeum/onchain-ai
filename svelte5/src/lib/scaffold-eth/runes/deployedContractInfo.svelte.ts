import { targetNetwork } from "$lib/scaffold-eth/classes";
import { createPublicClient } from "$lib/wagmi/runes";
import { ContractCodeStatus, contracts, type Contract, type ContractName } from "$lib/scaffold-eth/ts";
import type { Address } from "viem";

export const createDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const publicClient = $derived.by(createPublicClient());

  const deployedContract = $derived(targetNetwork.id ? contracts?.[targetNetwork.id]?.[contractName] : undefined);
  let status = $state(ContractCodeStatus.LOADING);

  // $inspect("CREATE DEPLOYED INFOS ~ chainIdCurrent (status)", targetNetwork.id, contractName, status);

  $effect(() => {
    const checkContractDeployment = async () => {
      if (!(deployedContract && publicClient)) {
        status = ContractCodeStatus.NOT_FOUND;
        return;
      }

      const code = await publicClient.getCode({
        address: deployedContract.address as Address
      });

      if (!code || code === "0x") {
        status = ContractCodeStatus.NOT_FOUND;
        return;
      }
      status = ContractCodeStatus.DEPLOYED;
    };

    checkContractDeployment();
  });

  return {
    get data() {
      return status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined;
    },
    get isLoading() {
      return status === ContractCodeStatus.LOADING;
    }
  };
};
