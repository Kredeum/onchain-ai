<script lang="ts">
  import "../../app.pcss";
  import { Connect } from "$lib/wagmi/components";
  import { Account, newWagmi, wagmi, wagmiConfig } from "$lib/wagmi/classes";
  import type { Snippet } from "svelte";
  import { newTargetNetwork, targetNetwork } from "$lib/scaffold-eth/classes";
  import { NetworkOptions } from "$lib/scaffold-eth/components";
  import { getTargetNetworks } from "$lib/scaffold-eth/ts";

  let { children }: { children: Snippet } = $props();

  newWagmi();
  newTargetNetwork();

  const account = new Account();
  const chains = $derived(getTargetNetworks().filter((network) => network.id !== account.chainId));
</script>

<div class="flex min-h-screen flex-col">
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      <a href="/app">App</a>
    </h1>
    <h1 class="text-2xl font-bold mb-6">
      <a href="/tests">Tests</a>
    </h1>

    <div class="pb-8">
      {#if account.address}
        {account.address} ({account.chainId})

        <button class="btn btn-primary btn-sm" onclick={() => targetNetwork.disconnect()}>Disconnect</button>

        {#each chains as chain (chain.id)}
          <button class="btn btn-default btn-sm" onclick={() => targetNetwork.switch(chain.id)}>
            {chain.name}
          </button>
        {/each}
        <div class="p-2"></div>
      {:else}
        <Connect chainId={account.chainId} bind:address={account.address} />
      {/if}
    </div>

    <main class="relative flex flex-1 flex-col">{@render children()}</main>
  </div>
</div>
