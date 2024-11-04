<script lang="ts">
  import type {
    Contract,
    ContractName,
    GenericContract,
    InheritedFunctions
  } from "$lib/scaffold-eth/ts";
  import type { AbiFunction, Abi } from "abitype";
  import ReadOnlyFunctionForm from "./ReadOnlyFunctionForm.svelte";
  import type { Address } from "viem";

  const { deployedContractData }: { deployedContractData: Contract<ContractName> } = $props();

  const functionsToDisplay = (
    ((deployedContractData.abi || []) as Abi).filter(
      (part) => part.type === "function"
    ) as AbiFunction[]
  )
    .filter((fn) => {
      const isQueryableWithParams =
        (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length > 0;
      return isQueryableWithParams;
    })
    .map((fn) => {
      return {
        fn,
        inheritedFrom: (
          (deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions
        )?.[fn.name]
      };
    })
    .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));
</script>

{#if functionsToDisplay.length === 0}
  No read methods
{:else}
  {#each functionsToDisplay as { fn, inheritedFrom } (fn.name)}
    <ReadOnlyFunctionForm
      abi={deployedContractData.abi}
      contractAddress={deployedContractData.address as Address}
      abiFunction={fn}
      {inheritedFrom}
    />
  {/each}
{/if}
