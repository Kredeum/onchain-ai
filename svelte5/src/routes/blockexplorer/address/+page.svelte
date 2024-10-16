<script lang="ts">
	import { page } from "$app/stores";
	import AddressComponent from "../../../lib/components/blockexplorer/AddressComponent.svelte";

	const { data }: { data: { contractData: { bytecode: string; assembly: string } } } = $props();

	const { contractData } = $derived(data);

	let address = $state("");
	$effect(() => {
		address = $page.url.hash.slice(1);
	});
</script>

<AddressComponent {address} {contractData} />
