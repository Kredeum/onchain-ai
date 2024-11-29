import { targetNetwork } from "$lib/scaffold-eth/classes";
import { SmartContract } from "$lib/wagmi/classes";
import { SvelteMap } from "svelte/reactivity";
import type { Address } from "viem";

class OnChainAI {
  contract: SmartContract;

  owner: string = $state("");
  callOwner = async () => {
    this.owner = (await this.contract.call("owner")) as string;
  };

  #lastInteractions = $state(new SvelteMap());
  lastInteraction(address: Address) {
    const callLastInteraction = async (address: Address) => {
      const lastInteraction = await this.contract.call("lastInteraction", [address]);
      this.#lastInteractions.set(address, lastInteraction);
    }
    callLastInteraction(address);
    return this.#lastInteractions.get(address);
  }

  constructor() {
    this.contract = new SmartContract("OnChainAIv1");

    $effect(() => {
      targetNetwork.id;
      this.callOwner();
    });
  }
}

export { OnChainAI };
