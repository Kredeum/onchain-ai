import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { zeroAddress, type Address } from "viem";
import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes/config.svelte";
import { createAccount } from "$lib/wagmi/runes/account.svelte";

const createEnsName = (params?: { address?: Address }): { ensName: string } => {
  let { address } = params || {};
  if (!address) {
    const { account } = $derived(createAccount());
    const { address: accountAddress } = $derived(account);
    address ||= accountAddress;
  }
  address ||= zeroAddress;

  const config = $derived.by(createConfig());
  let ensName: string = $state("");
  (async () => {
    ensName = (await getEnsName(config, { chainId: 1, address })) || "";
  })();

  $inspect("RUNE address", address);
  $inspect("RUNE ensName", ensName);

  return {
    get ensName() {
      return ensName;
    }
  };
};

const createEnsAvatar = (params: { name: string }): { ensAvatar: string } => {
  let { name } = params || {};

  const config = $derived.by(createConfig());
  let ensAvatar: string = $state("");
  (async () => {
    ensAvatar = (await getEnsAvatar(config, { chainId: 1, name })) || "";
  })();

  $inspect("RUNE createEnsAvatar name", name);
  $inspect("RUNE createEnsAvatar ensAvatar", ensAvatar);

  return {
    get ensAvatar() {
      return ensAvatar;
    }
  };
};

const createEnsAddress = (params: { name: string }): { ensAddress: Address } => {
  let { name } = params || {};

  const config = $derived.by(createConfig());
  let ensAddress: Address = $state("0x");
  (async () => {
    ensAddress = (await getEnsAddress(config, { chainId: 1, name })) || "0x";
  })();

  $inspect("RUNE createEnsAddress name", name);
  $inspect("RUNE createEnsAddress ensAddress", ensAddress);

  return {
    get ensAddress() {
      return ensAddress;
    }
  };
};

export { createEnsName, createEnsAvatar, createEnsAddress };
