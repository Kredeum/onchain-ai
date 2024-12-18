<script lang="ts">
  import { getAddress, isAddress } from "viem";
  import { anvil } from "viem/chains";
  import { CheckCircle, DocumentDuplicate, Icon } from "svelte-hero-icons";

  import { getBlockExplorerAddressLink } from "$lib/scaffold-eth/ts";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { BlockieAvatar } from "$lib/scaffold-eth/components";
  import { Address } from "$lib/wagmi/classes";

  const {
    address,
    disableAddressLink,
    format,
    size = "base"
  }: {
    address?: string | undefined;
    disableAddressLink?: boolean;
    format?: "short" | "long" | undefined;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  } = $props();

  const checksumAddress = $derived(address ? getAddress(address) : undefined);

  const blockieSizeMap = {
    xs: 6,
    sm: 7,
    base: 8,
    lg: 9,
    xl: 10,
    "2xl": 12,
    "3xl": 15
  };

  const addr = new Address(address, { ens: true });

  let addressCopied = $state(false);

  let displayAddress = $derived.by(() => {
    if (addr.ensName) {
      return addr.ensName;
    } else if (format === "long") {
      return checksumAddress;
    }
    return checksumAddress?.slice(0, 6) + "..." + checksumAddress?.slice(-4);
  });

  let blockExplorerAddressLink = $state<string>();
  $effect(() => {
    if (checksumAddress) {
      blockExplorerAddressLink = getBlockExplorerAddressLink(targetNetwork.chain, checksumAddress);
    }
  });
</script>

{#if !checksumAddress}
  <div class="flex animate-pulse space-x-4">
    <div class="h-6 w-6 rounded-md bg-slate-300"></div>
    <div class="flex items-center space-y-6">
      <div class="h-2 w-28 rounded bg-slate-300"></div>
    </div>
  </div>
{:else if !isAddress(checksumAddress)}
  <span class="text-error">Wrong address</span>
{:else}
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <BlockieAvatar
        address={checksumAddress}
        size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
        ensImage={addr.ensAvatar}
      />
    </div>
    {#if disableAddressLink}
      <span class="ml-1.5 text-{size} font-normal">{displayAddress}</span>
    {:else if targetNetwork.id === anvil.id}
      <span class="ml-1.5 text-{size} font-normal">
        <a href={blockExplorerAddressLink}>{displayAddress}</a>
      </span>
    {:else}
      <a
        class="ml-1.5 text-{size} font-normal"
        target="_blank"
        href={blockExplorerAddressLink}
        rel="noopener noreferrer"
      >
        {displayAddress}
      </a>
    {/if}
    {#if addressCopied}
      <Icon
        src={CheckCircle}
        class="ml-1.5 h-5 w-5 cursor-pointer text-xl font-normal text-sky-600"
        aria-hidden="true"
      />
    {:else}
      <Icon
        src={DocumentDuplicate}
        class="ml-1.5 h-5 w-5 cursor-pointer text-xl font-normal text-sky-600"
        aria-hidden="true"
        onclick={() => {
          navigator.clipboard.writeText(checksumAddress);
          addressCopied = true;
          setTimeout(() => (addressCopied = false), 800);
        }}
      />
    {/if}
  </div>
{/if}
