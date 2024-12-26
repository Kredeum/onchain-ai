<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { newTargetNetwork } from "$lib/scaffold-eth/classes";
  import { Header, Footer } from "$lib/scaffold-eth/components";
  import { newWagmi } from "@kredeum/wagmi-svelte5";

  let { children }: { children: Snippet } = $props();

  newWagmi();
  newTargetNetwork();
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="relative flex flex-1 flex-col">{@render children()}</main>

  <Footer />
</div>
