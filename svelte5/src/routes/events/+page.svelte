<script lang="ts">
  import Events from "$lib/onchain-ai/components/Events.svelte";

  let refresh: number = $state(0);
  let all: boolean = $state(false);
  let limit: number = $state(10);
  let count: number = $state(0);

  let noMore: boolean = $derived(limit >= count);
</script>

<div class="flex flex-col w-full p-4 items-center">
  <Events {refresh} display={true} {limit} {all} bind:count />

  <div class="flex py-4 w-2/3 justify-center">
    <button
      class="btn btn-sm h-10 rounded-full mx-4"
      onclick={() => {
        refresh++;
        all = false;
      }}>My events</button
    >

    <button
      class="btn btn-sm h-10 rounded-full mx-4"
      onclick={() => {
        refresh++;
        all = true;
      }}>All events</button
    >
    <button
      class="btn btn-sm h-10 rounded-full mx-24"
      disabled={noMore}
      onclick={() => {
        refresh++;
        limit += 10;
      }}>More events</button
    >
  </div>
</div>
