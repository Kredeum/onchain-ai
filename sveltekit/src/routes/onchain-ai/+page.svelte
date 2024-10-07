<script lang="ts">
	import { InputBase } from "$lib/components/scaffold-eth/inputs";
	import { createDeployedContractInfo } from "$lib/runes/deployedContractInfo.svelte";
	import { createTransactor } from "$lib/runes/transactor.svelte";
	import { createWriteContract } from "@zapaz/wagmi-svelte";

	console.log("OnChainAI");

	let prompt = $state("");

	const name = "Prompt";
	const placeholder = "Enter your prompt";
	const handleChange = (value: string) => {
		prompt = value;
	};

	const { data: deployedContractData, isLoading: deployedContractLoading } = $derived.by(
		createDeployedContractInfo("OnChainAI")
	);

	let contractWrite = $derived.by(createWriteContract());
	let writeTxn = $derived.by(createTransactor());

	const handleSend = async () => {
		try {
			const makeWriteWithParams = () =>
				contractWrite!.writeContractAsync({
					address: deployedContractData!.address,
					functionName: "sendRequest",
					abi: deployedContractData!.abi,
					args: [prompt],
					value: 3n ^ 15n
				});
			await writeTxn?.(makeWriteWithParams);
		} catch (e: unknown) {
			console.error("⚡️ handleSend ~ error", e);
		}
	};
</script>

<div class="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
	<div class="px-5">
		<h1 class="text-center">
			<span class="block text-4xl font-bold">OnChainAI</span>
		</h1>
	</div>

	<div class="flex flex-col space-y-3">
		<InputBase {name} value={prompt} {placeholder} onchange={handleChange} />

		<button class="btn btn-primary btn-sm h-10 rounded-full px-2" onclick={handleSend}>
			<span class="text-xl">Send</span>
		</button>
	</div>
</div>
