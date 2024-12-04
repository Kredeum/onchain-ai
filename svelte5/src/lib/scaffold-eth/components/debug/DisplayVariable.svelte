<script lang="ts">
  import { ArrowPath, Icon } from "svelte-hero-icons";
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

  const contract = new SmartContract(contractAddress);
  const data = $derived(contract.call(abiFunction.name));

  const refresh = () => contract.fetch(abiFunction.name);
  $effect(() => {
    refreshDisplayVariables;
    refresh();
  });

  const showAnimation = $derived(createAnimationConfig(() => data));

  $inspect("<DisplayVariable", abiFunction.name, contractAddress, data);
</script>

<div class="space-y-1 pb-2">
  <div class="flex items-center">
    <h3 class="mb-0 break-all text-lg font-medium">{abiFunction.name}</h3>
    <button class="btn btn-ghost btn-xs" onclick={refresh}>
      {#if !contract}
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
        class="block break-all bg-transparent transition {showAnimation()
          ? 'animate-pulse-fast rounded-sm bg-warning'
          : ''}"
      >
        <DisplayTxResult content={data} />
      </div>
    </div>
  </div>
</div>
