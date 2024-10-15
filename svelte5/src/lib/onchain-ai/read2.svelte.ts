import { createTargetNetworkId } from "$lib/runes/global.svelte";
import { readDeployments } from "@onchain-ai/common/lib/readJson";
import { untrack } from "svelte";
import { createReadContract } from "wagmi-svelte";

const createOnchainAIRead = () => {
	const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
	const { address, abi } = $derived(readDeployments(chainId).OnChainAIv1);
	const functionName = "lastResponse";

	let value = $state();

	const readContract = $derived.by(
		createReadContract(() => ({
			address,
			abi,
			functionName,
			chainId
		}))
	);

	$effect(() => {
		console.log("<Read $effect ~ reRead");
		value = readContract?.data;
	});

	$inspect("<Read value =", value);

	return {
		get value() {
			return value;
		}
	};
};

export { createOnchainAIRead };
