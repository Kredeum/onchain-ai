import { disconnect as disconnectWagmi } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

const createDisconnect = () => {
  const config = $derived.by(createConfig());

  const disconnect = async () => {
    await disconnectWagmi(config);
  };

  return {
    disconnect
  };
};

export { createDisconnect };
