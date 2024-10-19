<script lang="ts">
  import Chat from "$lib/onchain-ai/components/Chat.svelte";

  let refresh: number = $state(0);
</script>

<div class="flex flex-col w-full max-w-lg p-4">
  <div class="p-2">
    <Chat {refresh} />
  </div>

  <div class="pt-4 text-center">
    <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>
  </div>
</div>
