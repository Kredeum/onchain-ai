import { createClient } from "viem";
import { anvil, mainnet, type Chain } from "viem/chains";
import { createConfig, reconnect, type Config } from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "$lib/wagmi/ts";
import { Client } from "$lib/wagmi/classes";
import { ALCHEMY_TRANSPORT, POLLING_INTERVAL, TARGET_NETWORKS, WALLET_CONNECT_PROJECT_ID } from "$lib/wagmi/config";

class Wagmi extends Client {
  #connectors = [
    injected(),
    metaMask(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true
    }),
    coinbaseWallet({
      appName: "scaffold-eth-2",
      preference: "all"
    }),
    createBurnerConnector()
  ];

  #chains = TARGET_NETWORKS.find((network: Chain) => network.id === 1)
    ? TARGET_NETWORKS
    : ([...TARGET_NETWORKS, mainnet] as const);

  config = $state(createConfig({
    chains: this.#chains,
    connectors: this.#connectors,
    client({ chain }) {
      const client = createClient({ chain, transport: ALCHEMY_TRANSPORT(chain.id, "wss") });
      // console.log("WAGMI client created:", chain.id, client);

      if (chain.id === anvil.id) client.pollingInterval = POLLING_INTERVAL;
      return client;
    }
  }));

  recentConnectorId = $state();

  reconnect = async () => {
    this.recentConnectorId = await this.config.storage?.getItem("recentConnectorId");
    if (this.recentConnectorId) reconnect(this.config);
  };

  constructor() {
    super();
    this.reconnect();

    $inspect("WAGMI", this.config.state.chainId, this.config);
  }
}

let wagmi: Wagmi;
let wagmiConfig: Config;
// Should only be instantiate once, by main app `ScaffoldEthApp.svelte`
const newWagmi = () => {
  wagmi ||= new Wagmi();
  wagmiConfig = wagmi.config;
}

export { newWagmi, wagmi, wagmiConfig };
