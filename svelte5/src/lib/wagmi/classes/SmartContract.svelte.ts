import { type Abi, type AbiFunction, type Address as AddressType } from "viem";
import { SvelteMap } from "svelte/reactivity";
import {
  type ReadContractReturnType,
  deepEqual,
  readContract,
  waitForTransactionReceipt,
  writeContract
} from "@wagmi/core";
import { targetNetwork } from "$lib/wagmi/classes";
import { wagmiConfig } from "$lib/wagmi/classes";
import { isAddress, shorten0xString } from "$lib/wagmi/ts";
import { readDeployment, type DeploymentContractName, type DeploymentsChainId } from "$lib/wagmi/ts";
import { untrack } from "svelte";
import { notification } from "$lib/wagmi/ts";
import { LinkTx } from "../components";

let counter = 0;

class SmartContract {
  id = 0;

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
  callAsync = async (functionName: string = "", args: unknown[] = []): Promise<void> => {
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

    if (onStart) untrack(() => this.callAsync(functionName, args));
  };

  // Write SmartContract : send and wait
  sendId = $state<string>("");
  sending = $state(false);
  waiting = $state(false);
  notifs = new Map();
  send = async (functionName: string = "", args: unknown[] = [], value = 0n) => {
    if (this.sending) return;
    const chainId = targetNetwork.id;
    const { address, abi } = readDeployment(chainId, this.#nameOrAddress!) ?? {};
    if (!(address && abi)) return;

    let hash: `0x${string}` | undefined;
    try {
      this.sending = true;

      this.sendId = notification.loading("Sending transaction...");

      hash = await writeContract(wagmiConfig, { address, abi, functionName, args, value });

      const idHash = notification.info(LinkTx as any, { props: { hash, message: "Transaction sent!" } });
      this.notifs.set(hash, idHash);
    } catch (e: unknown) {
      notification.error(LinkTx as any, { props: { hash, message: "Transaction call failed!" } });
      throw new Error(`writeContract error: ${e}`);
    } finally {
      this.sending = false;
      notification.remove(this.sendId);
    }

    if (!hash) {
      notification.error(`Transaction failed, no hash!`);
      throw new Error("writeContract no hash");
    }
    return hash;
  };
  wait = async (hash: `0x${string}`) => {
    this.waiting = true;
    let receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

    notification.remove(this.notifs.get(hash));
    notification.success(LinkTx as any, {
      props: { hash, message: "Transaction validated!" }
    });

    this.waiting = false;
    return receipt;
  };
  sendAndWait = async (functionName: string = "", args: unknown[] = [], value = 0n) => {
    const hash = await this.send(functionName, args, value);
    if (hash) await this.wait(hash);
    return hash;
  };

  constructor(nameOrAddress: DeploymentContractName | AddressType) {
    if (!nameOrAddress) throw new Error("SmartContract nameOrAddress required");

    this.id = ++counter;
    this.#setNameOrAddress(nameOrAddress);

    // $inspect("SMARTCONTRACT INSPECT", targetNetwork.id, "|", this.nameOrAddress, this.id);
    // $inspect("SMARTCONTRACT SEND ID ING", this.sendId, this.sending);
  }
}

export { SmartContract };
