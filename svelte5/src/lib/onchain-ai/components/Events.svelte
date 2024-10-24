<script lang="ts">
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createOnchainAI } from "../runes/contract.svelte";
  import type { InteractionType, LogWithArgs, LogsParamsType } from "../types";
  import { SvelteMap } from "svelte/reactivity";

  let {
    interactions = $bindable([]),
    refresh = 0,
    count = $bindable(0),
    limit = 3,
    all = false,
    display = false
  }: {
    interactions?: InteractionType[];
    refresh?: number;
    count?: number;
    limit?: number;
    all?: boolean;
    display?: boolean;
  } = $props();

  const eventName = "InteractionLog";
  const { client, address, abi, account: sender } = $derived.by(createOnchainAI);

  const paramsAll: LogsParamsType = $derived({ address, abi, eventName });
  const params: LogsParamsType | undefined = $derived.by(() => {
    if (!(address && abi && sender)) return;

    return all ? paramsAll : { ...paramsAll, args: { sender } };
  });

  let logsMap = $state(new SvelteMap());
  $effect(() => {
    count = logsMap.size;
  });

  $effect(() => {
    if (!(client && params)) return;

    refresh;
    logsMap = new SvelteMap();

    console.log("$effect fetchLogs", params);

    const fetchLogs = async () => {
      try {
        const toBlock = await client.getBlockNumber();
        const fromBlock = 0n;

        ((await client.getContractEvents({ ...params, fromBlock, toBlock })) as LogWithArgs[])
          .sort((a, b) => {
            const blockDelta = (Number(a.blockNumber) || 0) - (Number(b.blockNumber) || 0);
            const indexDelta = (Number(a.transactionIndex) || 0) - (b.transactionIndex || 0);
            return blockDelta > 0 ? 1 : blockDelta < 0 ? -1 : indexDelta;
          })
          .map((log) => log.args)
          .forEach((log) => {
            logsMap.set(log.requestId, log);
          });

        // console.log("fetchLogs:", logsMap);

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);

        console.log("fetchLogs:", address, fromBlock, toBlock, interactions);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();

    console.log("$effect watchLogs", params);

    client.watchContractEvent({
      ...params,
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
  <div class="font-bold">
    {#if all}All{:else}My{/if}
    {interactions.length}/{logsMap.size} events
  </div>
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each interactions as interaction, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">
{JSON.stringify(interaction, replacer, 2)}</pre>
      {/each}
    </div>
  </div>
{/if}
