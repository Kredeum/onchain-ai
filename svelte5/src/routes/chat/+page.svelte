<script lang="ts">
  import Chat from "$lib/onchain-ai/components/Chat.svelte";

  let refresh: number = $state(0);
</script>

<div class="flex flex-col w-full p-4 items-center">
  <button class="btn btn-sm h-10 rounded-full" onclick={() => refresh++}>Refresh</button>

  <Chat {refresh} />
</div>
