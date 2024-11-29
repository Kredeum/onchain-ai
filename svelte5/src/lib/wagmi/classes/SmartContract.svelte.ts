import {
  findDeploymentContractName,
  readDeploymentContract,
  readDeploymentsChain,
  type DeploymentContractKey,
  type DeploymentContractName,
  type DeploymentsChain
} from "@onchain-ai/common";
import type { Abi, AbiFunction, Address } from "viem";
import { wagmiConfig } from "$lib/wagmi/classes";
import { type ReadContractReturnType, deepEqual, readContract } from "@wagmi/core";
import { targetNetwork } from "$lib/scaffold-eth/classes";

class SmartContract {
  // contractName is constant (defined in constructor)
  contractName = "";

  // call smartcontract named function with args
  call = async (functionName: string = "", args: unknown[] = []) => {
    const { address, abi } = readDeploymentContract(targetNetwork.id, this.contractName);

    const abiFunction = (abi as unknown as AbiFunction[]).find((f) => f.type === "function" && f.name === functionName);
    const abiFunctionInputsLength = abiFunction?.inputs?.length || 0;

    // waiting for params in args
    if (args.length !== abiFunctionInputsLength) {
      console.warn("args mismatch", args.length, abiFunctionInputsLength, args);
      return;
    }

    let data: ReadContractReturnType;
    try {
      data = await readContract(wagmiConfig, { address, abi, functionName, args });
    } catch (e: unknown) {
      console.warn("SMARTCONTRACT readContract interrupted", e);
    }

    return data;
  };

  // SmartContract created either by contract name or by address
  constructor(param: DeploymentContractName | Address) {
    const paramIsAddress = param.startsWith("0x");

    this.contractName = paramIsAddress ? findDeploymentContractName(targetNetwork.id, param as Address) : param;

    $inspect("SMARTCONTRACT INSPECT", targetNetwork.id, "|", this.contractName);
  }
}

export { SmartContract };
