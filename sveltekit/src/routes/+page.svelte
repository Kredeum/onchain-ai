<script lang="ts">
	import { Address } from "$lib/components/scaffold-eth";
	import { createAccount } from "@zapaz/wagmi-svelte";

	const { address } = $derived.by(createAccount());
</script>

<div class="flex flex-grow flex-col items-center pt-10">
	<div class="px-5">
		<h1 class="text-center">
			<span class="mb-2 block text-2xl">Welcome to</span>
			<span class="block text-4xl font-bold">Scaffold-ETH Alt</span>
		</h1>
		<div class="flex items-center justify-center space-x-2">
			<p class="my-2 font-medium">Connected Address:</p>
			<Address {address} />
		</div>
		<p class="text-center text-lg">
			Get started by editing
			<code
				class="bg-base-300 inline-block max-w-full break-words break-all text-base font-bold italic"
			>
				sveltekit/src/routes/+page.svelte
			</code>
		</p>
		<p class="text-center text-lg">
			Edit your smart contract
			<code
				class="bg-base-300 inline-block max-w-full break-words break-all text-base font-bold italic"
			>
				YourContract.sol
			</code>
			in
			<code
				class="bg-base-300 inline-block max-w-full break-words break-all text-base font-bold italic"
			>
				foundry/src
			</code>
		</p>
	</div>
</div>
