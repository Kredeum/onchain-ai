import { createClient, http } from "viem";
import { anvil, mainnet, type Chain } from "viem/chains";
import { createConfig } from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "$lib/burner-wallet";
import { getAlchemyHttpUrl } from "$lib/scaffold-eth/ts";
import scaffoldConfig from "$lib/scaffold.config";

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
    const client = createClient({ chain, transport: http(getAlchemyHttpUrl(chain.id)) });
    console.log("client created:", chain.id, client);
    if (chain.id === anvil.id) client.pollingInterval = scaffoldConfig.pollingInterval;
    return client;
  }
});

export { wagmiConfig };
