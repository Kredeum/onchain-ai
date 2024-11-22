import { readDeploymentContract } from "@onchain-ai/common";
import jsonDeployments from "$lib/deployments.json";
import type { Abi, AbiFunction, Address } from "viem";
import { createConfig } from "$lib/wagmi/runes";
import { type ReadContractReturnType, deepEqual, readContract } from "@wagmi/core";
import { createChainId } from "$lib/scaffold-eth/runes";

type DeploymentsChains = typeof jsonDeployments;
type DeploymentsChainId = keyof DeploymentsChains;
type DeploymentsChain = DeploymentsChains[DeploymentsChainId];
type DeploymentContractName = keyof DeploymentsChain;

class SmartContract {
  config = $derived.by(createConfig());

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
      const newData = await readContract(this.config, { address: this.address, abi: this.abi, functionName, args });
      if (!deepEqual($state.snapshot(this.dataRead), newData)) this.dataRead = newData;
    } catch (e: unknown) {
      console.error("SmartContract dataRead ERROR", e);
    }

    this.calling = false;

    return this.dataRead;
  };

  constructor({ name, address, abi }: { name?: DeploymentContractName; address?: Address; abi?: Abi }) {
    const { chainIdCurrent } = $derived.by(createChainId);
    if (name && !(address && abi)) {
      ({ address, abi } = jsonDeployments[chainIdCurrent as unknown as DeploymentsChainId][name] as {
        address: Address;
        abi: Abi;
      });
    }

    this.address = address;
    this.abi = abi;
  }
}

export { SmartContract };
