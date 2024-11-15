import { targetNetwork } from "./global.svelte";
import { createPublicClient } from "$lib/wagmi/runes";
import { ContractCodeStatus, contracts, type Contract, type ContractName } from "$lib/scaffold-eth/ts";
import type { Address } from "viem";
import { switchChain } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

export const createDeployedContractInfo = <TContractName extends ContractName>(contractName: TContractName) => {
  const config = $derived.by(createConfig());
  const publicClient = $derived.by(createPublicClient());
  const chainId = $derived(publicClient?.chain.id);

  const deployedContract = $derived(chainId ? contracts?.[chainId]?.[contractName] : undefined);
  let status = $state(ContractCodeStatus.LOADING);

  $inspect("createDeployedContractInfo ~ chainId (status)", chainId, status);

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

  return () => ({
    data: status === ContractCodeStatus.DEPLOYED ? deployedContract : undefined,
    isLoading: status === ContractCodeStatus.LOADING
  });
};
