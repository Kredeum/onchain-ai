<script lang="ts">
  import { getNetworkColor } from "$lib/runes/networkColor.svelte";
  import { getTargetNetworks, type ChainWithAttributes } from "$lib/utils/scaffold-eth/networks";
  import { createAccount, createSwitchChain } from "wagmi-svelte";
  import { ArrowsRightLeft, Icon } from "svelte-hero-icons";
  import { createDarkMode } from "$lib/runes/darkMode.svelte";

  const { hidden = false } = $props();

  const allowedNetworks = getTargetNetworks();

  const { chain } = $derived.by(createAccount());
  const switchChain = $derived.by(createSwitchChain());
  const { isDarkMode } = $derived.by(createDarkMode());

  const items = $derived(allowedNetworks.filter((network) => network.id !== chain?.id));
</script>

{#each items as network (network.id)}
  <li class:hidden>
    <button
      class="menu-item btn-sm flex gap-3 whitespace-nowrap !rounded-xl py-3"
      type="button"
      onclick={() => {
        switchChain.switchChain?.({ chainId: network.id });
      }}
    >
      <Icon src={ArrowsRightLeft} class="ml-2 h-6 w-4 sm:ml-0" />
      <span>
        Switch to
        <span style:color={getNetworkColor(network, isDarkMode)}>
          {network.name}
        </span>
      </span>
    </button>
  </li>
{/each}
