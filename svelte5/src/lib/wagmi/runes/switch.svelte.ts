import { switchChain as switchChainWagmi } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

const createSwitchChain = () => {
  const config = $derived.by(createConfig());

  const switchChain = async (chainId: number) => {
    await switchChainWagmi(config, { chainId });
  };

  return {
    switchChain
  };
};

export { createSwitchChain };
