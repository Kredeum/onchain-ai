import { readDeploymentContract, type DeploymentContractName, type DeploymentsChainId } from "@onchain-ai/common";
import jsonDeployments from "$lib/deployments.json";
import type { Abi, AbiFunction, Address } from "viem";
import { wagmiConfig } from "$lib/wagmi/classes";
import { type ReadContractReturnType, deepEqual, readContract } from "@wagmi/core";
import { targetNetwork } from "$lib/scaffold-eth/classes";

class SmartContract {
  address = $state<Address>();
  abi = $state<Abi>();
  dataRead = $state<ReadContractReturnType>();

  calling = $state(false);
  call = async ({ functionName = "", args = [] }: { functionName?: string; args?: unknown[] }) => {
    if (!(this.abi && this.address)) return;

    const abiFunction = (this.abi as unknown as AbiFunction[]).find(
      (f) => f.type === "function" && f.name === functionName
    );
    const abiFunctionInputsLength = abiFunction?.inputs?.length || 0;

    // waiting for params in args
    if (args.length !== abiFunctionInputsLength) {
      console.warn("args mismatch", args.length, abiFunctionInputsLength, args);
      return;
    }

    this.calling = true;

    try {
      const newData = await readContract(wagmiConfig, { address: this.address, abi: this.abi, functionName, args });
      if (!deepEqual($state.snapshot(this.dataRead), newData)) this.dataRead = newData;
    } catch (e: unknown) {
      console.error("SmartContract dataRead ERROR", e);
    }

    this.calling = false;

    return this.dataRead;
  };

  constructor(param: DeploymentContractName | { address: Address; abi: Abi }) {
    // Reactive on chain change ONLY when contract name is passed as param
    const multiChain = typeof param === "string";

    if (!multiChain) ({ address: this.address, abi: this.abi } = param);
    $effect(() => {
      console.log("SMART CONTRACT EFFECT", targetNetwork.id, multiChain);
      if (multiChain) ({ address: this.address, abi: this.abi } = readDeploymentContract(targetNetwork.id, param));
    });

    console.info("SMART CONTRACT NEW", targetNetwork.id, this.address, multiChain, param);
    $inspect("SMART CONTRACT INSPECT", targetNetwork.id, this.address, multiChain, param);
  }
}

export { SmartContract };
