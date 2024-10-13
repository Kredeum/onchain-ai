<script lang="ts">
	import { InputBase } from "$lib/components/scaffold-eth/inputs";
	import { createDeployedContractInfo } from "$lib/runes/deployedContractInfo.svelte";
	import { createTransactor } from "$lib/runes/transactor.svelte";
	import { createWriteContract } from "@zapaz/wagmi-svelte";
	import { readAddresses, readConfig } from "@onchain-ai/common/lib/readJson";
	import { createTargetNetwork } from "$lib/runes/targetNetwork.svelte";
	import { createTargetNetworkId } from "$lib/runes/global.svelte";

	let prompt = $state("");

	const { data: deployedContractData, isLoading: deployedContractLoading } = $derived.by(
		createDeployedContractInfo("OnChainAIv01")
	);

	let contractWrite = $derived.by(createWriteContract());
	let writeTxn = $derived.by(createTransactor());

	const handleSend = async () => {
		try {
			console.log("handleSend ~ deployedContractData:", deployedContractData);
			const makeWriteWithParams = () =>
				contractWrite!.writeContractAsync({
					address: deployedContractData!.address,
					abi: deployedContractData!.abi,
					functionName: "sendRequest",
					args: [prompt],
					value: 10n ** 14n
				});
			await writeTxn?.(makeWriteWithParams);
		} catch (e: unknown) {
			console.error("⚡️ handleSend ~ error", e);
		}
	};

	const { targetNetworkId } = $derived.by(createTargetNetworkId);
	const config = $derived(readConfig(targetNetworkId));
	const onChainAI = $derived(readAddresses(targetNetworkId).OnChainAIv01);
</script>

<div class="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
	<div class="px-5">
		<h1 class="text-center">
			<span class="block text-4xl font-bold">OnChainAI</span>
		</h1>
	</div>

	<div class="flex flex-col space-y-3">
		<InputBase
			name="Prompt"
			placeholder="Enter your prompt"
			onchange={(input) => (prompt = input)}
			value={prompt}
		/>

		<button class="btn btn-primary btn-sm h-10 rounded-full px-2" onclick={handleSend}>
			<span class="text-xl">Send</span>
		</button>
	</div>
	<div class="mt-4 text-gray-400">
		<a href={`${config.explorer}/address/${onChainAI}`} target="_blank">
			<em>view on etherscan</em>
		</a>
	</div>
</div>
