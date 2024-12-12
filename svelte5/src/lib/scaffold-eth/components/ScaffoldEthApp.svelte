<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { newTargetNetwork } from "$lib/wagmi/classes";
  import { newWagmi } from "$lib/wagmi/classes";
  import { Header, Footer } from "$lib/scaffold-eth/components";

  let { children }: { children: Snippet } = $props();

  newWagmi();
  newTargetNetwork();
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="relative flex flex-1 flex-col">{@render children()}</main>

  <Footer />
</div>
