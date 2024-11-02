<script lang="ts">
  import type { Abi, AbiFunction } from "abitype";
  import type { Address } from "viem";
  import {
    getFunctionInputKey,
    getInitialFormState,
    getParsedContractFunctionArgs,
    transformAbiFunction
  } from "$lib/scaffold-eth/ts";
  import { createTargetNetwork, createTransactor } from "$lib/scaffold-eth/runes";
  import {
    IntegerInput,
    InheritanceTooltip,
    ContractInput,
    DisplayTxResult
  } from "$lib/scaffold-eth/components";
  import { createAccount, createWriteContract } from "$lib/wagmi/runes";

  const {
    abi,
    abiFunction,
    contractAddress,
    inheritedFrom
  }: {
    abi: Abi;
    abiFunction: AbiFunction;
    onchange: () => void;
    contractAddress: Address;
    inheritedFrom?: string;
  } = $props();

  let form = $state(getInitialFormState(abiFunction));
  let txValue = $state<bigint | string>("");
  let txResult = $state();

  const { account } = $derived(createAccount());
  const { chain } = $derived(account);

  const targetNetwork = $derived.by(createTargetNetwork());
  const writeDisabled = $derived(!chain || chain?.id !== targetNetwork.id);
  let writeTxn = $derived.by(createTransactor());

  let { send, waitingTxHash, waitingTxReceipt } = $derived(
    createWriteContract({
      address: contractAddress,
      abi,
      functionName: abiFunction.name,
      args: getParsedContractFunctionArgs(form),
      value: BigInt(txValue)
    })
  );

  let tx = $state();
  const handleWrite = async () => {
    txResult = await send();
  };

  const transformedFunction = transformAbiFunction(abiFunction);
  const zeroInputs =
    transformedFunction.inputs.length === 0 && abiFunction.stateMutability !== "payable";
</script>

<div class="space-y-3 py-5 first:pt-0 last:pb-1">
  <div class="flex gap-3 {zeroInputs ? 'flex-row items-center justify-between' : 'flex-col'}">
    <p class="my-0 break-words font-medium">
      {abiFunction.name}
      <InheritanceTooltip {inheritedFrom} />
    </p>
    {#each transformedFunction.inputs as input, i (getFunctionInputKey(abiFunction.name, input, i))}
      <ContractInput
        setForm={(updatedFormValue) => {
          tx = undefined;
          form = updatedFormValue;
        }}
        {form}
        stateObjectKey={getFunctionInputKey(abiFunction.name, input, i)}
        paramType={input}
      />
    {/each}
    {#if abiFunction.stateMutability === "payable"}
      <div class="flex w-full flex-col gap-1.5">
        <div class="ml-2 flex items-center">
          <span class="mr-2 text-xs font-medium leading-none">payable value</span>
          <span class="block text-xs font-extralight leading-none">wei</span>
        </div>
        <IntegerInput
          bind:value={txValue}
          onchange={() => {
            tx = undefined;
          }}
          placeholder="value (wei)"
        />
      </div>
    {/if}
    <div class="flex justify-between gap-2">
      {#if !zeroInputs}
        <div class="flex-grow basis-0">
          {#if tx}
            <DisplayTxResult content={txResult} />
          {/if}
        </div>
      {/if}
      <div
        class="flex {writeDisabled &&
          'tooltip before:left-auto before:right-[-10px] before:transform-none before:content-[attr(data-tip)]'}"
        data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
      >
        <button
          class="btn btn-secondary btn-sm"
          disabled={writeDisabled || !send}
          onclick={handleWrite}
        >
          {#if !waitingTxReceipt}
            <span class="loading loading-spinner loading-xs"></span>
          {/if}
          Send 💸
        </button>
      </div>
    </div>
  </div>
  {#if zeroInputs && tx}
    <div class="flex-grow basis-0">
      <DisplayTxResult content={txResult} />
    </div>
  {/if}
</div>
