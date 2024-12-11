import { createClient, http } from "viem";
import { anvil, mainnet, type Chain } from "viem/chains";
import { createConfig, getConnections, getPublicClient, reconnect } from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "$lib/burner-wallet";
import { getAlchemyTransport } from "$lib/scaffold-eth/ts";
import scaffoldConfig from "$lib/scaffold.config";
import { Client } from "./Client.svelte";

const { walletConnectProjectId, targetNetworks } = scaffoldConfig;

const connectors = [
  injected(),
  metaMask(),
  walletConnect({
    projectId: walletConnectProjectId,
    showQrModal: true
  }),
  coinbaseWallet({
    appName: "scaffold-eth-2",
    preference: "all"
  }),
  createBurnerConnector()
];

const chains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

const wagmiConfig = createConfig({
  chains,
  connectors,
  client({ chain }) {
    const client = createClient({ chain, transport: getAlchemyTransport(chain.id, "wss") });
    // console.log("WAGMI client created:", chain.id, client);

    if (chain.id === anvil.id) client.pollingInterval = scaffoldConfig.pollingInterval;
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
