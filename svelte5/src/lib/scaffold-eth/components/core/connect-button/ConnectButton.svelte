<script lang="ts">
  import type { Address } from "viem";
  import scaffoldConfig from "$lib/scaffold.config";
  import { createNetworkColor } from "$lib/scaffold-eth/runes";
  import { formatENS, formatAddress, getBlockExplorerAddressLink } from "$lib/scaffold-eth/ts";
  import { createEnsAvatar, createAccount, createEnsName } from "$lib/wagmi/runes";
  import { Balance } from "$lib/scaffold-eth/components";
  import { createTargetNetwork } from "$lib/scaffold-eth/runes";
  import AddressInfoDropdown from "./AddressInfoDropdown.svelte";
  import WrongNetworkDropdown from "./WrongNetworkDropdown.svelte";
  import AddressQRCodeModal from "./AddressQRCodeModal.svelte";
  import { Connect } from "$lib/wagmi/components";

  const targetNetwork = $derived.by(createTargetNetwork());

  const { account } = $derived(createAccount());
  const { address, chain, isConnected } = $derived(account);

  const connected = $derived(isConnected);
  const isChainUnsupported = $derived(
    chain?.id && !scaffoldConfig.targetNetworks.map((it) => it.id as number).includes(chain.id)
  );
  const networkColor = $derived.by(createNetworkColor());

  const { ensName: name } = $derived(createEnsName(address));
  const { ensAvatar } = $derived(createEnsAvatar(name));

  $inspect("RUNE connect-button name:", name);

  const blockExplorerAddressLink = $derived(address ? getBlockExplorerAddressLink(targetNetwork, address) : undefined);
</script>

{#if !connected}
  <Connect />
{:else if isChainUnsupported}
  <WrongNetworkDropdown />
{:else}
  <div class="mr-1 flex flex-col items-center">
    <Balance address={address as Address} class="h-auto min-h-0" />
    <span class="text-xs" style:color={networkColor}>
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
