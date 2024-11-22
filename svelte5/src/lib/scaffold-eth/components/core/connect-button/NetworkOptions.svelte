<script lang="ts">
  import { ArrowsRightLeft, Icon } from "svelte-hero-icons";
  import { getTargetNetworks, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
  import { getNetworkColor, createDarkMode } from "$lib/scaffold-eth/runes";
  import { createAccount } from "$lib/wagmi/runes";
  import { BlockChain } from "$lib/wagmi/classes";

  const { hidden = false } = $props();

  const allowedNetworks = getTargetNetworks();

  const { account } = $derived(createAccount());
  const { chain } = $derived(account);

  const blockChain = new BlockChain();
  const { isDarkMode } = $derived.by(createDarkMode());

  const items = $derived(allowedNetworks.filter((network) => network.id !== chain?.id));
</script>

{#each items as network (network.id)}
  <li class:hidden>
    <button
      id="switch-{network.name.toLowerCase()}"
      class="menu-item btn-sm flex gap-3 whitespace-nowrap !rounded-xl py-3"
      type="button"
      onclick={() => {
        blockChain.switchChain?.(network.id);
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
