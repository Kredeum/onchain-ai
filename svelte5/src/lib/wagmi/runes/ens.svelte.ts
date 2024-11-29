import { type Address } from "viem";
import { isAddress } from "$lib/scaffold-eth/ts";

import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/classes";

const createEnsName = (
  address?: Address | string | null | undefined
): {
  fetch: () => Promise<string | undefined>;
  readonly ensName: string;
} => {
  let ensName: string = $state("");

  const fetch = async () => {
    if (!(address && isAddress(address))) return;

    ensName = (await getEnsName(wagmiConfig, { chainId: 1, address: address as Address })) || "";

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
  let ensAvatar: string = $state("");

  const fetch = async () => {
    if (!ensName) return;

    ensAvatar = (await getEnsAvatar(wagmiConfig, { chainId: 1, name: ensName })) || "";

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
  let ensAddress: Address | null = $state(null);

  const fetch = async () => {
    if (!ensName) return;

    ensAddress = await getEnsAddress(wagmiConfig, { chainId: 1, name: ensName });

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
