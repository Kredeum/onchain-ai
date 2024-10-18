<script>
  import Chat from "$lib/onchain-ai/components/Chat.svelte";

  let refresh = $state(0);
</script>

<div class="m-10">
  <Chat {refresh} />

  <div class="pt-4">
    <button class="btn" onclick={() => refresh++}>Refresh</button>
  </div>
</div>
