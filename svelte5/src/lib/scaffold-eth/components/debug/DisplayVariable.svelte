<script lang="ts">
  import { ArrowPath, Icon } from "svelte-hero-icons";
  import { untrack } from "svelte";
  import type { Address } from "viem";
  import type { AbiFunction, Abi } from "abitype";

  import { InheritanceTooltip, DisplayTxResult } from "$lib/scaffold-eth/components";
  import { createAnimationConfig } from "$lib/scaffold-eth/runes";
  import { SmartContract } from "$lib/wagmi/classes";

  const {
    contractAddress,
    abiFunction,
    refreshDisplayVariables,
    inheritedFrom,
    abi
  }: {
    contractAddress: Address;
    abiFunction: AbiFunction;
    refreshDisplayVariables: boolean;
    inheritedFrom?: string;
    abi: Abi;
  } = $props();

  const smartContract = new SmartContract({ address: contractAddress, abi });

  const smartContractCall = () => smartContract.call({ functionName: abiFunction.name });

  $effect(() => {
    refreshDisplayVariables;
    untrack(() => smartContractCall());
  });

  const showAnimation = $derived.by(createAnimationConfig(() => smartContract.dataRead));
</script>

<div class="space-y-1 pb-2">
  <div class="flex items-center">
    <h3 class="mb-0 break-all text-lg font-medium">{abiFunction.name}</h3>
    <button class="btn btn-ghost btn-xs" onclick={smartContractCall}>
      {#if !smartContract}
        <span class="loading loading-spinner loading-xs"></span>
      {:else}
        <Icon src={ArrowPath} class="h-3 w-3 cursor-pointer" aria-hidden="true" />
      {/if}
    </button>
    <InheritanceTooltip {inheritedFrom} />
  </div>
  <div class="flex flex-col items-start font-medium text-gray-500">
    <div>
      <div
        class="block break-all bg-transparent transition {showAnimation
          ? 'animate-pulse-fast rounded-sm bg-warning'
          : ''}"
      >
        <DisplayTxResult content={smartContract.dataRead} />
      </div>
    </div>
  </div>
</div>
