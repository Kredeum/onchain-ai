<script lang="ts">
  import { type Config, createConfig, connect, http } from "@wagmi/core";
  import { mainnet, baseSepolia, optimismSepolia } from "viem/chains";
  import { injected, metaMask, coinbaseWallet, walletConnect as walletConnectFunc } from "@wagmi/connectors";
  import scaffoldConfig from "$lib/scaffold.config";
  import type { Address } from "viem";

  const walletConnect = () => walletConnectFunc({ projectId: scaffoldConfig.walletConnectProjectId });

  const connectors = [injected(), metaMask(), coinbaseWallet(), walletConnect()];
  type Connector = (typeof connectors)[number];

  const chains = [mainnet, baseSepolia, optimismSepolia] as const;
  const transports = {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http()
  };
  const config: Config<typeof chains, typeof transports> = createConfig({ chains, connectors, transports });

  let connectModal: HTMLInputElement | undefined = $state();
  $effect(() => {
    connectModal = document.getElementById("connect-modal") as HTMLInputElement;
  });

  let walletChainId: number | undefined = $state();
  let walletAddress: Address | undefined = $state();
  let walletName: string | undefined = $state();

  const connectWallet = async (connectorFunc: () => Connector) => {
    if (connectModal) connectModal.checked = false;
    walletName = connectorFunc.name;
    console.log("connectWallet ~ connector:", walletName);

    const wallet = await connect(config, { connector: connectorFunc() });
    console.log("connectWal ~ wallet:", wallet);

    walletChainId = wallet.chainId;
    walletAddress = wallet.accounts[0];
    console.log("connectWallet ~ connect:", walletChainId, walletAddress);
  };
</script>

<label for="connect-modal" class="btn btn-primary btn-sm"> Connect Wallet </label>
<input type="checkbox" id="connect-modal" class="modal-toggle" />

<label for="connect-modal" class="modal cursor-pointer">
  <label class="modal-box relative w-64 bg-secondary">
    <input class="absolute left-0 top-0 h-0 w-0" />
    <h3 class="mb-3 text-xl font-bold text-center">Connect Wallet</h3>
    <label for="connect-modal" class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 text-xl"> &times; </label>
    <ul class="space-y-4 text-center">
      <li class="flex align-center">
        <img src="/rabby.svg" alt="metaMask" class="w-8 h-8 mr-2" />
        <button class="btn btn-default btn-sm w-40" onclick={() => connectWallet(injected)}> Injected Wallet </button>
      </li>
      <li class="flex content-center">
        <img src="/metaMask.svg" alt="metaMask" class="w-8 h-8 mr-2" />
        <button class="btn btn-default btn-sm w-40" onclick={() => connectWallet(metaMask)}>Metamask</button>
      </li>
      <li class="flex content-center">
        <img src="/coinbase.svg" alt="metaMask" class="w-8 h-8 mr-2" />
        <button class="btn btn-default btn-sm w-40" onclick={() => connectWallet(coinbaseWallet)}
          >Coinbase Wallet</button
        >
      </li>
      <li class="flex content-center">
        <img src="/walletConnect.svg" alt="metaMask" class="w-8 h-8 mr-2" />
        <button class="btn btn-default btn-sm w-40" onclick={() => connectWallet(walletConnect)}>WalletConnect</button>
      </li>
    </ul>
  </label>
</label>
