<script lang="ts">
  import { Icon, BarsArrowUp } from "svelte-hero-icons";
  import ContractUI from "./ContractUI.svelte";
  import { contracts, getAllContracts } from "$lib/scaffold-eth/ts";
  import { createChainId } from "$lib/scaffold-eth/runes";

  const selectedContractStorageKey = "scaffoldEth2.selectedContract";

  const { chainIdCurrent } = $derived.by(createChainId);
  const contractsData = $derived(contracts?.[chainIdCurrent] || {});
  const contractNames = $derived(Object.keys(contractsData));

  let clickedContractName = $state("");
  let selectedContract = $derived.by(() => {
    if (contractNames.length == 0) return;

    if (clickedContractName) return clickedContractName;

    const localStorageContractName = localStorage.getItem(selectedContractStorageKey);
    if (localStorageContractName && contractNames.includes(localStorageContractName)) return localStorageContractName;

    return contractNames[0];
  });

  $effect(() => localStorage.setItem(selectedContractStorageKey, String(selectedContract)));

  $inspect("<DebugContracts ~ contractsData:", contractsData);
  $inspect("<DebugContracts ~ contractNames:", contractNames);
</script>

<div class="flex flex-col items-center justify-center gap-y-6 py-8 lg:gap-y-8 lg:py-12">
  {#if contractNames.length === 0}
    <p class="mt-14 text-3xl">No contracts found!</p>
  {:else}
    {#if contractNames.length > 1}
      <div class="flex w-full max-w-7xl flex-row flex-wrap gap-2 px-6 pb-1 lg:px-10">
        {#each contractNames as contractName}
          <button
            class="btn btn-secondary btn-sm font-light hover:border-transparent {contractName === selectedContract
              ? 'no-animation bg-base-300 hover:bg-base-300'
              : 'bg-base-100 hover:bg-secondary'}"
            onclick={() => (clickedContractName = contractName)}
          >
            {contractName}
            {#if contractsData[contractName].external}
              <span class="tooltip tooltip-top tooltip-accent" data-tip="External contract">
                <Icon src={BarsArrowUp} class="h-4 w-4 cursor-pointer" />
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
    {#each contractNames as contractName}
      <ContractUI {contractName} hidden={contractName !== selectedContract} />
    {/each}
  {/if}
</div>
