<script>
  import Chat from "$lib/onchain-ai/Chat.svelte";

  let refresh = $state(0);
</script>

<Chat {refresh} />

<div class="mx-8">
  <button class="btn" onclick={() => refresh++}>Refresh</button>
</div>
