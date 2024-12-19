<script lang="ts">
  import { ArrowsRightLeft, Icon } from "svelte-hero-icons";
  import { getTargetNetworks, type ChainWithAttributes } from "$lib/scaffold-eth/ts";
  import { getNetworkColor, createDarkMode } from "$lib/scaffold-eth/runes";
  import { targetNetwork, type TargetNetworkId } from "$lib/scaffold-eth/classes";
  import { Account } from "$lib/wagmi/classes";
  import { Network } from "$lib/wagmi/classes";

  const { hidden = false } = $props();

  const allowedNetworks = getTargetNetworks();

  const account = new Account();

  const { isDarkMode } = $derived.by(createDarkMode());

  const items = $derived(allowedNetworks.filter((network) => network.id !== account.chainId));

  const normalizeName = (name: string | undefined): string => (name ? name.toLowerCase().replace(/\s+/g, "-") : "");
</script>

{#each items as chain (chain.id)}
  <li class:hidden>
    <button
      id="switch-{normalizeName(chain.name)}"
      class="menu-item btn-sm flex gap-3 whitespace-nowrap !rounded-xl py-3"
      type="button"
      onclick={() => targetNetwork.switch(chain.id as TargetNetworkId)}
    >
      <Icon src={ArrowsRightLeft} class="ml-2 h-6 w-4 sm:ml-0" />
      <span>
        Switch to
        <span style:color={getNetworkColor(chain, isDarkMode)}>
          {chain.name}
        </span>
      </span>
    </button>
  </li>
{/each}
