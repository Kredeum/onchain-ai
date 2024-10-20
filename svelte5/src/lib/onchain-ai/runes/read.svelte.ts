import { createReadContract } from "wagmi-svelte";
import { createOnchainAI } from "../runes/contract.svelte";

// DO NOT USE : doesn't work cause of one getContext inside createReadContract
// HAVE to use <Read /> component as a function instead :-(
// `Error: lifecycle_outside_component `getContext(...)` can only be used during component initialisation`
const createOnchainAIRead = (functionName: string) => {
  const { chainId, address, abi } = $derived.by(createOnchainAI);

  let value = $state();

  const readContract = $derived.by(
    createReadContract(() => ({
      address,
      abi,
      functionName,
      chainId
    }))
  );

  $effect(() => {
    console.log("<Read $effect ~ reRead");
    value = readContract?.data;
  });

  return {
    get value() {
      return value;
    }
  };
};

export { createOnchainAIRead };
