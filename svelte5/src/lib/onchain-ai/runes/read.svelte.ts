import { createReadContract } from "$lib/wagmi/runes/";
import { createOnchainAI } from "../runes/contract.svelte";

const createOnchainAIRead = ({
  functionName,
  args = []
}: {
  functionName: string;
  args?: string[];
}) => {
  const { address, abi } = $derived.by(createOnchainAI);

  const result = createReadContract({ address, abi, functionName, args });

  $inspect("{ address, abi, functionName, args }:", { address, abi, functionName, args });
  return {
    get data() {
      return result?.data;
    }
  };
};

export { createOnchainAIRead };
