<script lang="ts">
	import ReadOnChainAI from "$lib/onchain-ai/Read.svelte";
	import { untrack } from "svelte";

	let { refresh = 0 } = $props();

	let interaction: [string, string, string] = $state(["", "", ""]);
	const interactions: [string, string, string][] = $state([]);

	const findRequestId = (requestId: string): number =>
		interactions.findIndex((item) => item[0] === requestId);

	$effect(() => {
		if (!(interaction && interaction[0])) return;

		untrack(() => {
			const index = findRequestId(interaction[0]);
			if (index >= 0) {
				interactions[index] = interaction;
			} else {
				interactions.push(interaction);
			}
		});

		console.log("<Chat $effect", interaction, interaction[0]);
	});

	$inspect("chat interactions:", interactions);
</script>

<ReadOnChainAI {refresh} bind:interaction />

<div class="mb-4 bg-blue-100 p-4 rounded-lg shadow-md w-full max-w-lg mt-6 flex flex-col">
	{#each interactions as [id, prompt, response]}
		<div class="bg-green-100 p-2 rounded-lg inline-block max-w-xs self-end">
			{prompt}
		</div>
		<div class="bg-gray-100 p-2 rounded-lg inline-block max-w-xs self-start">
			{response}
		</div>
	{/each}
</div>
