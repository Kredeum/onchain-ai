<script lang="ts">
  import { replacer } from "$lib/scaffold-eth/ts";
  import { Interactions } from "$lib/onchain-ai/classes";

  const interactions = new Interactions();
</script>

<div class="flex flex-col w-full p-4 items-center">
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#if interactions.list.length > 0}
        <pre class="whitespace-pre-wrap break-words px-5">{JSON.stringify(interactions.list, null, 2)}</pre>
      {:else}
        <p class="p-14 text-2xl">No Events found!</p>
      {/if}
    </div>
  </div>
</div>
