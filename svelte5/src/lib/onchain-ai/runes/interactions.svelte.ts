import { SvelteMap } from "svelte/reactivity";
import { type InteractionLogsParamsType, type InteractionLogWithArgs, type InteractionType } from "$lib/onchain-ai/ts";
import { createContract } from "$lib/wagmi/runes/";

const createInteractions = ({ all = false, limit = 3, refresh = 0 } = {}) => {
  let interactions: InteractionType[] = $state([]);
  let logsMap = $state(new SvelteMap());
  let interactionsMax: number = $derived(logsMap.size);

  const eventName = "InteractionLog";
  const { client, address, abi, account: sender } = $derived.by(() => createContract("OnChainAIv1"));
  // $inspect("createInteractions", chainId, address, sender);

  const paramsAll: InteractionLogsParamsType = $derived({ address, abi, eventName });
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
        const maxBlock = 100_000n;
        const fromBlock = toBlock > maxBlock ? toBlock - maxBlock : 0n;
        console.log("fetchLogs", fromBlock, toBlock);

        (
          (await client.getContractEvents({
            ...params,
            fromBlock,
            toBlock
          })) as InteractionLogWithArgs[]
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
        console.log("fetchLogs", fromBlock, toBlock, logsMap.size);

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
        const log = logs[0] as InteractionLogWithArgs;
        logsMap.set(log.args.requestId, log.args);

        interactions = ([...logsMap.values()] as InteractionType[]) //
          .reverse()
          .slice(0, limit);
      }
    });
  });

  // $inspect("interactions", interactions);

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
