import { type Address } from "viem";
import { isAddress } from "$lib/scaffold-eth/ts";

import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

const createEnsName = (
  address?: Address | string | null | undefined
): {
  fetch: () => Promise<string | undefined>;
  readonly ensName: string;
} => {
  const config = $derived.by(createConfig());
  let ensName: string = $state("");

  const fetch = async () => {
    if (!(address && isAddress(address))) return;

    ensName = (await getEnsName(config, { chainId: 1, address: address as Address })) || "";

    return ensName;
  };
  fetch();

  return {
    fetch,
    get ensName() {
      return ensName;
    }
  };
};

const createEnsAvatar = (
  ensName: string = ""
): {
  fetch: () => Promise<string | undefined>;
  readonly ensAvatar: string;
} => {
  const config = $derived.by(createConfig());
  let ensAvatar: string = $state("");

  const fetch = async () => {
    if (!ensName) return;

    ensAvatar = (await getEnsAvatar(config, { chainId: 1, name: ensName })) || "";

    return ensAvatar;
  };
  fetch();

  return {
    fetch,
    get ensAvatar() {
      return ensAvatar;
    }
  };
};

const createEnsAddress = (
  ensName: string = ""
): {
  fetch: () => Promise<string | null | undefined>;
  readonly ensAddress: Address | null;
} => {
  const config = $derived.by(createConfig());
  let ensAddress: Address | null = $state(null);

  const fetch = async () => {
    if (!ensName) return;

    ensAddress = await getEnsAddress(config, { chainId: 1, name: ensName });

    return ensAddress;
  };
  fetch();

  return {
    fetch,
    get ensAddress() {
      return ensAddress;
    }
  };
};

export { createEnsName, createEnsAvatar, createEnsAddress };
