import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { zeroAddress, type Address } from "viem";
import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes/config.svelte";
import { createAccount } from "$lib/wagmi/runes/account.svelte";

const createEnsName = (address: Address = "0x"): { ensName: string } => {
  const config = $derived.by(createConfig());
  let ensName: string = $state("");

  (async () => {
    ensName = (await getEnsName(config, { chainId: 1, address })) || "";
  })();

  return {
    get ensName() {
      return ensName;
    }
  };
};

const createEnsAvatar = (ensName: string = ""): { ensAvatar: string } => {
  const config = $derived.by(createConfig());
  let ensAvatar: string = $state("");

  (async () => {
    ensAvatar = (await getEnsAvatar(config, { chainId: 1, name: ensName })) || "";
  })();

  return {
    get ensAvatar() {
      return ensAvatar;
    }
  };
};

const createEnsAddress = (ensName: string = ""): { ensAddress: Address } => {
  const config = $derived.by(createConfig());
  let ensAddress: Address = $state("0x");

  (async () => {
    ensAddress = (await getEnsAddress(config, { chainId: 1, name: ensName })) || "0x";
  })();

  return {
    get ensAddress() {
      return ensAddress;
    }
  };
};

export { createEnsName, createEnsAvatar, createEnsAddress };
