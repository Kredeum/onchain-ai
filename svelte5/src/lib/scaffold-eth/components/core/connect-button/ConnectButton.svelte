<script lang="ts">
  import type { Address as AddressType } from "viem";
  import { createNetworkColor } from "$lib/scaffold-eth/runes";
  import { formatENS, formatAddress, getBlockExplorerAddressLink } from "$lib/scaffold-eth/ts";
  import { Account } from "$lib/wagmi/classes";
  import { Balance } from "$lib/scaffold-eth/components";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import AddressInfoDropdown from "./AddressInfoDropdown.svelte";
  import AddressQRCodeModal from "./AddressQRCodeModal.svelte";
  import { Connect } from "$lib/wagmi/components";

  const account = new Account({ ens: true });
  const { address, chain, isConnected, ensName, ensAvatar } = $derived(account);

  const networkColor = $derived.by(createNetworkColor());

  const blockExplorerAddressLink = $derived(
    address ? getBlockExplorerAddressLink(targetNetwork.chain, address) : undefined
  );

  const normalizeName = (name: string | undefined): string => (name ? name.toLowerCase().replace(/\s+/g, "-") : "");
  // $inspect("<ConnectButton", chainId, address, isConnected, accouXnt.account);
</script>

{#if !isConnected}
  <span class="text-xs p-4" style:color={networkColor}>
    {targetNetwork?.name}
  </span>
  <Connect />
{:else}
  <div class="mr-1 flex flex-col items-center">
    <Balance address={address as AddressType} class="h-auto min-h-0" />
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
      displayName={ensName ? formatENS(ensName) : formatAddress(address)}
      {ensAvatar}
      {blockExplorerAddressLink}
    />
    <AddressQRCodeModal {address} modalId="qrcode-modal" />
  {/if}
{/if}
