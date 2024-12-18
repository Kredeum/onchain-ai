import * as chains from "viem/chains";
import scaffoldConfig from "$lib/scaffold.config";
import { http, webSocket } from "viem";

type ChainAttributes = {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  nativeCurrencyTokenAddress?: string;
};

export type ChainWithAttributes = chains.Chain & Partial<ChainAttributes>;

// Mapping of chainId to RPC chain name format followed by alchemy
export const RPC_CHAIN_ALCHEMY_NAMES: Record<number, string> = {
  [chains.mainnet.id]: "eth-mainnet",
  [chains.sepolia.id]: "eth-sepolia",
  [chains.holesky.id]: "eth-holesky",
  [chains.optimism.id]: "opt-mainnet",
  [chains.optimismSepolia.id]: "opt-sepolia",
  [chains.arbitrum.id]: "arb-mainnet",
  [chains.arbitrumSepolia.id]: "arb-sepolia",
  [chains.base.id]: "base-mainnet",
  [chains.baseSepolia.id]: "base-sepolia",
  [chains.scroll.id]: "scroll-mainnet",
  [chains.scrollSepolia.id]: "scroll-sepolia",
  [chains.linea.id]: "linea-mainnet",
  [chains.lineaSepolia.id]: "linea-sepolia",
  [chains.zksync.id]: "zksync-mainnet",
  [chains.zksyncSepoliaTestnet.id]: "zksync-sepolia",
  [chains.blast.id]: "blast-mainnet",
  [chains.mantle.id]: "mantle-mainnet",
  [chains.polygon.id]: "polygon-mainnet",
  [chains.polygonAmoy.id]: "polygon-amoy",
  [chains.polygonZkEvm.id]: "polygonzkevm-mainnet",
  [chains.polygonZkEvmCardona.id]: "polygonzkevm-cardona",
  [chains.astar.id]: "astar-mainnet"
};

export const getAlchemyUrl = (chainId: number, protocol: "https" | "wss" = "https") => {
  return RPC_CHAIN_ALCHEMY_NAMES[chainId]
    ? `${protocol}://${RPC_CHAIN_ALCHEMY_NAMES[chainId]}.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`
    : undefined;
};

export const getAlchemyTransport = (chainId: number, protocol: "https" | "wss" = "https") => {
  const fnProtocol = protocol === "https" ? http : webSocket;
  return fnProtocol(getAlchemyUrl(chainId, protocol));
};

export const NETWORKS_EXTRA_DATA: Record<string, ChainAttributes> = {
  [chains.anvil.id]: {
    color: "#b8af0c"
  },
  [chains.gnosis.id]: {
    color: "#48a9a6"
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e"
  },
  [chains.sepolia.id]: {
    color: ["#5f4bb6", "#87ff65"]
  },
  [chains.optimism.id]: {
    color: "#f01a37"
  },
  [chains.optimismSepolia.id]: {
    color: "#f01a37"
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0"
  },
  [chains.arbitrumSepolia.id]: {
    color: "#28a0f0"
  },
  [chains.base.id]: {
    color: "#239ad4"
  },
  [chains.baseSepolia.id]: {
    color: "#239ad4"
  },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  },
  [chains.polygonAmoy.id]: {
    color: "#92D9FA",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  },
  [chains.polygonZkEvm.id]: {
    color: "#1969ff"
  },
  [chains.polygonZkEvmCardona.id]: {
    color: "#1969ff"
  },
  [chains.scrollSepolia.id]: {
    color: "#fbebd4"
  }
};

/**
 * Gives the block explorer transaction URL, returns empty string if the network is a local chain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter((chainName) => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetNetwork = targetChainArr[0] as keyof typeof chains;
  const blockExplorerTxURL = chains[targetNetwork]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

/**
 * Gives the block explorer URL for a given address.
 * Defaults to Etherscan if no (wagmi) block explorer is configured for the network.
 */
export function getBlockExplorerAddressLink(network: chains.Chain, address: string) {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.anvil.id) {
    return `/blockexplorer/address#${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `https://etherscan.io/address/${address}`;
  }

  return `${blockExplorerBaseURL}/address/${address}`;
}

/**
 * @returns targetNetworks array containing networks configured in $lib/scaffold.config including extra network metadata
 */
export function getTargetNetworks(): ChainWithAttributes[] {
  return scaffoldConfig.targetNetworks.map((targetNetwork) => ({
    ...targetNetwork,
    ...NETWORKS_EXTRA_DATA[targetNetwork.id]
  }));
}
