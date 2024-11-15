<script lang="ts">
  import { onMount } from "svelte";
  import { type Address } from "viem";
  import { connect, getConnectors, switchChain, type GetConnectorsReturnType } from "@wagmi/core";

  import scaffoldConfig from "$lib/scaffold.config";
  import { createConfig } from "$lib/wagmi/runes";
  import { createChainId } from "$lib/scaffold-eth/runes";

  type ConnectorType = GetConnectorsReturnType[number];

  let { chainId = $bindable(), address = $bindable() }: { chainId?: number; address?: Address } = $props();

  const { chainIdDefault, chainIdLocal } = $derived.by(createChainId);

  const config = $derived.by(createConfig());

  let injectedSlug: string;

  const connectors: GetConnectorsReturnType = $derived(getConnectors(config));
  const findConnector = (type: string) => {
    const connector = connectors.find((c) => c.type === type);
    if (!connector) return {};

    const injected = connector?.type === "injected";
    const slug = injected ? injectedSlug : connector?.type;
    const name = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}${injected ? " Wallet" : ""}`;
    return { connector, slug, name };
  };

  onMount(() => {
    const provider = window.ethereum;
    if (provider) {
      // prettier-ignore
      injectedSlug =
      provider.isRabby ?       "rabby"
      : provider.isBraveWallet ? "brave"
      : provider.isTally?        "taho"
      : provider.isTrust ?       "trust"
      : provider.isFrame ?       "frame"
      :                          "injected";
    }
    console.log("onMount ~ injectedSlug:", injectedSlug);
  });

  const connectWallet = async (connector: ConnectorType) => {
    if (!config) return;
    modalDisplay = false;


    address = undefined;

    const params: { connector: ConnectorType; chainId?: number } = { connector };
    // if burner wallet, and onlyLocalBurnerWallet, switch to anvil
    if (connector.type === "burnerWallet" && scaffoldConfig.onlyLocalBurnerWallet) params.chainId = chainIdLocal;

    console.log("connectWallet params:", params);
    const wallet = await connect(config, params);
    console.log("connectWallet ~ wallet:", wallet);

    address = wallet.accounts[0];

    // if not on an existing configurated network, switch to default one
    if (!scaffoldConfig.targetNetworks.find((nw) => nw.id === wallet.chainId)) {
      console.log("connect Wallet ~ switch default Chain:", chainIdDefault);
      switchChain(config, { chainId: chainIdDefault });
      chainId = chainIdDefault;
    } else {
      chainId = wallet.chainId;
    }
  };

  let modalDisplay = $state(false);
</script>

<button class="btn btn-primary btn-sm" onclick={() => (modalDisplay = true)}> Connect Wallet </button>

{#if modalDisplay}
  <div class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start">
    <div class="flex flex-col items-center bg-secondary px-8 pt-4 pb-8 rounded-3xl relative mt-20">
      <h3 class="mb-6 text-xl font-bold">Connect Wallet</h3>
      <button
        class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 text-xl"
        onclick={() => (modalDisplay = false)}
      >
        &times;
      </button>
      <ul class="space-y-6 text-center">
        {@render connectSnippet("injected")}
        {@render connectSnippet("metaMask")}
        {@render connectSnippet("coinbaseWallet")}
        {@render connectSnippet("walletConnect")}
        {@render connectSnippet("burnerWallet")}
      </ul>
    </div>
  </div>
{/if}

{#snippet connectSnippet(type: string)}
  {@const { connector, slug, name } = findConnector(type)}
  {#if connector}
    <li class="flex align-center">
      <img src="/{slug}.svg" alt={name} class="w-8 h-8 mr-2" />
      <button class="btn btn-default btn-sm w-40" onclick={() => connectWallet(connector)}>
        {name}
      </button>
    </li>
  {/if}
{/snippet}
