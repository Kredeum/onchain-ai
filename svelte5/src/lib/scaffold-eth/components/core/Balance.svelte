<script lang="ts">
  import { formatEther, type Address as AddressType } from "viem";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { Address } from "$lib/wagmi/classes";

  const {
    address,
    class: className = "",
    usdMode = false
  }: { address?: AddressType; class?: string; usdMode?: boolean } = $props();

  const addr = new Address(address, { watchBalance: true });

  const formattedBalance = $derived(Number(formatEther(addr.balance || 0n)));
  let displayUsdMode = $state(targetNetwork?.nativeCurrencyPrice > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (targetNetwork?.nativeCurrencyPrice > 0) {
      displayUsdMode = !displayUsdMode;
    }
  };

  // $inspect("<Balance", address, addr.balance, formattedBalance, addr);
</script>

{#if addr.balance != null}
  <button
    class="btn btn-ghost btn-sm flex flex-col items-center font-normal hover:bg-transparent {className}"
    onclick={toggleBalanceMode}
  >
    <div class="flex w-full items-center justify-center user-balance" data-balance={addr.balance}>
      {#if displayUsdMode}
        <span class="mr-1 text-[0.8em] font-bold">$</span>
        <span>{(formattedBalance * targetNetwork.nativeCurrencyPrice).toFixed(2)}</span>
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
