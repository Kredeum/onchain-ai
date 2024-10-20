<script lang="ts">
  import { createPublicClient } from "wagmi-svelte";
  import { type Address, type Log, parseAbi } from "viem";
  import { replacer } from "$lib/utils/scaffold-eth/common";
  import { createOnchainAI } from "../runes/contract.svelte";
  import { createAccount } from "wagmi-svelte";

  type InteractionType = { requestId: string; sender: Address; prompt: string; response: string };
  type LogWithArgs = Log & { args: InteractionType };

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

  const client = $derived.by(createPublicClient());
  const { address, abi } = $derived.by(createOnchainAI);
  const { address: sender } = $derived.by(createAccount());

  $effect(() => {
    if (!(client && address && abi && sender)) return;

    client.watchContractEvent({
      address,
      abi,
      eventName,
      args: { sender },
      onLogs: (logs) => console.info(logs)
    });
  });

  $effect(() => {
    if (!(client && address && abi && sender)) return;

    console.log("$effect refresh", refresh);

    const fetchLogs = async () => {
      try {
        const toBlock = await client.getBlockNumber();
        const fromBlock = 0n; // toBlock > 1000n ? toBlock - 1000n : 0n;

        interactions = (
          (await client.getContractEvents({
            address,
            abi,
            eventName,
            args: { sender },
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
