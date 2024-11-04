import type { Abi, AbiFunction, AbiParameter } from "abitype";
import type { Address } from "viem";
import { type ReadContractReturnType, readContract, deepEqual } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

const createReadContract = ({
  address,
  abi,
  functionName,
  args = [],
  onStart = true
}: {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: unknown[];
  onStart?: boolean;
}) => {
  const config = $derived.by(createConfig());

  let data: ReadContractReturnType = $state();
  let isFetching = $state(false);

  const abiFunction = (abi as unknown as AbiFunction[]).find(
    (f) => f.type === "function" && f.name === functionName
  );
  const abiFunctionInputsLength = abiFunction?.inputs?.length || 0;

  const fetch = async () => {
    // waiting for params in args
    if (args.length !== abiFunctionInputsLength) {
      console.warn("args mismatch", args.length, abiFunctionInputsLength, args);
      return;
    }

    isFetching = true;

    try {
      const newData = await readContract(config, { address, abi, functionName, args });
      if (!deepEqual($state.snapshot(data), newData)) data = newData;
    } catch (e: unknown) {
      console.error("createReadContract ERROR", e);
    }

    isFetching = false;
    return data;
  };
  if (onStart) fetch();

  // $inspect("createReadContract data", data);
  return {
    fetch,
    get isFetching() {
      return isFetching;
    },
    get data() {
      return data;
    }
  };
};

export { createReadContract };
