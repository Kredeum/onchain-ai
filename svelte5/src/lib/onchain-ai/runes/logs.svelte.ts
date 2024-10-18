import { createPublicClient } from "wagmi-svelte";
import type { Address, Log } from "viem";

export const createContractLogs = (address: Address) => {
  let logs: Log[] = $state([]);
  let existingLogs: Log[];

  const client = $derived.by(createPublicClient());

  $effect(() => {

    const fetchLogs = async () => {
      if (!client) return console.error("Client not found");
      try {
        const chainId = await client.getChainId();
        // const toBlock = await client.getBlockNumber();
        // const fromBlock = toBlock - 50000n;
        const fromBlock = 0n;
        const toBlock = "latest";
        console.log("fetchLogs ~ chainId, fromBlock, toBlock, address", chainId, fromBlock, toBlock, address);

         existingLogs = await client.getLogs({ address, fromBlock, toBlock });
        console.log("fetchLogs ~ existingLogs:", existingLogs.length);

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
