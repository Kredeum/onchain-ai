import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { type Address } from "viem";
import { isAddress } from "$lib/components/scaffold-eth/inputs/utils";

import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes/config.svelte";
import { createAccount } from "$lib/wagmi/runes/account.svelte";
import { isEns } from "$lib/components/scaffold-eth/inputs";

const createEnsName = (address?: Address | string | null | undefined): { ensName: string } => {
  const config = $derived.by(createConfig());
  let ensName: string = $state("");

  (async () => {
    if (!address) return;
    if (!isAddress(address)) return;
    ensName = (await getEnsName(config, { chainId: 1, address: address as Address })) || "";
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

const createEnsAddress = (ensName: string = ""): { ensAddress: Address | null } => {
  const config = $derived.by(createConfig());
  let ensAddress: Address | null = $state(null);

  (async () => {
    ensAddress = await getEnsAddress(config, { chainId: 1, name: ensName });
  })();

  return {
    get ensAddress() {
      return ensAddress;
    }
  };
};

export { createEnsName, createEnsAvatar, createEnsAddress };
