import { targetNetwork } from "$lib/scaffold-eth/classes";
import type { ChainWithAttributes } from "$lib/scaffold-eth/ts";
import { createDarkMode } from "./darkMode.svelte";

export const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

export function getNetworkColor(network: ChainWithAttributes, isDarkMode: boolean) {
  const colorConfig = network?.color ?? DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
}

export const createNetworkColor = () => {
  const { isDarkMode } = $derived.by(createDarkMode());

  return () => getNetworkColor(targetNetwork?.chain, isDarkMode);
};
