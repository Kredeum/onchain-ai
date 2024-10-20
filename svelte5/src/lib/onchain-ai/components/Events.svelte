<script lang="ts">
  import { createPublicClient } from "wagmi-svelte";
  import { type Address, type Log, parseAbi } from "viem";
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createOnchainAI } from "../runes/contract.svelte";

  type InteractionType = { requestId: string; prompt: string; response: string };
  type LogWithArgs = Log & { args: InteractionType };

  let {
    interactions = $bindable([]),
    refresh = 0,
    limit = 3,
    display = false
  }: {
    interactions?: InteractionType[];
    refresh?: number;
    limit?: number;
    display?: boolean;
  } = $props();

  const { address } = $derived.by(createOnchainAI);
  const client = $derived.by(createPublicClient());

  $effect(() => {
    console.log("$effect refresh", refresh);

    const fetchLogs = async () => {
      if (!(client && address)) return console.error("<Events: Client or Address not found");
      try {
        const toBlock = await client.getBlockNumber();
        const events = parseAbi([
          // "event PromptLog(bytes32 indexed requestId, string prompt, address sender)",
          "event ResponseLog(bytes32 indexed requestId, string prompt, string response)"
        ]);
        const fromBlock = 0n; // toBlock > 1000n ? toBlock - 1000n : 0n;

        interactions = (
          (await client.getLogs({
            address,
            events,
            fromBlock,
            toBlock
          })) as LogWithArgs[]
        )
          .sort((a, b) => Number((b.blockNumber || 0n) - (a.blockNumber || 0n)))
          .map((log) => log.args)
          .slice(0, limit);

        console.log("fetchLogs:", address, fromBlock, toBlock, interactions);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();
  });
</script>

{#if display}
  <div class="flex flex-col gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each interactions as interaction, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(interaction, replacer, 2)}</pre>
      {/each}
    </div>
  </div>
{/if}

<!-- {#if events?.length > 0}
  {events.length} Events
  {#each events as event, i (i)}
    <pre>{JSON.stringify(event, replacer, 2)}</pre>
  {/each}
{:else}
  <div class="bg-gray-100 p-4 m-4 rounded-lg">
    <em> No contract Events yet </em>
  </div>
{/if} -->
