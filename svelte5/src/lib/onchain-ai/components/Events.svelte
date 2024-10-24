<script lang="ts">
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createOnchainAI } from "../runes/contract.svelte";
  import type { InteractionType, LogWithArgs } from "../types";

  const eventName = "InteractionLog";

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

  const { client, address, abi, account: sender } = $derived.by(createOnchainAI);

  const logsMap = new Map();

  $effect(() => {
    if (!(client && address && abi && sender)) return;

    console.log("$effect refresh", refresh);

    const fetchLogs = async () => {
      try {
        const toBlock = await client.getBlockNumber();
        const fromBlock = 0n; // toBlock > 1000n ? toBlock - 1000n : 0n;

        (
          (await client.getContractEvents({
            address,
            abi,
            eventName,
            args: { sender },
            fromBlock,
            toBlock
          })) as LogWithArgs[]
        )
          .sort((a, b) => {
            const blockDelta = (Number(a.blockNumber) || 0) - (Number(b.blockNumber) || 0);
            const indexDelta = (Number(a.transactionIndex) || 0) - (b.transactionIndex || 0);
            return blockDelta > 0 ? 1 : blockDelta < 0 ? -1 : indexDelta;
          })
          .map((log) => log.args)
          .forEach((log) => {
            logsMap.set(log.requestId, log);
          });

        console.log("fetchLogs:", logsMap);

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);

        console.log("fetchLogs:", address, fromBlock, toBlock, interactions);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();
  });

  $effect(() => {
    if (!(client && address && abi && sender)) return;

    client.watchContractEvent({
      address,
      abi,
      eventName,
      args: { sender },
      // onLogs: (logs) => (interactions = [(logs[0] as LogWithArgs).args, ...interactions])
      onLogs: (logs) => {
        const log = logs[0] as LogWithArgs;
        logsMap.set(log.args.requestId, log.args);

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);

        console.log("onLogs:", interactions);
      }
    });
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
