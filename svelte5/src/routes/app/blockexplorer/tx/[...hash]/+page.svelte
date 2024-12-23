<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  onMount(() => {
    const unsubscribe = page.subscribe(($page) => {
      const hash = $page.url.pathname.split("/").pop();
      goto(`/blockexplorer/transaction#${hash}`, { replaceState: true });
    });

    return () => {
      unsubscribe();
    };
  });
</script>
