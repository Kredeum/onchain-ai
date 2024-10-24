<script lang="ts">
  import Events from "$lib/onchain-ai/components/Events.svelte";

  let refresh: number = $state(0);
</script>

<div class="flex flex-col w-full p-4 items-center">
  <Events {refresh} display={true} />

  <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>
</div>
