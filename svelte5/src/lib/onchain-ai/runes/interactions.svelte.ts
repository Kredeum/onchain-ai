import type { InteractionType, LogWithArgs, LogsParamsType } from "../types";
import { createOnchainAI } from "./contract.svelte";
import { SvelteMap } from "svelte/reactivity";

const createInteractions = ({ all = false, limit = 3, refresh = 0 } = {}) => {
  let interactions: InteractionType[] = $state([]);
  let logsMap = $state(new SvelteMap());
  let interactionsMax: number = $derived(logsMap.size);

  const eventName = "InteractionLog";
  const { chainId, client, address, abi, account: sender } = $derived.by(createOnchainAI);
  $inspect("createInteractions", chainId, address, sender);

  const paramsAll: LogsParamsType = $derived({ address, abi, eventName });
  const params = $derived.by(() => {
    if (!(address && abi)) return;

    return all ? paramsAll : { ...paramsAll, args: { sender } };
  });

  $effect(() => {
    if (!(client && params)) return;

    refresh;
    logsMap = new SvelteMap();

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

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();


    client.watchContractEvent({
      ...params,
      onLogs: (logs) => {
        const log = logs[0] as LogWithArgs;
        logsMap.set(log.args.requestId, log.args);

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);
      }
    });
  });

  $inspect("interactions", interactions);

  return {
    get interactions() {
      return interactions;
    },
    get interactionsMax() {
      return interactionsMax;
    }
  };

};

export { createInteractions };
