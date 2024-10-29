import { createReadContract } from "wagmi-svelte";
import { createOnchainAI } from "../runes/contract.svelte";

const createOnchainAIRead = ({
  functionName,
  args = []
}: {
  functionName: string;
  args?: string[];
}) => {
  const { chainId, address, abi } = $derived.by(createOnchainAI);

  const readContract = $derived.by(
    createReadContract({ chainId, address, abi, functionName, args })
  );

  return {
    get data() {
      return readContract?.data;
    }
  };
};

export { createOnchainAIRead };
