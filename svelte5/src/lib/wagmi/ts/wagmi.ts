import { createClient, http } from "viem";
import { anvil, mainnet, type Chain } from "viem/chains";
import { createConfig as createWagmiConfig } from "@wagmi/core";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "$lib/burner-wallet";
import { getAlchemyHttpUrl } from "$lib/scaffold-eth/ts";
import scaffoldConfig from "$lib/scaffold.config";

const { onlyLocalBurnerWallet, walletConnectProjectId, targetNetworks } = scaffoldConfig;

export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

const connectors = [
  injected(),
  walletConnect({
    projectId: walletConnectProjectId,
    showQrModal: false
  }),
  coinbaseWallet({
    appName: "scaffold-eth-2",
    preference: "all"
  }),
  ...(!targetNetworks.some((network) => network.id !== anvil.id) || !onlyLocalBurnerWallet
    ? [createBurnerConnector()]
    : [])
];

export const wagmiConfig = createWagmiConfig({
  chains: enabledChains,
  connectors,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getAlchemyHttpUrl(chain.id)),
      ...(chain.id === (anvil as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval
          }
        : {})
    });
  }
});
