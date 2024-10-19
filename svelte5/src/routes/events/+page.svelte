<script lang="ts">
  import Events from "$lib/onchain-ai/components/Events.svelte";

  let refresh: number = $state(0);
</script>

<div class="flex flex-col w-full max-w-5xl p-4">
  <div class="p-2">
    <Events {refresh} />
  </div>

  <div class="pt-4 text-center">
    <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>
  </div>
</div>
