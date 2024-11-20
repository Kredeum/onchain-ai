<script lang="ts">
  import { reconnect } from "@wagmi/core";
  import { untrack, type Snippet } from "svelte";
  import { wagmiConfig } from "$lib/wagmi/ts";
  import { setNativeCurrencyPrice, createNativeCurrencyPrice, createDarkMode } from "$lib/scaffold-eth/runes";
  import { Header, Footer } from "$lib/scaffold-eth/components";

  let { children }: { children: Snippet } = $props();

  const price = createNativeCurrencyPrice();

  $effect(() => {
    setNativeCurrencyPrice(price.nativeCurrencyPrice);
  });

  $effect(() => {
    untrack(async () => {
      try {
        const recentConnectorId = await wagmiConfig.storage?.getItem("recentConnectorId");

        if (recentConnectorId) reconnect(wagmiConfig);
      } catch {}
    });
  });

  const { isDarkMode } = $derived.by(createDarkMode());
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="relative flex flex-1 flex-col">{@render children()}</main>

  <Footer />
</div>
