<script lang="ts">
	import { createTargetNetworkId } from "$lib/runes/global.svelte";
	import { readDeployments } from "@onchain-ai/common/lib/readJson";
	import { untrack } from "svelte";
	import { createReadContract } from "wagmi-svelte";

	let { functionName = "lastInteraction", refresh = 0, interaction = $bindable() } = $props();
	const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
	const { address, abi } = $derived(readDeployments(chainId).OnChainAIv1);

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
		interaction = readContract?.data as [string, string, string];
	});

	$effect(() => {
		refresh;
		console.log("<Read $effect ~ refetch");
		untrack(() => readContract?.refetch());
	});

	$inspect("<Read refresh =", refresh);
	$inspect("<Read interaction =", interaction);
</script>
