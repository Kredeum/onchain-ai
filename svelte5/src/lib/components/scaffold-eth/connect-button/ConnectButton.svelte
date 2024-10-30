<script lang="ts">
  import { modal } from "$lib/modal";
  import scaffoldConfig from "$lib/scaffold.config";
  import { createEnsAvatar, createAccount, createEnsName } from "$lib/wagmi/runes";
  import WrongNetworkDropdown from "./WrongNetworkDropdown.svelte";
  import { Balance } from "$lib/components/scaffold-eth";
  import type { Address } from "viem";
  import { createNetworkColor } from "$lib/runes/networkColor.svelte";
  import AddressInfoDropdown from "./AddressInfoDropdown.svelte";
  import { formatENS, formatAddress } from "./utils";
  import { getBlockExplorerAddressLink } from "$lib/utils/scaffold-eth/networks";
  import { createTargetNetwork } from "$lib/runes/targetNetwork.svelte";
  import AddressQRCodeModal from "./AddressQRCodeModal.svelte";

  const targetNetwork = $derived.by(createTargetNetwork());

  const { account } = $derived(createAccount());
  const { address, chain, isConnected } = $derived(account);

  const connected = $derived(isConnected);
  const isChainUnsupported = $derived(
    chain?.id && !scaffoldConfig.targetNetworks.map((it) => it.id as number).includes(chain.id)
  );
  const networkColor = $derived.by(createNetworkColor());

  const { ensName: name } = $derived(createEnsName({ address }));
  const { ensAvatar } = $derived(createEnsAvatar({ name }));

  $inspect("RUNE connect-button name:", name);

  const blockExplorerAddressLink = $derived(
    address ? getBlockExplorerAddressLink(targetNetwork, address) : undefined
  );
</script>

{#if !connected}
  <button class="btn btn-primary btn-sm" onclick={() => modal.open()} type="button">
    Connect Wallet
  </button>
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
