import { type Abi, type AbiFunction, type Address as AddressType } from "viem";
import { SvelteMap } from "svelte/reactivity";
import { type ReadContractReturnType, deepEqual, readContract } from "@wagmi/core";
import { targetNetwork } from "$lib/scaffold-eth/classes";
import { wagmiConfig } from "$lib/wagmi/classes";
import { isAddress } from "$lib/scaffold-eth/ts";
import { readDeployment, type DeploymentContractName, type DeploymentsChainId } from "@onchain-ai/common";
import { untrack } from "svelte";
import { shorten0xString } from "$lib/scaffold-eth/ts";

let counter = 0;

class SmartContract {
  name: string | undefined;
  #nameOrAddress: DeploymentContractName | AddressType | undefined;

  get address(): AddressType | undefined {
    const { address } = readDeployment(targetNetwork.id, this.#nameOrAddress!) ?? {};
    return address;
  }

  get abi(): Abi | undefined {
    const { abi } = readDeployment(targetNetwork.id, this.#nameOrAddress!) ?? {};
    return abi;
  }

  #setNameOrAddress(nameOrAddress: DeploymentContractName | AddressType) {
    this.#nameOrAddress = nameOrAddress;
    this.name = isAddress(nameOrAddress)
      ? "Contract @" + shorten0xString(this.#nameOrAddress as `0x$string`)
      : ((nameOrAddress as string) ?? "");
  }

  #getParamsOnCurrentChain = (functionName: string, args: unknown[]) => {
    const chainId = targetNetwork.id;
    const { address, abi } = readDeployment(chainId, this.#nameOrAddress!) ?? {};
    if (!(address && abi)) return;

    const dataKey = JSON.stringify({ chainId, address, functionName, args });

    return { chainId, address, abi, dataKey };
  };

  #call = async (chainId: number, address: AddressType, abi: Abi, functionName: string = "", args: unknown[] = []) => {
    // console.log("SMARTCONTRACT READ", functionName, args, chainId, deployment.address, `#${this.id}`);
    // console.log("SMARTCONTRACT READ",  deployment.abi);
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
    const { chainId, address, abi, dataKey } = this.#getParamsOnCurrentChain(functionName, args) || {};
    if (!(chainId && address && abi && dataKey)) return;

    this.isFetching = true;
    const newData = await this.#call(chainId, address, abi, functionName, args);
    this.isFetching = false;

    const prevData = $state.snapshot(this.#datas.get(dataKey));
    if (!deepEqual(prevData, newData)) {
      this.#datas.set(dataKey, newData);
      console.info(`get ${this.name}#${this.id}`, functionName, args, "=>", newData);
    }
  };

  call = (functionName: string = "", args: unknown[] = [], onStart = true): unknown | undefined => {
    const { dataKey } = this.#getParamsOnCurrentChain(functionName, args) || {};
    if (!dataKey) return;

    // console.info(`call ${this.name}#${this.id}`, functionName, args,);

    if (this.#datas.has(dataKey!)) return this.#datas.get(dataKey!);

    if (onStart) untrack(() => this.fetch(functionName, args));
  };

  constructor(nameOrAddress: DeploymentContractName | AddressType) {
    if (!nameOrAddress) throw new Error("SmartContract nameOrAddress is required");

    this.id = ++counter;
    this.#setNameOrAddress(nameOrAddress);

    // $inspect("SMARTCONTRACT INSPECT", targetNetwork.id, "|", this.nameOrAddress, this.id);
  }
}

export { SmartContract };
