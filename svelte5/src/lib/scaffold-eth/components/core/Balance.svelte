<script lang="ts">
  import { formatEther, type Address } from "viem";
  import { nativeCurrencyPrice } from "$lib/scaffold-eth/runes";
  import { createTargetNetwork } from "$lib/scaffold-eth/runes";
  import { createBalance } from "$lib/wagmi/runes";

  const {
    address,
    class: className = "",
    usdMode = false
  }: { address?: Address; class?: string; usdMode?: boolean } = $props();

  const targetNetwork = $derived.by(createTargetNetwork());
  const { balance } = $derived(createBalance({ address }));

  const formattedBalance = $derived(balance ? Number(formatEther(balance.value)) : 0);
  let displayUsdMode = $state(nativeCurrencyPrice.price > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (nativeCurrencyPrice.price > 0) {
      displayUsdMode = !displayUsdMode;
    }
  };

  // $inspect("<Balance", address, formattedBalance, balance);
</script>

{#if balance}
  <button
    class="btn btn-ghost btn-sm flex flex-col items-center font-normal hover:bg-transparent {className}"
    onclick={toggleBalanceMode}
  >
    <div id="user-balance" class="flex w-full items-center justify-center">
      {#if displayUsdMode}
        <span class="mr-1 text-[0.8em] font-bold">$</span>
        <span>{(formattedBalance * nativeCurrencyPrice.price).toFixed(2)}</span>
      {:else}
        <span>{formattedBalance.toFixed(4)}</span>
        <span class="ml-1 text-[0.8em] font-bold">{targetNetwork.nativeCurrency.symbol}</span>
      {/if}
    </div>
  </button>
{:else}
  <div class="flex animate-pulse space-x-4">
    <div class="h-6 w-6 rounded-md bg-slate-300"></div>
    <div class="flex items-center space-y-6">
      <div class="h-2 w-28 rounded bg-slate-300"></div>
    </div>
  </div>
{/if}
