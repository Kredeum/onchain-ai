import { createPublicClient } from "wagmi-svelte";
import type { Address, Log } from "viem";

const createOnchainAIEvents = (address: Address) => {
  let logs = $state<Log[]>([]);
  const client = $derived.by(createPublicClient());

  $effect(() => {
    const fetchLogs = async () => {
      if (!client) return console.error("Client not found");
      try {
        const lastBlock = await client.getBlockNumber();
        const existingLogs = await client.getLogs({
          address: address,
          fromBlock: lastBlock > 1000n ? lastBlock - 1000n : 0n,
          toBlock: lastBlock
        });
        logs = existingLogs ?? [];
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };
    fetchLogs();

    return client?.watchBlockNumber({
      onBlockNumber: async (_blockNumber, prevBlockNumber) => {
        const newLogs = await client.getLogs({
          address: address,
          fromBlock: prevBlockNumber,
          toBlock: "latest"
        });
        logs = [...logs, ...(newLogs ?? [])];
      }
    });
  });

  return () => logs;
};

export { createOnchainAIEvents };