import { createClient } from "viem";
import { anvil, mainnet, type Chain } from "viem/chains";
import { createConfig, reconnect } from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "$lib/burner-wallet";
import { Client } from "$lib/wagmi/classes";
import { ALCHEMY_TRANSPORT, POLLING_INTERVAL, TARGET_NETWORKS, WALLET_CONNECT_PROJECT_ID } from "$lib/wagmi/config";

const connectors = [
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

const chains = TARGET_NETWORKS.find((network: Chain) => network.id === 1)
  ? TARGET_NETWORKS
  : ([...TARGET_NETWORKS, mainnet] as const);

const wagmiConfig = createConfig({
  chains,
  connectors,
  client({ chain }) {
    const client = createClient({ chain, transport: ALCHEMY_TRANSPORT(chain.id, "wss") });
    // console.log("WAGMI client created:", chain.id, client);

    if (chain.id === anvil.id) client.pollingInterval = POLLING_INTERVAL;
    return client;
  }
});

class Wagmi extends Client {
  recentConnectorId = $state();

  reconnect = async () => {
    this.recentConnectorId = await wagmiConfig.storage?.getItem("recentConnectorId");
    if (this.recentConnectorId) reconnect(wagmiConfig);
  };

  constructor() {
    super();
    this.reconnect();
  }
}

let wagmi: Wagmi;
// Should only be instantiate once, by main app `ScaffoldEthApp.svelte`
const newWagmi = () => (wagmi ||= new Wagmi());

export { newWagmi, wagmi, wagmiConfig };
