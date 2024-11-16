<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { hydrate, type ResolvedRegister, type State } from "@wagmi/core";
  import { setContext, type Snippet } from "svelte";

  const { children, config } = $props<{
    children: Snippet;
    config: ResolvedRegister["config"];
  }>();

  setContext("wagmi", { config });
  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
