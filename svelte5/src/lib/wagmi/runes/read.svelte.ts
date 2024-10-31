import { createTargetNetworkId } from "$lib/runes/global.svelte";
import type { Address, Abi } from "abitype";
import { createConfig } from "./config.svelte";
import { readContract } from "@wagmi/core";
import { type ReadContractReturnType } from "@wagmi/core";

const createReadContract = ({
  address,
  abi,
  functionName,
  args = []
}: {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: string[];
}) => {
  const config = $derived.by(createConfig());

  let data: ReadContractReturnType = $state();
  (async () => {
    console.log("createReadContract BEFORE", config);
    data = await readContract(config, { address, abi, functionName, args });
    console.log("createReadContract  AFTER", config);
  })();

  $inspect("createReadContract config", config);
  return {
    get data() {
      return data;
    }
  };
};

export { createReadContract };
