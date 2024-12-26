<script lang="ts">
  import { replacer } from "@kredeum/wagmi-svelte5";
  import { Interactions } from "$lib/onchain-ai/classes";
  import { Account, wagmi } from "@kredeum/wagmi-svelte5";

  const account = new Account();

  $inspect("TEST INTERACTIONS chainId", account.chainId, wagmi.chainId);

  const interactions = new Interactions();
</script>

<div class="flex flex-col w-full p-4 items-center">
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#if interactions.list.length > 0}
        <pre class="whitespace-pre-wrap break-words px-5">{JSON.stringify(interactions.list, replacer, 2)}</pre>
      {:else}
        <p class="p-14 text-2xl">No Events found!</p>
      {/if}
    </div>
  </div>
</div>
