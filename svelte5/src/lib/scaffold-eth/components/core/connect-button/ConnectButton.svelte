<script lang="ts">
  import type { Address } from "viem";
  import { createNetworkColor } from "$lib/scaffold-eth/runes";
  import { formatENS, formatAddress, getBlockExplorerAddressLink } from "$lib/scaffold-eth/ts";
  import { Account } from "$lib/wagmi/classes";
  import { createEnsAvatar, createEnsName } from "$lib/wagmi/runes";
  import { Balance } from "$lib/scaffold-eth/components";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import AddressInfoDropdown from "./AddressInfoDropdown.svelte";
  import AddressQRCodeModal from "./AddressQRCodeModal.svelte";
  import { Connect } from "$lib/wagmi/components";

  const account = new Account();
  const { chainId, address, chain, isConnected } = $derived(account);

  const networkColor = $derived.by(createNetworkColor());

  const { ensName: name } = $derived(createEnsName(address));
  const { ensAvatar } = $derived(createEnsAvatar(name));

  const blockExplorerAddressLink = $derived(
    address ? getBlockExplorerAddressLink(targetNetwork.chain, address) : undefined
  );

  const normalizeName = (name: string | undefined): string => (name ? name.toLowerCase().replace(/\s+/g, "-") : "");
  // $inspect("<ConnectButton", chainId, address, isConnected, accouXnt.account);
</script>

{#if !isConnected}
  <span class="text-xs p-4" style:color={networkColor}>
    {targetNetwork.name}
  </span>
  <Connect />
{:else}
  <div class="mr-1 flex flex-col items-center">
    <Balance address={address as Address} class="h-auto min-h-0" />
    <span
      id="connected-network"
      data-chain-name={normalizeName(chain?.name)}
      class="text-xs"
      style:color={networkColor}
    >
      {chain?.name}
    </span>
  </div>
  {#if address}
    <AddressInfoDropdown
      {address}
      displayName={name ? formatENS(name) : formatAddress(address)}
      {ensAvatar}
      {blockExplorerAddressLink}
    />
    <AddressQRCodeModal {address} modalId="qrcode-modal" />
  {/if}
{/if}
