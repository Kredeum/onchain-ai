import { createChainId, targetNetwork } from "./global.svelte";
import { createPublicClient } from "$lib/wagmi/runes";
import { ContractCodeStatus, contracts, type Contract, type ContractName } from "$lib/scaffold-eth/ts";
import type { Address } from "viem";

export const createDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const publicClient = $derived.by(createPublicClient());
  const { chainIdCurrent } = $derived.by(createChainId);

  const deployedContract = $derived(chainIdCurrent ? contracts?.[chainIdCurrent]?.[contractName] : undefined);
  let status = $state(ContractCodeStatus.LOADING);

  // $inspect("createDeployedContractInfo ~ chainIdCurrent (status)", chainIdCurrent, contractName, status);

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
