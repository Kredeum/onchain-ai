<script lang="ts">
  import { reconnect } from "@wagmi/core";
  import { untrack, type Snippet } from "svelte";
  import { wagmiConfig } from "$lib/wagmi/ts";
  import { createNativeCurrencyPrice, createDarkMode } from "$lib/scaffold-eth/runes";
  import { newTargetNetwork } from "$lib/scaffold-eth/classes";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { Header, Footer } from "$lib/scaffold-eth/components";

  let { children }: { children: Snippet } = $props();

  const price = createNativeCurrencyPrice();

  newTargetNetwork();

  $effect(() => {
    targetNetwork.nativeCurrencyPrice = price.nativeCurrencyPrice;
  });

  $effect(() => {
    untrack(async () => {
      try {
        const recentConnectorId = await wagmiConfig.storage?.getItem("recentConnectorId");

        if (recentConnectorId) reconnect(wagmiConfig);
      } catch (e) {
        console.error("Failed to reconnect wallet", e);
      }
    });
  });

  const { isDarkMode } = $derived.by(createDarkMode());
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="relative flex flex-1 flex-col">{@render children()}</main>

  <Footer />
</div>
