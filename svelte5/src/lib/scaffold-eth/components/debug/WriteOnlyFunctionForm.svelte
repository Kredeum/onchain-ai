<script lang="ts">
  import type { Abi, AbiFunction } from "abitype";
  import type { Address, TransactionReceipt } from "viem";
  import {
    getFunctionInputKey,
    getInitialFormState,
    getParsedContractFunctionArgs,
    transformAbiFunction
  } from "$lib/scaffold-eth/ts";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { IntegerInput, InheritanceTooltip, ContractInput, DisplayTxResult } from "$lib/scaffold-eth/components";

  import { Account, SmartContract } from "$lib/wagmi/classes";

  const {
    abi,
    abiFunction,
    onchange,
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
  let txHash: `0x${string}` | undefined = $state();
  let txReceipt = $state<TransactionReceipt>();

  const account = new Account();
  const writeDisabled = $derived(account.chainId !== targetNetwork.id);

  const contract = new SmartContract(contractAddress);
  const handleWrite = async () => {
    txHash = await contract.send(abiFunction.name, getParsedContractFunctionArgs(form), BigInt(txValue));
    if (!txHash) return;

    txReceipt = await contract.wait(txHash);
    onchange();
  };

  const transformedFunction = transformAbiFunction(abiFunction);
  const zeroInputs = transformedFunction.inputs.length === 0 && abiFunction.stateMutability !== "payable";

  $inspect("<WriteOnlyFunctionForm Receipt txHash", txHash, "=>", txReceipt);
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
          txHash = undefined;
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
            txHash = undefined;
          }}
          placeholder="value (wei)"
        />
      </div>
    {/if}
    <div class="flex justify-between gap-2">
      {#if !zeroInputs}
        <div class="flex-grow basis-0"></div>
      {/if}
      <div
        class="flex {writeDisabled &&
          'tooltip before:left-auto before:right-[-10px] before:transform-none before:content-[attr(data-tip)]'}"
        data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
      >
        <button class="btn btn-secondary btn-sm" disabled={writeDisabled} onclick={handleWrite}>
          {#if contract.sending || contract.waiting}
            <span class="loading loading-spinner loading-xs"></span>
          {/if}
          Send 💸
        </button>
      </div>
    </div>
  </div>
</div>
{#if txReceipt}
  {@render displayReceipt(txReceipt)}
{/if}

{#snippet displayReceipt(receipt: TransactionReceipt)}
  <div class="break-words rounded-3xl bg-secondary px-4 py-1.5 text-sm">
    <p class="m-0 mb-1 font-bold">Result: {receipt.status}</p>
    <details>
      <summary>Detailed Receipt</summary>
      <pre class="whitespace-pre-wrap break-words">
    <DisplayTxResult content={receipt} />
   </pre>
    </details>
  </div>
{/snippet}
