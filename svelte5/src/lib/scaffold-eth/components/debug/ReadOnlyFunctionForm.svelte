<script lang="ts">
  import type { AbiFunction, Abi } from "abitype";
  import type { Address } from "viem";
  import {
    getFunctionInputKey,
    getInitialFormState,
    getParsedContractFunctionArgs,
    transformAbiFunction
  } from "$lib/scaffold-eth/ts";
  import { ContractInput, DisplayTxResult, InheritanceTooltip } from "$lib/scaffold-eth/components";
  import { createReadContract } from "$lib/wagmi/runes";

  const {
    contractAddress,
    abiFunction,
    inheritedFrom,
    abi
  }: {
    contractAddress: Address;
    abiFunction: AbiFunction;
    inheritedFrom?: string;
    abi: Abi;
  } = $props();

  let form = $state<Record<string, any>>(getInitialFormState(abiFunction));

  let { data, fetch, isFetching } = $derived(
    createReadContract({
      address: contractAddress,
      functionName: abiFunction.name,
      abi,
      args: getParsedContractFunctionArgs(form),
      onStart: false
    })
  );
  const transformedFunction = $derived(transformAbiFunction(abiFunction));
</script>

<div class="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
  <p class="my-0 break-words font-medium">
    {abiFunction.name}
    <InheritanceTooltip {inheritedFrom} />
  </p>
  {#each transformedFunction.inputs as input, i (getFunctionInputKey(abiFunction.name, input, i))}
    <ContractInput
      setForm={(updatedFormValue) => {
        form = updatedFormValue;
      }}
      {form}
      stateObjectKey={getFunctionInputKey(abiFunction.name, input, i)}
      paramType={input}
    />
  {/each}
  <div class="flex flex-wrap justify-between gap-2">
    <div class="w-4/5 flex-grow">
      {#if data && !isFetching}
        <div class="break-words rounded-3xl bg-secondary px-4 py-1.5 text-sm">
          <p class="m-0 mb-1 font-bold">Result:</p>
          <pre class="whitespace-pre-wrap break-words"><DisplayTxResult content={data} /></pre>
        </div>
      {/if}
    </div>
    <button class="btn btn-secondary btn-sm" onclick={fetch} disabled={isFetching}>
      {#if isFetching}
        <span class="loading loading-spinner loading-xs"></span>
      {/if}
      Read 📡
    </button>
  </div>
</div>
