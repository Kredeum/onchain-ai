<script lang="ts">
  import { onMount } from "svelte";
  import { type Account, type Address, type HttpTransport } from "viem";
  import { baseSepolia, optimismSepolia, base, anvil } from "viem/chains";
  import { type Config, connect, http, switchChain } from "@wagmi/core";
  import { injected, metaMask, coinbaseWallet, safe, walletConnect } from "@wagmi/connectors";

  import scaffoldConfig from "$lib/scaffold.config";
  import { createConfig } from "$lib/wagmi/runes";
  import { SvelteMap } from "svelte/reactivity";

  type Connector = () => any;
  type ConnectorMap = { connector: Connector; name: string; title: string };

  let { chainId = $bindable(), address = $bindable() }: { chainId?: number; address?: Address } = $props();

  const config = $derived.by(createConfig());
  let walletName = $state<string>();

  let connectorsMap: Map<string, ConnectorMap> = new SvelteMap();

  onMount(() => {
    const provider = window.ethereum;
    if (provider) {
      // prettier-ignore
      let name =  provider.isRabby ?       "rabby"
                : provider.isBraveWallet ? "brave"
                : provider.isTally?        "taho"
                : provider.isTrust ?       "trust"
                : provider.isFrame ?       "frame"
                :                          "injected";
      let title = `${name.charAt(0).toUpperCase()}${name.slice(1)} Wallet`;
      connectorsMap.set(name === "injected" ? "injected" : "wallet", { connector: injected, name, title });
    }

    connectorsMap.set("metaMask", {
      connector: metaMask,
      name: "metaMask",
      title: "MetaMask"
    });

    connectorsMap.set("coinbaseWallet", {
      connector: coinbaseWallet,
      name: "coinbaseWallet",
      title: "Coinbase Wallet"
    });

    connectorsMap.set("walletConnect", {
      connector: () => walletConnect({ projectId: scaffoldConfig.walletConnectProjectId }),
      name: "walletConnect",
      title: "WalletConnect"
    });

    const isIframe = typeof window !== "undefined" && window?.parent !== window;
    if (isIframe) {
      connectorsMap.set("safe", {
        connector: () => safe({ allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/], debug: true }),
        name: "safe",
        title: "Safe"
      });
    }
  });

  const connectWallet = async (connectorMap: ConnectorMap) => {
    if (!config) return;
    modalDisplay = false;

    walletName = connectorMap.name;
    chainId = undefined;
    address = undefined;

    const connector = connectorMap.connector();
    const wallet = await connect(config, { connector });

    chainId = wallet.chainId;
    address = wallet.accounts[0];

    if (!scaffoldConfig.targetNetworks.find((nw) => nw.id === chainId)) {
      console.log("connectWallet ~ switchChain:", scaffoldConfig.targetNetworks[0].id);
      switchChain(config, { chainId: scaffoldConfig.targetNetworks[0].id });
    }
  };

  let modalDisplay = $state(false);
</script>

<button class="btn btn-primary btn-sm" onclick={() => (modalDisplay = true)}> Connect Wallet </button>

{#if modalDisplay}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div class="flex flex-col items-center bg-secondary px-6 pt-4 pb-6 rounded-3xl relative">
      <h3 class="mb-4 text-xl font-bold">Connect Wallet</h3>
      <button
        class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 text-xl"
        onclick={() => (modalDisplay = false)}
      >
        &times;
      </button>
      <ul class="space-y-4 text-center">
        {@render connectSnippet("wallet")}
        {@render connectSnippet("metaMask")}
        {@render connectSnippet("coinbaseWallet")}
        {@render connectSnippet("walletConnect")}
        {@render connectSnippet("injected")}
        {@render connectSnippet("safe")}
      </ul>
    </div>
  </div>
{/if}

{#snippet connectSnippet(connectorName: string)}
  {@const connectorMap = connectorsMap.get(connectorName)}
  {#if connectorMap}
    <li class="flex align-center">
      <img src="/{connectorMap.name}.svg" alt={connectorMap.title} class="w-8 h-8 mr-2" />
      <button
        class="btn btn-default btn-sm w-40 {walletName === connectorMap.name ? 'btn-accent' : ''}"
        onclick={() => connectWallet(connectorMap)}
      >
        {connectorMap.title}
      </button>
    </li>
  {/if}
{/snippet}
