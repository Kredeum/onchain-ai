import type { Abi } from "abitype";
import { type Log, type Address } from "viem";
import { type LogWithArgs, type LogsParamsType } from "$lib/wagmi/ts";
import { createPublicClient } from "$lib/wagmi/runes";

const createEvents = (
  address: Address,
  abi: Abi,
  options: { chainId?: number; eventName?: string; args?: unknown[]; limit?: number } = {
    chainId: 1,
    limit: 10
  }
) => {
  let events: unknown[] = $state([]);
  let eventsAll: unknown[] = $state([]);

  const client = $derived.by(createPublicClient());

  const params: LogsParamsType = $derived({ address, abi, options });

  $effect(() => {
    if (!(client && params)) return;

    const fetchLogs = async () => {
      try {
        const toBlock = await client.getBlockNumber();
        const maxBlock = 10_000n;
        const fromBlock = toBlock > maxBlock ? toBlock - maxBlock : 0n;

        eventsAll = ((await client.getContractEvents({ ...params, fromBlock, toBlock })) as LogWithArgs[]).sort(
          (a, b) => {
            const blockDelta = (Number(a.blockNumber) || 0) - (Number(b.blockNumber) || 0);
            const indexDelta = (Number(a.transactionIndex) || 0) - (b.transactionIndex || 0);
            return blockDelta > 0 ? 1 : blockDelta < 0 ? -1 : indexDelta;
          }
        );

        events = eventsAll.reverse().slice(0, options.limit);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();

    client.watchContractEvent({
      ...params,
      onLogs: (logs: Log[]) => {
        events.unshift(logs);
        eventsAll.push(logs);
      }
    });
  });

  $inspect("events", events);

  return {
    get events() {
      return events;
    },
    get eventsMax() {
      return events.length;
    }
  };
};

export { createEvents };
