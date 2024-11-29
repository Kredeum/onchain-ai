<script lang="ts">
  import { ArrowsRightLeft, Icon } from "svelte-hero-icons";
  import { getTargetNetworks, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
  import { getNetworkColor, createDarkMode } from "$lib/scaffold-eth/runes";
  import { Account } from "$lib/wagmi/classes";
  import { BlockChain } from "$lib/wagmi/classes";
  import { type TargetNetworkId } from "$lib/scaffold-eth/classes";

  const { hidden = false } = $props();

  const allowedNetworks = getTargetNetworks();

  const account = new Account();

  const blockChain = new BlockChain();
  const { isDarkMode } = $derived.by(createDarkMode());

  const items = $derived(allowedNetworks.filter((network) => network.id !== account.chainId));

  const normalizeName = (name: string | undefined): string => (name ? name.toLowerCase().replace(/\s+/g, "-") : "");
</script>

{#each items as network (network.id)}
  <li class:hidden>
    <button
      id="switch-{normalizeName(network.name)}"
      class="menu-item btn-sm flex gap-3 whitespace-nowrap !rounded-xl py-3"
      type="button"
      onclick={() => {
        blockChain.switchChain?.(network.id as TargetNetworkId);
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
