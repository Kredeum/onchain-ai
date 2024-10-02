<script lang="ts">
	import { onMount } from "svelte";

	import type { PublicClient } from "viem";
	import { sepolia } from "viem/chains";

	import type { GetContractReturnGenericType } from "$lib/types";
	import { counter } from "$lib/counter";

	import IntegerInput from "$lib/components/scaffold-eth/inputs/IntegerInput.svelte";

	let num: bigint = -1n;
	let numInput: bigint = 0n;
	let counterContract: GetContractReturnGenericType;
	let publicClient: PublicClient;

	const refresh = async (hash?: `0x{string}`) => {
		if (hash) {
			console.log("hash", hash);
			await publicClient.waitForTransactionReceipt({ hash });
		}
		num = await counterContract.read.number();
	};
	const inc = async () => await refresh(await counterContract.write.increment());
	const set = async () => await refresh(await counterContract.write.setNumber([numInput]));

	onMount(async () => {
		({ contract: counterContract, publicClient } = await counter(sepolia));
		refresh();
	});
</script>

<div class="flex items-center px-5 py-2">
	<div>Counter:</div>

	<div class="btn btn-primary btn-sm cursor-auto gap-1 font-normal m-2">
		<span> {num >= 0 ? num : "***"}</span>
	</div>

	<div class="btn btn-primary btn-sm cursor-auto gap-1 font-normal m-2">
		<button onclick={inc}>Increment</button>
	</div>

	<div class="block max-w-[60px]">
		<IntegerInput bind:value={numInput} disableMultiplyBy1e18 />
	</div>

	<div class="btn btn-primary btn-sm cursor-auto gap-1 font-normal m-2">
		<button onclick={set}>Set</button>
	</div>
</div>
