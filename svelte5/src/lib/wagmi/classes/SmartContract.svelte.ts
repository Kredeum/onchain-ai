import type { AbiFunction, Address } from "viem";
import { SvelteMap } from "svelte/reactivity";
import { type ReadContractReturnType, deepEqual, readContract } from "@wagmi/core";
import { targetNetwork } from "$lib/scaffold-eth/classes";
import { wagmiConfig } from "$lib/wagmi/classes";
import { readDeployment, type DeploymentContractName } from "@onchain-ai/common";
import { untrack } from "svelte";

let counter = 0;

class SmartContract {
  id = 0;
  nameOrAddress: DeploymentContractName | Address;
  chainId = $derived(targetNetwork.id);

  getDataKey = (functionName: string, args: unknown[]): string =>
    JSON.stringify({ chainId: this.chainId, functionName, args });

  #call = async (functionName: string = "", args: unknown[] = []) => {
    const chainId = this.chainId;
    const deployment = readDeployment(chainId, this.nameOrAddress);
    if (!deployment) return;
    // console.log("SMARTCONTRACT READ", functionName, args, chainId, deployment.address, `#${this.id}`);
    // console.log("SMARTCONTRACT READ",  deployment.abi);

    const { address, abi } = deployment;
    const abiFunction = (abi as unknown as AbiFunction[]).find(
      (f) => f.type === "function" && f.name === functionName && f.inputs.length === args.length
    );
    if (!abiFunction) throw new Error(`Function call to ${functionName} with ${args.length} args not found`);

    let data: ReadContractReturnType;
    try {
      data = await readContract(wagmiConfig, { address, abi, functionName, args });
    } catch (e: unknown) {
      const newChainId = targetNetwork.id;
      if (newChainId === chainId) {
        console.error(`SMARTCONTRACT READ '${functionName}' error on chain '${chainId}'`, e);
      } else {
        console.warn(
          `SMARTCONTRACT READ '${functionName}' aborted`,
          `while changing chain '${chainId}' => '${newChainId}'`
        );
      }
    }

    return data;
  };

  isFetching = $state(false);
  #datas: SvelteMap<string, unknown | undefined> = new SvelteMap();
  fetch = async (functionName: string = "", args: unknown[] = []): Promise<void> => {
    const dataKey = this.getDataKey(functionName, args);

    this.isFetching = true;
    const newData = await this.#call(functionName, args);
    this.isFetching = false;

    const prevData = $state.snapshot(this.#datas.get(dataKey));
    if (!deepEqual(prevData, newData)) {
      this.#datas.set(dataKey, newData);
      console.info(
        "SMARTCONTRACT RESULT",
        functionName,
        args,
        this.chainId,
        this.nameOrAddress,
        `#${this.id}`,
        this.#datas
      );
    }
  };
  call = (functionName: string = "", args: unknown[] = [], onStart = true): unknown | undefined => {
    const dataKey = this.getDataKey(functionName, args);
    if (this.#datas.has(dataKey)) return this.#datas.get(dataKey);

    if (onStart) untrack(() => this.fetch(functionName, args));
  };

  constructor(nameOrAddress: DeploymentContractName | Address) {
    if (!nameOrAddress) throw new Error("SmartContract nameOrAddress is required");

    this.id = ++counter;
    this.nameOrAddress = nameOrAddress;

    // $inspect("SMARTCONTRACT INSPECT", targetNetwork.id, "|", this.nameOrAddress, this.id);
  }
}

export { SmartContract };
