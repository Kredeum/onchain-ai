import { readDeploymentContract, type DeploymentContractName, type DeploymentsChainId } from "@onchain-ai/common";
import jsonDeployments from "$lib/deployments.json";
import type { Abi, AbiFunction, Address } from "viem";
import { wagmiConfig } from "$lib/wagmi/ts";
import {
  type ReadContractReturnType,
  deepEqual,
  readContract,
  waitForTransactionReceipt,
  writeContract
} from "@wagmi/core";
import { targetNetwork } from "$lib/scaffold-eth/classes";
import { notification } from "$lib/scaffold-eth/ts";
import { LinkTx } from "../components";

class SmartContract {
  chainId = $derived(targetNetwork.id);
  address = $state<Address>();
  abi = $state<Abi>();
  dataRead = $state<ReadContractReturnType>();

  // Read SmartContract : call
  calling = $state(false);
  call = async ({ functionName = "", args = [] }: { functionName?: string; args?: unknown[] }) => {
    if (this.calling) return;
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

    let data: ReadContractReturnType;
    try {
      this.dataRead = await readContract(wagmiConfig, { address: this.address, abi: this.abi, functionName, args });
    } catch (e: unknown) {
      console.error("SmartContract dataRead ERROR", e);
    }

    this.calling = false;

    console.log("call= ~ this.dataRead:", this.chainId, this.dataRead);
    return this.dataRead;
  };

  // Write SmartContract : send then wait
  sendId = $state<string>("");
  sending = $derived(Boolean(this.sendId));
  notifs = new Map();
  send = async ({
    functionName = "",
    args = [],
    value = 0n
  }: {
    functionName?: string;
    args?: unknown[];
    value?: bigint;
  }) => {
    if (this.sending) return;
    if (!(this.abi && this.address)) return;

    let hash: `0x${string}` | undefined;
    try {
      this.sendId = notification.loading("Sending transaction...");

      hash = await writeContract(wagmiConfig, { address: this.address, abi: this.abi, functionName, args, value });

      const idHash = notification.info(LinkTx as any, { props: { hash, message: "Transaction sent!" } });
      this.notifs.set(hash, idHash);
    } catch (e: unknown) {
      notification.error(LinkTx as any, { props: { hash, message: "Transaction call failed!" } });
      throw new Error(`writeContract error: ${e}`);
    } finally {
      notification.remove(this.sendId);
    }

    if (!hash) {
      notification.error(`Transaction failed, no hash!`);
      throw new Error("writeContract no hash");
    }
    return hash;
  };

  // Write SmartContract : send then wait
  waiting = $state(false);
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

  constructor(param: DeploymentContractName | { address: Address; abi: Abi }) {
    ({ address: this.address, abi: this.abi } =
      typeof param === "string" ? readDeploymentContract(this.chainId, param) : param);

    $inspect("SC chainId", this.chainId, this.address, this.abi);
  }
}

export { SmartContract };
